import React, { useEffect, useMemo, useState } from 'react';
import SceneRenderer from '../engine/SceneRenderer';
import LayerEditor, { useSceneOverrides } from '../engine/LayerEditor';
import { initialState, loadState, saveState, saveManualState, loadManualState, SAVE_KEY } from '../engine/state';
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
  const [showComposer,setShowComposer]=useState(false);
  const [showPauseMenu,setShowPauseMenu]=useState(false);
  const [composerSelection,setComposerSelection]=useState(null);
  const [linkHotspot,setLinkHotspot]=useState(true);
  const [debugHotspots,setDebugHotspots]=useState(false);
  const [hoveredHotspot,setHoveredHotspot]=useState(null);
  const [hoveredInventory,setHoveredInventory]=useState(null);
  const [assetPreviews,setAssetPreviews]=useState({});
  const scene=SCENES[state.sceneId];
  const [overrides,setOverrides]=useSceneOverrides(state.sceneId);
  const objective=useMemo(()=>currentObjective(state),[state]);
  const inputLocked=Boolean(dialogue||popup||showPauseMenu);

  useEffect(()=>saveState(state),[state]);

  useEffect(()=>()=>{
    Object.values(assetPreviews).forEach((preview)=>preview?.url&&URL.revokeObjectURL(preview.url));
  },[]);

  const previewAsset=(key,file)=>{
    const url=URL.createObjectURL(file);
    setAssetPreviews((current)=>{
      if(current[key]?.url) URL.revokeObjectURL(current[key].url);
      return {...current,[key]:{url,name:file.name}};
    });
  };

  const clearPreviewAsset=(key)=>setAssetPreviews((current)=>{
    if(current[key]?.url) URL.revokeObjectURL(current[key].url);
    const next={...current};
    delete next[key];
    return next;
  });

  useEffect(()=>{
    if(state.sceneId==='01-department-office'&&!state.flags.introSeen&&!dialogue) startDialogue('office.opening');
    if(state.sceneId==='02-gannets-end-harbor'&&!state.flags.harborIntroSeen&&!dialogue) startDialogue('harbor.opening');
    if(state.sceneId==='03-gannets-end-lighthouse'&&!state.flags.lighthouseIntroSeen&&!dialogue) startDialogue('lighthouse.opening');
  },[state.sceneId,state.flags.introSeen,state.flags.harborIntroSeen,state.flags.lighthouseIntroSeen]);

  useEffect(()=>{
    const onKey=(event)=>{
      if(event.key!=='Escape') return;
      event.preventDefault();
      if(showComposer) {
        setShowComposer(false);
        return;
      }
      setShowPauseMenu((open)=>!open);
    };
    window.addEventListener('keydown',onKey);
    return ()=>window.removeEventListener('keydown',onKey);
  },[showComposer]);

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
    setDialogue(null); setMessage(''); setThought(''); setHoveredHotspot(null); setHoveredInventory(null); setShowPauseMenu(false);
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
  const reset=()=>{localStorage.removeItem(SAVE_KEY);setState(structuredClone(initialState));setDialogue(null);setPopup(null);setThought('');setMessage('');setShowPauseMenu(false);};
  const manualSave=()=>{
    const saved=saveManualState(state);
    setShowPauseMenu(false);
    say(saved?'Game saved. The Department has reluctantly acknowledged your progress.':'The save failed. The Department denies responsibility.');
  };
  const manualLoad=()=>{
    const saved=loadManualState();
    if(!saved) { setShowPauseMenu(false); return say('No manual save exists yet.'); }
    setState(saved);setDialogue(null);setPopup(null);setThought('');setMessage('Game loaded. Continuity restored.');setShowPauseMenu(false);
  };

  if(state.sceneId==='ending') return <Ending/>;
  const position=state.positions[state.sceneId]||scene.start;

  return <main className="game-shell">
    <section className="game-frame">
      <SceneRenderer
        scene={scene}
        flags={state.flags}
        position={position}
        onPosition={(next)=>setState((s)=>({...s,positions:{...s.positions,[s.sceneId]:next}}))}
        onHotspot={interact}
        overrides={overrides}
        setOverrides={setOverrides}
        composer={{active:showComposer,selection:composerSelection,setSelection:setComposerSelection,linkHotspot}}
        assetPreviews={assetPreviews}
        inputLocked={inputLocked || showComposer}
        debugHotspots={debugHotspots}
        onHotspotHover={setHoveredHotspot}
      />
      <Thought text={thought}/>
      <Message text={message} onClose={()=>setMessage('')}/>
      <div className="objective-ribbon"><span>OBJECTIVE</span>{objective}</div>
      <div className="scene-caption">{scene.name}</div>
    </section>

    <section className="game-controls">
      <ActionBar verb={state.verb} onChange={(verb)=>setState((s)=>({...s,verb,selectedItem:verb==='walk'||verb==='talk'||verb==='pickup'?null:s.selectedItem}))}/>
      <StatusLine verb={state.verb} selectedItem={state.selectedItem} hoveredHotspot={hoveredHotspot} hoveredInventory={hoveredInventory}/>
      <InventoryBar inventory={state.inventory} selected={state.selectedItem} onItemClick={inventoryClick} onItemDoubleClick={inventoryUse} onItemHover={setHoveredInventory}/>
    </section>

    <DialoguePanel dialogue={dialogue} onAdvance={advanceDialogue} onChoice={chooseDialogue} flags={state.flags}/>
    <ItemPopup popup={popup} onClose={closePopup}/>

    {showPauseMenu&&<div className="pause-shade" onClick={()=>setShowPauseMenu(false)}>
      <section className="pause-menu" onClick={(event)=>event.stopPropagation()} aria-label="Game menu">
        <div className="pause-menu__title"><strong>Mara Quibble</strong><span>{scene.name}</span></div>
        <button onClick={()=>setShowPauseMenu(false)}>Resume</button>
        <button onClick={manualSave}>Save game</button>
        <button onClick={manualLoad}>Load game</button>
        <button onClick={()=>{setShowPauseMenu(false);setShowComposer(true);}}>Scene composer</button>
        <button onClick={()=>setDebugHotspots((shown)=>!shown)}>{debugHotspots?'Hide':'Show'} hotspots</button>
        <button onClick={()=>setState((s)=>({...s,mute:!s.mute}))}>{state.mute?'Enable sound':'Mute sound'}</button>
        <button className="danger" onClick={reset}>Restart game</button>
        <small>Press Esc to close this menu.</small>
      </section>
    </div>}

    {showComposer&&<LayerEditor scene={scene} overrides={overrides} setOverrides={setOverrides} selection={composerSelection} setSelection={setComposerSelection} linkHotspot={linkHotspot} setLinkHotspot={setLinkHotspot} assetPreviews={assetPreviews} onPreviewAsset={previewAsset} onClearPreviewAsset={clearPreviewAsset} onSceneChange={changeScene} onClose={()=>setShowComposer(false)}/>} 
  </main>;
}
