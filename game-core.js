(()=>{
const TILE_SIZE=16;
const MAP=['....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................'];
const TOTAL_FIREFLIES=8;
const HOLLOW_ECHO_RADIUS=15;
const MEMORY_REVEAL_TIMING=Object.freeze({hold:3.25,fade:.75});
// The reveal stays inside the 320 × 200 game canvas: the upper band is used
// while the keeper is low, and the lower band is used while the keeper is high.
const MEMORY_REVEAL_LAYOUT=Object.freeze({x:24,w:272,h:64,topY:12,bottomY:124,keeperSplitY:104,maxLineChars:42,maxLines:3});
const MEMORY_DIALOGUE_TYPOGRAPHY=Object.freeze({bodyPx:13,titlePx:14,lineHeight:1.45});
const WATCHER_DIALOGUE=Object.freeze({name:'Eir, Rootwatcher',riddle:'I travel without feet, keep no shape, and still make every path remember the moon. What am I?',choices:Object.freeze(['A memory','A shadow'])});
const treeCells=[[3,2],[4,2],[13,2],[14,2],[7,4],[8,4],[11,6],[12,6],[5,8],[6,8]];
const addedTreeCells=[
  [[2,5],[3,4],[15,4],[16,4],[2,7],[3,7],[14,8],[15,8],[8,9],[9,9]],
  [[2,3],[3,3],[8,2],[9,2],[14,3],[15,3],[5,9],[6,9],[14,9],[16,9]],
  [[2,3],[3,3],[6,3],[7,3],[15,3],[17,3],[3,9],[4,9],[13,9],[14,9]],
  [[2,3],[3,3],[7,3],[8,3],[15,3],[16,3],[3,8],[4,8],[13,8],[14,8]]
];
const platformCells=[[[5,2],[13,7]],[[5,2],[13,7]],[[6,9],[13,6]],[[5,3],[16,6]]];
const EXIT_STATES=Object.freeze({CLOSED:'closed',OPENING:'opening',REVEALED:'revealed',OPEN:'open'});
const EXIT_STATE_DURATIONS=Object.freeze({opening:.75,revealed:1.25});

const tileObject=(id,kind,col,row,options={})=>({id,kind,x:col*TILE_SIZE,y:row*TILE_SIZE,w:TILE_SIZE,h:TILE_SIZE,solid:false,...options});
const boundaryObjects=()=>{
  const objects=[];
  for(let col=0;col<20;col++){objects.push(tileObject(`edge-top-${col}`,'tree',col,0,{solid:true}));objects.push(tileObject(`edge-bottom-${col}`,'tree',col,12,{solid:true}))}
  for(let row=1;row<12;row++){objects.push(tileObject(`edge-left-${row}`,'tree',0,row,{solid:true}));objects.push(tileObject(`edge-right-${row}`,'tree',19,row,{solid:true}))}
  return objects
};
const contains=(object,x,y)=>x>=object.x&&x<object.x+object.w&&y>=object.y&&y<object.y+object.h;
function createWorldObjects(areaIndex,bridge,exitState=EXIT_STATES.CLOSED){
  const area=createAreas()[areaIndex];
  const exitCol=Math.floor(area.home.x/TILE_SIZE),exitRow=Math.floor(area.home.y/TILE_SIZE);
  const ordinaryTrees=[...treeCells,...addedTreeCells[areaIndex]];
  const objects=[...boundaryObjects(),...ordinaryTrees.map(([col,row],index)=>tileObject(`tree-${index}`,'tree',col,row,{solid:true})),tileObject(`exit-tree-${areaIndex}`,'exit-tree',exitCol,exitRow,{solid:exitState!==EXIT_STATES.OPEN,state:exitState})];
  platformCells[areaIndex].forEach(([col,row],index)=>objects.push({id:`platform-${areaIndex}-${index}`,kind:'platform',x:col*TILE_SIZE,y:row*TILE_SIZE,w:TILE_SIZE*2,h:TILE_SIZE,solid:true}));
  if(areaIndex===1){
    for(let row=6;row<8;row++)for(let col=1;col<19;col++){
      const bridgeCell=bridge&&col>=8&&col<12;
      objects.push(tileObject(`water-${col}-${row}`,bridgeCell?'bridge':'water',col,row,{solid:!bridgeCell,frame:col-8}))
    }
  }
  if(areaIndex===2)objects.push({id:'sentinel',kind:'sentinel',x:144,y:96,w:TILE_SIZE*2,h:TILE_SIZE*2,solid:true});
  return objects
}

function createAreas(){return [
  {name:'Lantern Glade',start:{x:25,y:25},home:{x:280,y:168},memory:{x:41,y:73,text:'A rain-silver leaf holds the storm’s first reflection. The lantern keeper was not alone on the path home.'},lights:[{x:264,y:27},{x:73,y:153},{x:168,y:88}]},
  {name:'Moonroot Crossing',start:{x:40,y:40},home:{x:40,y:168},flower:{x:264,y:72},watcher:{x:264,y:48},memory:{x:280,y:41,text:'A root-knot is tied with a violet thread. Someone marked the crossing for the next traveler.'},lights:[{x:248,y:151},{x:152,y:169}]},
  {name:'Whispering Hollow',start:{x:279,y:40},home:{x:46,y:168},runes:[{x:264,y:152},{x:152,y:72},{x:57,y:120}],memory:{x:266,y:57,text:'A small bell-shell remembers a child’s laugh. The hollow keeps gentle sounds as well as echoes.'},lights:[{x:162,y:128,hidden:true}]},
  {name:'Starfall Grove',start:{x:276,y:40},home:{x:48,y:168},bells:[{x:258,y:150},{x:160,y:76},{x:62,y:118}],lights:[{x:146,y:150,hidden:true},{x:234,y:62,hidden:true}]}
]}

const countLights=areas=>areas.flatMap(area=>area.lights).filter(light=>light.got).length;
const countMemories=areas=>areas.filter(area=>area.memory?.got).length;
const areaComplete=area=>area.lights.every(light=>light.got);
const nextAreaIndex=(areaIndex,areas)=>areaIndex<areas.length-1?areaIndex+1:null;
const hiddenLightVisible=(areaIndex,echoAwake,starfallAwake)=>areaIndex===2?echoAwake:areaIndex===3?starfallAwake:true;
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
function watcherChoiceResult(choice){return choice===0?Object.freeze({correct:true,reply:'Yes. A memory carries a path after the feet have gone. The moonflower listens for that keeping.'}):Object.freeze({correct:false,reply:'A shadow follows, but it does not keep. Listen to the riddle once more; there is no harm in trying again.'})}
globalThis.MoonwellCore=Object.freeze({MAP,TILE_SIZE,TOTAL_FIREFLIES,HOLLOW_ECHO_RADIUS,MEMORY_REVEAL_TIMING,MEMORY_REVEAL_LAYOUT,MEMORY_DIALOGUE_TYPOGRAPHY,WATCHER_DIALOGUE,EXIT_STATES,EXIT_STATE_DURATIONS,addedTreeCells,areaComplete,canResolveEchoRune,countLights,countMemories,createAreas,createEchoReplay,createWorldObjects,exitStateAt,hiddenLightVisible,isBlocked,memoryRevealBoxForPlayer,memoryRevealStateAt,nearPoint,nextAreaIndex,watcherChoiceResult});
})();
