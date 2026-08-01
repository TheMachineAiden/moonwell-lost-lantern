(()=>{
const TILE_SIZE=16;
const MAP=['....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................','....................'];
const TOTAL_FIREFLIES=8;
const treeCells=[[3,2],[4,2],[13,2],[14,2],[7,4],[8,4],[11,6],[12,6],[5,8],[6,8]];
const platformCells=[[[5,2],[13,7]],[[5,2],[13,7]],[[6,9],[13,6]],[[5,3],[16,6]]];

const tileObject=(id,kind,col,row,options={})=>({id,kind,x:col*TILE_SIZE,y:row*TILE_SIZE,w:TILE_SIZE,h:TILE_SIZE,solid:false,...options});
const boundaryObjects=()=>{
  const objects=[];
  for(let col=0;col<20;col++){objects.push(tileObject(`edge-top-${col}`,'tree',col,0,{solid:true}));objects.push(tileObject(`edge-bottom-${col}`,'tree',col,12,{solid:true}))}
  for(let row=1;row<12;row++){objects.push(tileObject(`edge-left-${row}`,'tree',0,row,{solid:true}));objects.push(tileObject(`edge-right-${row}`,'tree',19,row,{solid:true}))}
  return objects
};
const contains=(object,x,y)=>x>=object.x&&x<object.x+object.w&&y>=object.y&&y<object.y+object.h;
function createWorldObjects(areaIndex,bridge){
  const objects=[...boundaryObjects(),...treeCells.map(([col,row],index)=>tileObject(`tree-${index}`,'tree',col,row,{solid:true}))];
  platformCells[areaIndex].forEach(([col,row],index)=>objects.push({id:`platform-${areaIndex}-${index}`,kind:'platform',x:col*TILE_SIZE,y:row*TILE_SIZE,w:TILE_SIZE*2,h:TILE_SIZE,solid:true}));
  if(areaIndex===1){
    for(let row=6;row<8;row++)for(let col=1;col<19;col++){
      const bridgeCell=bridge&&row===6&&col>=8&&col<12;
      objects.push(tileObject(`water-${col}-${row}`,bridgeCell?'bridge':'water',col,row,{solid:!bridgeCell,frame:col-8}))
    }
  }
  if(areaIndex===2)objects.push({id:'sentinel',kind:'sentinel',x:144,y:96,w:TILE_SIZE*2,h:TILE_SIZE*2,solid:true});
  return objects
}

function createAreas(){return [
  {name:'Lantern Glade',start:{x:25,y:25},home:{x:280,y:168},memory:{x:41,y:73,text:'A rain-silver leaf holds the storm’s first reflection. The lantern keeper was not alone on the path home.'},lights:[{x:264,y:27},{x:73,y:153},{x:168,y:88}]},
  {name:'Moonroot Crossing',start:{x:40,y:40},home:{x:40,y:168},flower:{x:264,y:72},memory:{x:280,y:41,text:'A root-knot is tied with a violet thread. Someone marked the crossing for the next traveler.'},lights:[{x:248,y:151},{x:152,y:169}]},
  {name:'Whispering Hollow',start:{x:279,y:40},home:{x:46,y:168},runes:[{x:264,y:152},{x:152,y:72},{x:57,y:120}],memory:{x:266,y:57,text:'A small bell-shell remembers a child’s laugh. The hollow keeps gentle sounds as well as echoes.'},lights:[{x:162,y:128,hidden:true}]},
  {name:'Starfall Grove',start:{x:276,y:40},home:{x:48,y:168},bells:[{x:258,y:150},{x:160,y:76},{x:62,y:118}],lights:[{x:146,y:150,hidden:true},{x:234,y:62,hidden:true}]}
]}

const countLights=areas=>areas.flatMap(area=>area.lights).filter(light=>light.got).length;
const countMemories=areas=>areas.filter(area=>area.memory?.got).length;
const areaComplete=area=>area.lights.every(light=>light.got);
const nextAreaIndex=(areaIndex,areas)=>areaIndex<areas.length-1?areaIndex+1:null;
const hiddenLightVisible=(areaIndex,echoAwake,starfallAwake)=>areaIndex===2?echoAwake:areaIndex===3?starfallAwake:true;
function isBlocked(x,y,areaIndex,bridge){return createWorldObjects(areaIndex,bridge).some(object=>object.solid&&contains(object,x,y))}
globalThis.MoonwellCore=Object.freeze({MAP,TILE_SIZE,TOTAL_FIREFLIES,areaComplete,countLights,countMemories,createAreas,createWorldObjects,hiddenLightVisible,isBlocked,nextAreaIndex});
})();
