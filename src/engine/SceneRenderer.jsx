import React, { useEffect, useMemo, useRef, useState } from 'react';
import { applyOverrides } from './LayerEditor';
import { clamp, clampToPolygons, perspectiveScale, resolveDepth } from './geometry';
import { assetUrl } from '../game/assetUrl';

function visible(entity,flags) {
  if (entity.hidden) return false;
  if (entity.visibleWhen && !flags[entity.visibleWhen]) return false;
  if (entity.hiddenWhen && flags[entity.hiddenWhen]) return false;
  return true;
}

function SceneLayer({layer,flags}) {
  if (!visible(layer,flags)) return null;
  const style={left:layer.x,top:layer.y,width:layer.w,height:layer.h,zIndex:layer.z};
  if (layer.kind==='effect') return <div className={`world-layer effect ${layer.className||''}`} style={style}/>;
  return <img className={`world-layer ${layer.className||''}`} style={style} src={layer.asset} alt="" draggable="false"/>;
}

export default function SceneRenderer({scene,flags,position,onPosition,onHotspot,onHotspotHover,overrides,inputLocked,debugHotspots}) {
  const viewportRef=useRef(null);
  const [metrics,setMetrics]=useState({width:1200,height:675,scale:.75});
  const [cameraX,setCameraX]=useState(scene.camera.startX||0);
  const [moving,setMoving]=useState(false);
  const [facing,setFacing]=useState('right');
  const timer=useRef(null);

  useEffect(()=>{
    const measure=()=>{
      const el=viewportRef.current; if(!el) return;
      const height=el.clientHeight; const scale=height/scene.world.height;
      setMetrics({width:el.clientWidth,height,scale});
    };
    measure();
    const observer=new ResizeObserver(measure); if(viewportRef.current) observer.observe(viewportRef.current);
    return ()=>observer.disconnect();
  },[scene.id]);

  useEffect(()=>{
    setCameraX(scene.camera.startX||0);
    onHotspotHover?.(null);
  },[scene.id]);

  useEffect(()=>()=>clearTimeout(timer.current),[]);

  const maxCamera=Math.max(0,scene.world.width-metrics.width/metrics.scale);
  const focusCamera=(x)=>{
    const left=cameraX+metrics.width/metrics.scale*scene.camera.deadZoneLeft;
    const right=cameraX+metrics.width/metrics.scale*scene.camera.deadZoneRight;
    let next=cameraX;
    if(x<left) next=x-metrics.width/metrics.scale*scene.camera.deadZoneLeft;
    if(x>right) next=x-metrics.width/metrics.scale*scene.camera.deadZoneRight;
    setCameraX(clamp(next,0,maxCamera));
  };

  const moveTo=(raw,callback)=>{
    if(inputLocked||moving) return;
    const destination=clampToPolygons(raw,scene.walkPolygons);
    const distance=Math.hypot(destination.x-position.x,(destination.y-position.y)*1.4);
    const duration=clamp(distance*2.3,250,1500);
    setFacing(destination.x<position.x?'left':'right');
    setMoving(true); focusCamera(destination.x); onPosition(destination);
    clearTimeout(timer.current);
    timer.current=setTimeout(()=>{setMoving(false);callback?.();},duration);
  };

  const clickStage=(event)=>{
    if(inputLocked) return;
    onHotspotHover?.(null);
    const rect=viewportRef.current.getBoundingClientRect();
    const x=(event.clientX-rect.left)/metrics.scale+cameraX;
    const y=(event.clientY-rect.top)/metrics.scale;
    moveTo({x,y});
  };

  const layers=useMemo(()=>scene.layers.map((l)=>applyOverrides(l,overrides)).sort((a,b)=>a.z-b.z),[scene,overrides]);
  const depth=resolveDepth(scene,position);
  const actorScale=perspectiveScale(scene,position.y);
  const maraAsset=assetUrl(`assets/characters/mara/${moving?'walk.png':'idle.png'}`);

  return <div className="scene-viewport" ref={viewportRef}>
    <div className="scene-camera" style={{transform:`translate3d(${-cameraX*metrics.scale}px,0,0)`}}>
      <div className="scene-world" style={{width:scene.world.width,height:scene.world.height,transform:`scale(${metrics.scale})`}} onClick={clickStage}>
        <img className="scene-background" src={scene.background} alt={scene.name}/>
        {layers.map((layer)=><SceneLayer key={layer.id} layer={layer} flags={flags}/>) }
        <img
          className={`player-actor ${moving?'is-walking':'is-idle'} facing-${facing}`}
          src={maraAsset}
          alt="Mara Quibble"
          style={{left:position.x,top:position.y,zIndex:depth.actorZ,transform:`translate(-50%,-100%) scale(${actorScale}) ${facing==='left'?'scaleX(-1)':''}`}}
        />
        {scene.hotspots.filter((h)=>visible(h,flags)).map((hotspot)=><button
          key={hotspot.id}
          type="button"
          className={`hotspot ${debugHotspots?'debug':''}`}
          style={{left:hotspot.x,top:hotspot.y,width:hotspot.w,height:hotspot.h,zIndex:90}}
          aria-label={hotspot.label}
          onMouseEnter={()=>onHotspotHover?.(hotspot)}
          onMouseLeave={()=>onHotspotHover?.(null)}
          onFocus={()=>onHotspotHover?.(hotspot)}
          onBlur={()=>onHotspotHover?.(null)}
          onClick={(event)=>{
            event.stopPropagation();
            moveTo(hotspot.walk||{x:hotspot.x,y:hotspot.y},()=>onHotspot(hotspot));
          }}
        ><span>{hotspot.label}</span></button>)}
      </div>
    </div>
  </div>;
}
