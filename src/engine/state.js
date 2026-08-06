export const SAVE_KEY = 'mara-quibble-v1';

export const initialState = {
  sceneId: '01-department-office',
  positions: {
    '01-department-office': { x: 1710, y: 1020 },
    '02-gannets-end-harbor': { x: 340, y: 860 }
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
    harborComplete: false
  },
  dialogueSeen: {},
  mute: false
};

export function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return structuredClone(initialState);
    const parsed = JSON.parse(raw);
    return {
      ...structuredClone(initialState),
      ...parsed,
      positions: { ...initialState.positions, ...(parsed.positions || {}) },
      flags: { ...initialState.flags, ...(parsed.flags || {}) },
      dialogueSeen: { ...(parsed.dialogueSeen || {}) }
    };
  } catch {
    return structuredClone(initialState);
  }
}

export function saveState(state) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch { /* ignore quota */ }
}
