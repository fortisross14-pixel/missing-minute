export function interactOffice({ hotspotId, verb, selectedItem, state, api }) {
  const f = state.flags;
  const look = (text) => api.say(text);

  if (hotspotId === 'pindle') {
    if (verb === 'talk' || verb === 'use') return api.dialogue('office.pindle');
    return look('Mr. Pindle is pretending to read a blank page with impressive concentration.');
  }

  if (hotspotId === 'terminal') {
    if (f.drillTriggered && !f.packageOpened && ['use','pickup'].includes(verb)) {
      return api.dialogue('office.package');
    }
    if (selectedItem === 'employee-id') return look('EMPLOYEE RECOGNIZED. AUTHORITY NOT FOUND. Accurate and unnecessarily personal.');
    if (selectedItem === 'complaint-form-bound' || selectedItem === 'complaint-form-loose') return look('COMPLAINT RECEIVED. ESTIMATED RESPONSE: EVENTUALLY. Fastest response I have ever received here.');
    api.setFlags({ terminalExamined:true });
    api.thought('The parcel is dated tomorrow. The terminal will only release it when the Department’s official date catches up.');
    return look(f.drillTriggered ? 'The display now reads: TOMORROW CONFIRMED. The hatch is unlocked.' : 'DELIVERY REJECTED: ITEM ARRIVED BEFORE BEING SENT. PLEASE TRY AGAIN TOMORROW.');
  }

  if (hotspotId === 'poster') {
    api.setFlags({ posterRead:true });
    api.thought('Triggering the fire drill should advance the official date by twenty-four hours. First I need a functioning alarm.');
    return look('“During emergency continuity exercises, advance the official date by one day.” They have made tomorrow’s staffing problem tomorrow’s problem.');
  }

  if (hotspotId === 'clock') {
    return look(f.drillTriggered ? 'The official clock has advanced to tomorrow. Staffing remains inadequate.' : 'The official municipal clock. Four minutes slow since 1912, but correcting it would invalidate several treaties.');
  }

  if (hotspotId === 'alarm') {
    if (selectedItem === 'alarm-handle' && verb === 'use' && !f.alarmRepaired) {
      api.removeItems(['alarm-handle']);
      api.setFlags({ alarmRepaired:true });
      return api.say('There. The building can panic responsibly again.');
    }
    if (f.alarmRepaired && !f.drillTriggered && ['use','pickup'].includes(verb)) {
      api.setFlags({ drillTriggered:true });
      api.sound('alarm');
      api.thought('The terminal thinks tomorrow has arrived. Time to open the parcel before the office changes its mind.');
      return api.say('The alarm gives a pathetic buzz. One sprinkler releases a single drop. Mr. Pindle announces that he is evacuating emotionally.');
    }
    api.setFlags({ alarmDiscovered:true });
    api.thought('The alarm is missing its handle. I saw something brass in Mr. Ledger’s fishbowl.');
    return look(f.alarmRepaired ? 'Fully operational, which puts it ahead of several departments.' : 'The fire alarm is missing its pull handle. Someone stole the most exciting part.');
  }

  if (hotspotId === 'rulers') {
    if (verb === 'pickup' || verb === 'use') {
      api.setFlags({ rulersTaken:true });
      api.grantItems(['short-ruler','long-ruler']);
      return api.thought('Two rulers. If this stops being a clerical problem, it may become geometry.');
    }
    return look('Two rulers of different lengths stored as a matched pair. The standards here are refreshingly achievable.');
  }

  if (hotspotId === 'fishbowl') {
    if (selectedItem === 'evidence-tongs' && verb === 'use' && !f.handleTaken) {
      api.setFlags({ handleTaken:true });
      api.grantItems(['alarm-handle']);
      return api.say('Thank you, Mr. Ledger. Your objection has been noted.');
    }
    if (!f.alarmDiscovered) return look('Mr. Ledger, official office fish and unofficial holder of several municipal secrets.');
    api.thought('The brass alarm handle is at the bottom. I need something long enough to retrieve it without touching evidence water.');
    return look(f.handleTaken ? 'Mr. Ledger guards an empty ceramic castle and a growing grievance.' : 'The missing fire-alarm handle is under the ceramic castle. Mr. Ledger has acquired legal representation.');
  }

  if (hotspotId === 'gus') {
    if (f.packageOpened && verb === 'talk') return api.dialogue('office.gus');
    return look(f.packageOpened ? 'Gus looks folded, damp, and professionally offended.' : 'Black umbrella. Bent handle. Unreasonably disapproving posture.');
  }

  if (hotspotId === 'map-exit') {
    if (!f.officeComplete) return look('A city map showing roads, tram lines and three districts marked “under review.”');
    api.changeScene('02-gannets-end-harbor');
    return;
  }

  if (hotspotId === 'forms') return look('Rejected forms, obsolete forms, and one form requesting permission to reject obsolete forms.');
  if (hotspotId === 'desk') return look('Mara’s desk: one lamp, several stamps, and a career developing at administrative speed.');
  if (hotspotId === 'shelf') return look('Lost umbrellas, unmatched gloves and a bowling pin whose colleagues left to pursue individual careers.');
  return look('Nothing here appears eager to become useful.');
}
