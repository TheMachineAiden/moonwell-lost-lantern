import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context={};
vm.runInNewContext(fs.readFileSync(new URL('../game-core.js',import.meta.url),'utf8'),context);
const {TOTAL_FIREFLIES,areaComplete,countLights,countMemories,createAreas,createWorldObjects,hiddenLightVisible,isBlocked,nextAreaIndex}=context.MoonwellCore;

test('Moonwell starts with four areas, eight fireflies, and three optional memories',()=>{
  const areas=createAreas();
  assert.equal(areas.length,4);
  assert.equal(areas.flatMap(area=>area.lights).length,TOTAL_FIREFLIES);
  assert.equal(countMemories(areas),0);
  assert.equal(areas.filter(area=>area.memory).length,3);
});

test('an area exit only opens after every firefly in its current area is gathered',()=>{
  const areas=createAreas();
  assert.equal(areaComplete(areas[0]),false);
  areas[0].lights.forEach(light=>light.got=true);
  assert.equal(areaComplete(areas[0]),true);
  assert.equal(countLights(areas),3);
});

test('the Moonroot bridge opens across the entire two-tile water crossing',()=>{
  assert.equal(isBlocked(160,100,1,false),true);
  assert.equal(isBlocked(160,100,1,true),false);
  assert.equal(isBlocked(160,116,1,true),false);
  assert.equal(isBlocked(80,100,1,true),true);
  assert.equal(isBlocked(8,8,0,false),true);
});

test('Moonroot has a complete playable route from its flower to its lower shore only after the bridge opens',()=>{
  const canStand=(x,y,bridge)=>![[x-5,y-5],[x+5,y-5],[x-5,y+5],[x+5,y+5]].some(([pointX,pointY])=>isBlocked(pointX,pointY,1,bridge));
  const routeExists=bridge=>{
    const start=[264,72],target=[248,151],queue=[start],seen=new Set([start.join(',')]);
    while(queue.length){
      const [x,y]=queue.shift();
      if(Math.hypot(x-target[0],y-target[1])<8)return true;
      for(const [deltaX,deltaY] of [[2,0],[-2,0],[0,2],[0,-2]]){
        const nextX=x+deltaX,nextY=y+deltaY,key=`${nextX},${nextY}`;
        if(nextX<6||nextX>314||nextY<6||nextY>194||seen.has(key)||!canStand(nextX,nextY,bridge))continue;
        seen.add(key);queue.push([nextX,nextY]);
      }
    }
    return false;
  };
  assert.equal(routeExists(false),false);
  assert.equal(routeExists(true),true);
});

test('each transition is a clear one-cell opening between two solid trees',()=>{
  const areas=createAreas();
  areas.forEach((area,index)=>{
    const col=Math.floor(area.home.x/16),row=Math.floor(area.home.y/16);
    assert.equal(isBlocked(area.home.x,area.home.y,index,false),false);
    assert.equal(isBlocked((col-1)*16+8,row*16+8,index,false),true);
    assert.equal(isBlocked((col+1)*16+8,row*16+8,index,false),true);
  });
});

test('world records keep ordinary blockers to one cell and landmark colliders to their declared footprint',()=>{
  const glade=createWorldObjects(0,false);
  const tree=glade.find(object=>object.id==='tree-0');
  assert.deepEqual({x:tree.x,y:tree.y,w:tree.w,h:tree.h,solid:tree.solid},{x:48,y:32,w:16,h:16,solid:true});
  assert.equal(isBlocked(48,32,0,false),true);
  assert.equal(isBlocked(112,32,0,false),false);
  const hollow=createWorldObjects(2,false);
  const sentinel=hollow.find(object=>object.id==='sentinel');
  assert.deepEqual({x:sentinel.x,y:sentinel.y,w:sentinel.w,h:sentinel.h},{x:144,y:96,w:32,h:32});
  assert.equal(isBlocked(144,96,2,false),true);
  assert.equal(isBlocked(175,127,2,false),true);
  assert.equal(isBlocked(176,127,2,false),false);
});

test('hidden fireflies follow their area-specific encounter gates',()=>{
  assert.equal(hiddenLightVisible(2,false,false),false);
  assert.equal(hiddenLightVisible(2,true,false),true);
  assert.equal(hiddenLightVisible(3,true,false),false);
  assert.equal(hiddenLightVisible(3,false,true),true);
});

test('area progression ends cleanly at Starfall Grove',()=>{
  const areas=createAreas();
  assert.equal(nextAreaIndex(0,areas),1);
  assert.equal(nextAreaIndex(2,areas),3);
  assert.equal(nextAreaIndex(3,areas),null);
});
