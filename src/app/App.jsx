import React, { useEffect, useMemo, useState } from 'react';
import SceneRenderer from '../engine/SceneRenderer';
import LayerEditor, { useLayerOverrides } from '../engine/LayerEditor';
import { initialState, loadState, saveState } from '../engine/state';
import { sounds } from '../engine/audio';
import { ITEMS, recipeFor } from '../game/items';
import { currentObjective } from '../game/objectives';
import { DIALOGUES, SCENES } from '../scenes';
import ActionBar from '../ui/ActionBar';
import StatusLine from '../ui/StatusLine';
import InventoryBar from '../ui/InventoryBar';
import DialoguePanel from '../ui/DialoguePanel';
import { Ending, ItemPopup, Message, Thought } from '../ui/Overlays';

const wrongCombos = [
  'The objects maintain a professional distance.',
  'Mara considers it. Civilization survives.',
  'That would create paperwork, not progress.',
  'There is improvisation, and then there is evidence.',
  'Even Gus finds that combination difficult to defend.'
];

export default function App() {
  const [state,setState]=useState(loadState);
  const [dialogue,setDialogue]=useState(null);
  const [popup,setPopup]=useState(null);
  const [thought,setThought]=useState('');
  const [message,setMessage]=useState('');
  const [showLayers,setShowLayers]=useState(false);
  const [debugHotspots,setDebugHotspots]=useState(false);
  const [hoveredHotspot,setHoveredHotspot]=useState(null);
  const [hoveredInventory,setHoveredInventory]=useState(null);
  const scene=SCENES[state.sceneId];
  const [overrides,setOverrides]=useLayerOverrides(state.sceneId);
  const objective=useMemo(()=>currentObjective(state),[state]);
  const inputLocked=Boolean(dialogue||popup);

  useEffect(()=>saveState(state),[state]);

  useEffect(()=>{
    if(state.sceneId==='01-department-office'&&!state.flags.introSeen&&!dialogue) startDialogue('office.opening');
    if(state.sceneId==='02-gannets-end-harbor'&&!state.flags.harborIntroSeen&&!dialogue) startDialogue('harbor.opening');
  },[state.sceneId,state.flags.introSeen,state.flags.harborIntroSeen]);

  const setFlags=(patch)=>setState((s)=>({...s,flags:{...s.flags,...patch}}));
  const has=(id)=>state.inventory.includes(id);
  const grantItems=(items,type='YOU PICKED UP')=>{
    const fresh=items.filter((id)=>!state.inventory.includes(id));
    if(!fresh.length) return;
    setState((s)=>({...s,inventory:[...s.inventory,...fresh]}));
    sounds.pickup(state.mute);
    setPopup({items:fresh,index:0,type});
  };
  const removeItems=(items)=>setState((s)=>({...s,inventory:s.inventory.filter((id)=>!items.includes(id)),selectedItem:items.includes(s.selectedItem)?null:s.selectedItem}));
  const say=(text)=>setMessage(text);
  const showThought=(text)=>{setThought(text);window.setTimeout(()=>setThought((x)=>x===text?'':x),5200);};
  const sound=(name)=>sounds[name]?.(state.mute);

  const applyEffects=(effects=[])=>{
    effects.forEach((effect)=>{
      if(effect.type==='setFlag') setFlags({[effect.key]:effect.value});
      if(effect.type==='thought') showThought(effect.text);
      if(effect.type==='grantItems') grantItems(effect.items,effect.popupType||'YOU PICKED UP');
      if(effect.type==='removeItems') removeItems(effect.items);
      if(effect.type==='sound') sound(effect.name);
      if(effect.type==='sceneChange') changeScene(effect.sceneId);
    });
  };

  function startDialogue(id) {
    const node=DIALOGUES[id];
    if(!node) return say(`Missing dialogue: ${id}`);
    setDialogue({id,node,index:0});
  }

  const advanceDialogue=()=>{
    if(!dialogue) return;
    if(dialogue.index<dialogue.node.lines.length-1) return setDialogue((d)=>({...d,index:d.index+1}));
    applyEffects(dialogue.node.completeEffects);
    if(dialogue.node.returnTo) startDialogue(dialogue.node.returnTo);
    else setDialogue(null);
  };

  const chooseDialogue=(choice)=>{
    applyEffects(choice.effects);
    if(choice.next) startDialogue(choice.next);
    else setDialogue(null);
  };

  const changeScene=(sceneId)=>{
    setDialogue(null); setMessage(''); setThought(''); setShowLayers(false); setHoveredHotspot(null); setHoveredInventory(null);
    setState((s)=>({...s,sceneId,selectedItem:null,verb:'walk'}));
  };

  const api={
    say,thought:showThought,dialogue:startDialogue,setFlags,grantItems,removeItems,has,changeScene,sound
  };

  const interact=(hotspot)=>{
    sounds.click(state.mute);
    scene.interact({hotspotId:hotspot.id,verb:state.verb,selectedItem:state.selectedItem,state,api});
    if(state.selectedItem) setState((s)=>({...s,selectedItem:null}));
  };

  const combine=(first,second)=>{
    const recipe=recipeFor(first,second);
    if(!recipe) {
      say(wrongCombos[Math.floor(Math.random()*wrongCombos.length)]);
      return setState((s)=>({...s,selectedItem:null}));
    }
    removeItems(recipe.consume);
    window.setTimeout(()=>grantItems([recipe.create],recipe.popupType||'YOU MADE'),0);
    if(recipe.create==='ruler-pair') setFlags({rulerPairMade:true});
    if(recipe.create==='evidence-tongs') setFlags({tongsMade:true});
    if(recipe.create==='foghorn') setFlags({foghornMade:true});
    showThought(recipe.message);
  };

  const inventoryClick=(id)=>{
    sounds.click(state.mute);
    if(state.selectedItem&&state.selectedItem!==id) return combine(state.selectedItem,id);
    setState((s)=>({...s,selectedItem:s.selectedItem===id?null:id,verb:s.verb==='give'?'give':'use'}));
  };

  const inventoryUse=(id)=>{
    if(id==='complaint-form-bound'&&!state.flags.rubberBandTaken) {
      removeItems(['complaint-form-bound']);
      setFlags({rubberBandTaken:true});
      setTimeout(()=>grantItems(['complaint-form-loose','rubber-band']),0);
      return showThought('At last, a practical application for complaints.');
    }
    if(id==='captains-hat'&&!state.flags.duckCallFound) {
      setFlags({duckCallFound:true});
      grantItems(['duck-call'],'YOU DISCOVERED');
      return showThought('A duck call stitched into the lining. Why does every grown man in this town hide a smaller object in his hat?');
    }
    if(id==='foghorn') {
      sound('foghorn');
      return say('The horn blast parts the fog, launches the gull from the bucket and points Nib’s moustache horizontally. Acceptable.');
    }
    say(ITEMS[id]?.description||'Mara finds no new administrative value in it.');
  };

  const closePopup=()=>setPopup((p)=>p.index<p.items.length-1?{...p,index:p.index+1}:null);
  const reset=()=>{localStorage.clear();setState(structuredClone(initialState));setDialogue(null);setPopup(null);setThought('');setMessage('');};

  if(state.sceneId==='ending') return <Ending/>;
  const position=state.positions[state.sceneId]||scene.start;

  return <main className="game-shell">
    <header className="game-header">
      <div><h1>Mara Quibble and the Missing Minute</h1><p>{scene.name}</p></div>
      <div className="header-actions">
        <button onClick={()=>setShowLayers((x)=>!x)}>Layers</button>
        <button onClick={()=>setDebugHotspots((x)=>!x)}>{debugHotspots?'Hide':'Show'} hotspots</button>
        <button onClick={()=>setState((s)=>({...s,mute:!s.mute}))}>{state.mute?'Sound off':'Sound on'}</button>
        <button onClick={reset}>Restart</button>
      </div>
    </header>

    <section className="game-frame">
      <SceneRenderer
        scene={scene}
        flags={state.flags}
        position={position}
        onPosition={(next)=>setState((s)=>({...s,positions:{...s.positions,[s.sceneId]:next}}))}
        onHotspot={interact}
        overrides={overrides}
        inputLocked={inputLocked}
        debugHotspots={debugHotspots}
        onHotspotHover={setHoveredHotspot}
      />
      <Thought text={thought}/>
      <Message text={message} onClose={()=>setMessage('')}/>
      <div className="objective-ribbon"><span>OBJECTIVE</span>{objective}</div>
    </section>

    <section className="game-controls">
      <ActionBar verb={state.verb} onChange={(verb)=>setState((s)=>({...s,verb,selectedItem:verb==='walk'||verb==='talk'||verb==='pickup'?null:s.selectedItem}))}/>
      <StatusLine verb={state.verb} selectedItem={state.selectedItem} hoveredHotspot={hoveredHotspot} hoveredInventory={hoveredInventory}/>
      <InventoryBar inventory={state.inventory} selected={state.selectedItem} onItemClick={inventoryClick} onItemDoubleClick={inventoryUse} onItemHover={setHoveredInventory}/>
    </section>

    <DialoguePanel dialogue={dialogue} onAdvance={advanceDialogue} onChoice={chooseDialogue} flags={state.flags}/>
    <ItemPopup popup={popup} onClose={closePopup}/>
    {showLayers&&<LayerEditor scene={scene} overrides={overrides} setOverrides={setOverrides} onClose={()=>setShowLayers(false)}/>} 
  </main>;
}
