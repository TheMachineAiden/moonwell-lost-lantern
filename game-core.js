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
  exitTree:Object.freeze({logical:Object.freeze({cellsWide:1,cellsHigh:1,solidUntil:'open'}),visual:Object.freeze({width:48,height:64,overhangLeft:16,overhangRight:16,overhangTop:48,overhangBottom:0})}),
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
const STARFALL_ALTAR=Object.freeze({x:190,y:112,interactionRadius:22});
const STARFALL_ALTAR_STATES=Object.freeze({DORMANT:'dormant',AWAKE:'awake',READY:'ready'});
const addedTreeCells=[
  [[2,5],[3,4],[15,4],[16,4],[2,7],[3,7],[14,8],[15,8],[6,10],[12,10]],
  [[2,3],[3,3],[8,2],[9,2],[14,3],[15,3],[5,9],[6,9],[14,9],[16,9]],
  [[2,3],[3,3],[6,3],[7,3],[15,3],[17,3],[4,9],[13,9],[14,9]],
  [[2,3],[3,3],[7,3],[8,3],[15,3],[16,3],[3,8],[4,8],[13,8],[14,8]]
];
const platformCells=[[[8,3]],[[5,2],[11,9]],[[6,9],[13,6]],[[5,3],[16,6]]];
// These three overlapping clusters are the unchanged top-canopy composition.
// Their dense visible root face spans the world at row 2, so the same declared
// layout also creates one seam-free line of collision-only root footprints.
const TOP_CANOPY_LAYOUT=Object.freeze([
  Object.freeze({x:-6,y:-3,w:128,h:56,frameOffset:0}),
  Object.freeze({x:96,y:-4,w:128,h:56,frameOffset:1}),
  Object.freeze({x:202,y:-2,w:128,h:56,frameOffset:0})
]);
const TOP_CANOPY_ROOT_CELLS=Object.freeze(Array.from({length:20},(_,col)=>Object.freeze([col,2])));
// Bottom-edge trees keep the same rooted tile anchors and colliders, while
// their retained raster silhouettes vary in scale, offset, and reflection so
// the foreground reads as one irregular forest edge instead of a picket row.
const BOTTOM_FOREST_LAYOUT=Object.freeze([
  [2,44,60,-3,false],[0,38,54,1,true],[1,42,58,-1,false],[2,36,52,2,true],[0,40,57,-2,false],
  [1,44,55,0,true],[0,36,59,2,true],[2,42,53,-2,false],[1,39,60,1,false],[0,43,56,-1,true],
  [2,37,54,2,false],[1,41,58,-3,true],[0,44,52,0,false],[2,38,57,1,true],[1,43,55,-2,false],
  [0,37,60,2,true],[2,41,54,-1,false],[1,36,58,1,true],[0,42,53,-2,false],[2,44,59,0,true]
].map(([frame,width,height,xOffset,mirror])=>Object.freeze({frame,width,height,xOffset,mirror})));
// Side-edge spruces reuse the same retained raster while varying silhouette
// and inward overhang. Their one-cell anchors and rooted contact rectangles
// stay fixed, including the overlaps into the top curtain and bottom forest.
const sideForestLayout=records=>Object.freeze(records.map(([frame,width,height,xOffset,mirror])=>Object.freeze({frame,width,height,xOffset,mirror})));
const SIDE_FOREST_LAYOUT=Object.freeze({
  left:sideForestLayout([
    [0,44,60,-3,false],[2,38,54,0,true],[1,42,58,-2,false],[0,36,52,1,true],
    [2,43,61,-3,true],[1,39,55,0,false],[0,45,57,-4,false],[2,37,50,1,true],
    [1,41,59,-2,true],[0,39,53,0,false],[2,44,62,-3,false]
  ]),
  right:sideForestLayout([
    [1,40,56,1,true],[0,44,61,3,false],[2,37,52,-1,true],[1,42,58,2,false],
    [0,38,54,0,true],[2,45,60,4,true],[1,36,51,-1,false],[0,43,57,3,true],
    [2,39,55,0,false],[1,41,62,2,true],[0,37,53,-1,false]
  ])
});
// Decorative cells never participate in collision. Moon/shadow patches are
// value blocks; the remaining kinds are one-tile understory props.
const groundDecorCells=[
  [['shadow',1,3],['shadow',4,6],['shadow',15,6],['shadow',17,8],['moon',5,5],['moon',9,5],['moon',13,6],['fern',1,9],['fern',17,4],['stone',4,10],['needles',10,2],['root',12,9],['mushroom',16,9],['glowmoss',7,10]],
  [['shadow',1,4],['shadow',6,3],['shadow',16,2],['shadow',17,8],['moon',4,5],['moon',9,4],['moon',13,5],['fern',2,8],['fern',17,9],['stone',7,10],['needles',11,3],['root',12,8],['mushroom',4,4],['glowmoss',16,8]],
  [['shadow',1,5],['shadow',5,2],['shadow',15,2],['shadow',17,7],['moon',5,6],['moon',9,5],['moon',13,7],['fern',2,8],['fern',17,9],['stone',7,10],['needles',11,3],['root',12,9],['mushroom',4,4],['glowmoss',15,8]],
  [['shadow',1,5],['shadow',6,2],['shadow',15,2],['shadow',17,7],['moon',5,6],['moon',10,5],['moon',14,7],['fern',2,9],['fern',17,9],['stone',7,10],['needles',11,2],['root',12,9],['mushroom',5,4],['glowmoss',16,8]]
];
const EXIT_STATES=Object.freeze({CLOSED:'closed',OPENING:'opening',REVEALED:'revealed',OPEN:'open'});
const EXIT_STATE_DURATIONS=Object.freeze({opening:.75,revealed:1.25});
// The exit remains one logical tile. Its stepped mouth grows to one clear
// 16-pixel tile, with a warm loam threshold that reads at phone scale while
// its rooted collider stays in place until the fully open state.
const EXIT_CLEARING=Object.freeze({closed:Object.freeze({width:6,pathWidth:4}),opening:Object.freeze({width:10,pathWidth:6}),revealed:Object.freeze({width:14,pathWidth:10}),open:Object.freeze({width:16,pathWidth:12}),top:-20,height:36,thresholdY:22});

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

