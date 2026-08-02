import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { combineInventory, INITIAL_FLAGS, ITEM_DEFS, START_STATE } from './gameLogic';
import './styles.css';

const BASE = import.meta.env.BASE_URL;
const SAVE_KEY = 'mara-quibble-poc-v2';

const VERBS = [
  ['walk', 'Walk to'],
  ['look', 'Look at'],
  ['use', 'Use'],
  ['talk', 'Talk to'],
  ['pickup', 'Pick up'],
  ['give', 'Give']
];

const PORTRAITS = {
  Mara: 'portrait-mara.jpg',
  'Mr. Pindle': 'portrait-pindle.jpg',
  Pindle: 'portrait-pindle.jpg',
  'Captain Nib': 'portrait-captain.jpg',
  'Madame Brine': 'portrait-brine.jpg',
  Gus: 'portrait-gus.jpg',
  'Mechanical Gull': 'portrait-gull.jpg'
};

const OFFICE_HOTSPOTS = [
  { id: 'pindle', label: 'Mr. Pindle', x: 17, y: 37, w: 19, h: 29, walkX: 28 },
  { id: 'terminal', label: 'pneumatic terminal', x: 22, y: 66, w: 16, h: 20, walkX: 31 },
  { id: 'poster', label: 'emergency procedure', x: 35, y: 18, w: 9, h: 28, walkX: 40 },
  { id: 'clock', label: 'official municipal clock', x: 50, y: 2, w: 14, h: 24, walkX: 55 },
  { id: 'door', label: 'staff-only door', x: 51, y: 28, w: 12, h: 47, walkX: 55 },
  { id: 'fishbowl', label: 'Mr. Ledger’s fishbowl', x: 66, y: 44, w: 14, h: 31, walkX: 69 },
  { id: 'alarm', label: 'fire alarm', x: 68, y: 67, w: 10, h: 17, walkX: 70 },
  { id: 'shelf', label: 'lost-property shelf', x: 79, y: 33, w: 20, h: 48, walkX: 81 },
  { id: 'forms', label: 'complaint forms', x: 1, y: 65, w: 19, h: 25, walkX: 22 },
  { id: 'map', label: 'city map', x: 72, y: 2, w: 23, h: 37, walkX: 73 },
  { id: 'lamp', label: 'desk lamp', x: 17, y: 63, w: 10, h: 15, walkX: 26 }
];

const HARBOR_HOTSPOTS = [
  { id: 'brine', label: 'Madame Brine', x: 78, y: 33, w: 20, h: 43, walkX: 75 },
  { id: 'captain', label: 'Captain Nib', x: 59, y: 34, w: 16, h: 48, walkX: 58 },
  { id: 'bird', label: 'mechanical gull', x: 24, y: 3, w: 15, h: 27, walkX: 31 },
  { id: 'bucket', label: 'empty fish bucket', x: 24, y: 68, w: 12, h: 18, walkX: 34 },
  { id: 'fish', label: 'sardines', x: 79, y: 62, w: 16, h: 20, walkX: 75 },
  { id: 'pump', label: 'broken bilge pump', x: 48, y: 65, w: 10, h: 20, walkX: 49 },
  { id: 'boat', label: 'The Misty Minnow', x: 39, y: 22, w: 30, h: 54, walkX: 50 },
  { id: 'lighthouse', label: 'abandoned lighthouse', x: 36, y: 7, w: 9, h: 27, walkX: 43 },
  { id: 'hat', label: 'ceremonial captain’s hat', x: 31, y: 70, w: 9, h: 12, walkX: 36, conditional: 'birdLured' },
  { id: 'tavern', label: 'The Rusty Kettle', x: 0, y: 12, w: 17, h: 62, walkX: 17 }
];

const SCENES = {
  office: {
    name: 'Department of Lost Causes',
    background: 'office-bg-v2.jpg',
    backFix: null,
    front: 'office-front.png',
    worldScale: 1.18,
    hotspots: OFFICE_HOTSPOTS
  },
  harbor: {
    name: 'Gannet’s End Harbor',
    background: 'harbor-bg-v3.jpg',
    backFix: null,
    front: 'harbor-front.png',
    worldScale: 1.34,
    hotspots: HARBOR_HOTSPOTS
  }
};

const WRONG_COMBINATIONS = [
  'That would create paperwork, not progress.',
  'Mara briefly considers it. Civilization survives.',
  'The objects maintain a professional distance.',
  'Even the peppermint thinks that is a bad idea.',
  'Gus says nothing, which is somehow judgmental.',
  'There is improvisation, and then there is evidence.'
];

function savedGame() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!parsed?.inventory || !parsed?.flags) return START_STATE;
    return {
      ...START_STATE,
      ...parsed,
      flags: { ...INITIAL_FLAGS, ...parsed.flags },
      maraX: { ...START_STATE.maraX, ...(parsed.maraX || {}) }
    };
  } catch {
    return START_STATE;
  }
}

