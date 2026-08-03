import React, { useMemo } from 'react';
import { actorDepthFor, actorScaleFor, applyLayerOverrides, conditionMatches, sortLayers } from './layerUtils';

const BASE = import.meta.env.BASE_URL;

function SceneLayer({ layer, flags, runtimeClasses = {} }) {
  if (layer.hidden) return null;
  if (layer.visibleWhen && !conditionMatches(layer.visibleWhen, flags)) return null;
  if (layer.hiddenWhen && conditionMatches(layer.hiddenWhen, flags)) return null;
  const className = [
    'scene-layer',
    `scene-layer--${layer.kind || 'sprite'}`,
    layer.className,
    runtimeClasses[layer.id]
  ].filter(Boolean).join(' ');

  const style = {
    zIndex: layer.z ?? 0,
    left: layer.fullScene ? 0 : `${layer.x ?? 0}%`,
    top: layer.fullScene ? 0 : `${layer.y ?? 0}%`,
    width: layer.fullScene ? '100%' : `${layer.width ?? 10}%`,
    height: layer.fullScene ? '100%' : layer.height ? `${layer.height}%` : 'auto',
    opacity: layer.opacity ?? 1,
    transformOrigin: layer.transformOrigin || '50% 100%',
    '--layer-rotate': `${layer.rotate || 0}deg`
  };

  if (layer.kind === 'effect') return <div className={className} style={style} aria-hidden="true" />;

  return (
    <img
      className={className}
      style={style}
      src={`${BASE}${layer.asset}`}
      alt={layer.alt || ''}
      aria-hidden={!layer.alt}
      draggable="false"
    />
  );
}

export default function LayeredScene({
  scene,
  flags,
  actor,
  moving,
  facing,
  cameraPx,
  onStageClick,
  visibleHotspots,
  onHotspotEnter,
  onHotspotLeave,
  onHotspotClick,
  runtimeClasses,
  overrides,
  viewportRef,
  viewportClassName = '',
  children
}) {
  const layers = useMemo(
    () => sortLayers(scene.layers.map((layer) => applyLayerOverrides(layer, overrides))),
    [scene, overrides]
  );
  const depthBand = actorDepthFor(scene, actor.y);
  const actorScale = actorScaleFor(scene, actor.y);

  return (
    <section className={`scene-viewport ${scene.id} ${viewportClassName}`} ref={viewportRef}>
      <div
        className="scene-world"
        style={{
          width: `${scene.worldScale * 100}%`,
          transform: `translate3d(-${cameraPx}px,0,0)`,
          transitionDuration: moving ? '700ms' : '450ms'
        }}
        onClick={onStageClick}
        role="application"
        aria-label={scene.name}
      >
        {layers.map((layer) => <SceneLayer key={layer.id} layer={layer} flags={flags} runtimeClasses={runtimeClasses} />)}

        <img
          className={`actor mara ${moving ? 'walking' : ''} facing-${facing}`}
          src={`${BASE}${scene.actor.asset}`}
          alt="Mara Quibble"
          style={{
            left: `${actor.x}%`,
            top: `${actor.y}%`,
            zIndex: depthBand.actorZ,
            '--actor-scale': actorScale
          }}
        />

        {visibleHotspots.map((hotspot) => (
          <button
            key={hotspot.id}
            className="hotspot"
            style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.w}%`, height: `${hotspot.h}%` }}
            onMouseEnter={() => onHotspotEnter(hotspot)}
            onMouseLeave={onHotspotLeave}
            onFocus={() => onHotspotEnter(hotspot)}
            onClick={(event) => { event.stopPropagation(); onHotspotClick(hotspot); }}
            aria-label={hotspot.label}
          ><span>{hotspot.label}</span></button>
        ))}
      </div>
      {children}
    </section>
  );
}
