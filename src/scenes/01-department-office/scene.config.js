import { assetUrl } from '../../game/assetUrl.js';
const A = 'assets/';

export const officeScene = {
  id:'01-department-office',
  name:'Department of Lost Causes',
  world:{width:4096,height:1152},
  start:{x:1740,y:1005},
  camera:{startX:0,deadZoneLeft:.38,deadZoneRight:.62},
  perspective:{nearY:760,farY:1090,nearScale:.72,farScale:1.02},
  walkPolygons:[
    [[60,760],[4036,760],[4070,1140],[30,1140]],
    [[830,650],[2980,650],[3160,820],[700,820]]
  ],
  depthZones:[
    {id:'rear',actorZ:18,polygon:[[60,650],[4030,650],[3990,810],[90,810]]},
    {id:'middle',actorZ:36,polygon:[[40,810],[4040,810],[4040,960],[40,960]]},
    {id:'front',actorZ:58,polygon:[[20,960],[4060,960],[4060,1148],[20,1148]]}
  ],
  background:assetUrl(`${A}scenes/01-department-office/background.png`),
  layers:[
    {id:'pindle',asset:assetUrl(`${A}characters/pindle/idle.png`),x:200,y:250,w:920,h:520,z:20,className:'npc-breathe'},
    {id:'terminal',asset:assetUrl(`${A}scenes/01-department-office/props/pneumatic-terminal-clean.png`),x:1380,y:255,w:360,h:500,z:22},
    {id:'fishbowl',asset:assetUrl(`${A}scenes/01-department-office/props/fishbowl.png`),x:2490,y:500,w:500,h:500,z:34},
    {id:'handle-in-bowl',asset:assetUrl(`${A}scenes/01-department-office/props/handle-in-bowl.png`),x:2645,y:645,w:150,h:150,z:35,hiddenWhen:'handleTaken'},
    {id:'lost-shelf',asset:assetUrl(`${A}scenes/01-department-office/props/lost-property-shelf.png`),x:3110,y:390,w:780,h:620,z:28},
    {id:'gus-on-rack',asset:assetUrl(`${A}characters/gus/hanging-painterly.svg`),x:3610,y:530,w:92,h:225,z:31,hiddenWhen:'packageOpened',className:'umbrella-sway'},
    {id:'alarm-broken',asset:assetUrl(`${A}scenes/01-department-office/props/alarm-broken-clean.png`),x:2790,y:245,w:210,h:300,z:16,hiddenWhen:'alarmRepaired'},
    {id:'alarm-repaired',asset:assetUrl(`${A}scenes/01-department-office/props/alarm-repaired-painterly.svg`),x:2835,y:260,w:122,h:182,z:16,visibleWhen:'alarmRepaired'},
    {id:'emergency-flash',kind:'effect',x:0,y:0,w:4096,h:1152,z:75,className:'emergency-flash',visibleWhen:'drillTriggered'}
  ],
  hotspots:[
    {id:'pindle',label:'Mr. Pindle',x:120,y:230,w:930,h:430,walk:{x:980,y:890}},
    {id:'terminal',label:'pneumatic delivery terminal',x:1360,y:240,w:390,h:450,walk:{x:1560,y:860}},
    {id:'poster',label:'emergency continuity procedure',x:1480,y:110,w:210,h:220,walk:{x:1660,y:760}},
    {id:'clock',label:'official municipal clock',x:2020,y:15,w:460,h:255,walk:{x:2270,y:780}},
    {id:'alarm',label:'fire alarm',x:2790,y:240,w:220,h:295,walk:{x:2860,y:840}},
    {id:'handle',label:'missing fire-alarm handle',x:2640,y:635,w:160,h:150,walk:{x:2730,y:940},hiddenWhen:'handleTaken'},
    {id:'fishbowl',label:'Mr. Ledger’s fishbowl',x:2475,y:500,w:520,h:500,walk:{x:2660,y:965}},
    {id:'shelf',label:'lost-property shelf',x:3110,y:385,w:800,h:620,walk:{x:3320,y:970}},
    {id:'gus',label:'judgmental umbrella',x:3590,y:500,w:145,h:290,walk:{x:3490,y:970},visibleWhen:'packageOpened'},
    {id:'map-exit',label:'route to Gannet’s End Harbor',x:3010,y:55,w:540,h:455,walk:{x:3200,y:845},visibleWhen:'officeComplete'},
    {id:'rulers',label:'matched ruler pair',x:150,y:875,w:360,h:105,walk:{x:620,y:980},hiddenWhen:'rulersTaken'},
    {id:'forms',label:'complaint form stack',x:110,y:780,w:440,h:235,walk:{x:740,y:995}},
    {id:'desk',label:'Mara’s desk',x:30,y:730,w:830,h:320,walk:{x:850,y:1000}}
  ]
};