function App() {
  const [game, setGame] = useState(savedGame);
  const [verb, setVerb] = useState('walk');
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoverText, setHoverText] = useState('Walk to somewhere needlessly official');
  const [dialogue, setDialogue] = useState(null);
  const [itemPopup, setItemPopup] = useState(null);
  const [thought, setThought] = useState('');
  const [moving, setMoving] = useState(false);
  const [facing, setFacing] = useState('right');
  const [cameraPx, setCameraPx] = useState(0);
  const [clockSpin, setClockSpin] = useState(false);
  const [alarmFlash, setAlarmFlash] = useState(false);
  const [fogBurst, setFogBurst] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const audioRef = useRef(null);
  const timers = useRef([]);
  const viewportRef = useRef(null);
  const introStarted = useRef(false);
  const harborStarted = useRef(false);

  const scene = SCENES[game.scene] || SCENES.office;

  const schedule = (fn, delay) => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  };

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  }, [game]);

  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const updateFlags = (patch) => setGame((g) => ({ ...g, flags: { ...g.flags, ...patch } }));
  const has = (id) => game.inventory.includes(id);
  const addItem = (id) => setGame((g) => ({ ...g, inventory: g.inventory.includes(id) ? g.inventory : [...g.inventory, id] }));
  const removeItem = (id) => setGame((g) => ({ ...g, inventory: g.inventory.filter((x) => x !== id) }));

  const showThought = (text, duration = 4200) => {
    setThought(text);
    schedule(() => setThought((current) => (current === text ? '' : current)), duration);
  };

  const playDialogue = (lines, options = {}) => {
    const normalized = lines.map((line) => (typeof line === 'string' ? { speaker: 'Mara', text: line } : line));
    setDialogue({
      lines: normalized,
      index: 0,
      choices: options.choices || null,
      onDone: options.onDone || null,
      cinematic: Boolean(options.cinematic)
    });
  };

  const finishDialogue = () => {
    const done = dialogue?.onDone;
    setDialogue(null);
    if (done) schedule(done, 80);
  };

  const advanceDialogue = () => {
    if (!dialogue) return;
    if (dialogue.index < dialogue.lines.length - 1) {
      setDialogue((d) => ({ ...d, index: d.index + 1 }));
      return;
    }
    if (!dialogue.choices) finishDialogue();
  };

  const chooseDialogue = (choice) => {
    setDialogue(null);
    schedule(choice.action, 80);
  };

  const showItems = (entries, onDone = null) => {
    const queue = entries.map((entry) => ({ type: 'YOU PICKED UP', ...entry }));
    setItemPopup({ queue, index: 0, onDone });
  };

  const closeItemPopup = () => {
    if (!itemPopup) return;
    if (itemPopup.index < itemPopup.queue.length - 1) {
      setItemPopup((p) => ({ ...p, index: p.index + 1 }));
      return;
    }
    const done = itemPopup.onDone;
    setItemPopup(null);
    if (done) schedule(done, 100);
  };

  const grantItems = (entries, onDone = null) => {
    setGame((g) => {
      const ids = entries.map((e) => e.id);
      return { ...g, inventory: [...g.inventory, ...ids.filter((id) => !g.inventory.includes(id))] };
    });
    sounds.item();
    showItems(entries, onDone);
  };

  const ensureAudio = () => {
    if (game.mute) return null;
    if (!audioRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioRef.current = new AudioContext();
    }
    if (audioRef.current?.state === 'suspended') audioRef.current.resume();
    return audioRef.current;
  };

  const tone = (frequency, duration = 0.15, type = 'sine', volume = 0.06, startOffset = 0) => {
    const ctx = ensureAudio();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + startOffset;
    oscillator.frequency.setValueAtTime(frequency, start);
    oscillator.type = type;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  };

  const sounds = {
    click: () => tone(230, 0.05, 'square', 0.025),
    item: () => { tone(440, 0.12, 'triangle', 0.05); tone(670, 0.17, 'triangle', 0.04, 0.08); },
    alarm: () => { for (let i = 0; i < 7; i += 1) tone(i % 2 ? 390 : 530, 0.16, 'square', 0.045, i * 0.17); },
    gull: () => { tone(940, 0.09, 'sawtooth', 0.04); tone(690, 0.12, 'sawtooth', 0.035, 0.1); },
    bell: () => { tone(145, 1.7, 'sine', 0.08); tone(290, 1.1, 'sine', 0.035); },
    foghorn: () => { tone(83, 1.7, 'sawtooth', 0.1); tone(124, 1.5, 'sine', 0.075); }
  };

  const cameraFor = (x) => {
    const viewport = viewportRef.current?.clientWidth || 1000;
    const world = viewport * scene.worldScale;
    const desired = (x / 100) * world - viewport * 0.48;
    return Math.max(0, Math.min(world - viewport, desired));
  };

  useEffect(() => {
    const recenter = () => setCameraPx(cameraFor(game.maraX[game.scene] ?? 50));
    recenter();
    window.addEventListener('resize', recenter);
    return () => window.removeEventListener('resize', recenter);
  }, [game.scene]);

  const walkTo = (x, action) => {
    if (moving || dialogue || itemPopup || transitioning) return;
    const old = game.maraX[game.scene] ?? 50;
    setFacing(x < old ? 'left' : 'right');
    const duration = Math.min(1350, Math.max(320, Math.abs(old - x) * 20));
    setMoving(true);
    setCameraPx(cameraFor(x));
    setGame((g) => ({ ...g, maraX: { ...g.maraX, [g.scene]: x } }));
    schedule(() => {
      setMoving(false);
      if (action) action();
    }, duration);
  };

  const objective = useMemo(() => {
    const f = game.flags;
    if (game.scene === 'ending') return 'The lighthouse is waiting.';
    if (game.scene === 'office') {
      if (!f.pindleTalked) return 'Ask Mr. Pindle about the impossible parcel.';
      if (!f.terminalSeen) return 'Examine the pneumatic delivery terminal.';
      if (!f.packageUnlocked) return 'Make tomorrow officially happen.';
      if (!f.packageOpened) return 'Retrieve the impossible parcel.';
      return 'Follow the moth’s route to Gannet’s End Harbor.';
    }
    if (!f.captainTalked) return 'Ask Captain Nib for passage to the lighthouse.';
    if (!f.hatGiven || !f.hornGiven) return 'Recover Nib’s hat and construct a working foghorn.';
    return 'Board the ferry and try not to explode.';
  }, [game.scene, game.flags]);

  const pindleConversation = () => {
    updateFlags({ pindleTalked: true });
    playDialogue([
      { speaker: 'Mara', text: 'Mr. Pindle?' },
      { speaker: 'Mr. Pindle', text: 'I’m extremely busy.' },
      { speaker: 'Mara', text: 'You’re holding a blank sheet of paper upside down.' },
      { speaker: 'Mr. Pindle', text: 'Confidentially.' }
    ], {
      choices: [
        {
          label: 'What is wrong with the parcel?',
          action: () => playDialogue([
            { speaker: 'Mara', text: 'Why won’t the machine release it?' },
            { speaker: 'Mr. Pindle', text: 'The terminal believes the parcel has not yet been mailed.' },
            { speaker: 'Mara', text: 'But it has arrived.' },
            { speaker: 'Mr. Pindle', text: 'Physically. Administratively, it remains in the future.' },
            { speaker: 'Mara', text: 'So it is here, but we are not allowed to acknowledge that it is here.' },
            { speaker: 'Mr. Pindle', text: 'Now you understand government work.' }
          ], { onDone: () => showThought('The hatch will open only when the office believes the parcel’s delivery date has arrived.') })
        },
        {
          label: 'Can you release it?',
          action: () => playDialogue([
            { speaker: 'Mara', text: 'Can you override the terminal?' },
            { speaker: 'Mr. Pindle', text: 'Certainly.' },
            { speaker: 'Mara', text: 'Will you?' },
            { speaker: 'Mr. Pindle', text: 'Certainly not. Overrides require authorization.' },
            { speaker: 'Mara', text: 'From whom?' },
            { speaker: 'Mr. Pindle', text: 'Me.' }
          ])
        },
        {
          label: 'What am I supposed to do?',
          action: () => playDialogue([
            { speaker: 'Mr. Pindle', text: 'The terminal checks the official municipal date.' },
            { speaker: 'Mara', text: 'The clock?' },
            { speaker: 'Mr. Pindle', text: 'Among other things. Consult the emergency continuity procedure.' },
            { speaker: 'Mara', text: 'Where is that?' },
            { speaker: 'Mr. Pindle', text: 'Displayed prominently.' }
          ], { onDone: () => showThought('The machine follows the official clock. The emergency poster may explain how to advance it.') })
        },
        {
          label: 'What exactly does this department do?',
          action: () => playDialogue([
            { speaker: 'Mr. Pindle', text: 'We receive items that cannot sensibly be returned.' },
            { speaker: 'Mara', text: 'Such as?' },
            { speaker: 'Mr. Pindle', text: 'Unsigned apologies. Abandoned ambitions. Matching socks separated under suspicious circumstances.' },
            { speaker: 'Mara', text: 'And umbrellas.' },
            { speaker: 'Mr. Pindle', text: 'Umbrellas are the backbone of municipal regret.' }
          ])
        },
        { label: 'I’ll figure it out.', action: () => showThought('First: understand what controls the terminal. Pindle strongly implied that the official date matters.') }
      ]
    });
  };

  const captainConversation = () => {
    updateFlags({ captainTalked: true });
    playDialogue([
      { speaker: 'Mara', text: 'I need you to take me to the lighthouse.' },
      { speaker: 'Captain Nib', text: 'Impossible.' },
      { speaker: 'Mara', text: 'Why?' },
      { speaker: 'Captain Nib', text: 'The sea is hostile, the fog is malicious, and I am improperly dressed.' },
      { speaker: 'Mara', text: 'You’re wearing a coat.' },
      { speaker: 'Captain Nib', text: 'I am not wearing my hat.' }
    ], {
      choices: [
        {
          label: 'Why won’t you sail?',
          action: () => playDialogue([
            { speaker: 'Captain Nib', text: 'Three reasons: my ceremonial hat was stolen, my regulation foghorn is broken, and the fog has developed intentions.' },
            { speaker: 'Mara', text: 'How can you tell?' },
            { speaker: 'Captain Nib', text: 'Ordinary fog drifts. This fog waits.' }
          ], { onDone: () => showThought('Nib needs his hat and a working foghorn. That may be easier than arguing with him.') })
        },
        {
          label: 'What happened to your hat?',
          action: () => playDialogue([
            { speaker: 'Captain Nib', text: 'The mechanical gull took it. Professional jealousy.' },
            { speaker: 'Mara', text: 'It’s a bird.' },
            { speaker: 'Captain Nib', text: 'Then explain its pension.' }
          ], { onDone: () => showThought('The gull may trade the hat for food. Birds are refreshingly direct negotiators.') })
        },
        {
          label: 'What happened to the foghorn?',
          action: () => playDialogue([
            { speaker: 'Captain Nib', text: 'It was damaged in the regrettable soup incident.' },
            { speaker: 'Mara', text: 'Can it be repaired?' },
            { speaker: 'Captain Nib', text: 'Not with any part recognized by the Harbor Authority.' },
            { speaker: 'Mara', text: 'And with unrecognized parts?' },
            { speaker: 'Captain Nib', text: 'I respect the direction of your thinking.' }
          ])
        },
        {
          label: 'What is wrong with the fog?',
          action: () => playDialogue([
            { speaker: 'Captain Nib', text: 'Three boats entered it last month. One returned yesterday. One returned in 1884.' },
            { speaker: 'Mara', text: 'And the third?' },
            { speaker: 'Captain Nib', text: 'Runs a successful bakery now.' }
          ])
        },
        { label: 'I’ll return when you’re properly accessorized.', action: () => showThought('Hat. Foghorn. Then perhaps courage will arrive as a side effect.') }
      ]
    });
  };

  const brineConversation = () => {
    updateFlags({ brineTalked: true });
    playDialogue([
      { speaker: 'Madame Brine', text: 'I predict rain, fog, and a customer asking for free fish. In that order.' },
      { speaker: 'Mara', text: 'The rain and fog already happened.' },
      { speaker: 'Madame Brine', text: 'Then my accuracy is undeniable.' }
    ], {
      choices: [
        {
          label: 'What do you know about the lighthouse?',
          action: () => playDialogue([
            { speaker: 'Madame Brine', text: 'It was built to guide ships away from danger. Then it began guiding other things.' },
            { speaker: 'Mara', text: 'What things?' },
            { speaker: 'Madame Brine', text: 'Possibilities. Regrets. Tourists.' },
            { speaker: 'Mara', text: 'Why was it abandoned?' },
            { speaker: 'Madame Brine', text: 'The keeper disappeared into a particularly bad Tuesday.' }
          ])
        },
        {
          label: 'Can I have a fish?',
          action: () => playDialogue([
            { speaker: 'Mara', text: 'Could I have one sardine?' },
            { speaker: 'Madame Brine', text: 'Certainly. After payment.' },
            { speaker: 'Mara', text: 'I don’t have money.' },
            { speaker: 'Madame Brine', text: 'Then you cannot afford the luxury fish.' },
            { speaker: 'Mara', text: 'It’s a sardine.' },
            { speaker: 'Madame Brine', text: 'Luxury is a matter of presentation.' }
          ], { onDone: () => showThought('Madame Brine wants payment—or a reason to feel indebted. The postcard may interest a professional prophet.') })
        },
        {
          label: 'Are you really a fortune-teller?',
          action: () => playDialogue([
            { speaker: 'Madame Brine', text: 'Maritime clairvoyant.' },
            { speaker: 'Mara', text: 'What is the difference?' },
            { speaker: 'Madame Brine', text: 'Salt.' }
          ])
        },
        {
          label: 'What does the gull eat?',
          action: () => playDialogue([
            { speaker: 'Madame Brine', text: 'Fish, metal, loose documents, and the dignity of public officials. It prefers sardines.' }
          ], { onDone: () => showThought('The gull wants a sardine. Madame Brine has sardines. Bureaucracy has prepared me for this triangle.') })
        },
        { label: 'I’ll leave you to your fish.', action: () => showThought('The impossible postcard shows this stall. I should compare it with the real scene.') }
      ]
    });
  };

  const inspectInventory = (id) => {
    if (id === 'complaint' && !game.flags.bandTaken) {
      updateFlags({ bandTaken: true });
      grantItems([{ id: 'rubber-band', type: 'YOU PICKED UP' }], () => {
        playDialogue([{ speaker: 'Mara', text: 'The complaint is now free-range.' }]);
        showThought('The rubber band could hold a crude tool together. Now I need something long enough to reach the fishbowl.')
      });
      return;
    }
    if (id === 'hat' && !game.flags.duckCallFound) {
      updateFlags({ duckCallFound: true });
      grantItems([{ id: 'duck-call', type: 'YOU DISCOVERED' }], () => playDialogue([
        { speaker: 'Mara', text: 'Why does every grown man in this town hide a smaller object in his hat?' },
        { speaker: 'Gus', text: 'Every profession protects its terminology.' }
      ]));
      return;
    }
    if (id === 'gus') {
      playDialogue([{ speaker: 'Gus', text: 'Yesterday was ideal umbrella weather. Today is behaving irresponsibly.' }]);
      return;
    }
    playDialogue([{ speaker: 'Mara', text: ITEM_DEFS[id].description }]);
  };

  const combineItems = (first, second) => {
    const result = combineInventory(game.inventory, first, second);
    if (!result) {
      playDialogue([{ speaker: 'Mara', text: WRONG_COMBINATIONS[Math.floor(Math.random() * WRONG_COMBINATIONS.length)] }]);
      return;
    }
    setGame((g) => ({
      ...g,
      inventory: result.inventory,
      flags: { ...g.flags, ...(result.result === 'tongs' ? { tongsMade: true } : { foghornMade: true }) }
    }));
    setSelectedItem(null);
    sounds.item();
    showItems([{ id: result.result, type: 'YOU MADE' }], () => {
      if (result.result === 'tongs') {
        playDialogue([{ speaker: 'Mara', text: 'If this works, I’m adding “engineering” to my job description.' }], {
          onDone: () => showThought('The improvised tongs should reach the brass handle at the bottom of the fishbowl.')
        });
      } else {
        playDialogue([{ speaker: 'Mara', text: 'Loud, portable, and impossible to defend in writing.' }], {
          onDone: () => showThought('The foghorn exists. I should test it before handing it to a man with strong opinions about maritime regulation.')
        });
      }
    });
  };

  const onInventoryClick = (id) => {
    sounds.click();
    if (verb === 'look' || ((id === 'complaint' || id === 'hat') && verb === 'use' && !selectedItem)) {
      inspectInventory(id);
      return;
    }
    if (!selectedItem) {
      setSelectedItem(id);
      setVerb('use');
      setHoverText(`Use ${ITEM_DEFS[id].name} with…`);
      return;
    }
    if (selectedItem === id) {
      inspectInventory(id);
      setSelectedItem(null);
      return;
    }
    combineItems(selectedItem, id);
  };

  const fireDrill = () => {
    sounds.alarm();
    setAlarmFlash(true);
    setClockSpin(true);
    playDialogue([
      { speaker: 'Mr. Pindle', text: 'Attention. This is not a fire.' },
      { speaker: 'Mara', text: 'That is reassuring.' },
      { speaker: 'Mr. Pindle', text: 'It is a legally recognized simulation of a fire.' },
      { speaker: 'Mara', text: 'Less reassuring.' },
      { speaker: 'Mr. Pindle', text: 'I am evacuating emotionally.' }
    ], {
      cinematic: true,
      onDone: () => {
        setAlarmFlash(false);
        setClockSpin(false);
        updateFlags({ packageUnlocked: true });
        playDialogue([{ speaker: 'Mara', text: 'The terminal thinks tomorrow has arrived. Time to open the parcel before the office changes its mind.' }]);
      }
    });
  };

  const openPackage = () => {
    updateFlags({ packageOpened: true });
    playDialogue([
      { speaker: 'Mara', text: 'The string is untying itself. That saves time and raises concerns.' },
      { speaker: 'Mara', text: 'Inside: a postcard, a cracked watch, and a note written in my handwriting.' },
      { speaker: 'Mara', text: '“Do not let the lighthouse ring. Do not trust the man with the perfect timetable. Bring an umbrella.”' },
      { speaker: 'Mara', text: 'I dislike receiving instructions from myself.' },
      { speaker: 'Mr. Pindle', text: 'It creates a difficult chain of command.' }
    ], {
      cinematic: true,
      onDone: () => grantItems([
        { id: 'postcard', type: 'YOU PICKED UP' },
        { id: 'watch', type: 'YOU PICKED UP' },
        { id: 'gus', type: 'YOU PICKED UP' }
      ], () => {
        sounds.bell();
        updateFlags({ gusAwake: true });
        playDialogue([
          { speaker: 'Gus', text: 'I warned them yesterday.' },
          { speaker: 'Mara', text: '…You talk?' },
          { speaker: 'Gus', text: 'Only when the situation becomes meteorologically irresponsible.' },
          { speaker: 'Mara', text: 'You predict weather?' },
          { speaker: 'Gus', text: 'Yesterday’s weather. With exceptional accuracy.' }
        ], {
          cinematic: true,
          onDone: () => showThought('The moth burned a route to Gannet’s End Harbor. I should follow it—and apparently bring Gus.')
        });
      })
    });
  };

  const showPostcardToBrine = () => {
    updateFlags({ postcardShown: true, sardineTaken: true });
    playDialogue([
      { speaker: 'Mara', text: 'This arrived from tomorrow.' },
      { speaker: 'Madame Brine', text: 'Cheap paper. Weak symbolism. Excessive lighthouse.' },
      { speaker: 'Mara', text: 'Look at the corner. Your swordfish sign is falling.' },
      { speaker: 'Madame Brine', text: 'My sign is perfectly—' },
      { speaker: 'Mara', text: 'Move!' },
      { speaker: 'Madame Brine', text: 'Moderate prophecy. Irritating, but useful. Take a sardine—and the glove. It has seen too much.' }
    ], {
      cinematic: true,
      onDone: () => grantItems([
        { id: 'sardine', type: 'YOU PICKED UP' },
        { id: 'glove', type: 'YOU PICKED UP' }
      ], () => showThought('The gull wants the sardine. I should place it somewhere that forces the bird to abandon the hat.'))
    });
  };

  const testFoghorn = () => {
    sounds.foghorn();
    setFogBurst(true);
    updateFlags({ hornTested: true });
    schedule(() => setFogBurst(false), 2600);
    playDialogue([
      { speaker: 'Mara', text: 'The device emits a note so deep that the harbor briefly remembers being a valley.' },
      { speaker: 'Madame Brine', text: 'Acceptable.' },
      { speaker: 'Captain Nib', text: 'Regulation quality.' },
      { speaker: 'Mara', text: 'There is absolutely no regulation for that.' },
      { speaker: 'Captain Nib', text: 'Then it violates none.' }
    ], { onDone: () => showThought('The foghorn works. Now Captain Nib needs it—and his hat.') });
  };

  const departureCutscene = () => {
    updateFlags({ departed: true });
    playDialogue([
      { speaker: 'Captain Nib', text: 'The Misty Minnow is prepared.' },
      { speaker: 'Mara', text: 'To reach the lighthouse?' },
      { speaker: 'Captain Nib', text: 'Prepared and willing are different maritime conditions.' },
      { speaker: 'Madame Brine', text: 'If the lighthouse asks your name, lie.' },
      { speaker: 'Mara', text: 'Why?' },
      { speaker: 'Madame Brine', text: 'It already knows the truth.' },
      { speaker: 'Gus', text: 'I object to this storage arrangement.' },
      { speaker: 'Captain Nib', text: 'All crew members have assigned stations.' },
      { speaker: 'Mara', text: 'The watch just moved to 4:17.' },
      { speaker: 'Captain Nib', text: 'Did we just explode?' },
      { speaker: 'Mara', text: 'Not in this version.' }
    ], {
      cinematic: true,
      onDone: () => {
        sounds.bell();
        setTransitioning(true);
        schedule(() => setGame((g) => ({ ...g, scene: 'ending' })), 900);
      }
    });
  };

  const resolveOffice = (id, activeVerb, item) => {
    const f = game.flags;
    if (item) {
      if (id === 'fishbowl' && item === 'tongs' && !f.handleTaken) {
        removeItem('tongs');
        updateFlags({ handleTaken: true });
        grantItems([{ id: 'handle', type: 'YOU PICKED UP' }], () => playDialogue([
          { speaker: 'Mara', text: 'Sorry, Mr. Ledger. Civic safety outranks aquatic décor.' }
        ], { onDone: () => showThought('The brass handle should repair the fire alarm.') }));
        return;
      }
      if (id === 'alarm' && item === 'handle' && !f.alarmRepaired) {
        removeItem('handle');
        updateFlags({ alarmRepaired: true });
        playDialogue([{ speaker: 'Mara', text: 'There. Nothing reassures the public like restored panic infrastructure.' }], {
          onDone: () => showThought('The alarm is repaired. Pulling it should start the emergency drill and advance the official date.')
        });
        return;
      }
      if (id === 'terminal' && item === 'id-card') {
        playDialogue([{ speaker: 'SYSTEM', text: 'EMPLOYEE RECOGNIZED. AUTHORITY NOT FOUND.' }, { speaker: 'Mara', text: 'Accurate and unnecessarily personal.' }]);
        return;
      }
      playDialogue([{ speaker: 'Mara', text: WRONG_COMBINATIONS[Math.floor(Math.random() * WRONG_COMBINATIONS.length)] }]);
      return;
    }

    if (id === 'pindle') {
      if (activeVerb === 'talk') pindleConversation();
      else playDialogue([{ speaker: 'Mara', text: 'Mr. Pindle appears to be losing an argument with a blank form.' }]);
      return;
    }
    if (id === 'terminal') {
      updateFlags({ terminalSeen: true });
      if (f.packageUnlocked) {
        if (!f.packageOpened && (activeVerb === 'pickup' || activeVerb === 'use' || activeVerb === 'open')) openPackage();
        else playDialogue([{ speaker: 'Mara', text: f.packageOpened ? 'The terminal is empty. Tomorrow has already been delivered.' : 'The parcel hatch is open.' }]);
      } else {
        playDialogue([
          { speaker: 'SYSTEM', text: 'DELIVERY REJECTED. ITEM ARRIVED BEFORE BEING SENT. PLEASE TRY AGAIN TOMORROW.' },
          { speaker: 'Mara', text: 'The machine is detaining the parcel on chronological grounds.' }
        ], { onDone: () => showThought('The terminal only cares about the official date. I need to make the office believe it is tomorrow.') });
      }
      return;
    }
    if (id === 'poster') {
      updateFlags({ posterSeen: true });
      playDialogue([{ speaker: 'Mara', text: '“During a fire drill, advance the official date by one day to ensure tomorrow remains fully staffed.” That explains why we’re so well prepared for yesterday.' }], {
        onDone: () => showThought('If I can trigger a fire drill, the official clock should jump to tomorrow.')
      });
      return;
    }
    if (id === 'alarm') {
      updateFlags({ alarmSeen: true });
      if (!f.alarmRepaired) {
        playDialogue([{ speaker: 'Mara', text: 'The fire alarm is missing its pull handle. Someone has stolen the most exciting part.' }], {
          onDone: () => showThought('The alarm needs its brass handle. I should look around the office.')
        });
      } else if (!f.packageUnlocked && (activeVerb === 'use' || activeVerb === 'pull')) fireDrill();
      else playDialogue([{ speaker: 'Mara', text: f.packageUnlocked ? 'One official fire drill is enough excitement for a fiscal quarter.' : 'It is repaired. Pulling it would begin an official fire drill.' }]);
      return;
    }
    if (id === 'fishbowl') {
      updateFlags({ handleSeen: true });
      playDialogue([{ speaker: 'Mara', text: f.handleTaken ? 'Mr. Ledger guards an empty ceramic castle and several classified bubbles.' : 'The missing fire-alarm handle is at the bottom. Mr. Ledger has claimed jurisdiction.' }], {
        onDone: () => !f.handleTaken && showThought('I need something long enough to retrieve the handle without touching the evidence water.')
      });
      return;
    }
    if (id === 'shelf') {
      if (!f.rulersTaken && (activeVerb === 'pickup' || activeVerb === 'use')) {
        updateFlags({ rulersTaken: true });
        grantItems([
          { id: 'short-ruler', type: 'YOU PICKED UP' },
          { id: 'long-ruler', type: 'YOU PICKED UP' }
        ], () => playDialogue([{ speaker: 'Mara', text: 'If this stops being a clerical problem, it may become geometry.' }]));
      } else playDialogue([{ speaker: 'Mara', text: 'Lost hats, lost keys, one bowling pin, and an umbrella pretending not to listen.' }]);
      return;
    }
    if (id === 'forms') {
      if (!f.bandTaken) inspectInventory('complaint');
      else playDialogue([{ speaker: 'Mara', text: 'The forms are now loosely organized. Anarchy has begun.' }]);
      return;
    }
    if (id === 'clock') {
      playDialogue([{ speaker: 'Mara', text: f.packageUnlocked ? 'The official clock now insists it is tomorrow. It looks smug about it.' : 'The official municipal clock. It is never right, but it is always binding.' }]);
      return;
    }
    if (id === 'map') {
      if (f.packageOpened) {
        playDialogue([{ speaker: 'Mara', text: 'The mechanical moth burned a route from here to Gannet’s End Harbor.' }], {
          choices: [
            {
              label: 'Follow the route to the harbor',
              action: () => {
                playDialogue([
                  { speaker: 'Mara', text: 'Mr. Pindle, I’m investigating an impossible parcel, a stopped clock, and an abandoned lighthouse.' },
                  { speaker: 'Mr. Pindle', text: 'Will you be returning before close?' },
                  { speaker: 'Mara', text: 'Probably not.' },
                  { speaker: 'Mr. Pindle', text: 'Approved.' },
                  { speaker: 'Mara', text: 'You did not read that.' },
                  { speaker: 'Mr. Pindle', text: 'I approved your absence, not your plan.' }
                ], {
                  cinematic: true,
                  onDone: () => {
                    setTransitioning(true);
                    schedule(() => {
                      setGame((g) => ({ ...g, scene: 'harbor', maraX: { ...g.maraX, harbor: 34 } }));
                      setTransitioning(false);
                    }, 750);
                  }
                });
              }
            },
            { label: 'Remain safely underqualified', action: () => playDialogue([{ speaker: 'Gus', text: 'A bold commitment to indoor weather.' }]) }
          ]
        });
      } else playDialogue([{ speaker: 'Mara', text: 'A map of Timberbottom. Half the streets are named “Temporary Access Road.”' }]);
      return;
    }
    if (id === 'door') {
      playDialogue([{ speaker: 'Mara', text: 'Staff only. Probably.' }, { speaker: 'Mr. Pindle', text: 'The restriction is working.' }]);
      return;
    }
    if (id === 'lamp') {
      playDialogue([{ speaker: 'Mara', text: 'The Department’s brightest employee.' }]);
    }
  };

  const resolveHarbor = (id, activeVerb, item) => {
    const f = game.flags;
    if (item) {
      if (id === 'brine' && item === 'postcard' && !f.postcardShown) {
        showPostcardToBrine();
        return;
      }
      if (id === 'bucket' && item === 'sardine' && !f.birdLured) {
        removeItem('sardine');
        updateFlags({ birdLured: true });
        sounds.gull();
        playDialogue([
          { speaker: 'Mara', text: 'The gull dives into the bucket with the precision of a tax audit and the dignity of neither.' },
          { speaker: 'Mechanical Gull', text: 'KRRR-CHING! KRRR-CHING!' },
          { speaker: 'Mara', text: 'The captain’s hat dropped onto the dock.' }
        ], { onDone: () => showThought('The gull is occupied. I should grab the hat before it finishes eating the bucket.') });
        return;
      }
      if (id === 'captain' && item === 'hat' && !f.hatGiven) {
        removeItem('hat');
        updateFlags({ hatGiven: true });
        playDialogue([
          { speaker: 'Captain Nib', text: 'A captain once more.' },
          { speaker: 'Mara', text: 'You were a captain without it.' },
          { speaker: 'Captain Nib', text: 'Technically. Not emotionally.' }
        ], { onDone: () => f.hornGiven ? departureCutscene() : showThought('Hat returned. He still needs a working foghorn.') });
        return;
      }
      if (id === 'captain' && item === 'foghorn' && !f.hornGiven) {
        if (!f.hornTested) {
          playDialogue([{ speaker: 'Captain Nib', text: 'Regulations require experimental foghorns to be tested at a safe distance from my moustache.' }]);
        } else {
          removeItem('foghorn');
          updateFlags({ hornGiven: true });
          playDialogue([{ speaker: 'Captain Nib', text: 'It meets every regulation I have not personally read.' }], {
            onDone: () => f.hatGiven ? departureCutscene() : showThought('The foghorn is ready. He still refuses to sail bareheaded.')
          });
        }
        return;
      }
      if ((id === 'boat' || id === 'lighthouse') && item === 'foghorn') {
        testFoghorn();
        return;
      }
      playDialogue([{ speaker: 'Mara', text: WRONG_COMBINATIONS[Math.floor(Math.random() * WRONG_COMBINATIONS.length)] }]);
      return;
    }

    if (id === 'captain') {
      if (activeVerb === 'talk') captainConversation();
      else playDialogue([{ speaker: 'Mara', text: 'Captain Barnaby Nib: half mariner, half uniform, all moustache.' }]);
      return;
    }
    if (id === 'brine') {
      if (activeVerb === 'talk') brineConversation();
      else playDialogue([{ speaker: 'Mara', text: 'Madame Brine reads the future in the expressions of dead fish. The mackerel looks concerned.' }]);
      return;
    }
    if (id === 'fish') {
      playDialogue([{ speaker: f.postcardShown ? 'Mara' : 'Madame Brine', text: f.postcardShown ? 'The remaining sardines are organizing. Best not to interfere.' : 'Those are retail fish. You currently have wholesale credibility.' }]);
      return;
    }
    if (id === 'bird') {
      sounds.gull();
      playDialogue([{ speaker: 'Mara', text: f.birdLured ? 'The mechanical gull is reconsidering its life inside a bucket.' : 'A clockwork gull wearing Captain Nib’s hat. It watches shiny things with industrial greed.' }], {
        onDone: () => !f.birdLured && showThought('It seems interested in food and shiny objects. Madame Brine mentioned sardines.')
      });
      return;
    }
    if (id === 'bucket') {
      playDialogue([{ speaker: 'Mara', text: f.birdLured ? 'Metallic pecking. Occasional profanity. The bucket is winning.' : 'Empty, dented, and conveniently below the gull.' }]);
      return;
    }
    if (id === 'hat') {
      if (f.birdLured && !f.hatTaken && (activeVerb === 'pickup' || activeVerb === 'use')) {
        updateFlags({ hatTaken: true });
        grantItems([{ id: 'hat', type: 'YOU PICKED UP' }], () => showThought('The hat feels suspiciously lumpy. I should examine it in the inventory.'));
      } else playDialogue([{ speaker: 'Mara', text: 'It is within picking-up distance, which is the adventure-game equivalent of destiny.' }]);
      return;
    }
    if (id === 'pump') {
      if (!f.funnelTaken && (activeVerb === 'pickup' || activeVerb === 'use')) {
        updateFlags({ funnelTaken: true });
        grantItems([{ id: 'funnel', type: 'YOU PICKED UP' }], () => playDialogue([{ speaker: 'Captain Nib', text: 'Take the funnel. The pump has not worked since the regrettable soup incident.' }]));
      } else playDialogue([{ speaker: 'Mara', text: 'A broken bilge pump. It smells faintly of chowder and litigation.' }]);
      return;
    }
    if (id === 'boat') {
      if (has('foghorn') && activeVerb === 'use') testFoghorn();
      else playDialogue([{ speaker: 'Mara', text: 'The Misty Minnow appears to be held together by paint, rope, and positive language.' }]);
      return;
    }
    if (id === 'lighthouse') {
      playDialogue([{ speaker: 'Mara', text: 'The abandoned lighthouse. It seems less abandoned from this angle.' }, { speaker: 'Gus', text: 'Perhaps abandonment is a spectrum.' }]);
      return;
    }
    if (id === 'tavern') {
      playDialogue([{ speaker: 'Mara', text: 'The Rusty Kettle. Closed due to weather inside.' }]);
    }
  };

  const interact = (hotspot) => {
    sounds.click();
    const item = selectedItem;
    const activeVerb = item ? 'use' : verb;
    setSelectedItem(null);
    walkTo(hotspot.walkX ?? 50, () => {
      if (game.scene === 'office') resolveOffice(hotspot.id, activeVerb, item);
      else resolveHarbor(hotspot.id, activeVerb, item);
    });
  };

  const stageClick = (event) => {
    if (dialogue || itemPopup || transitioning || game.scene === 'ending') return;
    if (event.target.closest('.hotspot, .actor, .animated-prop')) return;
    if (verb !== 'walk' || selectedItem) return;
    const viewportRect = viewportRef.current?.getBoundingClientRect();
    const viewportWidth = viewportRef.current?.clientWidth || event.currentTarget.clientWidth;
    const viewportLeft = viewportRect?.left || 0;
    const worldWidth = viewportWidth * scene.worldScale;
    const x = ((event.clientX - viewportLeft + cameraPx) / worldWidth) * 100;
    walkTo(Math.max(8, Math.min(92, x)));
  };

  const resetGame = () => {
    if (!window.confirm('Restart the POC and erase this local save?')) return;
    localStorage.removeItem(SAVE_KEY);
    introStarted.current = false;
    harborStarted.current = false;
    setGame(START_STATE);
    setVerb('walk');
    setSelectedItem(null);
    setDialogue(null);
    setItemPopup(null);
    setThought('');
    setFogBurst(false);
  };

  const hint = () => {
    const f = game.flags;
    let text = '';
    if (game.scene === 'office') {
      if (!f.pindleTalked) text = 'Talk to Mr. Pindle. He knows what the terminal is waiting for.';
      else if (!f.posterSeen) text = 'Read the emergency procedure poster.';
      else if (!f.rulersTaken) text = 'Pick up the matched rulers on the lost-property shelf.';
      else if (!f.bandTaken) text = 'Use or examine the complaint form in your inventory.';
      else if (!f.tongsMade) text = 'With both rulers and the rubber band in inventory, combine any two of those components.';
      else if (!f.handleTaken) text = 'Use the improvised tongs on the fishbowl.';
      else if (!f.alarmRepaired) text = 'Use the brass handle on the fire alarm.';
      else if (!f.packageUnlocked) text = 'Use the repaired fire alarm.';
      else if (!f.packageOpened) text = 'Pick up or use the parcel in the pneumatic terminal.';
      else text = 'Use the city map and follow the moth’s route.';
    } else if (game.scene === 'harbor') {
      if (!f.captainTalked) text = 'Talk to Captain Nib.';
      else if (!f.postcardShown) text = 'Use the impossible postcard on Madame Brine.';
      else if (!f.birdLured) text = 'Use the sardine on the bucket beneath the gull.';
      else if (!f.hatTaken) text = 'Pick up the dropped captain’s hat.';
      else if (!f.duckCallFound) text = 'Look at or use the captain’s hat in your inventory.';
      else if (!f.funnelTaken) text = 'Pick up the brass funnel from the broken bilge pump.';
      else if (!f.foghornMade) text = 'Combine the glove, duck call, and funnel.';
      else if (!f.hornTested) text = 'Use the foghorn on the ferry.';
      else text = 'Give Captain Nib the hat and the tested foghorn.';
    } else text = 'The POC is complete. Tomorrow remains suspicious.';
    playDialogue([{ speaker: 'Hint Department', text }]);
  };

  useEffect(() => {
    if (game.scene === 'office' && !game.flags.introSeen && !introStarted.current) {
      introStarted.current = true;
      schedule(() => {
        playDialogue([
          { speaker: 'Mara', text: 'Received. Misplaced. Filed under “Eventually.”' },
          { speaker: 'Mr. Pindle', text: 'Try to look less efficient, Miss Quibble. It alarms the public.' },
          { speaker: 'SYSTEM', text: 'THUNK. DELIVERY REJECTED: ARRIVED BEFORE SCHEDULED DATE.' },
          { speaker: 'Mara', text: 'That’s new.' },
          { speaker: 'Mr. Pindle', text: 'It isn’t. We had a letter from next Wednesday in March.' },
          { speaker: 'Mara', text: 'And what happened?' },
          { speaker: 'Mr. Pindle', text: 'We filed it in April.' },
          { speaker: 'Mara', text: 'The parcel is addressed to me.' },
          { speaker: 'Mr. Pindle', text: 'My condolences.' }
        ], {
          cinematic: true,
          onDone: () => {
            updateFlags({ introSeen: true });
            showThought('The parcel is mine, but the terminal refuses to release it. Mr. Pindle may know why.');
          }
        });
      }, 500);
    }
  }, [game.scene, game.flags.introSeen]);

  useEffect(() => {
    if (game.scene === 'harbor' && !game.flags.harborIntroSeen && !harborStarted.current) {
      harborStarted.current = true;
      schedule(() => {
        playDialogue([
          { speaker: 'Captain Nib', text: 'A captain without his ceremonial hat is merely a man standing near water.' },
          { speaker: 'Madame Brine', text: 'You were mostly that with the hat.' },
          { speaker: 'Captain Nib', text: 'The hat represents maritime authority.' },
          { speaker: 'Madame Brine', text: 'The gull is wearing it better.' },
          { speaker: 'Mara', text: 'I’m looking for passage to the lighthouse.' },
          { speaker: 'Captain Nib', text: 'No.' },
          { speaker: 'Mara', text: 'That was quick.' },
          { speaker: 'Captain Nib', text: 'Experience.' }
        ], {
          cinematic: true,
          onDone: () => {
            updateFlags({ harborIntroSeen: true });
            showThought('Captain Nib owns the only boat. Unfortunately, I need Captain Nib.');
          }
        });
      }, 500);
    }
  }, [game.scene, game.flags.harborIntroSeen]);

  if (game.scene === 'ending') {
    return (
      <main className="game-shell ending-shell">
        <div className="ending-fog" />
        <section className="ending-card">
          <p className="eyebrow">End of proof of concept</p>
          <h1>Mara Quibble<br /><span>and the Missing Minute</span></h1>
          <p>The ferry enters the fog. For one second it is sinking, flying, operating as a restaurant, and captained by the gull.</p>
          <blockquote>“Did we just explode?” — Captain Nib<br />“Not in this version.” — Mara</blockquote>
          <button className="primary-button" onClick={resetGame}>Play again</button>
        </section>
      </main>
    );
  }

  const visibleHotspots = scene.hotspots.filter((h) => !h.conditional || game.flags[h.conditional]);
  const currentLine = dialogue?.lines[dialogue.index];
  const currentPopup = itemPopup?.queue[itemPopup.index];

  return (
    <main className={`game-shell ${alarmFlash ? 'alarm-flash' : ''} ${dialogue?.cinematic ? 'cinematic' : ''}`} onPointerDown={ensureAudio}>
      <header className="topbar">
        <div>
          <p className="eyebrow">A hand-painted point-and-click adventure</p>
          <h1>Mara Quibble <span>and the Missing Minute</span></h1>
        </div>
        <div className="top-actions">
          <button onClick={hint} aria-label="Show hint">?</button>
          <button onClick={() => setGame((g) => ({ ...g, mute: !g.mute }))} aria-label={game.mute ? 'Enable sound' : 'Mute sound'}>{game.mute ? '🔇' : '🔊'}</button>
          <button onClick={resetGame} aria-label="Restart">↻</button>
        </div>
      </header>

      <section className="objective-bar"><span>Current objective</span><strong>{objective}</strong></section>

      <section className={`scene-viewport ${game.scene} ${fogBurst ? 'fog-burst' : ''}`} ref={viewportRef}>
        <div
          className="scene-world"
          style={{
            width: `${scene.worldScale * 100}%`,
            transform: `translate3d(-${cameraPx}px,0,0)`,
            transitionDuration: moving ? '700ms' : '450ms'
          }}
          onClick={stageClick}
          role="application"
          aria-label={scene.name}
        >
          <img className="scene-bg" src={`${BASE}assets/${scene.background}`} alt="" aria-hidden="true" />
          {scene.backFix && <img className="scene-back-fix" src={`${BASE}assets/${scene.backFix}`} alt="" aria-hidden="true" />}

          {game.scene === 'office' && (
            <>
              <div className={`clock-hand ${clockSpin ? 'spinning' : ''}`} />
              <div className={`package-prop ${game.flags.packageUnlocked ? 'unlocked' : ''} ${game.flags.packageOpened ? 'gone' : ''}`}>?</div>
            </>
          )}

          {game.scene === 'harbor' && (
            <>
              <img className={`animated-prop boat-layer ${fogBurst ? 'startled' : ''}`} src={`${BASE}assets/boat-rock-layer.png`} alt="The Misty Minnow" />
              <img className={`animated-prop gull-layer ${game.flags.birdLured ? 'lured' : ''}`} src={`${BASE}assets/gull-clean.png`} alt="Mechanical gull" />
              <div className="water-ripple ripple-one" /><div className="water-ripple ripple-two" />
            </>
          )}

          <img
            className={`actor mara ${moving ? 'walking' : ''} facing-${facing}`}
            src={`${BASE}assets/mara-clean.png`}
            alt="Mara Quibble"
            style={{ left: `${game.maraX[game.scene]}%` }}
          />

          {visibleHotspots.map((hotspot) => (
            <button
              key={hotspot.id}
              className="hotspot"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.w}%`, height: `${hotspot.h}%` }}
              onMouseEnter={() => setHoverText(`${selectedItem ? `Use ${ITEM_DEFS[selectedItem].name} with` : VERBS.find(([id]) => id === verb)?.[1]} ${hotspot.label}`)}
              onMouseLeave={() => setHoverText(objective)}
              onFocus={() => setHoverText(hotspot.label)}
              onClick={(event) => { event.stopPropagation(); interact(hotspot); }}
              aria-label={hotspot.label}
            ><span>{hotspot.label}</span></button>
          ))}

          <img className="scene-front" src={`${BASE}assets/${scene.front}`} alt="" aria-hidden="true" />
          <div className="rain-layer" aria-hidden="true" />
          {fogBurst && <div className="fog-curtain" />}
        </div>

        <div className="scene-caption" aria-live="polite">{hoverText}</div>
        {thought && <div className="thought-bubble" aria-live="polite"><strong>Mara thinks</strong>{thought}</div>}
      </section>

      <section className="control-deck">
        <div className="verbs-panel" aria-label="Actions">
          {VERBS.map(([id, label]) => (
            <button
              key={id}
              className={`verb-button ${verb === id && !selectedItem ? 'active' : ''}`}
              onClick={() => { sounds.click(); setVerb(id); setSelectedItem(null); setHoverText(`${label}…`); }}
              aria-label={label}
            >
              <img src={`${BASE}assets/verb-${id}.svg`} alt={label} />
            </button>
          ))}
        </div>

        <div className="inventory-panel">
          <div className="inventory-heading">
            <span>Inventory</span>
            <small>{selectedItem ? `Selected: ${ITEM_DEFS[selectedItem].name}` : 'Select an object, then another object or scene hotspot'}</small>
          </div>
          <div className="inventory-grid">
            {game.inventory.map((id) => (
              <button
                key={id}
                className={`inventory-item ${selectedItem === id ? 'selected' : ''}`}
                onClick={() => onInventoryClick(id)}
                onMouseEnter={() => setHoverText(ITEM_DEFS[id].name)}
                onMouseLeave={() => setHoverText(objective)}
                title={ITEM_DEFS[id].description}
              >
                <span className="inventory-art"><img src={`${BASE}assets/item-${ITEM_DEFS[id].icon}.svg`} alt="" /></span>
                <span className="inventory-name">{ITEM_DEFS[id].name}</span>
              </button>
            ))}
            {Array.from({ length: Math.max(0, 8 - game.inventory.length) }).map((_, index) => <div className="inventory-empty" key={`empty-${index}`} />)}
          </div>
        </div>
      </section>

      <footer className="footer-note">Autosaves locally · Wide rooms scroll with Mara · Background, actor, occlusion and atmosphere are separate layers</footer>

      {dialogue && currentLine && (
        <div className="dialogue-backdrop" onClick={!dialogue.choices ? advanceDialogue : undefined}>
          <section className="dialogue-box" role="dialog" aria-live="assertive" onClick={(e) => e.stopPropagation()}>
            <div className="portrait-frame">
              {PORTRAITS[currentLine.speaker]
                ? <img src={`${BASE}assets/${PORTRAITS[currentLine.speaker]}`} alt="" />
                : <span>{currentLine.speaker.slice(0, 1)}</span>}
            </div>
            <div className="dialogue-content">
              <strong>{currentLine.speaker}</strong>
              <p>{currentLine.text}</p>
              {dialogue.index === dialogue.lines.length - 1 && dialogue.choices ? (
                <div className="dialogue-choices">
                  {dialogue.choices.map((choice) => <button key={choice.label} onClick={() => chooseDialogue(choice)}>{choice.label}</button>)}
                </div>
              ) : <button className="continue-button" onClick={advanceDialogue}>{dialogue.index === dialogue.lines.length - 1 ? 'Continue' : 'Next'}</button>}
            </div>
          </section>
        </div>
      )}

      {itemPopup && currentPopup && (
        <div className="item-popup-backdrop" onClick={closeItemPopup}>
          <section className="item-popup" role="dialog" aria-live="assertive" onClick={(e) => e.stopPropagation()}>
            <p>{currentPopup.type}</p>
            <img src={`${BASE}assets/item-${ITEM_DEFS[currentPopup.id].icon}.svg`} alt={ITEM_DEFS[currentPopup.id].name} />
            <h2>{ITEM_DEFS[currentPopup.id].name}</h2>
            <blockquote>{ITEM_DEFS[currentPopup.id].description}</blockquote>
            <button className="primary-button" onClick={closeItemPopup}>Put it away</button>
          </section>
        </div>
      )}

      {transitioning && <div className="scene-transition"><span>Eventually…</span></div>}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
