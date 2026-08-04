import { assetUrl } from '../../game/assetUrl.js';
const A = 'assets/';

export const harborScene = {
  id:'02-gannets-end-harbor',
  name:'Gannet’s End Harbor',
  world:{width:2196,height:900},
  start:{x:420,y:770},
  camera:{startX:0,deadZoneLeft:.32,deadZoneRight:.67},
  perspective:{nearY:500,farY:850,nearScale:.72,farScale:1.04},
  walkPolygons:[
    [[110,585],[2040,585],[2160,850],[35,850]],
    [[400,515],[1450,515],[1580,650],[330,650]]
  ],
  depthZones:[
    {id:'rear',actorZ:20,polygon:[[70,470],[2110,470],[2050,620],[120,620]]},
    {id:'middle',actorZ:40,polygon:[[60,620],[2130,620],[2140,740],[50,740]]},
    {id:'front',actorZ:60,polygon:[[30,740],[2160,740],[2180,880],[10,880]]}
  ],
  background:assetUrl(`${A}scenes/02-gannets-end-harbor/background.png`),
  layers:[
    {id:'water-animation',kind:'effect',x:0,y:0,w:2196,h:900,z:7,className:'water-shimmer',locked:true},
    {id:'gull-with-hat',asset:assetUrl(`${A}characters/mechanical-gull/with-hat.png`),x:515,y:115,w:170,h:165,z:22,className:'gull-idle',hiddenWhen:'gullLured'},
    {id:'gull-bucket',asset:assetUrl(`${A}characters/mechanical-gull/in-bucket.png`),x:620,y:585,w:130,h:125,z:32,className:'bucket-rattle',visibleWhen:'gullLured',hiddenWhen:'harborComplete'},
    {id:'hat-on-dock',asset:assetUrl(`${A}scenes/02-gannets-end-harbor/props/captains-hat.svg`),x:720,y:640,w:120,h:72,z:34,visibleWhen:'gullLured',hiddenWhen:'hatTaken'},
    {id:'bucket',asset:assetUrl(`${A}scenes/02-gannets-end-harbor/props/bucket.svg`),x:610,y:625,w:135,h:115,z:31,hiddenWhen:'gullLured'},
    {id:'pump-with-funnel',asset:assetUrl(`${A}scenes/02-gannets-end-harbor/props/pump-with-funnel.svg`),x:1020,y:610,w:175,h:150,z:31,hiddenWhen:'funnelTaken'},
    {id:'pump-empty',asset:assetUrl(`${A}scenes/02-gannets-end-harbor/props/pump-empty.svg`),x:1020,y:610,w:175,h:150,z:31,visibleWhen:'funnelTaken'},
    {id:'harbor-occlusion',asset:assetUrl(`${A}scenes/02-gannets-end-harbor/layers/harbor-occlusion.png`),x:0,y:0,w:2196,h:900,z:48},
    {id:'foreground-crates-left',asset:assetUrl(`${A}scenes/02-gannets-end-harbor/layers/foreground-crates-left.png`),x:0,y:600,w:520,h:300,z:70},
    {id:'foreground-nets-right',asset:assetUrl(`${A}scenes/02-gannets-end-harbor/layers/foreground-nets-right.png`),x:1810,y:595,w:386,h:305,z:70},
    {id:'rain',kind:'effect',x:0,y:0,w:2196,h:900,z:75,className:'rain-effect'},
    {id:'fog',kind:'effect',x:0,y:0,w:2196,h:900,z:76,className:'fog-effect'}
  ],
  hotspots:[
    {id:'tavern',label:'The Rusty Kettle',x:0,y:230,w:430,h:430,walk:{x:380,y:700}},
    {id:'lighthouse',label:'abandoned lighthouse',x:670,y:155,w:150,h:300,walk:{x:760,y:610}},
    {id:'gull',label:'mechanical gull',x:485,y:80,w:245,h:230,walk:{x:650,y:650},hiddenWhen:'gullLured'},
    {id:'bucket',label:'empty fish bucket',x:575,y:590,w:220,h:175,walk:{x:680,y:760},hiddenWhen:'gullLured'},
    {id:'hat',label:'ceremonial captain’s hat',x:690,y:610,w:190,h:145,walk:{x:790,y:770},visibleWhen:'gullLured',hiddenWhen:'hatTaken'},
    {id:'pump',label:'broken bilge pump',x:985,y:575,w:260,h:220,walk:{x:1100,y:770}},
    {id:'boat',label:'The Misty Minnow',x:780,y:120,w:590,h:570,walk:{x:1250,y:700}},
    {id:'captain',label:'Captain Nib',x:1160,y:270,w:360,h:510,walk:{x:1125,y:780}},
    {id:'brine',label:'Madame Brine',x:1670,y:270,w:360,h:430,walk:{x:1600,y:770}},
    {id:'fish',label:'luxury sardines',x:1580,y:530,w:570,h:245,walk:{x:1540,y:790}},
    {id:'sign',label:'hanging swordfish sign',x:1630,y:20,w:535,h:300,walk:{x:1720,y:665}}
  ]
};
