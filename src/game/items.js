import { assetUrl } from './assetUrl.js';
const A = 'assets/inventory/';

export const ITEMS = {
  'employee-id': { name:'Employee ID', description:'Mara Quibble, Junior Retrieval Clerk. The photograph displays confidence she does not remember having.', icon:assetUrl(`${A}employee-id.svg`) },
  peppermint: { name:'Stale peppermint', description:'Possibly older than the public.', icon:assetUrl(`${A}peppermint.svg`) },
  'complaint-form-bound': { name:'Complaint form', description:'Form 37-B, held together by an industrial rubber band.', icon:assetUrl(`${A}complaint-form.svg`) },
  'complaint-form-loose': { name:'Loose complaint form', description:'The complaint is now free-range.', icon:assetUrl(`${A}complaint-form-loose.svg`) },
  'short-ruler': { name:'Short ruler', description:'Twelve inches of dependable bureaucracy.', icon:assetUrl(`${A}short-ruler.svg`) },
  'long-ruler': { name:'Long ruler', description:'Twenty-four inches. Twice the ruler, exactly the same authority.', icon:assetUrl(`${A}long-ruler.svg`) },
  'rubber-band': { name:'Industrial rubber band', description:'Strong enough to restrain forty-seven pages of public dissatisfaction.', icon:assetUrl(`${A}rubber-band.svg`) },
  'ruler-pair': { name:'Unfastened ruler pair', description:'The right shape, but lacking commitment.', icon:assetUrl(`${A}ruler-pair.svg`) },
  'evidence-tongs': { name:'Improvised evidence tongs', description:'Officially two rulers and a rubber band. Spiritually, engineering.', icon:assetUrl(`${A}evidence-tongs.svg`) },
  'alarm-handle': { name:'Brass alarm handle', description:'Heavy, official, and apparently waterproof.', icon:assetUrl(`${A}alarm-handle.svg`) },
  postcard: { name:'Impossible postcard', description:'Gannet’s End Harbor, including one detail that has not happened yet.', icon:assetUrl(`${A}postcard.svg`) },
  watch: { name:'Cracked pocket watch', description:'Stopped at 4:17. The second hand appears nervous.', icon:assetUrl(`${A}watch.svg`) },
  'lighthouse-key': { name:'Lighthouse service key', description:'Stamped with the Department seal and the number 417.', icon:assetUrl(`${A}lighthouse-key.svg`) },
  'passenger-card': { name:'Never Was passenger card', description:'A Grand Suite card issued to Mara Quint, whoever that is.', icon:assetUrl(`${A}passenger-card.svg`) },
  'vellum-photo': { name:'Photograph of Vellum', description:'Director Vellum aboard The Never Was, standing beside a final-shipment crate.', icon:assetUrl(`${A}vellum-photo.svg`) },
  gus: { name:'Gus', description:'A talking umbrella with flawless knowledge of weather that has already occurred.', icon:assetUrl(`${A}gus.svg`) },
  sardine: { name:'Sardine', description:'Small, oily, and suddenly central to several negotiations.', icon:assetUrl(`${A}sardine.svg`) },
  'rubber-glove': { name:'Long rubber glove', description:'Designed for cleaning fish. Long enough to suggest the fish sometimes resist.', icon:assetUrl(`${A}rubber-glove.svg`) },
  'captains-hat': { name:'Ceremonial captain’s hat', description:'Large, dramatic, and apparently capable of replacing courage.', icon:assetUrl(`${A}captains-hat.svg`) },
  'duck-call': { name:'Brass duck call', description:'Nib calls it an emergency naval communication device.', icon:assetUrl(`${A}duck-call.svg`) },
  funnel: { name:'Brass funnel', description:'Formerly part of a maritime pump. Currently between careers.', icon:assetUrl(`${A}funnel.svg`) },
  'amplified-duck-call': { name:'Amplified duck call', description:'More volume. Still too much duck.', icon:assetUrl(`${A}amplified-duck-call.svg`) },
  'wheezing-glove': { name:'Wheezing glove', description:'A balloon reconsidering its choices.', icon:assetUrl(`${A}wheezing-glove.svg`) },
  'foghorn': { name:'Regulation-ish foghorn', description:'One glove, one duck call and one funnel. Approved by nobody.', icon:assetUrl(`${A}foghorn.svg`) }
};

export const RECIPES = {
  ['long-ruler+short-ruler']: { consume:['long-ruler','short-ruler'], create:'ruler-pair', message:'The shape is right. I need something to hold them together.' },
  ['rubber-band+ruler-pair']: { consume:['rubber-band','ruler-pair'], create:'evidence-tongs', popupType:'YOU MADE', message:'I’m adding “fabrication specialist” to my annual review.' },
  ['duck-call+funnel']: { consume:['duck-call','funnel'], create:'amplified-duck-call', popupType:'YOU MADE', message:'More volume. Still too much duck.' },
  ['duck-call+rubber-glove']: { consume:['duck-call','rubber-glove'], create:'wheezing-glove', popupType:'YOU MADE', message:'It sounds like a balloon reconsidering its choices.' },
  ['amplified-duck-call+rubber-glove']: { consume:['amplified-duck-call','rubber-glove'], create:'foghorn', popupType:'YOU MADE', message:'Loud, portable, and impossible to defend in writing.' },
  ['funnel+wheezing-glove']: { consume:['funnel','wheezing-glove'], create:'foghorn', popupType:'YOU MADE', message:'Loud, portable, and impossible to defend in writing.' }
};

export function recipeFor(a,b) {
  return RECIPES[[a,b].sort().join('+')];
}