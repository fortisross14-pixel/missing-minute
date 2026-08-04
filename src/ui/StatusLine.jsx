import React from 'react';
import { ITEMS } from '../game/items';

const VERB_LABELS = {
  walk: 'Walk to',
  look: 'Look at',
  use: 'Use',
  talk: 'Talk to',
  pickup: 'Pick up',
  give: 'Give'
};

function targetLabel(hotspot, verb) {
  if (!hotspot) return '';
  return hotspot.actionLabels?.[verb] || hotspot.label || hotspot.id;
}

export default function StatusLine({ verb, selectedItem, hoveredHotspot, hoveredInventory }) {
  if (hoveredInventory) {
    const item = ITEMS[hoveredInventory];
    if (item) return <div className="status-strip inventory-status"><strong>{item.name}</strong><span>{item.description}</span></div>;
  }

  const item = selectedItem ? ITEMS[selectedItem] : null;
  if (hoveredHotspot) {
    const target = targetLabel(hoveredHotspot, verb);
    let text;
    if (item && verb === 'give') text = `Give ${item.name} to ${target}`;
    else if (item && verb === 'use') text = `Use ${item.name} with ${target}`;
    else text = `${VERB_LABELS[verb] || verb} ${target}`;
    return <div className="status-strip"><span className="status-verb">{text}</span></div>;
  }

  if (item) {
    const prefix = verb === 'give' ? 'Give' : 'Use';
    return <div className="status-strip"><span className="status-verb">{prefix} {item.name} with…</span></div>;
  }

  return <div className="status-strip"><span className="status-verb">{(VERB_LABELS[verb] || verb).toUpperCase()} — move over a person or object</span></div>;
}
