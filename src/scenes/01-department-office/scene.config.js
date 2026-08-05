const BASE_URL = import.meta.env?.BASE_URL ?? '/';
const asset = (p) => `${BASE_URL}${String(p).replace(/^\/+/, '')}`;

export const officeScene = {
  id:'01-department-office',
  name:'Department of Lost Causes',
  world:{width:4096,height:1152},
  start:{x:1770,y:1020},
  camera:{startX:420,deadZoneLeft:.35,deadZoneRight:.62},
  perspective:{nearY:690,farY:1095,nearScale:.78,farScale:1.04},
  walkPolygons:[
    [[70,760],[4020,760],[4060,1140],[40,1140]],
    [[820,660],[2990,660],[3160,815],[700,815]]
  ],
  depthZones:[
    {id:'rear',actorZ:20,polygon:[[60,660],[4040,660],[4010,820],[90,820]]},
    {id:'middle',actorZ:40,polygon:[[40,820],[4050,820],[4050,960],[40,960]]},
    {id:'front',actorZ:60,polygon:[[30,960],[4060,960],[4060,1148],[30,1148]]}
  ],
  background:asset('assets/scenes/01-department-office/background-calibration.png'),
  layers:[
    {id:'pindle',asset:asset('assets/characters/pindle/idle.svg'),x:180,y:300,w:560,h:390,z:24,className:'npc-breathe'},
    {id:'terminal',asset:asset('assets/scenes/01-department-office/props/pneumatic-terminal-calibration.png'),x:1380,y:320,w:360,h:470,z:26},
    {id:'fishbowl',asset:asset('assets/scenes/01-department-office/props/fishbowl-calibration.png'),x:2520,y:540,w:420,h:420,z:34},
    {id:'handle-in-bowl',asset:asset('assets/scenes/01-department-office/props/handle-in-bowl-calibration.png'),x:2668,y:675,w:118,h:118,z:35,hiddenWhen:'handleTaken'},
    {id:'lost-shelf',asset:asset('assets/scenes/01-department-office/props/lost-shelf-calibration.png'),x:3150,y:350,w:820,h:690,z:30},
    {id:'gus-on-rack',asset:asset('assets/characters/gus/hanging.svg'),x:3730,y:560,w:82,h:212,z:31,hiddenWhen:'packageOpened',className:'umbrella-sway'},
    {id:'alarm-broken',asset:asset('assets/scenes/01-department-office/props/alarm-broken-calibration.png'),x:2805,y:265,w:160,h:215,z:18,hiddenWhen:'alarmRepaired'},
    {id:'alarm-repaired',asset:asset('assets/scenes/01-department-office/props/alarm-repaired.svg'),x:2840,y:280,w:92,h:140,z:18,visibleWhen:'alarmRepaired'}
  ],
  hotspots:[
    {id:'pindle',label:'Mr. Pindle',x:140,y:280,w:620,h:410,walk:{x:900,y:910}},
    {id:'terminal',label:'pneumatic delivery terminal',x:1360,y:300,w:390,h:500,walk:{x:1560,y:910}},
    {id:'poster',label:'emergency continuity procedure',x:1465,y:132,w:230,h:190,walk:{x:1640,y:780}},
    {id:'clock',label:'official municipal clock',x:2035,y:52,w:370,h:235,walk:{x:2250,y:810}},
    {id:'alarm',label:'fire alarm',x:2790,y:245,w:195,h:245,walk:{x:2870,y:900}},
    {id:'rulers',label:'matched ruler pair',x:90,y:905,w:420,h:110,walk:{x:710,y:995},hiddenWhen:'rulersTaken'},
    {id:'fishbowl',label:'Mr. Ledger’s fishbowl',x:2495,y:525,w:450,h:450,walk:{x:2680,y:1000}},
    {id:'shelf',label:'lost-property shelf',x:3140,y:340,w:830,h:690,walk:{x:3340,y:1000}},
    {id:'gus',label:'judgmental umbrella',x:3720,y:540,w:120,h:260,walk:{x:3550,y:1000},visibleWhen:'packageOpened'},
    {id:'map-exit',label:'route to Gannet’s End Harbor',x:2920,y:70,w:560,h:420,walk:{x:3180,y:900},visibleWhen:'officeComplete'},
    {id:'forms',label:'complaint form stack',x:40,y:800,w:360,h:200,walk:{x:630,y:1000}},
    {id:'desk',label:'Mara’s desk',x:30,y:765,w:780,h:270,walk:{x:900,y:1005}}
  ]
};
