import React from 'react';
import { ITEMS } from '../game/items';

export default function InventoryBar({inventory,selected,onItemClick,onItemDoubleClick,onItemHover}) {
  return <div className="inventory-panel">
    <div className="inventory-title">MARA’S SATCHEL</div>
    <div className="inventory-grid">{inventory.map((id)=>{
      const item=ITEMS[id]; if(!item) return null;
      return <button
        key={id}
        type="button"
        className={`inventory-slot ${selected===id?'selected':''}`}
        onClick={()=>onItemClick(id)}
        onDoubleClick={()=>onItemDoubleClick(id)}
        onMouseEnter={()=>onItemHover?.(id)}
        onMouseLeave={()=>onItemHover?.(null)}
        onFocus={()=>onItemHover?.(id)}
        onBlur={()=>onItemHover?.(null)}
        title={`${item.name}: ${item.description}`}
      >
        <img src={item.icon} alt=""/><span>{item.name}</span>
      </button>;
    })}</div>
  </div>;
}
