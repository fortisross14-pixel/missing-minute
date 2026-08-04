export function interactHarbor({ hotspotId, verb, selectedItem, state, api }) {
  const f = state.flags;
  const look = (text) => api.say(text);
  const noPickup = (text='I don’t think I can pick that up.') => api.say(text);

  if (hotspotId === 'captain') {
    if (selectedItem === 'captains-hat' && verb === 'give' && !f.hatGiven) {
      if (!f.duckCallFound) { api.setFlags({duckCallFound:true}); api.grantItems(['duck-call'],'YOU DISCOVERED'); api.say('As Nib takes the hat, a brass duck call falls from the lining. He calls it an emergency naval communication device.'); }
      api.removeItems(['captains-hat']); api.setFlags({hatGiven:true});
      if (f.duckCallFound) api.say('Nib places the hat on his head and immediately stands taller. “A captain once more.”');
      if (!f.hornGiven) api.thought('Hat returned. He still needs a working foghorn.');
      return;
    }
    if (selectedItem === 'foghorn' && verb === 'give' && !f.hornGiven) {
      api.removeItems(['foghorn']); api.setFlags({hornGiven:true});
      api.say('Nib inspects the horn. “Hand-built? Unlicensed? Excellent. Harbor-certified equipment is notoriously unreliable.”');
      if (!f.hatGiven) api.thought('The foghorn is ready. He still needs his ceremonial hat.');
      return;
    }
    if (verb === 'talk' || verb === 'use') return api.dialogue('harbor.nib');
    if (verb === 'pickup') return noPickup('I don’t think I can pick up Captain Nib. His coat alone may exceed the ferry’s cargo limit.');
    return look('Captain Nib stands beside the ferry with the posture of a man posing for a monument no one commissioned.');
  }

  if (hotspotId === 'brine') {
    if (verb === 'talk' || selectedItem === 'postcard') return api.dialogue(selectedItem === 'postcard' ? 'harbor.brine.postcard' : 'harbor.brine');
    if (verb === 'pickup') return noPickup('Madame Brine would object, and several of the fish appear prepared to testify.');
    return look('Madame Brine arranges fish by expression: optimistic on the left, resigned on the right, management in the middle.');
  }

  if (hotspotId === 'gull') {
    if (selectedItem === 'sardine') { api.thought('It wants the sardine, but I need it to leave the hat behind. The empty bucket is directly beneath it.'); return look('The gull leans toward the fish without surrendering the hat. Negotiations have stalled.'); }
    if (verb === 'talk') { api.sound('gull'); return look('The gull responds with three metallic clicks and a cash-register noise. Strong opening argument.'); }
    if (verb === 'pickup') return noPickup('It has metal talons, a bad attitude, and the high ground.');
    return look('Part bird, part machinery, entirely unpleasant. It is wearing Nib’s hat with irritating confidence.');
  }

  if (hotspotId === 'bucket') {
    if (selectedItem === 'sardine' && verb === 'use' && !f.gullLured) {
      api.removeItems(['sardine']); api.setFlags({gullLured:true}); api.sound('gull');
      api.thought('The gull is occupied. I should grab Nib’s hat before it finishes eating the bucket.');
      return api.say('The gull drops the hat and dives headfirst into the bucket. The bucket begins reconsidering its structural integrity.');
    }
    if (verb === 'pickup') return noPickup('The bucket is useful where it is: directly below a gull with poor impulse control.');
    return look('An empty fish bucket positioned directly beneath a predatory mechanical bird. That feels useful.');
  }

  if (hotspotId === 'hat') {
    if ((verb === 'pickup' || verb === 'use') && !f.hatTaken) { api.setFlags({hatTaken:true}); api.grantItems(['captains-hat']); return api.thought('The hat feels unusually heavy. I should examine it before giving it back.'); }
    return look('Captain Nib’s ceremonial hat, briefly liberated from maritime authority.');
  }

  if (hotspotId === 'pump') {
    if ((verb === 'pickup' || verb === 'use') && !f.funnelTaken) { api.setFlags({funnelTaken:true}); api.grantItems(['funnel']); return api.say('Formerly part of a maritime pump. Currently between careers.'); }
    return look(f.funnelTaken ? 'A broken bilge pump, now missing the one component that looked remotely useful.' : 'A broken bilge pump with a removable brass funnel. Nib is pretending not to see me.');
  }

  if (hotspotId === 'boat') {
    if (verb === 'pickup') return noPickup('It is technically portable, but not by me.');
    if (f.hatGiven && f.hornGiven) return api.dialogue('harbor.departure');
    if (!f.nibTalked) return look('The Misty Minnow appears to be held together by paint, rope and positive language.');
    return api.thought('Nib will not sail until I return his hat and give him a working foghorn.');
  }

  if (hotspotId === 'lighthouse') {
    if (verb === 'pickup') return noPickup('Even by municipal standards, stealing a lighthouse would be noticeable.');
    return look('The abandoned lighthouse. The note says its beacon can reveal The Never Was. It seems less abandoned every time I look.');
  }
  if (hotspotId === 'fish') {
    if (verb === 'pickup' && !f.sardineTaken) return api.say('Madame Brine slaps my hand away without interrupting her conversation with a haddock. Payment first.');
    return look('Luxury sardines. Luxury is apparently a matter of presentation.');
  }
  if (hotspotId === 'sign') {
    if (verb === 'pickup') return noPickup('It is still attached to the building. For now.');
    return look(f.photoShown ? 'Madame Brine is holding the fallen sign with the composure of someone revising a prediction.' : 'A swordfish sign hanging from two ropes. In the postcard, one rope has already snapped.');
  }
  if (hotspotId === 'tavern') {
    if (verb === 'pickup') return noPickup('I am not picking up a tavern. It is probably load-bearing for the neighborhood.');
    return look('The Rusty Kettle. CLOSED DUE TO WEATHER INSIDE. At least they posted a reason.');
  }
  return look('The harbor contains many objects that would be useful in a less specific emergency.');
}
