import React from 'react';
import { assetUrl } from '../game/assetUrl';

const VERBS = ['walk','look','use','talk','pickup','give'];
const LABELS = {walk:'Walk to',look:'Look at',use:'Use',talk:'Talk to',pickup:'Pick up',give:'Give'};

export default function ActionBar({verb,onChange}) {
  return <div className="action-bar" aria-label="Actions">{VERBS.map((id)=><button
    key={id}
    type="button"
    className={verb===id?'active':''}
    onClick={()=>onChange(id)}
    title={LABELS[id]}
    aria-pressed={verb===id}
  >
    <img src={assetUrl(`assets/ui/verbs/${id}.svg`)} alt={LABELS[id]}/>
  </button>)}</div>;
}
