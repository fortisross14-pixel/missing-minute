import React from 'react';
import { actorDepthFor } from './layerUtils';

export function useSceneLayerOverrides(sceneId) {
  const key = `mara-layer-overrides:${sceneId}`;
  const read = React.useCallback(() => {
    try { return JSON.parse(localStorage.getItem(key)) || {}; } catch { return {}; }
  }, [key]);
  const [overrides, setOverrides] = React.useState(read);
  React.useEffect(() => { setOverrides(read()); }, [read]);
  React.useEffect(() => { localStorage.setItem(key, JSON.stringify(overrides)); }, [key, overrides]);
  return [overrides, setOverrides];
}

export default function LayerEditor({ scene, actorY, overrides, setOverrides, onClose }) {
  const actorBand = actorDepthFor(scene, actorY);
  const setField = (id, field, value) => {
    setOverrides((current) => ({
      ...current,
      [id]: { ...(current[id] || {}), [field]: value }
    }));
  };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ scene: scene.id, overrides }, null, 2)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${scene.id}-layer-overrides.json`;
    link.click();
    URL.revokeObjectURL(href);
  };

  return (
    <aside className="layer-editor" aria-label="Layer editor">
      <header>
        <div><strong>{scene.name}</strong><small>Actor band: {actorBand.id} · z {actorBand.actorZ}</small></div>
        <button onClick={onClose}>×</button>
      </header>
      <p className="layer-editor-help">Adjust z-order and placement live. Values are saved in this browser. Export the JSON and paste its values into the scene file when satisfied.</p>
      <div className="layer-editor-list">
        {scene.layers.map((layer) => {
          const effective = { ...layer, ...(overrides[layer.id] || {}) };
          return (
            <section key={layer.id} className="layer-editor-row">
              <div className="layer-editor-title"><strong>{layer.id}</strong><span>{layer.kind || 'sprite'}</span></div>
              <label>Z<input type="number" value={effective.z ?? 0} onChange={(e) => setField(layer.id, 'z', Number(e.target.value))} /></label>
              {!layer.fullScene && <>
                <label>X<input type="number" step="0.1" value={effective.x ?? 0} onChange={(e) => setField(layer.id, 'x', Number(e.target.value))} /></label>
                <label>Y<input type="number" step="0.1" value={effective.y ?? 0} onChange={(e) => setField(layer.id, 'y', Number(e.target.value))} /></label>
                <label>W<input type="number" step="0.1" value={effective.width ?? 10} onChange={(e) => setField(layer.id, 'width', Number(e.target.value))} /></label>
              </>}
              <label className="layer-visible"><input type="checkbox" checked={!effective.hidden} onChange={(e) => setField(layer.id, 'hidden', !e.target.checked)} /> visible</label>
            </section>
          );
        })}
      </div>
      <footer>
        <button onClick={() => setOverrides({})}>Reset scene</button>
        <button onClick={exportJson}>Export JSON</button>
      </footer>
    </aside>
  );
}
