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

test('a lantern only opens after every firefly in its current area is gathered',()=>{
  const areas=createAreas();
  assert.equal(areaComplete(areas[0]),false);
  areas[0].lights.forEach(light=>light.got=true);
  assert.equal(areaComplete(areas[0]),true);
  assert.equal(countLights(areas),3);
});

test('the Moonroot bridge opens only across its stepping-stone span',()=>{
  assert.equal(isBlocked(160,100,1,false),true);
  assert.equal(isBlocked(160,100,1,true),false);
  assert.equal(isBlocked(80,100,1,true),true);
  assert.equal(isBlocked(8,8,0,false),true);
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
