import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context={};
vm.runInNewContext(fs.readFileSync(new URL('../game-core.js',import.meta.url),'utf8'),context);
const {TOTAL_FIREFLIES,MEMORY_DIALOGUE_TYPOGRAPHY,MEMORY_REVEAL_LAYOUT,MEMORY_REVEAL_TIMING,WATCHER_DIALOGUE,EXIT_STATES,addedTreeCells,areaComplete,canResolveEchoRune,countLights,countMemories,createAreas,createEchoReplay,createWorldObjects,exitStateAt,hiddenLightVisible,isBlocked,memoryRevealBoxForPlayer,memoryRevealStateAt,nextAreaIndex,watcherChoiceResult}=context.MoonwellCore;

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

test('collected memories hold long enough to read, then dissolve without motion when reduced',()=>{
  assert.equal(memoryRevealStateAt(0), 'holding');
  assert.equal(memoryRevealStateAt(MEMORY_REVEAL_TIMING.hold-.01), 'holding');
  assert.equal(memoryRevealStateAt(MEMORY_REVEAL_TIMING.hold), 'fading');
  assert.equal(memoryRevealStateAt(MEMORY_REVEAL_TIMING.hold+MEMORY_REVEAL_TIMING.fade-.01), 'fading');
  assert.equal(memoryRevealStateAt(MEMORY_REVEAL_TIMING.hold+MEMORY_REVEAL_TIMING.fade), 'hidden');
  assert.equal(memoryRevealStateAt(MEMORY_REVEAL_TIMING.hold,true), 'hidden');
});

