export const harborDialogues = {
  'harbor.opening': {
    cinematic:true,
    lines:[
      {speaker:'Captain Nib',text:'A captain without his ceremonial hat is merely a man standing near water.'},
      {speaker:'Madame Brine',text:'You were mostly that with the hat.'},
      {speaker:'Captain Nib',text:'The hat represents maritime authority.'},
      {speaker:'Madame Brine',text:'The gull is wearing it better.'},
      {speaker:'Mara',text:'I need passage to the lighthouse.'},
      {speaker:'Captain Nib',text:'No.'},
      {speaker:'Mara',text:'That was quick.'},
      {speaker:'Captain Nib',text:'Experience.'}
    ],
    completeEffects:[{type:'setFlag',key:'harborIntroSeen',value:true},{type:'thought',text:'Captain Nib owns the only ferry that can approach the lighthouse, so unfortunately I need Captain Nib.'}]
  },
  'harbor.nib': {
    lines:[{speaker:'Mara',text:'Captain Nib?'},{speaker:'Captain Nib',text:'Captain Barnaby Nib. Harbor master, ferry operator, and survivor of several menus.'}],
    choices:[
      {label:'Take me to the lighthouse.',next:'harbor.nib.pass'},
      {label:'Why won’t you sail?',next:'harbor.nib.why'},
      {label:'What happened to your hat?',next:'harbor.nib.hat'},
      {label:'What happened to the foghorn?',next:'harbor.nib.horn'},
      {label:'What is wrong with the fog?',next:'harbor.nib.fog'},
      {label:'I’ll come back.',close:true,effects:[{type:'setFlag',key:'nibTalked',value:true}]}
    ]
  },
  'harbor.nib.pass': { lines:[
    {speaker:'Mara',text:'I need you to take me to the lighthouse.'},
    {speaker:'Captain Nib',text:'Impossible. The sea is hostile, the fog is malicious, and I am improperly dressed.'},
    {speaker:'Mara',text:'You are wearing a coat.'},
    {speaker:'Captain Nib',text:'I am not wearing my hat.'}
  ], completeEffects:[{type:'setFlag',key:'nibTalked',value:true}], returnTo:'harbor.nib' },
  'harbor.nib.why': { lines:[
    {speaker:'Captain Nib',text:'Three reasons. My ceremonial hat has been stolen. My regulation foghorn is broken. And the fog has developed intentions.'},
    {speaker:'Mara',text:'How can you tell?'},
    {speaker:'Captain Nib',text:'Ordinary fog drifts. This fog waits.'}
  ], completeEffects:[{type:'setFlag',key:'nibTalked',value:true},{type:'thought',text:'Nib needs his hat and a working foghorn. Solving those problems may be easier than arguing with him.'}], returnTo:'harbor.nib' },
  'harbor.nib.hat': { lines:[
    {speaker:'Captain Nib',text:'The mechanical gull took it.'},
    {speaker:'Mara',text:'Why?'},
    {speaker:'Captain Nib',text:'Professional jealousy.'},
    {speaker:'Mara',text:'It is a bird.'},
    {speaker:'Captain Nib',text:'Then explain its pension.'}
  ], returnTo:'harbor.nib' },
  'harbor.nib.horn': { lines:[
    {speaker:'Captain Nib',text:'It was damaged in the regrettable soup incident.'},
    {speaker:'Mara',text:'What soup incident?'},
    {speaker:'Captain Nib',text:'Regrettable. Classified. Primarily soup.'},
    {speaker:'Mara',text:'Could I build another one?'},
    {speaker:'Captain Nib',text:'I respect the direction of your thinking.'}
  ], returnTo:'harbor.nib' },
  'harbor.nib.fog': { lines:[
    {speaker:'Captain Nib',text:'Three boats entered it last month. One returned yesterday. One returned in 1884.'},
    {speaker:'Mara',text:'And the third?'},
    {speaker:'Captain Nib',text:'Runs a successful bakery now.'},
    {speaker:'Mara',text:'That does not sound terrible.'},
    {speaker:'Captain Nib',text:'It was a fishing boat.'}
  ], returnTo:'harbor.nib' },
  'harbor.brine': {
    lines:[{speaker:'Mara',text:'Madame Brine?'},{speaker:'Madame Brine',text:'Fishmonger, maritime clairvoyant, and unwilling lender of sardines.'}],
    choices:[
      {label:'What do you know about the lighthouse?',next:'harbor.brine.lighthouse'},
      {label:'Can I have a fish?',next:'harbor.brine.fish'},
      {label:'Are you really a fortune-teller?',next:'harbor.brine.fortune'},
      {label:'What does the gull eat?',next:'harbor.brine.gull'},
      {label:'Look at this postcard.',next:'harbor.brine.postcard',visibleWhen:'packageOpened'},
      {label:'I’ll leave you to your fish.',close:true,effects:[{type:'setFlag',key:'brineTalked',value:true}]}
    ]
  },
  'harbor.brine.lighthouse': { lines:[
    {speaker:'Madame Brine',text:'It was built to guide ships away from danger.'},
    {speaker:'Mara',text:'That sounds normal.'},
    {speaker:'Madame Brine',text:'Then it began guiding unusual ships toward it.'},
    {speaker:'Mara',text:'Such as The Never Was?'},
    {speaker:'Madame Brine',text:'A name spoken by people who prefer their voyages unrecorded.'}
  ], returnTo:'harbor.brine' },
  'harbor.brine.fish': { lines:[
    {speaker:'Mara',text:'Could I have one sardine?'},
    {speaker:'Madame Brine',text:'Certainly. After payment.'},
    {speaker:'Mara',text:'I do not have money.'},
    {speaker:'Madame Brine',text:'Then you cannot afford the luxury fish.'},
    {speaker:'Mara',text:'It is a sardine.'},
    {speaker:'Madame Brine',text:'Luxury is a matter of presentation.'}
  ], returnTo:'harbor.brine' },
  'harbor.brine.fortune': { lines:[
    {speaker:'Madame Brine',text:'Maritime clairvoyant.'},
    {speaker:'Mara',text:'What is the difference?'},
    {speaker:'Madame Brine',text:'Salt.'}
  ], returnTo:'harbor.brine' },
  'harbor.brine.gull': { lines:[
    {speaker:'Madame Brine',text:'Fish, metal, loose documents, and the dignity of public officials.'},
    {speaker:'Mara',text:'Any favorite?'},
    {speaker:'Madame Brine',text:'Sardines.'}
  ], completeEffects:[{type:'thought',text:'The gull wants a sardine. Madame Brine wants payment—or a reason to give me one.'}], returnTo:'harbor.brine' },
  'harbor.brine.postcard': { cinematic:true, lines:[
    {speaker:'Mara',text:'This postcard arrived from tomorrow. Look at the corner.'},
    {speaker:'Madame Brine',text:'Cheap paper. Weak symbolism. Excessive lighthouse.'},
    {speaker:'Mara',text:'Your swordfish sign is falling in the picture.'},
    {speaker:'Madame Brine',text:'My sign is perfectly—'},
    {speaker:'SFX',text:'The rope snaps. Brine catches the sign with both hands.'},
    {speaker:'Captain Nib',text:'Prophecy.'},
    {speaker:'Madame Brine',text:'Coincidence.'},
    {speaker:'SFX',text:'The second rope snaps.'},
    {speaker:'Madame Brine',text:'Moderate prophecy. Take a sardine. And the glove. It has seen too much.'}
  ], completeEffects:[
    {type:'setFlag',key:'photoShown',value:true},
    {type:'setFlag',key:'brineTalked',value:true},
    {type:'setFlag',key:'sardineTaken',value:true},
    {type:'setFlag',key:'gloveTaken',value:true},
    {type:'grantItems',items:['sardine','rubber-glove']},
    {type:'thought',text:'The gull wants the sardine. The glove looks useful, although I am not yet prepared to explain how.'}
  ]},
  'harbor.departure': { cinematic:true, lines:[
    {speaker:'Captain Nib',text:'The Misty Minnow is prepared.'},
    {speaker:'Mara',text:'To reach the lighthouse?'},
    {speaker:'Captain Nib',text:'Prepared and willing are different maritime conditions.'},
    {speaker:'Madame Brine',text:'If the lighthouse asks your name, lie.'},
    {speaker:'Mara',text:'Why?'},
    {speaker:'Madame Brine',text:'It already knows the truth.'},
    {speaker:'Gus',text:'I object to this umbrella holder.'},
    {speaker:'Captain Nib',text:'All crew members have assigned stations.'},
    {speaker:'Mara',text:'The note says the lighthouse beacon can reveal The Never Was. Let’s hope the key works.'}
  ], completeEffects:[{type:'setFlag',key:'harborComplete',value:true},{type:'sceneChange',sceneId:'03-gannets-end-lighthouse'}] }
};
