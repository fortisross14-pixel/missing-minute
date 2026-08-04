export const officeDialogues = {
  'office.opening': {
    cinematic: true,
    lines: [
      { speaker:'Narration', text:'Rain taps the windows of the Department of Lost Causes, where objects no one can sensibly return are given forms no one can sensibly complete.' },
      { speaker:'Mara', text:'Received. Misplaced. And filed under “probably important.” Productive evening.' },
      { speaker:'SFX', text:'The pneumatic delivery terminal rattles, groans, and produces one violent THUNK.' },
      { speaker:'Mara', text:'That’s new.' },
      { speaker:'Mr. Pindle', text:'It isn’t. We had a letter from next Wednesday in March.' },
      { speaker:'Mara', text:'What happened?' },
      { speaker:'Mr. Pindle', text:'We filed it in April.' },
      { speaker:'Mara', text:'The parcel is addressed to me.' },
      { speaker:'Mr. Pindle', text:'My condolences.' }
    ],
    completeEffects:[{type:'setFlag', key:'introSeen', value:true},{type:'thought', text:'The parcel is here, the machine refuses to release it, and Mr. Pindle intends to help from a safe administrative distance.'}]
  },
  'office.pindle': {
    lines:[
      {speaker:'Mara',text:'Mr. Pindle?'},
      {speaker:'Mr. Pindle',text:'I’m extremely busy.'},
      {speaker:'Mara',text:'You are holding a blank sheet of paper upside down.'},
      {speaker:'Mr. Pindle',text:'Confidentially.'}
    ],
    choices:[
      {label:'What is wrong with the parcel?', next:'office.pindle.parcel'},
      {label:'Can you release it?', next:'office.pindle.override'},
      {label:'Why is it dated tomorrow?', next:'office.pindle.tomorrow'},
      {label:'What am I supposed to do?', next:'office.pindle.advice'},
      {label:'What exactly does this department do?', next:'office.pindle.department'},
      {label:'I’ll figure it out.', close:true, effects:[{type:'setFlag',key:'pindleTalked',value:true}]}
    ]
  },
  'office.pindle.parcel': {
    lines:[
      {speaker:'Mara',text:'Why won’t the machine release it?'},
      {speaker:'Mr. Pindle',text:'The terminal believes the parcel has not yet been mailed.'},
      {speaker:'Mara',text:'But it has arrived.'},
      {speaker:'Mr. Pindle',text:'Physically. Administratively, it remains in the future.'},
      {speaker:'Mara',text:'So it is here, but we are not allowed to acknowledge that it is here.'},
      {speaker:'Mr. Pindle',text:'Now you understand government work.'}
    ],
    completeEffects:[{type:'setFlag',key:'pindleTalked',value:true},{type:'thought',text:'The hatch will not open until the office believes the parcel’s delivery date has arrived.'}],
    returnTo:'office.pindle'
  },
  'office.pindle.override': {
    lines:[
      {speaker:'Mara',text:'Can you override the terminal?'},
      {speaker:'Mr. Pindle',text:'Certainly.'},
      {speaker:'Mara',text:'Will you?'},
      {speaker:'Mr. Pindle',text:'Certainly not.'},
      {speaker:'Mara',text:'Why?'},
      {speaker:'Mr. Pindle',text:'Overrides require authorization.'},
      {speaker:'Mara',text:'From whom?'},
      {speaker:'Mr. Pindle',text:'Me.'}
    ], returnTo:'office.pindle'
  },
  'office.pindle.tomorrow': {
    lines:[
      {speaker:'Mara',text:'How can someone send a package from tomorrow?'},
      {speaker:'Mr. Pindle',text:'Priority delivery.'},
      {speaker:'Mara',text:'That is not an answer.'},
      {speaker:'Mr. Pindle',text:'Then it is suitable for filing.'},
      {speaker:'Mara',text:'Does this happen often?'},
      {speaker:'Mr. Pindle',text:'No. Usually the future has the decency to wait.'}
    ], returnTo:'office.pindle'
  },
  'office.pindle.advice': {
    lines:[
      {speaker:'Mara',text:'What am I supposed to do?'},
      {speaker:'Mr. Pindle',text:'The terminal checks the official municipal date.'},
      {speaker:'Mara',text:'The clock?'},
      {speaker:'Mr. Pindle',text:'Among other things.'},
      {speaker:'Mara',text:'Can I change it?'},
      {speaker:'Mr. Pindle',text:'Not during ordinary operations. Consult the emergency continuity procedure.'},
      {speaker:'Mara',text:'Where is that?'},
      {speaker:'Mr. Pindle',text:'Displayed prominently.'}
    ],
    completeEffects:[{type:'setFlag',key:'pindleTalked',value:true},{type:'thought',text:'The terminal follows the official clock. The emergency poster may explain how to advance it.'}],
    returnTo:'office.pindle'
  },
  'office.pindle.department': {
    lines:[
      {speaker:'Mara',text:'For the record, what is our official function?'},
      {speaker:'Mr. Pindle',text:'We receive items that cannot sensibly be returned.'},
      {speaker:'Mara',text:'Such as?'},
      {speaker:'Mr. Pindle',text:'Unsigned apologies. Abandoned ambitions. Matching socks separated under suspicious circumstances.'},
      {speaker:'Mara',text:'And umbrellas.'},
      {speaker:'Mr. Pindle',text:'Umbrellas are the backbone of municipal regret.'}
    ], returnTo:'office.pindle'
  },
  'office.package': {
    cinematic:true,
    lines:[
      {speaker:'Mara',text:'The string is untying itself. That saves time and raises concerns.'},
      {speaker:'Mara',text:'A watch stopped at 4:17. A lighthouse key. A cruise card issued to “Mara Quint.”'},
      {speaker:'Mara',text:'And a photograph of Director Vellum aboard a ship called The Never Was.'},
      {speaker:'Mara',text:'The note is in my handwriting.'},
      {speaker:'Future Mara',text:'Vellum is taking the last shipment aboard The Never Was tonight. Go to Gannet’s End Harbor. Find Captain Nib. Use the lighthouse key. Do not let Vellum start the Clock at 4:17 tomorrow. Trust the other me.'},
      {speaker:'Mara',text:'I dislike receiving instructions from myself.'},
      {speaker:'Mr. Pindle',text:'It creates a difficult chain of command.'},
      {speaker:'Gus',text:'I warned them yesterday.'},
      {speaker:'Mara',text:'You talk?'},
      {speaker:'Gus',text:'Only when the situation becomes meteorologically irresponsible.'}
    ],
    completeEffects:[
      {type:'setFlag',key:'packageOpened',value:true},
      {type:'setFlag',key:'officeComplete',value:true},
      {type:'grantItems',items:['postcard','watch','lighthouse-key','passenger-card','vellum-photo','gus'],popupType:'YOU DISCOVERED'},
      {type:'thought',text:'The note points to Captain Nib at Gannet’s End Harbor. He can take me to the lighthouse, where I can reveal The Never Was.'}
    ]
  },
  'office.gus': {
    lines:[
      {speaker:'Mara',text:'Who are you?'},
      {speaker:'Gus',text:'Gustav Umbriel Stormworthy the Third.'},
      {speaker:'Mara',text:'Your tag says “Gus.”'},
      {speaker:'Gus',text:'The Department lacks respect for lineage.'}
    ],
    choices:[
      {label:'How can you talk?',next:'office.gus.talk'},
      {label:'What do you know about the lighthouse?',next:'office.gus.lighthouse'},
      {label:'Can you predict what happens next?',next:'office.gus.future'},
      {label:'Let’s go.',close:true}
    ]
  },
  'office.gus.talk': { lines:[
    {speaker:'Mara',text:'Umbrellas do not normally speak.'},
    {speaker:'Gus',text:'People do not normally receive their own mail from tomorrow. Let us both remain open-minded.'}
  ], returnTo:'office.gus' },
  'office.gus.lighthouse': { lines:[
    {speaker:'Gus',text:'It has been abandoned for twenty years.'},
    {speaker:'Mara',text:'Then why did the note send us there?'},
    {speaker:'Gus',text:'I was hoping you would avoid the sensible question.'}
  ], returnTo:'office.gus' },
  'office.gus.future': { lines:[
    {speaker:'Gus',text:'Certainly. You ask an umbrella to predict the future.'},
    {speaker:'Mara',text:'And after that?'},
    {speaker:'Gus',text:'My specialty ends.'}
  ], returnTo:'office.gus' }
};
