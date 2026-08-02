import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { combineInventory, INITIAL_FLAGS, ITEM_DEFS, START_STATE } from './gameLogic';
import './styles.css';

const BASE = import.meta.env.BASE_URL;
const SAVE_KEY = 'mara-quibble-poc-v1';

const VERBS = [
  ['walk', 'Walk', '👣'],
  ['look', 'Look at', '🔎'],
  ['use', 'Use', '✋'],
  ['talk', 'Talk to', '💬'],
  ['pickup', 'Pick up', '↥'],
  ['give', 'Give', '🎁']
];

const OFFICE_HOTSPOTS = [
  { id: 'pindle', label: 'Mr. Pindle', x: 20, y: 43, w: 20, h: 30, walkX: 31 },
  { id: 'terminal', label: 'pneumatic delivery terminal', x: 24, y: 69, w: 15, h: 20, walkX: 34 },
  { id: 'poster', label: 'emergency procedure poster', x: 35, y: 20, w: 9, h: 25, walkX: 40 },
  { id: 'clock', label: 'municipal clock', x: 50, y: 2, w: 14, h: 24, walkX: 55 },
  { id: 'door', label: 'staff doorway', x: 50, y: 27, w: 13, h: 50, walkX: 55 },
  { id: 'fishbowl', label: 'evidence fishbowl', x: 66, y: 43, w: 14, h: 32, walkX: 68 },
  { id: 'alarm', label: 'emergency alarm base', x: 67, y: 68, w: 12, h: 16, walkX: 69 },
  { id: 'shelf', label: 'lost-property shelf', x: 79, y: 34, w: 21, h: 48, walkX: 80 },
  { id: 'complaintDesk', label: 'complaint forms', x: 2, y: 67, w: 20, h: 25, walkX: 24 },
  { id: 'map', label: 'city map', x: 72, y: 2, w: 22, h: 36, walkX: 72 }
];

const HARBOR_HOTSPOTS = [
  { id: 'brine', label: 'Madame Brine', x: 78, y: 36, w: 22, h: 42, walkX: 76 },
  { id: 'captain', label: 'Captain Nib', x: 55, y: 33, w: 18, h: 50, walkX: 55 },
  { id: 'bird', label: 'mechanical gull', x: 25, y: 2, w: 16, h: 27, walkX: 34 },
  { id: 'bucket', label: 'empty fish bucket', x: 24, y: 68, w: 14, h: 20, walkX: 36 },
  { id: 'fish', label: 'Madame Brine’s sardines', x: 78, y: 62, w: 18, h: 22, walkX: 75 },
  { id: 'pump', label: 'broken bilge pump', x: 48, y: 63, w: 11, h: 22, walkX: 49 },
  { id: 'boat', label: 'the ferry', x: 38, y: 23, w: 35, h: 52, walkX: 50 },
  { id: 'lighthouse', label: 'distant lighthouse', x: 36, y: 10, w: 10, h: 25, walkX: 45 },
  { id: 'hat', label: 'ceremonial captain’s hat', x: 31, y: 70, w: 10, h: 12, walkX: 36, conditional: 'birdLured' }
];

const WRONG_COMBINATIONS = [
  'That would create paperwork, not progress.',
  'Mara briefly considers it. Civilization survives.',
  'The objects maintain a professional distance.',
  'Even the peppermint thinks that is a bad idea.',
  'Gus says nothing, which is somehow judgmental.',
  'There is improvisation, and then there is evidence.'
];

