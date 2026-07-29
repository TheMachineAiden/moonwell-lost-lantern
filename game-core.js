(()=>{
const TILE_SIZE=16;
const MAP=['####################','#..................#','#..##........##....#','#..................#','#......##..........#','#..................#','#..........##......#','#..................#','#....##............#','#..................#','#..................#','#..................#','####################'];
const TOTAL_FIREFLIES=8;

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
function isBlocked(x,y,areaIndex,bridge){const col=Math.floor(x/TILE_SIZE),row=Math.floor(y/TILE_SIZE);if(!MAP[row]||!MAP[row][col]||MAP[row][col]==='#')return true;return areaIndex===1&&y>91&&y<109&&(!bridge||x<100||x>220)}
globalThis.MoonwellCore=Object.freeze({MAP,TILE_SIZE,TOTAL_FIREFLIES,areaComplete,countLights,countMemories,createAreas,hiddenLightVisible,isBlocked,nextAreaIndex});
})();
