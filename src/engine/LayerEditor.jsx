import React, { useEffect, useMemo, useState } from 'react';

function key(sceneId) { return `mq-layer-overrides-${sceneId}`; }

export function useLayerOverrides(sceneId) {
  const [overrides,setOverrides] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key(sceneId))) || {}; } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem(key(sceneId), JSON.stringify(overrides)); } catch { /* ignore */ }
  }, [sceneId,overrides]);
  useEffect(() => {
    try { setOverrides(JSON.parse(localStorage.getItem(key(sceneId))) || {}); } catch { setOverrides({}); }
  }, [sceneId]);
  return [overrides,setOverrides];
}

export function applyOverrides(layer, overrides) {
  return { ...layer, ...(overrides[layer.id] || {}) };
}

export default function LayerEditor({scene,overrides,setOverrides,onClose}) {
  const [selected,setSelected] = useState(scene.layers[0]?.id || '');
  const layer = useMemo(() => scene.layers.find((x)=>x.id===selected), [scene,selected]);
  const effective = layer ? applyOverrides(layer,overrides) : null;
  const update = (field,value) => setOverrides((current)=>({
    ...current,
    [selected]:{...(current[selected]||{}),[field]:value}
  }));
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(overrides,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download=`${scene.id}-layer-overrides.json`; a.click();
    URL.revokeObjectURL(url);
  };
  return <aside className="layer-editor" aria-label="Scene layer editor">
    <div className="layer-editor__header"><strong>Scene layers</strong><button onClick={onClose}>×</button></div>
    <p>Edit this room live. Export the values when the composition is final.</p>
    <label>Object<select value={selected} onChange={(e)=>setSelected(e.target.value)}>{scene.layers.filter(l=>l.kind!=='effect').map((l)=><option key={l.id} value={l.id}>{l.id}</option>)}</select></label>
    {effective && <div className="layer-editor__controls">
      {['x','y','w','h','z'].map((field)=><label key={field}>{field.toUpperCase()}<input type="number" value={effective[field] ?? 0} onChange={(e)=>update(field,Number(e.target.value))}/></label>)}
      <label className="check"><input type="checkbox" checked={!effective.hidden} onChange={(e)=>update('hidden',!e.target.checked)}/> Visible</label>
    </div>}
    <div className="layer-editor__actions">
      <button onClick={exportJson}>Export JSON</button>
      <button onClick={()=>setOverrides({})}>Reset scene</button>
    </div>
  </aside>;
}
