import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  applyHotspotOverrides,
  applyLayerOverrides,
  effectiveActor,
  getSelectionEntity
} from './LayerEditor';
import { clamp, clampToPolygons, perspectiveScale, resolveDepth } from './geometry';
import { officialDateFor, splitFlapCharacters } from '../game/calendar';

function visible(entity, flags) {
  if (entity.hidden) return false;
  if (entity.visibleWhen && !flags[entity.visibleWhen]) return false;
  if (entity.hiddenWhen && flags[entity.hiddenWhen]) return false;
  return true;
}

function SplitFlapRow({ value, className = '' }) {
  return <div className={`split-flap-row ${className}`}>{splitFlapCharacters(value).map(({character,index}) => <span
    key={`${value}-${index}`}
    className={`split-flap-cell ${character === ' ' ? 'space' : ''}`}
    style={{ animationDelay: `${index * 28}ms` }}
  >{character === ' ' ? '\u00a0' : character}</span>)}</div>;
}

function SplitFlapCalendar({ layer, flags, style }) {
  const date = officialDateFor(layer, flags);
  return <div className={`world-layer split-flap-calendar ${layer.className || ''}`} style={style} data-date={date.iso}>
    <div className="split-flap-label">{layer.label || 'OFFICIAL MUNICIPAL DATE'}</div>
    <SplitFlapRow value={date.weekday}/>
    <div className="split-flap-date-line">
      <SplitFlapRow value={date.day} className="day"/>
      <SplitFlapRow value={date.month} className="month"/>
      <SplitFlapRow value={date.year} className="year"/>
    </div>
    <SplitFlapRow value={date.status} className="status"/>
  </div>;
}

function SceneLayer({ layer, flags, previewAsset }) {
  if (!visible(layer, flags)) return null;
  const style = {
    left: layer.x,
    top: layer.y,
    width: layer.w,
    height: layer.h,
    zIndex: layer.z,
    opacity: layer.opacity ?? 1,
    transform: layer.flipX ? 'scaleX(-1)' : undefined
  };
  if (layer.kind === 'effect') return <div className={`world-layer effect ${layer.className || ''}`} style={style}/>;
  if (layer.kind === 'split-flap-date') return <SplitFlapCalendar layer={layer} flags={flags} style={style}/>;
  return <img className={`world-layer ${layer.className || ''}`} style={style} src={previewAsset || layer.asset} alt="" draggable="false"/>;
}

function selectionMatches(selection, type, id) {
  return selection?.type === type && selection?.id === id;
}

