export const ITEM_DEFS = {
  'id-card': { name: 'Employee ID', icon: 'id-card', description: 'Mara Quibble, Junior Retrieval Clerk. The word “Junior” has been underlined twice.' },
  peppermint: { name: 'Stale Peppermint', icon: 'peppermint', description: 'Hard enough to qualify as municipal infrastructure.' },
  complaint: { name: 'Complaint Form', icon: 'complaint', description: 'Unsigned, triplicated, and held together by a magnificently excessive rubber band.' },
  'short-ruler': { name: 'Short Ruler', icon: 'short-ruler', description: 'Twelve inches of limited authority.' },
  'long-ruler': { name: 'Long Ruler', icon: 'long-ruler', description: 'Longer, but no more certain.' },
  'rubber-band': { name: 'Industrial Rubber Band', icon: 'rubber-band', description: 'Approved for paperwork, emergency repairs, and minor siege engines.' },
  tongs: { name: 'Evidence Tongs', icon: 'tongs', description: 'Two rulers promoted beyond their competence.' },
  handle: { name: 'Alarm Handle', icon: 'handle', description: 'Heavy brass. Damp with procedural importance.' },
  postcard: { name: 'Impossible Postcard', icon: 'postcard', description: 'A picture of the lighthouse, mailed tomorrow in Mara’s handwriting.' },
  watch: { name: 'Cracked Watch', icon: 'watch', description: 'Stopped at 4:17. It ticks only when nobody is listening.' },
  gus: { name: 'Gus the Umbrella', icon: 'gus', description: 'A licensed meteorological pessimist. His forecasts are accurate one day late.' },
  sardine: { name: 'Sardine', icon: 'sardine', description: 'Small, shiny, and burdened with a surprisingly complicated inner life.' },
  glove: { name: 'Long Rubber Glove', icon: 'glove', description: 'Long enough to reach into situations that common sense would avoid.' },
  hat: { name: 'Captain’s Hat', icon: 'hat', description: 'Ceremonial, authoritative, and suspiciously lumpy around the brim.' },
  'duck-call': { name: 'Brass Duck Call', icon: 'duck-call', description: 'Captain Nib calls it an emergency naval communicator.' },
  funnel: { name: 'Brass Funnel', icon: 'funnel', description: 'Formerly part of the ferry’s bilge pump. Before the soup incident.' },
  foghorn: { name: 'Regulation-ish Foghorn', icon: 'foghorn', description: 'A rubber-powered instrument capable of alarming weather systems.' }
};

export const INITIAL_FLAGS = {
  terminalSeen: false,
  posterSeen: false,
  alarmSeen: false,
  handleSeen: false,
  rulersTaken: false,
  bandTaken: false,
  tongsMade: false,
  handleTaken: false,
  alarmRepaired: false,
  packageUnlocked: false,
  packageOpened: false,
  captainTalked: false,
  postcardShown: false,
  sardineTaken: false,
  birdLured: false,
  hatTaken: false,
  duckCallFound: false,
  hatGiven: false,
  funnelTaken: false,
  foghornMade: false,
  hornTested: false,
  hornGiven: false,
  departed: false
};

export const START_STATE = {
  scene: 'office',
  inventory: ['id-card', 'peppermint', 'complaint'],
  flags: INITIAL_FLAGS,
  maraX: { office: 54, harbor: 45 },
  mute: false
};

export function canMakeTongs(inventory) {
  return ['short-ruler', 'long-ruler', 'rubber-band'].every((item) => inventory.includes(item));
}

export function canMakeFoghorn(inventory) {
  return ['glove', 'duck-call', 'funnel'].every((item) => inventory.includes(item));
}

export function combineInventory(inventory, first, second) {
  const pair = new Set([first, second]);
  if ([...pair].every((id) => ['short-ruler', 'long-ruler', 'rubber-band'].includes(id)) && canMakeTongs(inventory)) {
    return { inventory: [...inventory.filter((id) => !['short-ruler', 'long-ruler', 'rubber-band'].includes(id)), 'tongs'], result: 'tongs' };
  }
  if ([...pair].every((id) => ['glove', 'duck-call', 'funnel'].includes(id)) && canMakeFoghorn(inventory)) {
    return { inventory: [...inventory.filter((id) => !['glove', 'duck-call', 'funnel'].includes(id)), 'foghorn'], result: 'foghorn' };
  }
  return null;
}
