export function interactLighthouse({ hotspotId, verb, selectedItem, state, api }) {
  const f = state.flags;
  const look = (text) => api.say(text);
  const noPickup = (text='I don’t think I can pick that up.') => api.say(text);

  if (hotspotId === 'captain') {
    if (verb === 'talk' || verb === 'use') return api.dialogue('lighthouse.nib');
    if (verb === 'pickup') return noPickup('Captain Nib has survived several maritime incidents and one buffet. I am not lifting him.');
    return look('Nib is keeping one hand on the boat and the other on his ceremonial hat, which he considers a complete safety procedure.');
  }

  if (hotspotId === 'boat') {
    if (verb === 'pickup') return noPickup('The ferry has already exceeded its recommended number of improvised repairs.');
    if (!f.shipRevealed) return api.say('Nib refuses to leave until the beacon has done something dramatic enough to justify the trip.');
    return api.say('The Never Was is offshore. Returning to the harbor would be sensible, and therefore currently unavailable.');
  }

  if (hotspotId === 'service-door') {
    if (selectedItem === 'lighthouse-key' && verb === 'use' && !f.lighthouseUnlocked) {
      api.setFlags({ lighthouseUnlocked:true });
      api.sound('click');
      api.thought('The service key opened the lighthouse. Inside are Department crates, shipping records and a beacon that looks deliberately incomplete.');
      return api.say('The lock clicks at exactly 4:17, despite the complete absence of a clock mechanism. Reassuring.');
    }
    if (!f.lighthouseUnlocked) {
      if (verb === 'pickup') return noPickup('The door is stone, iron and aggressively attached to the lighthouse.');
      api.thought('The brass key from the future package is stamped LIGHTHOUSE SERVICE — 417.');
      return look('A corroded service door with the Department seal beneath several layers of salt. The keyhole is marked 417.');
    }
    return look('The service door is open. It has revealed exactly the sort of municipal machinery abandoned buildings should not contain.');
  }

  if (hotspotId === 'crate') {
    if (!f.crateOpened && ['use','pickup'].includes(verb)) {
      api.setFlags({ crateOpened:true, prismTaken:true });
      api.grantItems(['beacon-prism'],'YOU RECOVERED');
      api.thought('A beacon prism. Someone removed the lighthouse’s most important part, packed it carefully and forgot to finish stealing it.');
      return api.say('The crate contains a triangular lens, three cancelled destination labels and a receipt signed by Director Vellum.');
    }
    return look(f.crateOpened ? 'An open Department crate. The remaining packing straw is classified as “unused possibility, low grade.”' : 'A Department shipping crate marked FINAL BEACON COMPONENT — DO NOT INVENTORY.');
  }

  if (hotspotId === 'ledger') {
    if (!f.manifestRead && ['look','use','pickup'].includes(verb)) return api.dialogue('lighthouse.ledger');
    return look('Vellum’s shipping ledger. The final line routes an unregistered vessel through beacon frequency 4:17.');
  }

  if (hotspotId === 'beacon') {
    if (selectedItem === 'beacon-prism' && verb === 'use' && !f.prismInstalled) {
      api.removeItems(['beacon-prism']);
      api.setFlags({ prismInstalled:true });
      api.thought('The prism is installed. The beacon still needs the correct timing signal.');
      return api.say('The prism settles into the brass cradle. The entire tower exhales, which architecture should not do.');
    }
    if (!f.prismInstalled) return look('The beacon assembly is intact except for a prism-shaped absence in the center. Even the lighthouse has missing paperwork.');
    return look('The beacon prism is installed and waiting for a timing signal from the control console.');
  }

  if (hotspotId === 'controls') {
    if (selectedItem === 'watch' && verb === 'use' && !f.beaconSynced) {
      if (!f.manifestRead) {
        api.thought('The watch is stopped at 4:17, but I need evidence that this is the beacon frequency rather than a very specific mechanical failure.');
        return api.say('The console accepts the watch as an object and rejects it as an argument.');
      }
      api.setFlags({ beaconSynced:true });
      api.thought('The console is synchronized to 4:17. Install the prism, then activate the beacon.');
      return api.say('The watch hand twitches. The console answers with four clicks, one pause and seventeen deeply suspicious chimes.');
    }
    if (['use','pickup'].includes(verb)) {
      if (!f.prismInstalled) return api.say('The controls respond, but the empty beacon cradle produces only a narrow beam of administrative disappointment.');
      if (!f.beaconSynced) return api.say('The timing dial refuses every setting except one it does not display. The ledger and cracked watch may provide the missing number.');
      if (!f.shipRevealed) return api.dialogue('lighthouse.reveal');
      return api.say('The beacon is already operating at 4:17. The ship in the fog is now the larger problem.');
    }
    return look(f.beaconSynced ? 'The console is synchronized to 4:17 and ready to activate.' : 'A brass control console with a timing dial, a destination switch and a warning: DO NOT POINT AT UNREALIZED VOYAGES.');
  }

  if (hotspotId === 'ship') {
    if (verb === 'pickup') return noPickup('The ship is offshore, enormous and probably subject to customs.');
    if (verb === 'talk') return api.say('The Never Was answers with a distant horn. Gus says it has an evasive accent.');
    return look('The Never Was: a luxury ship that appears only when the lighthouse shines through a missing minute. Vellum is aboard.');
  }

  return look('Salt, fog and machinery. The lighthouse has all the charm of the Department with fewer forms and more drowning.');
}
