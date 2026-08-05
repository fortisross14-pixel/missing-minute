const BASE_URL = import.meta.env?.BASE_URL ?? '/';
const asset = (p) => `${BASE_URL}${String(p).replace(/^\/+/, '')}`;

export const officeScene = {
  id:'01-department-office',
  name:'Department of Lost Causes',
  world:{width:4096,height:1152},
  start:{x:1700,y:1020},
  camera:{startX:420,deadZoneLeft:.35,deadZoneRight:.62},
  perspective:{nearY:700,farY:1095,nearScale:.82,farScale:1.08},
  walkPolygons:[
    [[70,760],[4020,760],[4060,1140],[40,1140]],
    [[780,660],[3020,660],[3170,820],[700,820]]
  ],
  depthZones:[
    {id:'rear',actorZ:20,polygon:[[60,660],[4040,660],[4010,820],[90,820]]},
    {id:'middle',actorZ:40,polygon:[[40,820],[4050,820],[4050,970],[40,970]]},
    {id:'front',actorZ:60,polygon:[[30,970],[4060,970],[4060,1148],[30,1148]]}
  ],
  background:asset('assets/scenes/01-department-office/background-cleanwide.png'),
  layers:[
    {id:'clock-normal',asset:asset('assets/scenes/01-department-office/props/clock-normal.svg'),x:2050,y:58,w:270,h:270,z:10,hiddenWhen:'drillTriggered'},
    {id:'clock-tomorrow',asset:asset('assets/scenes/01-department-office/props/clock-tomorrow.svg'),x:2050,y:58,w:270,h:270,z:10,visibleWhen:'drillTriggered'},
    {id:'calendar-today',asset:asset('assets/scenes/01-department-office/props/calendar-today.svg'),x:3050,y:120,w:150,h:190,z:10,hiddenWhen:'drillTriggered'},
    {id:'calendar-tomorrow',asset:asset('assets/scenes/01-department-office/props/calendar-tomorrow.svg'),x:3050,y:120,w:150,h:190,z:10,visibleWhen:'drillTriggered'},
    {id:'pindle',asset:asset('assets/characters/pindle/idle.svg'),x:55,y:420,w:520,h:320,z:24,className:'npc-breathe'},
    {id:'terminal',asset:asset('assets/scenes/01-department-office/props/pneumatic-terminal-clean.png'),x:1040,y:335,w:300,h:455,z:26},
    {id:'fishbowl',asset:asset('assets/scenes/01-department-office/props/fishbowl-pedestal-clean.png'),x:2470,y:505,w:430,h:540,z:34},
    {id:'lost-shelf',asset:asset('assets/scenes/01-department-office/props/lost-property-shelf-clean.png'),x:3290,y:308,w:690,h:860,z:30},
    {id:'alarm-broken',asset:asset('assets/scenes/01-department-office/props/alarm-broken-clean.png'),x:2875,y:210,w:145,h:220,z:18,hiddenWhen:'alarmRepaired'},
    {id:'alarm-repaired',asset:asset('assets/scenes/01-department-office/props/alarm-repaired.svg'),x:2890,y:220,w:110,h:165,z:18,visibleWhen:'alarmRepaired'}
  ],
  hotspots:[
    {id:'pindle',label:'Mr. Pindle',x:40,y:350,w:620,h:390,walk:{x:760,y:920}},
    {id:'terminal',label:'pneumatic delivery terminal',x:1020,y:325,w:330,h:470,walk:{x:1220,y:920}},
    {id:'poster',label:'emergency continuity procedure',x:1110,y:140,w:220,h:180,walk:{x:1240,y:795}},
    {id:'clock',label:'official municipal clock',x:2030,y:55,w:290,h:275,walk:{x:2190,y:840}},
    {id:'alarm',label:'fire alarm',x:2865,y:200,w:165,h:235,walk:{x:2900,y:920}},
    {id:'rulers',label:'matched ruler pair',x:70,y:905,w:430,h:120,walk:{x:690,y:1000},hiddenWhen:'rulersTaken'},
    {id:'fishbowl',label:'Mr. Ledger’s fishbowl',x:2480,y:505,w:420,h:545,walk:{x:2670,y:1005}},
    {id:'shelf',label:'lost-property shelf',x:3290,y:300,w:700,h:865,walk:{x:3480,y:1005}},
    {id:'map-exit',label:'route to Gannet’s End Harbor',x:3020,y:50,w:640,h:460,walk:{x:3170,y:915},visibleWhen:'officeComplete'},
    {id:'forms',label:'complaint form stack',x:35,y:795,w:360,h:215,walk:{x:610,y:1000}},
    {id:'desk',label:'Mara’s desk',x:25,y:770,w:760,h:280,walk:{x:860,y:1005}}
  ]
};
