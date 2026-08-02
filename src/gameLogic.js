export const ITEM_DEFS = {
  'id-card': { name: 'Employee ID', icon: 'id-card', description: 'Mara Quibble, Junior Retrieval Clerk. The photograph displays confidence she does not remember having.' },
  peppermint: { name: 'Stale Peppermint', icon: 'peppermint', description: 'A peppermint from the public-service bowl. Possibly older than the public.' },
  complaint: { name: 'Complaint Form', icon: 'complaint', description: 'Form 37-B: Complaint Concerning Excessive Difficulty Filing a Complaint.' },
  'short-ruler': { name: 'Short Ruler', icon: 'short-ruler', description: 'Twelve inches of dependable bureaucracy.' },
  'long-ruler': { name: 'Long Ruler', icon: 'long-ruler', description: 'Twenty-four inches. Twice the ruler, exactly the same authority.' },
  'rubber-band': { name: 'Industrial Rubber Band', icon: 'rubber-band', description: 'Strong enough to restrain forty-seven pages of public dissatisfaction.' },
  tongs: { name: 'Improvised Evidence Tongs', icon: 'tongs', description: 'Officially two rulers and a rubber band. Spiritually, engineering.' },
  handle: { name: 'Brass Alarm Handle', icon: 'handle', description: 'Heavy, official, and apparently waterproof.' },
  postcard: { name: 'Impossible Postcard', icon: 'postcard', description: 'A picture of Gannet’s End Harbor. Several details have not happened yet.' },
  watch: { name: 'Cracked Pocket Watch', icon: 'watch', description: 'Stopped at 4:17. The second hand appears nervous.' },
  gus: { name: 'Gus', icon: 'gus', description: 'A talking umbrella with flawless knowledge of weather that has already occurred.' },
  sardine: { name: 'Sardine', icon: 'sardine', description: 'Small, oily, and suddenly central to several negotiations.' },
  glove: { name: 'Long Rubber Glove', icon: 'glove', description: 'Designed for cleaning fish. Long enough to suggest the fish sometimes resist.' },
  hat: { name: 'Captain’s Hat', icon: 'hat', description: 'Large, dramatic, and apparently capable of replacing courage.' },
  'duck-call': { name: 'Brass Duck Call', icon: 'duck-call', description: 'Captain Nib’s emergency naval communication device. It sounds like an anxious duck.' },
  funnel: { name: 'Brass Funnel', icon: 'funnel', description: 'Formerly part of a maritime pump. Currently between careers.' },
  foghorn: { name: 'Regulation-ish Foghorn', icon: 'foghorn', description: 'One glove, one duck call and one funnel. Approved by nobody. Ready for service.' }
};

export const INITIAL_FLAGS = {
  introSeen: false,
  pindleTalked: false,
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
  gusAwake: false,
  harborIntroSeen: false,
  captainTalked: false,
  brineTalked: false,
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
  flags: { ...INITIAL_FLAGS },
  maraX: { office: 48, harbor: 34 },
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
    return {
      inventory: [...inventory.filter((id) => !['short-ruler', 'long-ruler', 'rubber-band'].includes(id)), 'tongs'],
      result: 'tongs'
    };
  }
  if ([...pair].every((id) => ['glove', 'duck-call', 'funnel'].includes(id)) && canMakeFoghorn(inventory)) {
    return {
      inventory: [...inventory.filter((id) => !['glove', 'duck-call', 'funnel'].includes(id)), 'foghorn'],
      result: 'foghorn'
    };
  }
  return null;
}
