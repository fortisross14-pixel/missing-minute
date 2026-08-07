export const SAVE_KEY = 'mara-quibble-v1';
export const MANUAL_SAVE_KEY = 'mara-quibble-v1-manual';

export const initialState = {
  sceneId: '01-department-office',
  positions: {
    '01-department-office': { x: 1710, y: 1020 },
    '02-gannets-end-harbor': { x: 340, y: 860 },
    '03-gannets-end-lighthouse': { x: 300, y: 850 }
  },
  inventory: ['employee-id', 'peppermint', 'complaint-form-bound'],
  selectedItem: null,
  verb: 'walk',
  flags: {
    introSeen: false,
    pindleTalked: false,
    terminalExamined: false,
    posterRead: false,
    alarmDiscovered: false,
    rulersTaken: false,
    rubberBandTaken: false,
    rulerPairMade: false,
    tongsMade: false,
    handleTaken: false,
    alarmRepaired: false,
    drillTriggered: false,
    packageOpened: false,
    gusTaken: false,
    officeComplete: false,
    harborIntroSeen: false,
    nibTalked: false,
    brineTalked: false,
    photoShown: false,
    sardineTaken: false,
    gloveTaken: false,
    gullLured: false,
    hatTaken: false,
    duckCallFound: false,
    funnelTaken: false,
    foghornMade: false,
    hatGiven: false,
    hornGiven: false,
    harborComplete: false,
    lighthouseIntroSeen: false,
    lighthouseUnlocked: false,
    crateOpened: false,
    prismTaken: false,
    manifestRead: false,
    prismInstalled: false,
    beaconSynced: false,
    shipRevealed: false
  },
  dialogueSeen: {},
  mute: false
};

function normalizeLoadedState(parsed) {
  const inventory = Array.isArray(parsed?.inventory) ? parsed.inventory : [...initialState.inventory];
  const flags = { ...initialState.flags, ...(parsed?.flags || {}) };
  // v1.1 granted Gus from the parcel. Preserve old saves without leaving a duplicate Gus on the shelf.
  if (inventory.includes('gus')) {
    flags.gusTaken = true;
    flags.officeComplete = true;
  }
  return {
    ...structuredClone(initialState),
    ...parsed,
    inventory,
    positions: { ...initialState.positions, ...(parsed?.positions || {}) },
    flags,
    dialogueSeen: { ...(parsed?.dialogueSeen || {}) }
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return structuredClone(initialState);
    return normalizeLoadedState(JSON.parse(raw));
  } catch {
    return structuredClone(initialState);
  }
}

export function saveState(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch { /* ignore quota */ }
}


export function saveManualState(state) {
  try {
    localStorage.setItem(MANUAL_SAVE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function loadManualState() {
  try {
    const raw = localStorage.getItem(MANUAL_SAVE_KEY);
    if (!raw) return null;
    return normalizeLoadedState(JSON.parse(raw));
  } catch {
    return null;
  }
}