function createGroundDecor(areaIndex){return groundDecorCells[areaIndex].map(([kind,col,row],index)=>Object.freeze({id:`decor-${areaIndex}-${index}`,kind,x:col*TILE_SIZE,y:row*TILE_SIZE,w:TILE_SIZE,h:TILE_SIZE,solid:false}))}

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
globalThis.MoonwellCore=Object.freeze({MAP,TILE_SIZE,WORLD_WIDTH,WORLD_HEIGHT,RENDER_SCALE,RENDER_WIDTH,RENDER_HEIGHT,VISUAL_FOOTPRINTS,TOP_CANOPY_LAYOUT,TOP_CANOPY_ROOT_CELLS,BOTTOM_FOREST_LAYOUT,SIDE_FOREST_LAYOUT,TOTAL_FIREFLIES,HOLLOW_ECHO_RADIUS,MEMORY_REVEAL_TIMING,MEMORY_REVEAL_LAYOUT,MEMORY_DIALOGUE_TYPOGRAPHY,WATCHER_DIALOGUE,MOONROOT_BRIDGE_LAYOUT,STARFALL_ALTAR,STARFALL_ALTAR_STATES,EXIT_STATES,EXIT_STATE_DURATIONS,EXIT_CLEARING,addedTreeCells,areaComplete,canResolveEchoRune,collisionRectFor,countLights,countMemories,createAreas,createEchoReplay,createGroundDecor,createWorldObjects,exitStateAt,hiddenLightVisible,isBlocked,memoryRevealBoxForPlayer,memoryRevealStateAt,nearPoint,nextAreaIndex,starfallAltarState,watcherChoiceResult});
})();