function readSaved() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!parsed || !parsed.flags || !parsed.inventory) return START_STATE;
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
  const [game, setGame] = useState(readSaved);
  const [verb, setVerb] = useState('walk');
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoverText, setHoverText] = useState('Walk to somewhere needlessly official');
  const [dialogue, setDialogue] = useState(null);
  const [moving, setMoving] = useState(false);
  const [clockSpin, setClockSpin] = useState(false);
  const [alarmFlash, setAlarmFlash] = useState(false);
  const [fogBurst, setFogBurst] = useState(false);
  const [toast, setToast] = useState('');
  const audioRef = useRef(null);
  const timerRef = useRef([]);

  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(game));
  }, [game]);

  useEffect(() => () => timerRef.current.forEach(clearTimeout), []);

  const schedule = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timerRef.current.push(id);
    return id;
  };

  const updateFlags = (patch) => setGame((g) => ({ ...g, flags: { ...g.flags, ...patch } }));
  const setInventory = (updater) => setGame((g) => ({ ...g, inventory: typeof updater === 'function' ? updater(g.inventory) : updater }));
  const has = (id) => game.inventory.includes(id);
  const addItem = (id) => setInventory((inv) => (inv.includes(id) ? inv : [...inv, id]));
  const removeItem = (id) => setInventory((inv) => inv.filter((item) => item !== id));

  const showToast = (message) => {
    setToast(message);
    schedule(() => setToast(''), 1900);
  };

  const say = (speaker, text, options = {}) => {
    setDialogue({ speaker, text, choices: options.choices || null, onClose: options.onClose || null });
  };

  const closeDialogue = () => {
    const fn = dialogue?.onClose;
    setDialogue(null);
    if (fn) schedule(fn, 80);
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
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const start = ctx.currentTime + startOffset;
    osc.frequency.setValueAtTime(frequency, start);
    osc.type = type;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.03);
  };

  const sounds = {
    click: () => tone(220, 0.06, 'square', 0.025),
    item: () => { tone(430, 0.12, 'triangle', 0.05); tone(650, 0.16, 'triangle', 0.04, 0.08); },
    alarm: () => { for (let i = 0; i < 6; i += 1) tone(i % 2 ? 380 : 520, 0.16, 'square', 0.045, i * 0.17); },
    gull: () => { tone(920, 0.09, 'sawtooth', 0.04); tone(700, 0.12, 'sawtooth', 0.035, 0.1); },
    bell: () => { tone(145, 1.7, 'sine', 0.08); tone(290, 1.1, 'sine', 0.035); },
    foghorn: () => { tone(83, 1.7, 'sawtooth', 0.1); tone(124, 1.5, 'sine', 0.075); }
  };

  const walkTo = (x, action) => {
    if (moving || dialogue) return;
    const old = game.maraX[game.scene] ?? 50;
    const duration = Math.min(1100, Math.max(320, Math.abs(old - x) * 15));
    setMoving(true);
    setGame((g) => ({ ...g, maraX: { ...g.maraX, [g.scene]: x } }));
    schedule(() => {
      setMoving(false);
      if (action) action();
    }, duration);
  };

  const objective = useMemo(() => {
    const f = game.flags;
    if (game.scene === 'ending') return 'Tomorrow has been delayed until further notice.';
    if (game.scene === 'office') {
      if (!f.terminalSeen) return 'Investigate the impossible delivery.';
      if (!f.packageUnlocked) return 'Make tomorrow officially happen.';
      if (!f.packageOpened) return 'Retrieve the parcel from the terminal.';
      return 'Follow the mechanical moth’s route to Gannet’s End Harbor.';
    }
    if (!f.captainTalked) return 'Find passage to the lighthouse.';
    if (!f.hatGiven || !f.hornGiven) return 'Restore Captain Nib’s hat and foghorn.';
    return 'Try not to explode in this version.';
  }, [game.scene, game.flags]);

  const inspectInventory = (id) => {
    if (id === 'complaint' && !game.flags.bandTaken) {
      say('Mara', `${ITEM_DEFS[id].description} Mara removes the rubber band before it can file an appeal.`, {
        onClose: () => {
          addItem('rubber-band');
          updateFlags({ bandTaken: true });
          sounds.item();
          showToast('Rubber band added');
        }
      });
      return;
    }
    if (id === 'hat' && !game.flags.duckCallFound) {
      say('Mara', 'The hat is suspiciously lumpy. Inside the brim is a brass duck call labelled “EMERGENCY NAVAL COMMUNICATION.”', {
        onClose: () => {
          addItem('duck-call');
          updateFlags({ duckCallFound: true });
          sounds.item();
          showToast('Duck call discovered');
        }
      });
      return;
    }
    if (id === 'gus') {
      say('Gus', 'Yesterday was ideal umbrella weather. Today is behaving irresponsibly.');
      return;
    }
    say('Mara', ITEM_DEFS[id].description);
  };

  const combineItems = (a, b) => {
    const result = combineInventory(game.inventory, a, b);
    if (!result) {
      say('Mara', WRONG_COMBINATIONS[Math.floor(Math.random() * WRONG_COMBINATIONS.length)]);
      return;
    }
    setGame((g) => ({
      ...g,
      inventory: result.inventory,
      flags: {
        ...g.flags,
        ...(result.result === 'tongs' ? { tongsMade: true } : { foghornMade: true })
      }
    }));
    setSelectedItem(null);
    sounds.item();
    if (result.result === 'tongs') {
      say('Mara', 'Two rulers and a rubber band. The Department would call these “Improvised Evidence Tongs” and charge another division sixty dollars.');
    } else {
      say('Mara', 'Glove, duck call, funnel. It is either a foghorn or the final stage of a very confused goose.');
    }
  };

  const onInventoryClick = (id) => {
    sounds.click();
    if (verb === 'look') {
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

  const triggerFireDrill = () => {
    sounds.alarm();
    setAlarmFlash(true);
    setClockSpin(true);
    say('SYSTEM', 'OFFICIAL FIRE DRILL. Please evacuate in alphabetical order by emotional readiness.', {
      onClose: () => {
        schedule(() => {
          setAlarmFlash(false);
          setClockSpin(false);
          updateFlags({ packageUnlocked: true });
          sounds.item();
          say('Mr. Pindle', 'I am evacuating emotionally. Please do not wait for me.');
        }, 800);
      }
    });
  };

  const openPackage = () => {
    updateFlags({ packageOpened: true });
    addItem('postcard'); addItem('watch'); addItem('gus');
    sounds.item();
    say('Mara', 'Inside: a cracked watch, a lighthouse postcard, and a note in my handwriting: “Do not let the lighthouse ring. Do not trust the man with the perfect timetable. Bring an umbrella.”', {
      onClose: () => {
        sounds.bell();
        say('Gus', 'I warned them about this yesterday.');
      }
    });
  };

  const resolveOffice = (id, activeVerb, item) => {
    const f = game.flags;
    if (item) {
      if (id === 'fishbowl' && item === 'tongs' && !f.handleTaken) {
        removeItem('tongs'); addItem('handle'); updateFlags({ handleTaken: true }); sounds.item();
        say('Mara', 'Evidence retrieved without contaminating the evidence water. Mr. Ledger the fish remains unconvinced.');
        return;
      }
      if (id === 'alarm' && item === 'handle' && !f.alarmRepaired) {
        removeItem('handle'); updateFlags({ alarmRepaired: true }); sounds.item();
        say('Mara', 'The handle fits. A triumph for standardized brass and reckless initiative.');
        return;
      }
      if (id === 'terminal' && item === 'id-card') {
        say('TERMINAL', 'EMPLOYEE RECOGNIZED. CAREER PROSPECTS NOT FOUND.');
        return;
      }
      say('Mara', WRONG_COMBINATIONS[Math.floor(Math.random() * WRONG_COMBINATIONS.length)]);
      return;
    }

    if (id === 'terminal') {
      updateFlags({ terminalSeen: true });
      if (f.packageUnlocked) {
        if (activeVerb === 'pickup' || activeVerb === 'use') openPackage();
        else say('Mara', 'The terminal has finally accepted tomorrow. The parcel hatch is open.');
      } else {
        say('TERMINAL', 'DELIVERY REJECTED: ITEM ARRIVED BEFORE BEING SENT. PLEASE TRY AGAIN TOMORROW.');
      }
      return;
    }
    if (id === 'poster') {
      updateFlags({ posterSeen: true });
      say('Mara', '“During a fire drill, advance the official date by one day to ensure tomorrow remains fully staffed.” That explains why we’re so well prepared for yesterday.');
      return;
    }
    if (id === 'fishbowl') {
      updateFlags({ handleSeen: true });
      say('Mara', f.handleTaken ? 'Mr. Ledger guards an empty ceramic castle and several classified bubbles.' : 'The missing brass alarm handle is at the bottom. Touching evidence water without approved tongs is a disciplinary offence.');
      return;
    }
    if (id === 'alarm') {
      updateFlags({ alarmSeen: true });
      if (!f.alarmRepaired) say('Mara', 'The alarm is missing its pull handle. The Department has achieved fire safety through optimism.');
      else if (!f.packageUnlocked && activeVerb === 'use') triggerFireDrill();
      else if (f.packageUnlocked) say('Mara', 'One official fire drill is enough excitement for a fiscal quarter.');
      else say('Mara', 'It is repaired. Pulling it would begin an official fire drill.');
      return;
    }
    if (id === 'shelf') {
      if ((activeVerb === 'pickup' || activeVerb === 'use') && !f.rulersTaken) {
        addItem('short-ruler'); addItem('long-ruler'); updateFlags({ rulersTaken: true }); sounds.item();
        say('Mara', 'A matched pair of rulers. Different lengths, identical lack of ambition.');
      } else say('Mara', 'Lost hats, lost keys, one bowling pin, and an umbrella pretending not to listen.');
      return;
    }
    if (id === 'complaintDesk') {
      if (!f.bandTaken) inspectInventory('complaint');
      else say('Mara', 'The forms are now loosely organized. Anarchy has begun.');
      return;
    }
    if (id === 'pindle') {
      say('Mr. Pindle', activeVerb === 'talk' ? 'I’m in a meeting with the possibility of leaving on time.' : 'The frosted glass preserves both privacy and plausible employment.');
      return;
    }
    if (id === 'clock') {
      say('Mara', f.packageUnlocked ? 'The official clock now insists it is tomorrow. It looks smug about it.' : 'The municipal clock controls the Department’s official date. Naturally, it is seven minutes slow and one administration behind.');
      return;
    }
    if (id === 'map') {
      if (f.packageOpened) {
        say('Mara', 'The mechanical moth burned a route from here to Gannet’s End Harbor.', {
          choices: [
            { label: 'Follow the route to the harbor', action: () => setGame((g) => ({ ...g, scene: 'harbor', maraX: { ...g.maraX, harbor: 45 } })) },
            { label: 'Remain safely underqualified', action: () => say('Gus', 'A bold commitment to indoor weather.') }
          ]
        });
      } else say('Mara', 'A map of Timberbottom. Half the streets are named “Temporary Access Road.”');
      return;
    }
    if (id === 'door') {
      say('Mara', f.packageOpened ? 'The moth route leads to the map, not through Mr. Pindle’s office. A rare mercy.' : 'Staff only. Probably.');
    }
  };

  const testFoghorn = () => {
    sounds.foghorn();
    setFogBurst(true);
    updateFlags({ hornTested: true });
    schedule(() => setFogBurst(false), 2400);
    say('Mara', 'The foghorn produces a note so deep that the harbor briefly remembers being a valley.', {
      onClose: () => say('Gus', 'Yesterday’s forecast did mention humiliation.')
    });
  };

  const depart = () => {
    updateFlags({ departed: true });
    sounds.bell();
    schedule(() => setGame((g) => ({ ...g, scene: 'ending' })), 500);
  };

  const resolveHarbor = (id, activeVerb, item) => {
    const f = game.flags;
    if (item) {
      if (id === 'brine' && item === 'postcard' && !f.postcardShown) {
        updateFlags({ postcardShown: true }); addItem('glove'); sounds.item();
        say('Madame Brine', 'The swordfish sign falls in this picture—', {
          onClose: () => say('Mara', 'Duck.', {
            onClose: () => say('Madame Brine', 'An unlicensed prophet! Take this emergency rubber glove. Every oracle needs one.')
          })
        });
        return;
      }
      if (id === 'bucket' && item === 'sardine' && !f.birdLured) {
        removeItem('sardine'); updateFlags({ birdLured: true }); sounds.gull();
        say('Mara', 'The gull dives into the bucket with the precision of a tax audit and the dignity of neither. The captain’s hat drops onto the dock.');
        return;
      }
      if (id === 'captain' && item === 'hat' && !f.hatGiven) {
        removeItem('hat'); updateFlags({ hatGiven: true }); sounds.item();
        say('Captain Nib', 'My authority has returned! It was becoming difficult to distinguish me from a heavily decorated pedestrian.');
        if (f.hornGiven) schedule(depart, 700);
        return;
      }
      if (id === 'captain' && item === 'foghorn' && !f.hornGiven) {
        if (!f.hornTested) {
          say('Captain Nib', 'Regulations require that all experimental foghorns be tested at a safe distance from my moustache.');
        } else {
          removeItem('foghorn'); updateFlags({ hornGiven: true }); sounds.item();
          say('Captain Nib', 'It meets every regulation I have not personally read. We sail!', { onClose: f.hatGiven ? depart : null });
        }
        return;
      }
      if ((id === 'boat' || id === 'lighthouse') && item === 'foghorn') {
        testFoghorn();
        return;
      }
      say('Mara', WRONG_COMBINATIONS[Math.floor(Math.random() * WRONG_COMBINATIONS.length)]);
      return;
    }

    if (id === 'captain') {
      updateFlags({ captainTalked: true });
      if (activeVerb === 'talk') {
        say('Captain Nib', 'I cannot sail without my ceremonial hat and a regulation foghorn. Also the fog is professionally malicious.', {
          choices: [
            { label: 'What happened to the hat?', action: () => say('Captain Nib', 'That mechanical gull stole it. Professional jealousy.') },
            { label: 'How experienced are you?', action: () => say('Captain Nib', 'I have crossed this harbor eleven thousand times. Experience is distance multiplied by repetition.') },
            { label: 'Why is the lighthouse abandoned?', action: () => say('Captain Nib', 'Because asking who rings its bell became expensive.') }
          ]
        });
      } else say('Mara', 'Captain Barnaby Nib: half mariner, half uniform, all moustache.');
      return;
    }
    if (id === 'brine') {
      if (activeVerb === 'talk') say('Madame Brine', f.postcardShown ? 'Take a sardine. Prophecy is exhausting and fish are deductible.' : 'I predict rain, fog, and a customer showing me something interesting. In that order.');
      else say('Mara', 'Madame Brine reads the future in the expressions of dead fish. The mackerel looks concerned.');
      return;
    }
    if (id === 'fish') {
      if (f.postcardShown && !f.sardineTaken && (activeVerb === 'pickup' || activeVerb === 'use')) {
        addItem('sardine'); updateFlags({ sardineTaken: true }); sounds.item();
        say('Madame Brine', 'One sardine. Use it responsibly, or at least far from me.');
      } else if (!f.postcardShown) say('Madame Brine', 'Those are retail fish. You currently have wholesale credibility.');
      else say('Mara', 'The remaining sardines are organizing. Best not to interfere.');
      return;
    }
    if (id === 'bird') {
      sounds.gull();
      say('Mara', f.birdLured ? 'The mechanical gull is reconsidering its life inside a bucket.' : 'A clockwork gull wearing Captain Nib’s hat. It watches shiny things with industrial greed.');
      return;
    }
    if (id === 'bucket') {
      say('Mara', f.birdLured ? 'Metallic pecking. Occasional profanity. The bucket is winning.' : 'Empty, dented, and conveniently below the gull.');
      return;
    }
    if (id === 'hat') {
      if (f.birdLured && !f.hatTaken && (activeVerb === 'pickup' || activeVerb === 'use')) {
        addItem('hat'); updateFlags({ hatTaken: true }); sounds.item();
        say('Mara', 'One ceremonial captain’s hat, lightly gull-adjacent.');
      } else say('Mara', 'It is within picking-up distance, which is the adventure-game equivalent of destiny.');
      return;
    }
    if (id === 'pump') {
      if (!f.funnelTaken && (activeVerb === 'pickup' || activeVerb === 'use')) {
        addItem('funnel'); updateFlags({ funnelTaken: true }); sounds.item();
        say('Captain Nib', 'Take the funnel. The pump has not worked since the regrettable soup incident.');
      } else say('Mara', 'A broken bilge pump. It smells faintly of chowder and litigation.');
      return;
    }
    if (id === 'boat') {
      if (has('foghorn') && activeVerb === 'use') testFoghorn();
      else say('Mara', 'The ferry is called The Misty Minnow. Its lifeboat is called Optimism.');
      return;
    }
    if (id === 'lighthouse') {
      say('Mara', 'The lighthouse is abandoned, fogbound, and currently staring back. Three excellent reasons to visit.');
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

  const onStageClick = (event) => {
    if (dialogue || game.scene === 'ending') return;
    if (event.target.closest('.hotspot, .actor, .prop-layer')) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    if (verb === 'walk' && !selectedItem) walkTo(Math.max(18, Math.min(82, x)));
  };

  const chooseDialogue = (choice) => {
    setDialogue(null);
    schedule(choice.action, 80);
  };

  const resetGame = () => {
    if (!window.confirm('Restart the POC and erase this local save?')) return;
    localStorage.removeItem(SAVE_KEY);
    setGame(START_STATE);
    setVerb('walk'); setSelectedItem(null); setDialogue(null); setFogBurst(false);
  };

  const hint = () => {
    const f = game.flags;
    let text = '';
    if (game.scene === 'office') {
      if (!f.posterSeen) text = 'The emergency poster contains one useful sentence hiding among fourteen useless ones.';
      else if (!f.rulersTaken) text = 'The lost-property shelf contains a matched pair that should not remain matched.';
      else if (!f.bandTaken) text = 'Examine the complaint form in your inventory.';
      else if (!f.tongsMade) text = 'Combine either ruler with another ruler while the rubber band is in your inventory.';
      else if (!f.handleTaken) text = 'Use the improvised tongs on the fishbowl.';
      else if (!f.alarmRepaired) text = 'Use the brass handle on the emergency alarm base.';
      else if (!f.packageUnlocked) text = 'Use the repaired alarm.';
      else if (!f.packageOpened) text = 'Pick up the parcel from the terminal.';
      else text = 'Look at the city map and follow the moth’s route.';
    } else if (game.scene === 'harbor') {
      if (!f.captainTalked) text = 'Talk to Captain Nib before repairing his entire professional identity.';
      else if (!f.postcardShown) text = 'Use the impossible postcard on Madame Brine.';
      else if (!f.sardineTaken) text = 'Pick up a sardine from the fish stall.';
      else if (!f.birdLured) text = 'Use the sardine on the empty bucket below the gull.';
      else if (!f.hatTaken) text = 'Pick up the hat that dropped near the bucket.';
      else if (!f.duckCallFound) text = 'Look at the captain’s hat in your inventory.';
      else if (!f.funnelTaken) text = 'Take the brass funnel from the broken bilge pump.';
      else if (!f.foghornMade) text = 'Combine the glove, duck call, and funnel.';
      else if (!f.hornTested) text = 'Use the foghorn on the ferry.';
      else text = 'Give the hat and tested foghorn to Captain Nib.';
    } else text = 'The POC is complete. Tomorrow remains deeply suspicious.';
    say('Hint Department', text);
  };

  const hotspots = game.scene === 'office' ? OFFICE_HOTSPOTS : HARBOR_HOTSPOTS;
  const background = game.scene === 'office' ? `${BASE}assets/office-bg.jpg` : `${BASE}assets/harbor-bg.jpg`;
  const actor = game.scene === 'office' ? `${BASE}assets/mara-office.png` : `${BASE}assets/mara-harbor.png`;

  if (game.scene === 'ending') {
    return (
      <main className="game-shell ending-shell">
        <div className="ending-fog" />
        <section className="ending-card">
          <p className="eyebrow">End of proof of concept</p>
          <h1>Mara Quibble<br /><span>and the Missing Minute</span></h1>
          <p className="ending-copy">The ferry enters the fog. For one second it is sinking, flying, operating as a restaurant, and captained by the gull.</p>
          <blockquote>“Did we just explode?” — Captain Nib<br />“Not in this version.” — Mara</blockquote>
          <button className="primary-button" onClick={resetGame}>Play again</button>
        </section>
      </main>
    );
  }

  return (
    <main className={`game-shell ${alarmFlash ? 'alarm-flash' : ''}`} onPointerDown={ensureAudio}>
      <header className="topbar">
        <div>
          <p className="eyebrow">A point-and-click proof of concept</p>
          <h1>Mara Quibble <span>and the Missing Minute</span></h1>
        </div>
        <div className="top-actions">
          <button onClick={hint} aria-label="Show puzzle hint">?</button>
          <button onClick={() => setGame((g) => ({ ...g, mute: !g.mute }))} aria-label={game.mute ? 'Enable sound' : 'Mute sound'}>{game.mute ? '🔇' : '🔊'}</button>
          <button onClick={resetGame} aria-label="Restart game">↻</button>
        </div>
      </header>

      <section className="objective-bar"><strong>Current objective:</strong> {objective}</section>

      <section className={`scene-frame ${game.scene} ${fogBurst ? 'fog-burst' : ''}`}>
        <div
          className="scene-stage"
          onClick={onStageClick}
          style={{ backgroundImage: `url(${background})` }}
          role="application"
          aria-label={game.scene === 'office' ? 'Department of Lost Causes office' : 'Gannet’s End Harbor'}
        >
          <div className="ambient-light" />
          <div className="rain-layer" aria-hidden="true" />
          {game.scene === 'office' && (
            <>
              <div className={`clock-hand ${clockSpin ? 'spinning' : ''}`} aria-hidden="true" />
              <div className={`package-prop ${game.flags.packageUnlocked ? 'unlocked' : ''} ${game.flags.packageOpened ? 'gone' : ''}`} aria-hidden="true"><span>?</span></div>
            </>
          )}
          {game.scene === 'harbor' && (
            <>
              <img className={`prop-layer boat-layer ${fogBurst ? 'startled' : ''}`} src={`${BASE}assets/boat.png`} alt="" aria-hidden="true" />
              <img className={`prop-layer gull-layer ${game.flags.birdLured ? 'lured' : ''}`} src={`${BASE}assets/gull.png`} alt="" aria-hidden="true" />
              <div className="water-ripple one" /><div className="water-ripple two" />
            </>
          )}

          <img
            className={`actor mara ${moving ? 'walking' : ''}`}
            src={actor}
            alt="Mara Quibble"
            style={{ left: `${game.maraX[game.scene]}%` }}
          />

          {hotspots.filter((h) => !h.conditional || game.flags[h.conditional]).map((hotspot) => (
            <button
              key={hotspot.id}
              className="hotspot"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, width: `${hotspot.w}%`, height: `${hotspot.h}%` }}
              onMouseEnter={() => setHoverText(`${selectedItem ? `Use ${ITEM_DEFS[selectedItem].name} with` : VERBS.find(([id]) => id === verb)?.[1]} ${hotspot.label}`)}
              onMouseLeave={() => setHoverText(objective)}
              onFocus={() => setHoverText(hotspot.label)}
              onClick={(e) => { e.stopPropagation(); interact(hotspot); }}
              aria-label={`${hotspot.label}`}
            ><span>{hotspot.label}</span></button>
          ))}

          <div className="scene-caption" aria-live="polite">{hoverText}</div>
          {toast && <div className="toast">{toast}</div>}
          {fogBurst && <div className="fog-curtain" />}
        </div>
      </section>

      <section className="control-deck">
        <div className="verbs-panel" aria-label="Actions">
          {VERBS.map(([id, label, icon]) => (
            <button
              key={id}
              className={`verb-button ${verb === id && !selectedItem ? 'active' : ''}`}
              onClick={() => { sounds.click(); setVerb(id); setSelectedItem(null); setHoverText(`${label}…`); }}
            ><span>{icon}</span>{label}</button>
          ))}
        </div>

        <div className="inventory-panel">
          <div className="inventory-heading">
            <span>Inventory</span>
            <small>{selectedItem ? `Selected: ${ITEM_DEFS[selectedItem].name}` : 'Select an item, then another item or a scene object'}</small>
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
                <img src={`${BASE}assets/item-${ITEM_DEFS[id].icon}.png`} alt="" />
                <span>{ITEM_DEFS[id].name}</span>
              </button>
            ))}
            {Array.from({ length: Math.max(0, 8 - game.inventory.length) }).map((_, index) => <div className="inventory-empty" key={`empty-${index}`} />)}
          </div>
        </div>
      </section>

      <footer className="footer-note">Autosaves locally · Hold or focus hotspots to reveal names · Built as a two-room POC</footer>

      {dialogue && (
        <div className="dialogue-backdrop" onClick={!dialogue.choices ? closeDialogue : undefined}>
          <section className="dialogue-box" role="dialog" aria-live="assertive" aria-label={`${dialogue.speaker} says`} onClick={(e) => e.stopPropagation()}>
            <div className={`portrait ${dialogue.speaker === 'Mara' ? 'mara-portrait' : ''}`}>{dialogue.speaker.slice(0, 1)}</div>
            <div className="dialogue-content">
              <strong>{dialogue.speaker}</strong>
              <p>{dialogue.text}</p>
              {dialogue.choices ? (
                <div className="dialogue-choices">
                  {dialogue.choices.map((choice) => <button key={choice.label} onClick={() => chooseDialogue(choice)}>{choice.label}</button>)}
                </div>
              ) : <button className="continue-button" onClick={closeDialogue}>Continue</button>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
