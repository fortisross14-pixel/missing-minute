export function currentObjective(state) {
  const f = state.flags;
  if (state.sceneId === '01-department-office') {
    if (!f.pindleTalked) return 'Ask Mr. Pindle about the impossible parcel.';
    if (!f.terminalExamined) return 'Examine the pneumatic delivery terminal.';
    if (!f.posterRead) return 'Find out how the Department advances its official date.';
    if (!f.alarmDiscovered) return 'Inspect the fire alarm.';
    if (!f.tongsMade) return 'Find a way to retrieve the alarm handle from the fishbowl.';
    if (!f.handleTaken) return 'Use the improvised tongs on Mr. Ledger’s fishbowl.';
    if (!f.alarmRepaired) return 'Return the brass handle to the fire alarm.';
    if (!f.drillTriggered) return 'Trigger the Department’s emergency drill.';
    if (!f.packageOpened) return 'Retrieve the parcel now that tomorrow is official.';
    if (!f.gusTaken) return 'Pick up the talking umbrella from the lost-property shelf.';
    return 'Go to Gannet’s End Harbor and find Captain Nib.';
  }
  if (state.sceneId === '02-gannets-end-harbor') {
    if (!f.nibTalked) return 'Ask Captain Nib for passage to the lighthouse.';
    if (!f.photoShown) return 'Find a way to obtain a sardine from Madame Brine.';
    if (!f.gullLured) return 'Use the sardine to lure the mechanical gull away from Nib’s hat.';
    if (!f.hatTaken) return 'Pick up Captain Nib’s ceremonial hat.';
    if (!f.duckCallFound) return 'Examine the captain’s hat.';
    if (!f.funnelTaken) return 'Find something that can amplify the duck call.';
    if (!f.foghornMade) return 'Combine the glove, duck call and funnel into a foghorn.';
    if (!f.hatGiven || !f.hornGiven) return 'Return Nib’s hat and give him the new foghorn.';
    return 'Board the Misty Minnow and sail for the lighthouse.';
  }
  if (state.sceneId === '03-gannets-end-lighthouse') {
    if (!f.lighthouseUnlocked) return 'Use the brass lighthouse key on the service door.';
    if (!f.manifestRead) return 'Inspect the shipping ledger and identify Vellum’s beacon frequency.';
    if (!f.prismTaken) return 'Open the Department crate and recover the beacon prism.';
    if (!f.prismInstalled) return 'Install the prism in the lighthouse beacon assembly.';
    if (!f.beaconSynced) return 'Synchronize the beacon controls with the cracked watch stopped at 4:17.';
    if (!f.shipRevealed) return 'Activate the repaired beacon and reveal The Never Was.';
    return 'The Never Was is visible in the fog. Find a way aboard.';
  }
  return 'The lighthouse is waiting.';
}
