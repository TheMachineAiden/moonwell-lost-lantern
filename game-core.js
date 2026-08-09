(()=>{
const TILE_SIZE=16;
const WORLD_WIDTH=TILE_SIZE*20;
const WORLD_HEIGHT=TILE_SIZE*13;
const RENDER_SCALE=2;
const RENDER_WIDTH=WORLD_WIDTH*RENDER_SCALE;
const RENDER_HEIGHT=WORLD_HEIGHT*RENDER_SCALE;
const VISUAL_FOOTPRINTS=Object.freeze({
  keeper:Object.freeze({logical:Object.freeze({colliderWidth:10,colliderHeight:10,solid:true}),visual:Object.freeze({width:14,height:18,anchorOffsetX:-7,anchorOffsetY:-17})}),
  tree:Object.freeze({logical:Object.freeze({cellsWide:1,cellsHigh:1,solid:true,colliderWidth:20,colliderHeight:12,colliderOffsetX:-2,colliderOffsetY:4}),visual:Object.freeze({perimeterWidth:40,perimeterHeight:56,interiorWidth:24,interiorHeight:40,overhangTop:40,overhangBottom:0})}),
  exitTree:Object.freeze({logical:Object.freeze({cellsWide:1,cellsHigh:1,solidUntil:'open'}),visual:Object.freeze({width:64,height:72,overhangLeft:24,overhangRight:24,overhangTop:56,overhangBottom:0})}),
  rootPlatform:Object.freeze({logical:Object.freeze({cellsWide:2,cellsHigh:1,solid:true,colliderWidth:40,colliderHeight:14,colliderOffsetX:-4,colliderOffsetY:2}),visual:Object.freeze({width:48,height:24,overhangLeft:4,overhangRight:4,overhangTop:8,overhangBottom:0})}),
  starrootChime:Object.freeze({logical:Object.freeze({cellsWide:1,cellsHigh:1,solid:false,interactionRadius:15}),visual:Object.freeze({width:24,height:24,anchorOffsetX:-12,anchorOffsetY:-16})}),
  moonwellAltar:Object.freeze({logical:Object.freeze({cellsWide:2,cellsHigh:2,solid:true,colliderWidth:28,colliderHeight:8,colliderOffsetX:-14,colliderOffsetY:-8,interactionRadius:22}),visual:Object.freeze({width:32,height:24,anchorOffsetX:-16,anchorOffsetY:-24})}),
  glowmoss:Object.freeze({logical:Object.freeze({solid:false,collectible:false}),visual:Object.freeze({width:16,height:16})}),
  eir:Object.freeze({logical:Object.freeze({cellsWide:1,cellsHigh:1,solid:false,interactionRadius:22}),visual:Object.freeze({width:16,height:24,anchorOffsetX:-8,anchorOffsetY:-22})}),
  loamPatch:Object.freeze({logical:Object.freeze({solid:false}),visual:Object.freeze({width:80,height:48})}),
  moonlightPool:Object.freeze({logical:Object.freeze({solid:false}),visual:Object.freeze({width:112,height:66})}),
  canopyCurtain:Object.freeze({logical:Object.freeze({cellsWide:20,cellsHigh:1,rootRow:2,solid:true,colliderWidth:20,colliderHeight:12,colliderOffsetX:-2,colliderOffsetY:4}),visual:Object.freeze({width:128,height:56,clusters:3,rootContactY:48})})
});
const MAP=['....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................'];
const TOTAL_FIREFLIES=8;
// Each placed collectible selects one retained four-frame firefly strip. The
// mapping is visual-only: pickup locations, timing, visibility, and counts
// remain owned by the existing area light records.
const FIREFLY_VARIANTS=Object.freeze([[0,1,2],[3,4],[5],[6,7]].map(row=>Object.freeze(row)));
const HOLLOW_ECHO_RADIUS=15;
const MEMORY_REVEAL_TIMING=Object.freeze({hold:3.25,fade:.75});
// The reveal stays inside the 320 × 208 game canvas: the upper band is used
// while the keeper is low, and the lower band is used while the keeper is high.
const MEMORY_REVEAL_LAYOUT=Object.freeze({x:24,w:272,h:64,topY:12,bottomY:132,keeperSplitY:104,maxLineChars:42,maxLines:3});
const MEMORY_DIALOGUE_TYPOGRAPHY=Object.freeze({bodyPx:13,titlePx:14,lineHeight:1.45});
const WATCHER_DIALOGUE=Object.freeze({
  name:'Eir, Rootwatcher',
  intro:'The bridge roots wake for a keeper who can listen. Three little riddles, Luna—shall we make the crossing remember?',
  solved:'Moon, echo, lantern—three bright answers. The roots remember their shape, and the bridge grows from shore to shore.',
  riddles:Object.freeze([
    Object.freeze({question:'I glow after sunset and change my round face. What am I?',choices:Object.freeze(['The moon','A mushroom']),answer:0,correct:'The moon! It shows the forest where night begins.',wrong:'Mushrooms like moonlight, but their faces do not wax and wane. Try once more.'}),
    Object.freeze({question:'I have no mouth, but I answer when you call. What am I?',choices:Object.freeze(['An echo','A root']),answer:0,correct:'An echo! Even the hollow likes to answer back.',wrong:'Roots listen quietly, but they do not call your words back. Have another guess.'}),
    Object.freeze({question:'I carry a tiny sun and never burn my hand. What am I?',choices:Object.freeze(['A raindrop','A lantern']),answer:1,correct:'A lantern! That is the warm answer the bridge was waiting for.',wrong:'A raindrop can sparkle, but it cannot carry a steady flame. One more try.'})
  ])
});
const MOONROOT_BRIDGE_LAYOUT=Object.freeze({water:Object.freeze({firstCol:1,lastCol:18,firstRow:5,lastRow:8}),bridge:Object.freeze({col:9,row:5,cols:2,rows:4})});
// Four source-derived water frames form a quiet, non-repeating local mosaic.
// The visual selection never changes Moonroot's water objects or collision.
const WATER_TILE_LAYOUT=Object.freeze([
  [0,1,3,2,0,1,3,2,0,1,3,2,0,1,3,2,0,1],
  [2,3,0,1,2,3,0,1,2,3,0,1,2,3,0,1,2,3],
  [1,0,2,3,1,0,2,3,1,0,2,3,1,0,2,3,1,0],
  [3,2,1,0,3,2,1,0,3,2,1,0,3,2,1,0,3,2]
].map(row=>Object.freeze(row)));
const STARFALL_ALTAR=Object.freeze({x:190,y:112,interactionRadius:22});
const STARFALL_ALTAR_STATES=Object.freeze({DORMANT:'dormant',AWAKE:'awake',READY:'ready'});
const addedTreeCells=[
  [[2,5],[3,4],[15,4],[16,4],[2,7],[3,7],[14,8],[15,8],[6,10],[12,10]],
  [[2,3],[3,3],[8,2],[9,2],[14,3],[15,3],[5,9],[6,9],[14,9],[16,9]],
  [[2,3],[3,3],[6,3],[7,3],[15,3],[17,3],[4,9],[13,9],[14,9]],
  [[2,3],[3,3],[7,3],[8,3],[15,3],[16,3],[3,8],[4,8],[13,8],[14,8]]
];
// Interior blockers keep their exact one-cell roots and contact rectangles.
// Only retained spruce frame, scale, horizontal offset, and reflection vary,
// breaking up repeated pairs while every crown stays grounded at its anchor.
const interiorForestLayout=areas=>Object.freeze(areas.map(records=>Object.freeze(records.map(([frame,width,height,xOffset,mirror])=>Object.freeze({frame,width,height,xOffset,mirror})))));
const INTERIOR_FOREST_LAYOUT=interiorForestLayout([
  [[0,23,39,-1,false],[2,27,44,1,true],[1,25,41,0,false],[0,28,43,-2,true],[2,24,42,2,false],[1,26,38,-1,true],[0,22,40,1,true],[2,29,45,0,false],[1,24,39,-2,false],[0,27,42,2,true]],
  [[1,26,43,-2,false],[0,23,38,1,true],[2,28,45,0,true],[1,24,40,2,false],[0,27,44,-1,true],[2,22,39,1,false],[1,29,42,-2,true],[0,25,41,0,false],[2,24,38,2,true],[1,28,44,-1,false]],
  [[2,25,44,1,false],[1,22,38,-2,true],[0,29,43,0,false],[2,24,40,2,true],[1,27,45,-1,false],[0,23,39,1,true],[2,28,42,-2,false],[1,26,41,0,true],[0,24,38,2,false]],
  [[0,28,44,-1,true],[2,23,39,2,false],[1,26,42,0,true],[0,22,38,1,false],[2,29,45,-2,true],[1,25,40,2,false],[0,27,43,-1,false],[2,25,41,1,true],[1,28,38,-2,false],[0,24,44,0,true]]
]);
const platformCells=[[[8,3]],[[5,2],[11,9]],[[6,9],[13,6]],[[5,3],[16,6]]];
// Each map composes three overlapping retained-raster canopy clusters into a
// continuous forest wall. Frame order, overlap, height offset, and reflection
// vary without moving the shared row-2 collision-only root footprints.
const topCanopyLayouts=areas=>Object.freeze(areas.map(records=>Object.freeze(records.map(([x,y,frame,mirror])=>Object.freeze({x,y,w:128,h:56,frame,mirror})))));
const TOP_CANOPY_LAYOUTS=topCanopyLayouts([
  [[-6,-3,0,false],[96,-4,1,false],[202,-2,0,true]],
  [[-10,-5,1,true],[90,-2,0,false],[198,-4,1,false]],
  [[-2,-2,1,false],[102,-5,1,true],[206,-3,0,false]],
  [[-8,-4,0,true],[94,-1,0,false],[204,-5,1,true]]
]);
const TOP_CANOPY_ROOT_CELLS=Object.freeze(Array.from({length:20},(_,col)=>Object.freeze([col,2])));
// Bottom-edge trees keep the same rooted tile anchors and colliders, while
// their retained raster silhouettes vary in scale, offset, and reflection so
// the foreground reads as one irregular forest edge instead of a picket row.
const BOTTOM_FOREST_BASE=Object.freeze([
  [2,44,60,-3,false],[0,38,54,1,true],[1,42,58,-1,false],[2,36,52,2,true],[0,40,57,-2,false],
  [1,44,55,0,true],[0,36,59,2,true],[2,42,53,-2,false],[1,39,60,1,false],[0,43,56,-1,true],
  [2,37,54,2,false],[1,41,58,-3,true],[0,44,52,0,false],[2,38,57,1,true],[1,43,55,-2,false],
  [0,37,60,2,true],[2,41,54,-1,false],[1,36,58,1,true],[0,42,53,-2,false],[2,44,59,0,true]
].map(([frame,width,height,xOffset,mirror])=>Object.freeze({frame,width,height,xOffset,mirror})));
// Each area shifts the accepted irregular retained-sprite sequence by a
// distinct phase offset. This keeps the same safe silhouette bounds and
// rooted baselines while preventing one identical foreground skyline from
// following Luna through all four maps.
const BOTTOM_FOREST_LAYOUTS=Object.freeze([0,7,13,3].map(phase=>Object.freeze(
  BOTTOM_FOREST_BASE.map((_,col)=>BOTTOM_FOREST_BASE[(col+phase)%BOTTOM_FOREST_BASE.length])
)));
// Side-edge spruces use distinct map-specific phases of each accepted edge
// profile. This changes the two corner joins as well as the in-between
// silhouettes, so a shared perimeter does not read as one repeated frame.
// Their one-cell anchors and rooted contact rectangles stay fixed, including
// the overlaps into the top curtain and bottom forest.
const sideForestRecords=records=>Object.freeze(records.map(([frame,width,height,xOffset,mirror])=>Object.freeze({frame,width,height,xOffset,mirror})));
const sideForestLayouts=(records,phases)=>{
  const base=sideForestRecords(records);
  return Object.freeze(phases.map(phase=>Object.freeze(base.map((_,row)=>base[(row+phase)%base.length]))));
};
const SIDE_FOREST_LAYOUT=Object.freeze({
  left:sideForestLayouts([
    [0,44,60,-3,false],[2,38,54,0,true],[1,42,58,-2,false],[0,36,52,1,true],
    [2,43,61,-3,true],[1,39,55,0,false],[0,45,57,-4,false],[2,37,50,1,true],
    [1,41,59,-2,true],[0,39,53,0,false],[2,44,62,-3,false]
  ],[0,4,7,2]),
  right:sideForestLayouts([
    [1,40,56,1,true],[0,44,61,3,false],[2,37,52,-1,true],[1,42,58,2,false],
    [0,38,54,0,true],[2,45,60,4,true],[1,36,51,-1,false],[0,43,57,3,true],
    [2,39,55,0,false],[1,41,62,2,true],[0,37,53,-1,false]
  ],[0,5,8,3])
});
// Retained loam sprites cover the base floor through explicit, irregular
// map-specific records. Their fixed 80 x 48 footprint stays aligned to the
// quarter-tile rhythm while offsets, frames, reflection, and opacity break the
// former shared staggered lattice. These records are visual only.
const loamPatchLayout=areas=>Object.freeze(areas.map(records=>Object.freeze(records.map(([frame,x,y,mirror,alpha])=>Object.freeze({frame,x,y,w:80,h:48,mirror,alpha})))));
const LOAM_PATCH_LAYOUT=loamPatchLayout([
  [
    [0,-32,-16,false,.72],[2,32,-8,true,.68],[1,96,-20,false,.74],[3,164,-4,true,.70],[0,236,-12,false,.76],[2,292,-20,true,.66],
    [1,-48,32,true,.70],[3,16,40,false,.74],[0,88,28,true,.68],[2,152,44,false,.72],[1,224,36,true,.76],[3,284,24,false,.68],
    [2,-32,76,false,.74],[0,40,68,true,.70],[3,108,84,false,.76],[1,180,72,true,.68],[2,248,88,false,.72],[0,300,76,true,.66],
    [3,-48,124,true,.68],[1,24,112,false,.76],[2,96,132,true,.72],[0,164,116,false,.70],[3,236,128,true,.74],[1,292,108,false,.66],
    [0,-28,168,false,.76],[2,40,156,true,.70],[1,112,176,false,.72],[3,184,164,true,.68],[0,252,172,false,.74],[2,304,160,true,.66]
  ],
  [
    [2,-44,-8,true,.70],[0,20,-20,false,.76],[3,92,-4,true,.68],[1,156,-16,false,.72],[2,228,-8,true,.74],[0,288,-20,false,.66],
    [3,-28,40,false,.74],[1,44,28,true,.68],[2,108,44,false,.72],[0,176,32,true,.76],[3,244,24,false,.70],[1,304,40,true,.66],
    [0,-48,80,true,.68],[2,16,68,false,.74],[1,84,88,true,.70],[3,156,72,false,.76],[0,220,84,true,.68],[2,288,64,false,.72],
    [1,-24,120,false,.76],[3,48,132,true,.70],[0,116,112,false,.68],[2,184,128,true,.74],[1,252,116,false,.72],[3,308,136,true,.66],
    [2,-44,164,true,.70],[0,24,176,false,.74],[3,96,156,true,.68],[1,168,172,false,.76],[2,232,160,true,.72],[0,296,180,false,.66]
  ],
  [
    [1,-24,-20,false,.76],[3,44,-4,true,.68],[0,108,-16,false,.72],[2,176,-8,true,.74],[1,248,-20,false,.70],[3,304,-4,true,.66],
    [0,-48,28,true,.68],[2,24,44,false,.74],[1,92,32,true,.76],[3,164,24,false,.70],[0,232,40,true,.72],[2,288,28,false,.66],
    [3,-28,84,false,.72],[1,40,68,true,.76],[2,112,80,false,.68],[0,176,92,true,.74],[3,248,72,false,.70],[1,304,88,true,.66],
    [2,-44,112,true,.70],[0,20,132,false,.68],[3,88,120,true,.74],[1,160,136,false,.72],[2,228,116,true,.76],[0,292,128,false,.66],
    [1,-20,176,false,.74],[3,48,160,true,.70],[0,120,172,false,.76],[2,188,156,true,.68],[1,256,180,false,.72],[3,312,164,true,.66]
  ],
  [
    [3,-48,-4,true,.68],[1,20,-16,false,.74],[2,88,-8,true,.72],[0,156,-20,false,.76],[3,224,-4,true,.70],[1,288,-16,false,.66],
    [2,-24,36,false,.76],[0,48,24,true,.70],[3,116,44,false,.68],[1,184,28,true,.74],[2,252,40,false,.72],[0,308,24,true,.66],
    [1,-44,72,true,.70],[3,24,88,false,.74],[0,96,68,true,.76],[2,164,84,false,.68],[1,232,76,true,.72],[3,296,92,false,.66],
    [0,-28,132,false,.72],[2,40,116,true,.68],[1,108,128,false,.76],[3,176,112,true,.70],[0,244,136,false,.74],[2,304,120,true,.66],
    [3,-48,160,true,.68],[1,20,176,false,.76],[2,92,164,true,.72],[0,164,180,false,.70],[3,236,156,true,.74],[1,296,172,false,.66]
  ]
]);
// Decorative cells never participate in collision. Every map keeps the same
// small understory vocabulary, but explicit frame, reflection, opacity, and
// two-pixel-scale offsets stop each kind from recurring on a shared tile
// track. The retained 16 px raster cells remain the only visible art.
const groundDecorLayout=areas=>Object.freeze(areas.map(records=>Object.freeze(records.map(([kind,col,row,frame,xOffset,yOffset,mirror,alpha])=>Object.freeze({kind,col,row,frame,xOffset,yOffset,mirror,alpha})))));
const GROUND_DECOR_LAYOUT=groundDecorLayout([
  [
    ['shadow',2,4,0,-2,0,false,.40],['shadow',6,7,2,1,-1,true,.44],['shadow',14,5,1,-1,1,false,.38],['shadow',17,9,0,2,-1,true,.42],
    ['moon',4,6,1,-2,1,true,.26],['moon',10,4,2,1,-1,false,.30],['moon',13,8,0,-1,1,true,.28],
    ['fern',2,10,2,1,-1,true,.90],['fern',18,5,0,-2,1,false,.86],['stone',5,9,1,2,0,true,.88],
    ['needles',9,3,2,-1,1,false,.56],['root',11,9,0,1,0,true,.60],['mushroom',16,8,1,-1,1,true,.90],['glowmoss',7,9,1,1,0,false,.46]
  ],
  [
    ['shadow',1,3,1,1,0,false,.42],['shadow',7,4,0,-2,1,true,.38],['shadow',13,4,2,2,-1,false,.44],['shadow',18,10,1,-1,0,true,.40],
    ['moon',4,4,2,1,1,false,.28],['moon',11,3,0,-1,0,true,.30],['moon',15,10,1,2,-1,false,.26],
    ['fern',2,9,1,-1,1,false,.88],['fern',17,4,2,2,0,true,.92],['stone',7,9,2,-2,1,false,.90],
    ['needles',10,4,0,1,0,true,.58],['root',13,9,2,-1,1,false,.56],['mushroom',4,3,0,2,1,false,.86],['glowmoss',17,10,2,-1,0,true,.48]
  ],
  [
    ['shadow',1,6,2,1,-1,true,.38],['shadow',5,3,1,-2,1,false,.42],['shadow',16,4,0,2,0,true,.44],['shadow',18,8,2,-1,1,false,.40],
    ['moon',6,5,0,-1,1,true,.30],['moon',9,7,1,2,-1,false,.26],['moon',14,6,2,-2,0,true,.28],
    ['fern',3,8,0,2,1,true,.90],['fern',16,9,1,-1,-1,false,.84],['stone',8,10,0,1,0,true,.92],
    ['needles',12,3,1,-2,1,false,.54],['root',11,8,1,2,0,true,.60],['mushroom',5,5,1,-1,1,false,.88],['glowmoss',15,9,0,1,0,true,.44]
  ],
  [
    ['shadow',2,5,1,-1,1,false,.42],['shadow',8,5,0,2,-1,true,.38],['shadow',15,4,2,-2,0,false,.44],['shadow',17,8,1,1,1,true,.40],
    ['moon',5,7,2,1,-1,false,.28],['moon',11,6,0,-2,1,true,.30],['moon',14,9,1,2,0,false,.26],
    ['fern',3,9,2,-1,0,true,.86],['fern',18,7,1,1,1,false,.90],['stone',6,10,2,2,-1,false,.88],
    ['needles',10,3,2,-1,1,true,.58],['root',12,9,0,1,0,false,.56],['mushroom',6,4,0,-2,1,true,.90],['glowmoss',16,10,2,1,-1,false,.48]
  ]
]);
// Two retained-raster pools give each map a distinct moonlit route hierarchy.
// The dominant pool supports that map's next interaction rather than repeating
// one lower-centre spotlight; the smaller pool only carries the eye onward.
// These records are visual-only and never enter the world-object list.
const moonlightPoolLayout=areas=>Object.freeze(areas.map(records=>Object.freeze(records.map(([frame,x,y,w,h,alpha])=>Object.freeze({frame,x,y,w,h,alpha})))));
const MOONLIGHT_POOL_LAYOUT=moonlightPoolLayout([
  [[1,56,112,112,66,.76],[2,208,44,80,48,.24]],
  [[0,176,28,112,66,.72],[1,116,128,80,48,.32]],
  [[2,200,116,112,66,.74],[1,112,36,80,48,.28]],
  [[0,132,68,112,66,.78],[2,32,96,80,48,.26]]
]);
const EXIT_STATES=Object.freeze({CLOSED:'closed',OPENING:'opening',REVEALED:'revealed',OPEN:'open'});
const EXIT_STATE_DURATIONS=Object.freeze({opening:.75,revealed:1.25});
// The exit remains one logical tile. Its stepped mouth grows to one clear
// 16-pixel tile, with a warm loam threshold that reads at phone scale while
// its rooted collider stays in place until the fully open state.
const EXIT_CLEARING=Object.freeze({closed:Object.freeze({width:6,pathWidth:4}),opening:Object.freeze({width:10,pathWidth:6}),revealed:Object.freeze({width:14,pathWidth:10}),open:Object.freeze({width:16,pathWidth:12}),top:-24,height:40,thresholdY:30});

const tileObject=(id,kind,col,row,options={})=>({id,kind,x:col*TILE_SIZE,y:row*TILE_SIZE,w:TILE_SIZE,h:TILE_SIZE,solid:false,...options});
const boundaryObjects=()=>{
  const objects=[];
  for(let col=0;col<20;col++){objects.push(tileObject(`edge-top-${col}`,'tree',col,0,{solid:true}));objects.push(tileObject(`edge-bottom-${col}`,'tree',col,12,{solid:true}))}
  for(let row=1;row<12;row++){objects.push(tileObject(`edge-left-${row}`,'tree',0,row,{solid:true}));objects.push(tileObject(`edge-right-${row}`,'tree',19,row,{solid:true}))}
  TOP_CANOPY_ROOT_CELLS.forEach(([col,row])=>objects.push(tileObject(`canopy-root-${col}`,'canopy-root',col,row,{solid:true,collisionOnly:true})));
  return objects
};
const collisionRectFor=object=>object.kind==='tree'||object.kind==='canopy-root'?{x:object.x-2,y:object.y+4,w:20,h:12}:object.kind==='exit-tree'?{x:object.x-4,y:object.y+4,w:24,h:12}:object.kind==='platform'?{x:object.x-4,y:object.y+2,w:40,h:14}:{x:object.x,y:object.y,w:object.w,h:object.h};
const contains=(object,x,y)=>{const collider=collisionRectFor(object);return x>=collider.x&&x<collider.x+collider.w&&y>=collider.y&&y<collider.y+collider.h};
function createWorldObjects(areaIndex,bridge,exitState=EXIT_STATES.CLOSED){
  const area=createAreas()[areaIndex];
  const ordinaryTrees=addedTreeCells[areaIndex];
  const objects=[...boundaryObjects(),...ordinaryTrees.map(([col,row],index)=>tileObject(`tree-${index}`,'tree',col,row,{solid:true}))];
  if(area.home){
    const exitCol=Math.floor(area.home.x/TILE_SIZE),exitRow=Math.floor(area.home.y/TILE_SIZE);
    objects.push(tileObject(`exit-tree-${areaIndex}`,'exit-tree',exitCol,exitRow,{solid:exitState!==EXIT_STATES.OPEN,state:exitState}));
  }
  platformCells[areaIndex].forEach(([col,row],index)=>objects.push({id:`platform-${areaIndex}-${index}`,kind:'platform',x:col*TILE_SIZE,y:row*TILE_SIZE,w:TILE_SIZE*2,h:TILE_SIZE,solid:true}));
  if(areaIndex===1){
    const water=MOONROOT_BRIDGE_LAYOUT.water,span=MOONROOT_BRIDGE_LAYOUT.bridge;
    for(let row=water.firstRow;row<=water.lastRow;row++)for(let col=water.firstCol;col<=water.lastCol;col++){
      const bridgeCell=col>=span.col&&col<span.col+span.cols&&row>=span.row&&row<span.row+span.rows;
      if(!(bridge&&bridgeCell))objects.push(tileObject(`water-${col}-${row}`,'water',col,row,{solid:true}))
    }
    if(bridge)objects.push({id:'moonroot-bridge',kind:'bridge',x:span.col*TILE_SIZE,y:span.row*TILE_SIZE,w:span.cols*TILE_SIZE,h:span.rows*TILE_SIZE,solid:false,orientation:'vertical'});
  }
  if(areaIndex===2)objects.push({id:'sentinel',kind:'sentinel',x:144,y:96,w:TILE_SIZE*2,h:TILE_SIZE*2,solid:true});
  if(areaIndex===3)objects.push({id:'moonwell-altar-base',kind:'altar-base',x:176,y:104,w:28,h:8,solid:true,collisionOnly:true});
  return objects
}

function createAreas(){return [
  {name:'Lantern Glade',start:{x:56,y:152},home:{x:280,y:72},memory:{x:40,y:72,text:'A rain-silver leaf holds the storm’s first reflection. The lantern keeper was not alone on the path home.'},lights:[{x:264,y:56},{x:88,y:136},{x:168,y:88}]},
  {name:'Moonroot Crossing',start:{x:40,y:72},home:{x:40,y:168},watcher:{x:248,y:72},memory:{x:280,y:168,text:'On the far shore, a silver thread rests in an old root-knot. Eir kept it as proof that another keeper once crossed safely.'},lights:[{x:248,y:168},{x:152,y:168}]},
  {name:'Whispering Hollow',start:{x:280,y:72},home:{x:40,y:168},runes:[{x:264,y:152},{x:152,y:72},{x:56,y:120}],memory:{x:264,y:88,text:'A small seed-shell remembers a child’s laugh. The hollow keeps gentle sounds as well as echoes.'},lights:[{x:168,y:136,hidden:true}]},
  {name:'Starfall Grove',start:{x:280,y:72},altar:STARFALL_ALTAR,starroots:[{x:264,y:152},{x:168,y:72},{x:56,y:120}],lights:[{x:152,y:152,hidden:true},{x:232,y:56,hidden:true}]}
]}

function createGroundDecor(areaIndex){return GROUND_DECOR_LAYOUT[areaIndex].map((record,index)=>Object.freeze({id:`decor-${areaIndex}-${index}`,kind:record.kind,x:record.col*TILE_SIZE,y:record.row*TILE_SIZE,w:TILE_SIZE,h:TILE_SIZE,frame:record.frame,xOffset:record.xOffset,yOffset:record.yOffset,mirror:record.mirror,alpha:record.alpha,solid:false}))}

const countLights=areas=>areas.flatMap(area=>area.lights).filter(light=>light.got).length;
const countMemories=areas=>areas.filter(area=>area.memory?.got).length;
const areaComplete=area=>area.lights.every(light=>light.got);
const nextAreaIndex=(areaIndex,areas)=>areaIndex<areas.length-1?areaIndex+1:null;
const hiddenLightVisible=(areaIndex,echoAwake,starfallAwake)=>areaIndex===2?echoAwake:areaIndex===3?starfallAwake:true;
const starfallAltarState=(starfallAwake,areaComplete)=>!starfallAwake?STARFALL_ALTAR_STATES.DORMANT:areaComplete?STARFALL_ALTAR_STATES.READY:STARFALL_ALTAR_STATES.AWAKE;
function memoryRevealStateAt(seconds,reducedMotion=false){
  if(seconds<0)return 'hidden';
  if(seconds<MEMORY_REVEAL_TIMING.hold)return 'holding';
  if(!reducedMotion&&seconds<MEMORY_REVEAL_TIMING.hold+MEMORY_REVEAL_TIMING.fade)return 'fading';
  return 'hidden'
}
function memoryRevealBoxForPlayer(playerY){return{x:MEMORY_REVEAL_LAYOUT.x,y:playerY<MEMORY_REVEAL_LAYOUT.keeperSplitY?MEMORY_REVEAL_LAYOUT.bottomY:MEMORY_REVEAL_LAYOUT.topY,w:MEMORY_REVEAL_LAYOUT.w,h:MEMORY_REVEAL_LAYOUT.h}}
function isBlocked(x,y,areaIndex,bridge){return createWorldObjects(areaIndex,bridge).some(object=>object.solid&&contains(object,x,y))}
function exitStateAt(seconds){
  if(seconds<EXIT_STATE_DURATIONS.opening)return EXIT_STATES.OPENING;
  if(seconds<EXIT_STATE_DURATIONS.opening+EXIT_STATE_DURATIONS.revealed)return EXIT_STATES.REVEALED;
  return EXIT_STATES.OPEN
}
const nearPoint=(point,target,radius=HOLLOW_ECHO_RADIUS)=>Math.hypot(point.x-target.x,point.y-target.y)<radius;
function createEchoReplay(trail,origin){
  for(let index=trail.length-1;index>=0;index--)if(nearPoint(trail[index],origin))return trail.slice(index).reverse();
  return []
}
const canResolveEchoRune=(stage,echoHolding,player,runes)=>stage===2&&echoHolding&&nearPoint(player,runes[2]);
function watcherChoiceResult(step,choice){const riddle=WATCHER_DIALOGUE.riddles[step];if(!riddle)return Object.freeze({correct:false,complete:false,nextStep:step,reply:'Eir has no more riddles to ask.'});const correct=choice===riddle.answer,nextStep=correct?step+1:step;return Object.freeze({correct,complete:correct&&nextStep===WATCHER_DIALOGUE.riddles.length,nextStep,reply:correct?riddle.correct:riddle.wrong})}
globalThis.MoonwellCore=Object.freeze({MAP,TILE_SIZE,WORLD_WIDTH,WORLD_HEIGHT,RENDER_SCALE,RENDER_WIDTH,RENDER_HEIGHT,VISUAL_FOOTPRINTS,TOP_CANOPY_LAYOUTS,TOP_CANOPY_ROOT_CELLS,BOTTOM_FOREST_LAYOUTS,SIDE_FOREST_LAYOUT,INTERIOR_FOREST_LAYOUT,LOAM_PATCH_LAYOUT,GROUND_DECOR_LAYOUT,MOONLIGHT_POOL_LAYOUT,WATER_TILE_LAYOUT,TOTAL_FIREFLIES,FIREFLY_VARIANTS,HOLLOW_ECHO_RADIUS,MEMORY_REVEAL_TIMING,MEMORY_REVEAL_LAYOUT,MEMORY_DIALOGUE_TYPOGRAPHY,WATCHER_DIALOGUE,MOONROOT_BRIDGE_LAYOUT,STARFALL_ALTAR,STARFALL_ALTAR_STATES,EXIT_STATES,EXIT_STATE_DURATIONS,EXIT_CLEARING,addedTreeCells,areaComplete,canResolveEchoRune,collisionRectFor,countLights,countMemories,createAreas,createEchoReplay,createGroundDecor,createWorldObjects,exitStateAt,hiddenLightVisible,isBlocked,memoryRevealBoxForPlayer,memoryRevealStateAt,nearPoint,nextAreaIndex,starfallAltarState,watcherChoiceResult});
})();
