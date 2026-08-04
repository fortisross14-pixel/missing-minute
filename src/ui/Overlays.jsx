import React from 'react';
import { ITEMS } from '../game/items';
export function ItemPopup({popup,onClose}) {
  if(!popup) return null;
  const item=ITEMS[popup.items[popup.index]];
  return <div className="modal-shade" onClick={onClose}><div className="item-popup" onClick={(e)=>e.stopPropagation()}>
    <div className="pickup-kicker">{popup.type||'YOU PICKED UP'}</div>
    <img src={item.icon} alt=""/>
    <h2>{item.name}</h2><p>{item.description}</p>
    <button onClick={onClose}>{popup.index<popup.items.length-1?'Next item':'Continue'}</button>
  </div></div>;
}
export function Thought({text}) { return text?<div className="mara-thought"><strong>Mara:</strong> {text}</div>:null; }
export function Message({text,onClose}) { return text?<div className="message-toast" onClick={onClose}>{text}</div>:null; }
export function Ending() { return <div className="ending-screen"><div><p>END OF FOUNDATION BUILD</p><h1>The lighthouse is waiting.</h1><p>Mara now has the key, the passenger card and proof that Vellum is aboard The Never Was.</p><p>Scene 3 begins at the lighthouse landing.</p></div></div>; }
