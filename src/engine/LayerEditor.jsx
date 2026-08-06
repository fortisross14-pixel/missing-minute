import React, { useEffect, useMemo, useRef, useState } from 'react';

const SCHEMA_VERSION = 1;
const STORAGE_PREFIX = 'mq-scene-composer';

function storageKey(sceneId) {
  return `${STORAGE_PREFIX}-${sceneId}`;
}

export function emptySceneOverrides(sceneId = '') {
  return {
    schemaVersion: SCHEMA_VERSION,
    sceneId,
    actor: {},
    layers: {},
    hotspots: {}
  };
}

function normalizeOverrides(value, sceneId) {
  if (!value || typeof value !== 'object') return emptySceneOverrides(sceneId);
  if (value.layers || value.hotspots || value.actor) {
    return {
      ...emptySceneOverrides(sceneId),
      ...value,
      sceneId,
      actor: value.actor || {},
      layers: value.layers || {},
      hotspots: value.hotspots || {}
    };
  }
  // Migration path for the original editor, which stored layer overrides at root level.
  return { ...emptySceneOverrides(sceneId), layers: value };
}

export function useSceneOverrides(sceneId) {
  const [overrides, setOverrides] = useState(() => {
    try {
      return normalizeOverrides(JSON.parse(localStorage.getItem(storageKey(sceneId))), sceneId);
    } catch {
      return emptySceneOverrides(sceneId);
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(sceneId), JSON.stringify(overrides));
    } catch {
      // Composer data is deliberately tiny. Ignore storage failures and keep editing in memory.
    }
  }, [sceneId, overrides]);

  useEffect(() => {
    try {
      setOverrides(normalizeOverrides(JSON.parse(localStorage.getItem(storageKey(sceneId))), sceneId));
    } catch {
      setOverrides(emptySceneOverrides(sceneId));
    }
  }, [sceneId]);

  return [overrides, setOverrides];
}

export function applyLayerOverrides(layer, overrides) {
  const patch = overrides?.layers?.[layer.id] || {};
  return { ...layer, ...patch };
}

export function applyHotspotOverrides(hotspot, overrides) {
  const patch = overrides?.hotspots?.[hotspot.id] || {};
  return {
    ...hotspot,
    ...patch,
    walk: { ...(hotspot.walk || {}), ...(patch.walk || {}) }
  };
}

export function effectiveActor(scene, overrides) {
  return {
    x: overrides?.actor?.x ?? scene.start.x,
    y: overrides?.actor?.y ?? scene.start.y,
    width: overrides?.actor?.width ?? scene.actor?.width ?? 210,
    z: overrides?.actor?.z,
    flipX: Boolean(overrides?.actor?.flipX)
  };
}

export function getSelectionEntity(scene, overrides, selection) {
  if (!selection) return null;
  if (selection.type === 'actor') return effectiveActor(scene, overrides);
  if (selection.type === 'layer') {
    const layer = scene.layers.find((entry) => entry.id === selection.id);
    return layer ? applyLayerOverrides(layer, overrides) : null;
  }
  if (selection.type === 'hotspot') {
    const hotspot = scene.hotspots.find((entry) => entry.id === selection.id);
    return hotspot ? applyHotspotOverrides(hotspot, overrides) : null;
  }
  return null;
}

function selectionLabel(selection) {
  if (!selection) return 'Nothing selected';
  if (selection.type === 'actor') return 'Mara (start position)';
  return `${selection.type === 'layer' ? 'Visual' : 'Hotspot'}: ${selection.id}`;
}

function NumberInput({ label, value, onChange, step = 1 }) {
  return <label>{label}<input type="number" step={step} value={Number.isFinite(value) ? value : 0} onChange={(event) => onChange(Number(event.target.value))}/></label>;
}