test('memory reveals use a fixed in-canvas safe band with room for readable copy',()=>{
  assert.equal(JSON.stringify(memoryRevealBoxForPlayer(40)),JSON.stringify({x:24,y:124,w:272,h:64}));
  assert.equal(JSON.stringify(memoryRevealBoxForPlayer(140)),JSON.stringify({x:24,y:12,w:272,h:64}));
  assert.equal(MEMORY_REVEAL_LAYOUT.maxLineChars,42);
  assert.equal(MEMORY_REVEAL_LAYOUT.maxLines,3);
  assert.deepEqual(JSON.parse(JSON.stringify(MEMORY_DIALOGUE_TYPOGRAPHY)),{bodyPx:13,titlePx:14,lineHeight:1.45});
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

test('each exit stays a solid one-cell tree until its fully parted state',()=>{
  const areas=createAreas();
  areas.forEach((area,index)=>{
    const col=Math.floor(area.home.x/16),row=Math.floor(area.home.y/16);
    for(const state of [EXIT_STATES.CLOSED,EXIT_STATES.OPENING,EXIT_STATES.REVEALED]){
      const exit=createWorldObjects(index,false,state).find(object=>object.id===`exit-tree-${index}`);
      assert.deepEqual({x:exit.x,y:exit.y,w:exit.w,h:exit.h,solid:exit.solid,state:exit.state},{x:col*16,y:row*16,w:16,h:16,solid:true,state});
    }
    const openExit=createWorldObjects(index,false,EXIT_STATES.OPEN).find(object=>object.id===`exit-tree-${index}`);
    assert.equal(openExit.solid,false);
  });
});

test('the exit tree state sequence cannot remove its collider before the fully parted glimmer',()=>{
  assert.equal(exitStateAt(0),EXIT_STATES.OPENING);
  assert.equal(exitStateAt(.74),EXIT_STATES.OPENING);
  assert.equal(exitStateAt(.75),EXIT_STATES.REVEALED);
  assert.equal(exitStateAt(1.99),EXIT_STATES.REVEALED);
  assert.equal(exitStateAt(2),EXIT_STATES.OPEN);
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

test('every approved side-forest cluster has ten one-cell solid trees and preserves the marked routes',()=>{
  const areas=createAreas();
  const requiredRoutes=[
    [areas[0].start,...areas[0].lights,areas[0].home],
    [areas[1].start,areas[1].flower,{x:160,y:88},{x:160,y:144},areas[1].home],
    [areas[2].start,...areas[2].runes,areas[2].home],
    [areas[3].start,...areas[3].bells,...areas[3].lights,areas[3].home]
  ];
  const routeExists=(areaIndex,bridge,start,target)=>{
    const objects=createWorldObjects(areaIndex,bridge,EXIT_STATES.OPEN);
    const blocked=(x,y)=>objects.some(object=>object.solid&&x>=object.x&&x<object.x+object.w&&y>=object.y&&y<object.y+object.h);
    const canStand=(x,y)=>![[x-5,y-5],[x+5,y-5],[x-5,y+5],[x+5,y+5]].some(([pointX,pointY])=>blocked(pointX,pointY));
    const queue=[[start.x,start.y]],seen=new Set([`${start.x},${start.y}`]);
    while(queue.length){const [x,y]=queue.shift();if(Math.hypot(x-target.x,y-target.y)<10)return true;for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){const nextX=x+dx,nextY=y+dy,key=`${nextX},${nextY}`;if(nextX<6||nextX>314||nextY<6||nextY>194||seen.has(key)||!canStand(nextX,nextY))continue;seen.add(key);queue.push([nextX,nextY])}}
    return false;
  };
  addedTreeCells.forEach((cells,areaIndex)=>{
    assert.equal(cells.length,10);
    const objects=createWorldObjects(areaIndex,areaIndex===1);
    cells.forEach(([col,row])=>{const tree=objects.find(object=>object.x===col*16&&object.y===row*16);assert.deepEqual({w:tree.w,h:tree.h,solid:tree.solid},{w:16,h:16,solid:true})});
    requiredRoutes[areaIndex].slice(1).reduce((from,to)=>{assert.equal(routeExists(areaIndex,areaIndex===1,from,to),true,`area ${areaIndex}: ${from.x},${from.y} to ${to.x},${to.y}`);return to},requiredRoutes[areaIndex][0]);
  });
});

test('hidden fireflies follow their area-specific encounter gates',()=>{
  assert.equal(hiddenLightVisible(2,false,false),false);
  assert.equal(hiddenLightVisible(2,true,false),true);
  assert.equal(hiddenLightVisible(3,true,false),false);
  assert.equal(hiddenLightVisible(3,false,true),true);
});

test('the Hollow echo retraces Luna from the casting rune to the remembered rune',()=>{
  const runes=createAreas()[2].runes;
  const trail=[{x:runes[0].x,y:runes[0].y},{x:216,y:118},{x:runes[1].x,y:runes[1].y}];
  const replay=createEchoReplay(trail,runes[0]);
  assert.deepEqual(replay,[trail[2],trail[1],trail[0]]);
  assert.equal(createEchoReplay(trail.slice(1),runes[0]).length,0);
});

test('the Hollow only resolves when Luna reaches rune three while the echo holds rune one',()=>{
  const runes=createAreas()[2].runes;
  assert.equal(canResolveEchoRune(2,true,runes[2],runes),true);
  assert.equal(canResolveEchoRune(2,false,runes[2],runes),false);
  assert.equal(canResolveEchoRune(1,true,runes[2],runes),false);
  assert.equal(canResolveEchoRune(2,true,runes[1],runes),false);
});

test('Whispering Hollow keeps a collision-safe route through the three echo runes',()=>{
  const runes=createAreas()[2].runes;
  const canStand=(x,y)=>![[x-5,y-5],[x+5,y-5],[x-5,y+5],[x+5,y+5]].some(([pointX,pointY])=>isBlocked(pointX,pointY,2,false));
  const routeExists=(start,target)=>{
    const queue=[[start.x,start.y]],seen=new Set([`${start.x},${start.y}`]);
    while(queue.length){
      const [x,y]=queue.shift();
      if(Math.hypot(x-target.x,y-target.y)<8)return true;
      for(const [deltaX,deltaY] of [[2,0],[-2,0],[0,2],[0,-2]]){
        const nextX=x+deltaX,nextY=y+deltaY,key=`${nextX},${nextY}`;
        if(nextX<6||nextX>314||nextY<6||nextY>194||seen.has(key)||!canStand(nextX,nextY))continue;
        seen.add(key);queue.push([nextX,nextY]);
      }
    }
    return false;
  };
  assert.equal(routeExists(runes[0],runes[1]),true);
  assert.equal(routeExists(runes[1],runes[2]),true);
});

test('area progression ends cleanly at Starfall Grove',()=>{
  const areas=createAreas();
  assert.equal(nextAreaIndex(0,areas),1);
  assert.equal(nextAreaIndex(2,areas),3);
  assert.equal(nextAreaIndex(3,areas),null);
});

test('Eir is a one-cell, non-blocking Moonroot encounter with a retryable memory riddle',()=>{
  const watcher=createAreas()[1].watcher;
  assert.deepEqual(JSON.parse(JSON.stringify(watcher)),{x:264,y:48});
  assert.equal(isBlocked(watcher.x,watcher.y,1,false),false);
  assert.equal(WATCHER_DIALOGUE.choices.length,2);
  assert.equal(watcherChoiceResult(0).correct,true);
  assert.equal(watcherChoiceResult(1).correct,false);
  assert.match(watcherChoiceResult(1).reply,/no harm/i);
});
