import { assetUrl } from '../../game/assetUrl.js';
const A = 'assets/';

export const officeScene = {
  id:'01-department-office',
  name:'Department of Lost Causes',
  world:{width:2048,height:1152},
  start:{x:1030,y:965},
  camera:{startX:0,deadZoneLeft:.34,deadZoneRight:.66},
  perspective:{nearY:650,farY:1080,nearScale:.72,farScale:1.04},
  walkPolygons:[
    [[80,700],[1970,700],[2030,1090],[30,1090]],
    [[520,600],[1310,600],[1420,760],[430,760]]
  ],
  depthZones:[
    {id:'rear',actorZ:20,polygon:[[30,610],[2020,610],[1980,790],[70,790]]},
    {id:'middle',actorZ:40,polygon:[[40,790],[2010,790],[2020,930],[30,930]]},
    {id:'front',actorZ:60,polygon:[[20,930],[2030,930],[2040,1135],[10,1135]]}
  ],
  background:assetUrl(`${A}scenes/01-department-office/background.png`),
  layers:[
    {id:'window-rain',kind:'effect',x:0,y:0,w:2048,h:1152,z:7,className:'office-window-rain',locked:true},
    {id:'pindle',asset:assetUrl(`${A}characters/pindle/idle.png`),x:150,y:260,w:390,h:315,z:23,className:'npc-breathe'},
    {id:'terminal',asset:assetUrl(`${A}scenes/01-department-office/props/terminal-painterly.svg`),x:535,y:345,w:295,h:345,z:24},
    {id:'parcel-inside',asset:assetUrl(`${A}scenes/01-department-office/props/parcel-painterly.svg`),x:600,y:500,w:132,h:90,z:26,hiddenWhen:'packageOpened',className:'parcel-rattle'},
    {id:'desk-painterly',asset:assetUrl(`${A}scenes/01-department-office/layers/desk-painterly.png`),x:-30,y:585,w:760,h:525,z:28},
    {id:'ruler-tray-full',asset:assetUrl(`${A}scenes/01-department-office/props/ruler-tray-full.svg`),x:385,y:755,w:210,h:82,z:31,hiddenWhen:'rulersTaken'},
    {id:'ruler-tray-empty',asset:assetUrl(`${A}scenes/01-department-office/props/ruler-tray-empty.svg`),x:385,y:755,w:210,h:82,z:31,visibleWhen:'rulersTaken'},
    {id:'fishbowl-painterly',asset:assetUrl(`${A}scenes/01-department-office/layers/fishbowl-painterly.png`),x:1290,y:535,w:380,h:420,z:32},
    {id:'ledger-fish',asset:assetUrl(`${A}scenes/01-department-office/props/mr-ledger.svg`),x:1430,y:585,w:90,h:65,z:33,className:'fish-swim'},
    {id:'handle-in-bowl',asset:assetUrl(`${A}scenes/01-department-office/props/handle-painterly.svg`),x:1450,y:665,w:72,h:58,z:34,hiddenWhen:'handleTaken'},
    {id:'lost-shelf-painterly',asset:assetUrl(`${A}scenes/01-department-office/layers/lost-shelf-painterly.png`),x:1605,y:455,w:420,h:420,z:26},
    {id:'gus-on-rack',asset:assetUrl(`${A}characters/gus/hanging-painterly.svg`),x:1715,y:530,w:92,h:225,z:31,hiddenWhen:'packageOpened',className:'umbrella-sway'},
    {id:'alarm-broken',asset:assetUrl(`${A}scenes/01-department-office/props/alarm-broken-painterly.svg`),x:1455,y:345,w:100,h:145,z:12,hiddenWhen:'alarmRepaired'},
    {id:'alarm-repaired',asset:assetUrl(`${A}scenes/01-department-office/props/alarm-repaired-painterly.svg`),x:1455,y:345,w:100,h:145,z:12,visibleWhen:'alarmRepaired'},
    {id:'pindle-counter-occlusion',asset:assetUrl(`${A}scenes/01-department-office/layers/pindle-counter-occlusion.png`),x:0,y:0,w:2048,h:1152,z:35},
    {id:'desk-front-mask',asset:assetUrl(`${A}scenes/01-department-office/layers/desk-front-mask.png`),x:-30,y:585,w:760,h:525,z:48},
    {id:'fishbowl-front-mask',asset:assetUrl(`${A}scenes/01-department-office/layers/fishbowl-front-mask.png`),x:1290,y:535,w:380,h:420,z:49},
    {id:'lost-shelf-front-mask',asset:assetUrl(`${A}scenes/01-department-office/layers/lost-shelf-front-mask.png`),x:1605,y:455,w:420,h:420,z:50},
    {id:'emergency-flash',kind:'effect',x:0,y:0,w:2048,h:1152,z:75,className:'emergency-flash',visibleWhen:'drillTriggered'}
  ],
  hotspots:[
    {id:'pindle',label:'Mr. Pindle',x:120,y:235,w:470,h:390,walk:{x:620,y:850}},
    {id:'terminal',label:'pneumatic delivery terminal',x:505,y:320,w:350,h:400,walk:{x:760,y:870}},
    {id:'poster',label:'emergency continuity procedure',x:875,y:180,w:175,h:260,walk:{x:980,y:760}},
    {id:'clock',label:'official municipal clock',x:1240,y:10,w:300,h:295,walk:{x:1300,y:760}},
    {id:'alarm',label:'fire alarm',x:1425,y:315,w:155,h:205,walk:{x:1480,y:790}},
    {id:'rulers',label:'matched ruler pair',x:350,y:720,w:285,h:145,walk:{x:620,y:940},hiddenWhen:'rulersTaken'},
    {id:'handle',label:'missing fire-alarm handle',x:1415,y:625,w:150,h:125,walk:{x:1455,y:900},hiddenWhen:'handleTaken'},
    {id:'fishbowl',label:'Mr. Ledger’s fishbowl',x:1260,y:505,w:430,h:470,walk:{x:1410,y:930}},
    {id:'shelf',label:'lost-property shelf',x:1580,y:420,w:455,h:480,walk:{x:1640,y:925}},
    {id:'gus',label:'judgmental umbrella',x:1680,y:505,w:150,h:285,walk:{x:1660,y:925},visibleWhen:'packageOpened'},
    {id:'map-exit',label:'route to Gannet’s End Harbor',x:1765,y:0,w:280,h:390,walk:{x:1780,y:790},visibleWhen:'officeComplete'},
    {id:'forms',label:'complaint form stack',x:0,y:690,w:360,h:250,walk:{x:380,y:965}},
    {id:'desk',label:'Mara’s desk',x:0,y:570,w:760,h:550,walk:{x:730,y:965}}
  ]
};
