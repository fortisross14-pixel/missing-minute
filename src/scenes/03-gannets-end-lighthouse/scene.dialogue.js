export const lighthouseDialogues = {
  'lighthouse.opening': {
    cinematic:true,
    lines:[
      {speaker:'Narration',text:'The Misty Minnow reaches Gannet’s End Lighthouse by following a route Captain Nib describes as “mostly water.”'},
      {speaker:'Captain Nib',text:'We have arrived.'},
      {speaker:'Mara',text:'You tied the boat to a gravestone.'},
      {speaker:'Captain Nib',text:'Maritime bollard.'},
      {speaker:'Gus',text:'It says “Beloved Harold.”'},
      {speaker:'Captain Nib',text:'Harold was extremely maritime.'},
      {speaker:'Mara',text:'The service door has the Department seal. Vellum has been using this place.'}
    ],
    completeEffects:[
      {type:'setFlag',key:'lighthouseIntroSeen',value:true},
      {type:'thought',text:'The brass lighthouse key should open the service door. Then I need to find out how the beacon reveals The Never Was.'}
    ]
  },
  'lighthouse.nib': {
    lines:[
      {speaker:'Mara',text:'Are you coming inside?'},
      {speaker:'Captain Nib',text:'A captain remains with his vessel.'},
      {speaker:'Gus',text:'You are afraid of the lighthouse.'},
      {speaker:'Captain Nib',text:'A captain also remains beyond the reach of slander.'}
    ],
    choices:[
      {label:'What do you know about this place?',next:'lighthouse.nib.history'},
      {label:'Have you seen The Never Was?',next:'lighthouse.nib.ship'},
      {label:'Why does the key say 417?',next:'lighthouse.nib.key'},
      {label:'Guard the boat.',close:true}
    ]
  },
  'lighthouse.nib.history': { lines:[
    {speaker:'Captain Nib',text:'The light was decommissioned twenty years ago after it began directing ships toward journeys they had cancelled.'},
    {speaker:'Mara',text:'That seems worth mentioning before the crossing.'},
    {speaker:'Captain Nib',text:'You had already paid in foghorn.'}
  ], returnTo:'lighthouse.nib' },
  'lighthouse.nib.ship': { lines:[
    {speaker:'Captain Nib',text:'Once. In the fog. Twelve decks, no registry, music from a party nobody remembered attending.'},
    {speaker:'Mara',text:'Did you approach it?'},
    {speaker:'Captain Nib',text:'I performed a disciplined maritime retreat.'},
    {speaker:'Gus',text:'He screamed and reversed.'}
  ], returnTo:'lighthouse.nib' },
  'lighthouse.nib.key': { lines:[
    {speaker:'Captain Nib',text:'Every mechanism here stops at 4:17.'},
    {speaker:'Mara',text:'Why?'},
    {speaker:'Captain Nib',text:'At 4:18, sensible people leave.'}
  ], returnTo:'lighthouse.nib' },
  'lighthouse.ledger': {
    cinematic:true,
    lines:[
      {speaker:'Mara',text:'Department shipping ledger. Signed by Director Halbert Vellum.'},
      {speaker:'Gus',text:'His handwriting predicts arrogance with ninety-eight percent accuracy.'},
      {speaker:'Mara',text:'“Final shipment: unrealized lives. Transfer to The Never Was. Beacon destination frequency: 4:17.”'},
      {speaker:'Gus',text:'The cracked watch is stopped at 4:17.'},
      {speaker:'Mara',text:'So it is not only a warning. It is a key for the beacon controls.'}
    ],
    completeEffects:[
      {type:'setFlag',key:'manifestRead',value:true},
      {type:'thought',text:'The beacon frequency is 4:17. I can use the cracked watch to synchronize the console after repairing the missing prism.'}
    ]
  },
  'lighthouse.reveal': {
    cinematic:true,
    lines:[
      {speaker:'Mara',text:'Prism installed. Timing locked to 4:17. Activating beacon.'},
      {speaker:'SFX',text:'The old mechanism turns. Brass shutters clap open. A white beam cuts through the fog.'},
      {speaker:'Captain Nib',text:'There! Off the eastern rocks!'},
      {speaker:'Gus',text:'Yesterday, there was nothing there.'},
      {speaker:'Mara',text:'The Never Was.'},
      {speaker:'Gus',text:'Large, expensive and avoiding commitment. It may be a cruise ship.'},
      {speaker:'Mara',text:'Vellum is aboard, and the final shipment goes out tonight. We need a way onto that ship.'}
    ],
    completeEffects:[
      {type:'setFlag',key:'shipRevealed',value:true},
      {type:'thought',text:'The Never Was is visible. The next step is boarding it before Vellum completes the shipment.'}
    ]
  }
};