export default function SceneRenderer({
  scene,
  flags,
  position,
  onPosition,
  onHotspot,
  onHotspotHover,
  overrides,
  setOverrides,
  composer,
  assetPreviews = {},
  inputLocked,
  debugHotspots
}) {
  const viewportRef = useRef(null);
  const [metrics, setMetrics] = useState({ width: 1200, height: 675, scale: .75 });
  const [cameraX, setCameraX] = useState(scene.camera.startX || 0);
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState('right');
  const timer = useRef(null);
  const dragState = useRef(null);

  useEffect(() => {
    const measure = () => {
      const element = viewportRef.current;
      if (!element) return;
      const height = element.clientHeight;
      const scale = height / scene.world.height;
      setMetrics({ width: element.clientWidth, height, scale });
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [scene.id, scene.world.height]);

  useEffect(() => {
    setCameraX(scene.camera.startX || 0);
    onHotspotHover?.(null);
  }, [scene.id]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const maxCamera = Math.max(0, scene.world.width - metrics.width / metrics.scale);
  const boundedCamera = clamp(cameraX, 0, maxCamera);

  useEffect(() => {
    if (cameraX !== boundedCamera) setCameraX(boundedCamera);
  }, [boundedCamera, cameraX]);

  const focusCamera = (x) => {
    const left = cameraX + metrics.width / metrics.scale * scene.camera.deadZoneLeft;
    const right = cameraX + metrics.width / metrics.scale * scene.camera.deadZoneRight;
    let next = cameraX;
    if (x < left) next = x - metrics.width / metrics.scale * scene.camera.deadZoneLeft;
    if (x > right) next = x - metrics.width / metrics.scale * scene.camera.deadZoneRight;
    setCameraX(clamp(next, 0, maxCamera));
  };

  const moveTo = (raw, callback) => {
    if (inputLocked || moving || composer.active) return;
    const destination = clampToPolygons(raw, scene.walkPolygons);
    const distance = Math.hypot(destination.x - position.x, (destination.y - position.y) * 1.4);
    const duration = clamp(distance * 2.3, 250, 1500);
    setFacing(destination.x < position.x ? 'left' : 'right');
    setMoving(true);
    focusCamera(destination.x);
    onPosition(destination);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setMoving(false);
      callback?.();
    }, duration);
  };

  function eventToWorld(event) {
    const rect = viewportRef.current.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) / metrics.scale + cameraX,
      y: (event.clientY - rect.top) / metrics.scale
    };
  }

  const clickStage = (event) => {
    if (inputLocked || composer.active) return;
    onHotspotHover?.(null);
    moveTo(eventToWorld(event));
  };

  const layers = useMemo(
    () => scene.layers.map((layer) => applyLayerOverrides(layer, overrides)).sort((a, b) => a.z - b.z),
    [scene, overrides]
  );
  const hotspots = useMemo(
    () => scene.hotspots.map((hotspot) => applyHotspotOverrides(hotspot, overrides)),
    [scene, overrides]
  );

  const composedActor = effectiveActor(scene, overrides);
  const actorPosition = composer.active ? { x: composedActor.x, y: composedActor.y } : position;
  const depth = resolveDepth(scene, actorPosition);
  const actorScale = perspectiveScale(scene, actorPosition.y);
  const actorWidth = composer.active ? composedActor.width : (scene.actor?.width ?? composedActor.width);
  const actorPreview = assetPreviews[`${scene.id}:actor:mara`]?.url;
  const actorAsset = actorPreview || (moving && scene.actor?.walkAsset ? scene.actor.walkAsset : scene.actor?.asset);
  const backgroundAsset = assetPreviews[`${scene.id}:background`]?.url || scene.background;

  function updateComposerSelection(patch, selectionOverride = null) {
    const selection = selectionOverride || composer.selection;
    const entity = getSelectionEntity(scene, overrides, selection);
    if (!selection || !entity || selection.type === 'background') return;

    setOverrides((current) => {
      const next = {
        schemaVersion: 1,
        sceneId: scene.id,
        actor: current.actor || {},
        layers: current.layers || {},
        hotspots: current.hotspots || {}
      };
      if (selection.type === 'actor') {
        return { ...next, actor: { ...next.actor, ...patch } };
      }
      const bucket = selection.type === 'layer' ? 'layers' : 'hotspots';
      const result = {
        ...next,
        [bucket]: {
          ...next[bucket],
          [selection.id]: { ...(next[bucket][selection.id] || {}), ...patch }
        }
      };
      if (selection.type === 'layer') {
        const source = scene.layers.find((entry) => entry.id === selection.id);
        const dx = (patch.x ?? entity.x) - entity.x;
        const dy = (patch.y ?? entity.y) - entity.y;
        const dw = (patch.w ?? entity.w) - entity.w;
        const dh = (patch.h ?? entity.h) - entity.h;

        if (source?.syncGroup) {
          const siblingPatches = { ...result.layers };
          scene.layers.filter((entry) => entry.syncGroup === source.syncGroup && entry.id !== selection.id).forEach((sibling) => {
            const siblingEntity = applyLayerOverrides(sibling, next);
            siblingPatches[sibling.id] = {
              ...(siblingPatches[sibling.id] || {}),
              ...(patch.x !== undefined ? { x: siblingEntity.x + dx } : {}),
              ...(patch.y !== undefined ? { y: siblingEntity.y + dy } : {}),
              ...(patch.w !== undefined ? { w: Math.max(8, siblingEntity.w + dw) } : {}),
              ...(patch.h !== undefined ? { h: Math.max(8, siblingEntity.h + dh) } : {})
            };
          });
          result.layers = siblingPatches;
        }

        if (composer.linkHotspot) {
          const hotspotId = source?.hotspotId || (scene.hotspots.some((entry) => entry.id === selection.id) ? selection.id : null);
          if (hotspotId) {
            const originalHotspot = applyHotspotOverrides(scene.hotspots.find((entry) => entry.id === hotspotId), next);
            result.hotspots = {
              ...result.hotspots,
              [hotspotId]: {
                ...(result.hotspots[hotspotId] || {}),
                ...(patch.x !== undefined ? { x: originalHotspot.x + dx } : {}),
                ...(patch.y !== undefined ? { y: originalHotspot.y + dy } : {}),
                ...(patch.w !== undefined ? { w: Math.max(8, originalHotspot.w + dw) } : {}),
                ...(patch.h !== undefined ? { h: Math.max(8, originalHotspot.h + dh) } : {})
              }
            };
          }
        }
      }
      return result;
    });
  }

  function beginComposerDrag(event, mode, selection) {
    if (!composer.active) return;
    event.preventDefault();
    event.stopPropagation();
    composer.setSelection(selection);
    const entity = getSelectionEntity(scene, overrides, selection);
    if (!entity) return;
    dragState.current = {
      pointerId: event.pointerId,
      mode,
      selection,
      origin: eventToWorld(event),
      entity: { ...entity }
    };
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function continueComposerDrag(event) {
    const drag = dragState.current;
    if (!drag) return;
    event.preventDefault();
    const point = eventToWorld(event);
    const dx = Math.round(point.x - drag.origin.x);
    const dy = Math.round(point.y - drag.origin.y);
    if (drag.mode === 'move') {
      updateComposerSelection({ x: Math.round(drag.entity.x + dx), y: Math.round(drag.entity.y + dy) }, drag.selection);
    } else if (drag.mode === 'resize') {
      updateComposerSelection({
        w: Math.max(8, Math.round(drag.entity.w + dx)),
        h: Math.max(8, Math.round(drag.entity.h + dy))
      }, drag.selection);
    }
  }

  function endComposerDrag(event) {
    if (!dragState.current) return;
    event.preventDefault();
    dragState.current = null;
  }

  const selectedEntity = composer.active ? getSelectionEntity(scene, overrides, composer.selection) : null;

  return <div className={`scene-viewport ${composer.active ? 'composer-active' : ''}`} ref={viewportRef}
    onPointerMove={continueComposerDrag} onPointerUp={endComposerDrag} onPointerCancel={endComposerDrag}>
    <div className="scene-camera" style={{ transform: `translate3d(${-cameraX * metrics.scale}px,0,0)` }}>
      <div className="scene-world" style={{ width: scene.world.width, height: scene.world.height, transform: `scale(${metrics.scale})` }} onClick={clickStage}>
        <img className="scene-background" src={backgroundAsset} alt={scene.name}/>
        {layers.map((layer) => <SceneLayer key={layer.id} layer={layer} flags={flags} previewAsset={assetPreviews[`${scene.id}:layer:${layer.id}`]?.url}/>)}
        <img
          className={`player-actor ${moving ? 'is-walking' : 'is-idle'} facing-${facing}`}
          src={actorAsset}
          alt="Mara Quibble"
          style={{
            left: actorPosition.x,
            top: actorPosition.y,
            width: actorWidth,
            zIndex: composedActor.z ?? depth.actorZ,
            transform: `translate(-50%,-100%) scale(${actorScale}) ${facing === 'left' || composedActor.flipX ? 'scaleX(-1)' : ''}`
          }}
        />

        {!composer.active && hotspots.filter((hotspot) => visible(hotspot, flags)).map((hotspot) => <button
          key={hotspot.id}
          type="button"
          className={`hotspot ${debugHotspots ? 'debug' : ''}`}
          style={{ left: hotspot.x, top: hotspot.y, width: hotspot.w, height: hotspot.h, zIndex: 90 }}
          aria-label={hotspot.label}
          onMouseEnter={() => onHotspotHover?.(hotspot)}
          onMouseLeave={() => onHotspotHover?.(null)}
          onFocus={() => onHotspotHover?.(hotspot)}
          onBlur={() => onHotspotHover?.(null)}
          onClick={(event) => {
            event.stopPropagation();
            moveTo(hotspot.walk || { x: hotspot.x, y: hotspot.y }, () => onHotspot(hotspot));
          }}
        ><span>{hotspot.label}</span></button>)}

        {composer.active && <>
          {layers.filter((layer) => layer.kind !== 'effect' && visible(layer, flags)).map((layer) => <button
            key={`composer-layer-${layer.id}`}
            type="button"
            className={`composer-target composer-target-layer ${selectionMatches(composer.selection, 'layer', layer.id) ? 'selected' : ''}`}
            style={{ left: layer.x, top: layer.y, width: layer.w, height: layer.h, zIndex: 210 }}
            onPointerDown={(event) => beginComposerDrag(event, 'move', { type: 'layer', id: layer.id })}
            title={`Move visual: ${layer.id}`}
          ><span>{layer.id}</span></button>)}

          <button
            type="button"
            className={`composer-target composer-target-actor ${selectionMatches(composer.selection, 'actor', 'mara') ? 'selected' : ''}`}
            style={{
              left: actorPosition.x - actorWidth * actorScale / 2,
              top: actorPosition.y - actorWidth * actorScale * 1.65,
              width: actorWidth * actorScale,
              height: actorWidth * actorScale * 1.65,
              zIndex: 215
            }}
            onPointerDown={(event) => beginComposerDrag(event, 'move', { type: 'actor', id: 'mara' })}
            title="Move Mara start position"
          ><span>Mara start</span></button>

          {composer.selection?.type === 'hotspot' && selectedEntity && <button
            type="button"
            className="composer-target composer-target-hotspot selected"
            style={{ left: selectedEntity.x, top: selectedEntity.y, width: selectedEntity.w, height: selectedEntity.h, zIndex: 220 }}
            onPointerDown={(event) => beginComposerDrag(event, 'move', composer.selection)}
            title={`Move hotspot: ${composer.selection.id}`}
          ><span>hotspot: {composer.selection.id}</span></button>}

          {composer.selection && selectedEntity && (composer.selection.type === 'layer' || composer.selection.type === 'hotspot') && <button
            type="button"
            className="composer-resize-handle"
            aria-label="Resize selected element"
            style={{ left: selectedEntity.x + selectedEntity.w - 18, top: selectedEntity.y + selectedEntity.h - 18, zIndex: 230 }}
            onPointerDown={(event) => beginComposerDrag(event, 'resize', composer.selection)}
          />}
        </>}
      </div>
    </div>

    {composer.active && <div className="composer-camera-bar">
      <button type="button" onClick={() => setCameraX((value) => clamp(value - 300, 0, maxCamera))}>◀</button>
      <label>Camera <input type="range" min="0" max={Math.max(0, maxCamera)} step="10" value={boundedCamera} onChange={(event) => setCameraX(Number(event.target.value))}/></label>
      <button type="button" onClick={() => setCameraX((value) => clamp(value + 300, 0, maxCamera))}>▶</button>
      <span>{Math.round(boundedCamera)} / {Math.round(maxCamera)}</span>
    </div>}
  </div>;
}
