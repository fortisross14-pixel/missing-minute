import React from 'react';
export default function DialoguePanel({dialogue,onAdvance,onChoice,flags}) {
  if(!dialogue) return null;
  const node=dialogue.node;
  const line=node.lines[dialogue.index];
  const atEnd=dialogue.index===node.lines.length-1;
  const choices=(node.choices||[]).filter((c)=>!c.visibleWhen||flags[c.visibleWhen]);
  return <div className={`dialogue-overlay ${node.cinematic?'cinematic':''}`}>
    <div className="dialogue-box">
      <div className="dialogue-speaker">{line.speaker}</div>
      <div className="dialogue-text">{line.text}</div>
      {atEnd && choices.length>0 ? <div className="dialogue-choices">{choices.map((choice,index)=><button key={`${choice.label}-${index}`} onClick={()=>onChoice(choice)}>{choice.label}</button>)}</div> : <button className="dialogue-next" onClick={onAdvance}>{atEnd?'Continue':'Next'}</button>}
    </div>
  </div>;
}
