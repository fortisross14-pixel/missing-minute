import React from 'react';
const VERBS=['walk','look','use','talk','pickup','give'];
export default function ActionBar({verb,onChange}) {
  return <div className="action-bar" aria-label="Actions">{VERBS.map((id)=><button key={id} className={verb===id?'active':''} onClick={()=>onChange(id)} title={id}>
    <img src={`${import.meta.env.BASE_URL}assets/ui/verbs/${id}.svg`} alt={id}/>
  </button>)}</div>;
}