export default function LayerEditor({
  scene,
  overrides,
  setOverrides,
  selection,
  setSelection,
  linkHotspot,
  setLinkHotspot,
  onClose,
  onSceneChange
}) {
  const importRef = useRef(null);
  const [notice, setNotice] = useState('');
  const entity = useMemo(() => getSelectionEntity(scene, overrides, selection), [scene, overrides, selection]);

  const targets = useMemo(() => [
    { value: 'actor:mara', label: 'ACTOR — Mara start position' },
    ...scene.layers.filter((layer) => layer.kind !== 'effect').map((layer) => ({ value: `layer:${layer.id}`, label: `VISUAL — ${layer.id}` })),
    ...scene.hotspots.map((hotspot) => ({ value: `hotspot:${hotspot.id}`, label: `HOTSPOT — ${hotspot.id}` }))
  ], [scene]);

  useEffect(() => {
    const first = scene.layers.find((layer) => layer.kind !== 'effect');
    setSelection(first ? { type: 'layer', id: first.id } : { type: 'actor', id: 'mara' });
  }, [scene.id, setSelection]);

  useEffect(() => {
    const onKey = (event) => {
      if (!selection || ['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      const amount = event.shiftKey ? 10 : 1;
      const deltas = {
        ArrowLeft: { x: -amount },
        ArrowRight: { x: amount },
        ArrowUp: { y: -amount },
        ArrowDown: { y: amount }
      };
      const delta = deltas[event.key];
      if (!delta) return;
      event.preventDefault();
      patchSelection(delta, true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function patchSelection(patch, relative = false) {
    if (!selection || !entity) return;
    setOverrides((current) => {
      const next = normalizeOverrides(current, scene.id);
      const applyPatch = (base) => {
        const resolved = { ...patch };
        if (relative) {
          if (patch.x) resolved.x = (base.x ?? 0) + patch.x;
          if (patch.y) resolved.y = (base.y ?? 0) + patch.y;
          if (patch.w) resolved.w = Math.max(8, (base.w ?? 8) + patch.w);
          if (patch.h) resolved.h = Math.max(8, (base.h ?? 8) + patch.h);
        }
        return resolved;
      };

      if (selection.type === 'actor') {
        return { ...next, actor: { ...next.actor, ...applyPatch(entity) } };
      }

      const bucket = selection.type === 'layer' ? 'layers' : 'hotspots';
      const selectedPatch = applyPatch(entity);
      const updated = {
        ...next,
        [bucket]: {
          ...next[bucket],
          [selection.id]: { ...(next[bucket][selection.id] || {}), ...selectedPatch }
        }
      };

      if (selection.type === 'layer') {
        const baseLayer = scene.layers.find((entry) => entry.id === selection.id);
        const dx = (selectedPatch.x ?? entity.x) - entity.x;
        const dy = (selectedPatch.y ?? entity.y) - entity.y;
        const dw = (selectedPatch.w ?? entity.w) - entity.w;
        const dh = (selectedPatch.h ?? entity.h) - entity.h;

        if (baseLayer?.syncGroup) {
          const siblingPatches = { ...updated.layers };
          scene.layers.filter((entry) => entry.syncGroup === baseLayer.syncGroup && entry.id !== selection.id).forEach((sibling) => {
            const siblingEntity = applyLayerOverrides(sibling, next);
            siblingPatches[sibling.id] = {
              ...(siblingPatches[sibling.id] || {}),
              ...(selectedPatch.x !== undefined ? { x: siblingEntity.x + dx } : {}),
              ...(selectedPatch.y !== undefined ? { y: siblingEntity.y + dy } : {}),
              ...(selectedPatch.w !== undefined ? { w: Math.max(8, siblingEntity.w + dw) } : {}),
              ...(selectedPatch.h !== undefined ? { h: Math.max(8, siblingEntity.h + dh) } : {})
            };
          });
          updated.layers = siblingPatches;
        }

        if (linkHotspot) {
          const hotspotId = baseLayer?.hotspotId || (scene.hotspots.some((entry) => entry.id === selection.id) ? selection.id : null);
          if (hotspotId) {
            const baseHotspot = applyHotspotOverrides(scene.hotspots.find((entry) => entry.id === hotspotId), next);
            updated.hotspots = {
              ...updated.hotspots,
              [hotspotId]: {
                ...(updated.hotspots[hotspotId] || {}),
                ...(selectedPatch.x !== undefined ? { x: baseHotspot.x + dx } : {}),
                ...(selectedPatch.y !== undefined ? { y: baseHotspot.y + dy } : {}),
                ...(selectedPatch.w !== undefined ? { w: Math.max(8, baseHotspot.w + dw) } : {}),
                ...(selectedPatch.h !== undefined ? { h: Math.max(8, baseHotspot.h + dh) } : {})
              }
            };
          }
        }
      }
      return updated;
    });
  }

  function updateField(field, value) {
    if (field === 'walkX' || field === 'walkY') {
      const axis = field === 'walkX' ? 'x' : 'y';
      setOverrides((current) => ({
        ...normalizeOverrides(current, scene.id),
        hotspots: {
          ...current.hotspots,
          [selection.id]: {
            ...(current.hotspots?.[selection.id] || {}),
            walk: { ...(entity.walk || {}), [axis]: value }
          }
        }
      }));
      return;
    }
    patchSelection({ [field]: value });
  }

  function resetSelected() {
    if (!selection) return;
    setOverrides((current) => {
      const next = normalizeOverrides(current, scene.id);
      if (selection.type === 'actor') return { ...next, actor: {} };
      const bucket = selection.type === 'layer' ? 'layers' : 'hotspots';
      const copy = { ...next[bucket] };
      delete copy[selection.id];
      if (selection.type === 'layer') {
        const layer = scene.layers.find((entry) => entry.id === selection.id);
        if (layer?.syncGroup) scene.layers.filter((entry) => entry.syncGroup === layer.syncGroup).forEach((entry) => delete copy[entry.id]);
      }
      return { ...next, [bucket]: copy };
    });
  }

  function exportJson() {
    const payload = { ...normalizeOverrides(overrides, scene.id), exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${scene.id}-composition.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Composition JSON exported.');
  }

  async function importJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      setOverrides(normalizeOverrides(parsed, scene.id));
      setNotice(`Imported ${file.name}.`);
    } catch {
      setNotice('That file is not valid composition JSON.');
    } finally {
      event.target.value = '';
    }
  }

  async function copyJson() {
    try {
      await navigator.clipboard.writeText(JSON.stringify(normalizeOverrides(overrides, scene.id), null, 2));
      setNotice('Composition JSON copied.');
    } catch {
      setNotice('Clipboard access was blocked; use Export JSON instead.');
    }
  }

  const selectionValue = selection ? `${selection.type}:${selection.id}` : '';
  const canResize = selection?.type === 'layer' || selection?.type === 'hotspot';

  return <aside className="layer-editor" aria-label="Scene composer">
    <div className="layer-editor__header"><strong>Scene Composer</strong><button onClick={onClose} aria-label="Close composer">×</button></div>
    <p>Drag objects in the room. Drag the square handle to resize. Arrow keys move 1 px; Shift + arrow moves 10 px.</p>

    <div className="composer-scene-switch">
      <button className={scene.id === '01-department-office' ? 'active' : ''} onClick={() => onSceneChange('01-department-office')}>Office</button>
      <button className={scene.id === '02-gannets-end-harbor' ? 'active' : ''} onClick={() => onSceneChange('02-gannets-end-harbor')}>Harbor</button>
    </div>

    <label>Selected element<select value={selectionValue} onChange={(event) => {
      const [type, ...rest] = event.target.value.split(':');
      setSelection({ type, id: rest.join(':') });
    }}>{targets.map((target) => <option key={target.value} value={target.value}>{target.label}</option>)}</select></label>

    <div className="composer-selection-name">{selectionLabel(selection)}</div>

    {entity && <div className="layer-editor__controls">
      <NumberInput label="X" value={entity.x} onChange={(value) => updateField('x', value)}/>
      <NumberInput label="Y" value={entity.y} onChange={(value) => updateField('y', value)}/>
      {selection.type === 'actor' && <NumberInput label="Width" value={entity.width} onChange={(value) => updateField('width', Math.max(24, value))}/>} 
      {canResize && <><NumberInput label="Width" value={entity.w} onChange={(value) => updateField('w', Math.max(8, value))}/><NumberInput label="Height" value={entity.h} onChange={(value) => updateField('h', Math.max(8, value))}/></>}
      {selection.type === 'layer' && <>
        <NumberInput label="Z-index" value={entity.z} onChange={(value) => updateField('z', value)}/>
        <NumberInput label="Opacity" value={entity.opacity ?? 1} step={0.05} onChange={(value) => updateField('opacity', Math.max(0, Math.min(1, value)))}/>
        <label className="check"><input type="checkbox" checked={!entity.hidden} onChange={(event) => updateField('hidden', !event.target.checked)}/> Visible</label>
        <label className="check"><input type="checkbox" checked={Boolean(entity.flipX)} onChange={(event) => updateField('flipX', event.target.checked)}/> Flip horizontally</label>
        <label className="check"><input type="checkbox" checked={linkHotspot} onChange={(event) => setLinkHotspot(event.target.checked)}/> Move matching hotspot</label>
      </>}
      {selection.type === 'hotspot' && <>
        <NumberInput label="Walk X" value={entity.walk?.x ?? entity.x} onChange={(value) => updateField('walkX', value)}/>
        <NumberInput label="Walk Y" value={entity.walk?.y ?? entity.y + entity.h} onChange={(value) => updateField('walkY', value)}/>
      </>}
    </div>}

    <div className="layer-editor__actions wrap">
      <button onClick={exportJson}>Export JSON</button>
      <button onClick={copyJson}>Copy JSON</button>
      <button onClick={() => importRef.current?.click()}>Import JSON</button>
      <input ref={importRef} hidden type="file" accept="application/json,.json" onChange={importJson}/>
      <button onClick={resetSelected}>Reset selected</button>
      <button onClick={() => setOverrides(emptySceneOverrides(scene.id))}>Reset scene</button>
    </div>
    {notice && <div className="composer-notice">{notice}</div>}
  </aside>;
}
