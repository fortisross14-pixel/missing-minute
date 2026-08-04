export const harborScene = {
  id:'02-gannets-end-harbor',
  name:'Gannet’s End Harbor',
  world:{width:2900,height:900},
  start:{x:240,y:735},
  camera:{startX:0,deadZoneLeft:.32,deadZoneRight:.64},
  perspective:{nearY:455,farY:825,nearScale:.7,farScale:1.04},
  walkPolygons:[
    [[100,610],[2750,610],[2860,830],[40,830]],
    [[420,530],[1900,530],[2050,655],[340,655]]
  ],
  depthZones:[
    {id:'rear',actorZ:20,polygon:[[60,480],[2820,480],[2750,625],[120,625]]},
    {id:'middle',actorZ:40,polygon:[[70,625],[2820,625],[2820,730],[70,730]]},
    {id:'front',actorZ:60,polygon:[[30,730],[2870,730],[2890,860],[10,860]]}
  ],
  background:'/assets/scenes/02-gannets-end-harbor/background.svg',
  layers:[
    {id:'rear-harbor-details',asset:'/assets/scenes/02-gannets-end-harbor/layers/rear-harbor-details.svg',x:0,y:0,w:2900,h:900,z:5,locked:true},
    {id:'water-animation',kind:'effect',x:0,y:0,w:2900,h:900,z:7,className:'water-shimmer',locked:true},
    {id:'boat-back',asset:'/assets/scenes/02-gannets-end-harbor/layers/boat-back.svg',x:1480,y:320,w:760,h:430,z:17,className:'boat-rock'},
    {id:'gull-with-hat',asset:'/assets/characters/mechanical-gull/with-hat.svg',x:1120,y:230,w:210,h:190,z:22,className:'gull-idle',hiddenWhen:'gullLured'},
    {id:'gull-bucket',asset:'/assets/characters/mechanical-gull/in-bucket.svg',x:1135,y:610,w:170,h:150,z:32,className:'bucket-rattle',visibleWhen:'gullLured',hiddenWhen:'harborComplete'},
    {id:'hat-on-dock',asset:'/assets/scenes/02-gannets-end-harbor/props/captains-hat.svg',x:1250,y:650,w:150,h:90,z:34,visibleWhen:'gullLured',hiddenWhen:'hatTaken'},
    {id:'captain-nib',asset:'/assets/characters/nib/idle.svg',x:1910,y:360,w:250,h:390,z:26,className:'npc-breathe'},
    {id:'fish-stall-back',asset:'/assets/scenes/02-gannets-end-harbor/layers/fish-stall-back.svg',x:2270,y:285,w:570,h:490,z:19},
    {id:'madame-brine',asset:'/assets/characters/brine/idle.svg',x:2430,y:370,w:245,h:370,z:27,className:'npc-breathe'},
    {id:'swordfish-sign-normal',asset:'/assets/scenes/02-gannets-end-harbor/props/swordfish-sign.svg',x:2310,y:220,w:380,h:170,z:23,hiddenWhen:'photoShown'},
    {id:'swordfish-sign-caught',asset:'/assets/scenes/02-gannets-end-harbor/props/swordfish-sign-caught.svg',x:2370,y:410,w:350,h:210,z:28,visibleWhen:'photoShown'},
    {id:'bucket',asset:'/assets/scenes/02-gannets-end-harbor/props/bucket.svg',x:1135,y:640,w:150,h:130,z:31,hiddenWhen:'gullLured'},
    {id:'pump-with-funnel',asset:'/assets/scenes/02-gannets-end-harbor/props/pump-with-funnel.svg',x:1670,y:600,w:210,h:180,z:31,hiddenWhen:'funnelTaken'},
    {id:'pump-empty',asset:'/assets/scenes/02-gannets-end-harbor/props/pump-empty.svg',x:1670,y:600,w:210,h:180,z:31,visibleWhen:'funnelTaken'},
    {id:'fish-stall-counter',asset:'/assets/scenes/02-gannets-end-harbor/layers/fish-stall-counter.svg',x:2250,y:590,w:620,h:250,z:43},
    {id:'boat-front',asset:'/assets/scenes/02-gannets-end-harbor/layers/boat-front.svg',x:1480,y:320,w:760,h:430,z:45,className:'boat-rock'},
    {id:'dock-posts',asset:'/assets/scenes/02-gannets-end-harbor/layers/dock-posts.svg',x:850,y:520,w:620,h:310,z:48},
    {id:'foreground-crates-left',asset:'/assets/scenes/02-gannets-end-harbor/layers/foreground-crates-left.svg',x:0,y:650,w:650,h:250,z:70},
    {id:'foreground-nets-right',asset:'/assets/scenes/02-gannets-end-harbor/layers/foreground-nets-right.svg',x:2460,y:630,w:440,h:270,z:70},
    {id:'rain',kind:'effect',x:0,y:0,w:2900,h:900,z:75,className:'rain-effect'},
    {id:'fog',kind:'effect',x:0,y:0,w:2900,h:900,z:76,className:'fog-effect'}
  ],
  hotspots:[
    {id:'tavern',label:'The Rusty Kettle',x:40,y:260,w:520,h:430,walk:{x:440,y:690}},
    {id:'lighthouse',label:'abandoned lighthouse',x:760,y:110,w:160,h:350,walk:{x:780,y:610}},
    {id:'gull',label:'mechanical gull',x:1080,y:190,w:280,h:270,walk:{x:1220,y:650},hiddenWhen:'gullLured'},
    {id:'bucket',label:'empty fish bucket',x:1090,y:610,w:230,h:190,walk:{x:1200,y:735},hiddenWhen:'gullLured'},
    {id:'hat',label:'ceremonial captain’s hat',x:1210,y:620,w:230,h:160,walk:{x:1320,y:740},visibleWhen:'gullLured',hiddenWhen:'hatTaken'},
    {id:'pump',label:'broken bilge pump',x:1630,y:570,w:280,h:240,walk:{x:1750,y:735}},
    {id:'boat',label:'The Misty Minnow',x:1450,y:300,w:820,h:500,walk:{x:2050,y:690}},
    {id:'captain',label:'Captain Nib',x:1870,y:330,w:330,h:450,walk:{x:1840,y:735}},
    {id:'brine',label:'Madame Brine',x:2380,y:335,w:330,h:430,walk:{x:2300,y:740}},
    {id:'fish',label:'luxury sardines',x:2300,y:630,w:500,h:170,walk:{x:2290,y:750}},
    {id:'sign',label:'hanging swordfish sign',x:2260,y:190,w:500,h:260,walk:{x:2380,y:640}}
  ]
};
