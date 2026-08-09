import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const context={};
vm.runInNewContext(fs.readFileSync(new URL('../game-core.js',import.meta.url),'utf8'),context);
const {TILE_SIZE,WORLD_WIDTH,WORLD_HEIGHT,RENDER_SCALE,RENDER_WIDTH,RENDER_HEIGHT,VISUAL_FOOTPRINTS,TOP_CANOPY_LAYOUT,TOP_CANOPY_ROOT_CELLS,BOTTOM_FOREST_LAYOUT,SIDE_FOREST_LAYOUT,INTERIOR_FOREST_LAYOUT,LOAM_PATCH_LAYOUT,GROUND_DECOR_LAYOUT,MOONLIGHT_POOL_LAYOUT,TOTAL_FIREFLIES,MEMORY_DIALOGUE_TYPOGRAPHY,MEMORY_REVEAL_LAYOUT,MEMORY_REVEAL_TIMING,WATCHER_DIALOGUE,MOONROOT_BRIDGE_LAYOUT,STARFALL_ALTAR,STARFALL_ALTAR_STATES,EXIT_STATES,EXIT_CLEARING,addedTreeCells,areaComplete,canResolveEchoRune,collisionRectFor,countLights,countMemories,createAreas,createEchoReplay,createGroundDecor,createWorldObjects,exitStateAt,hiddenLightVisible,isBlocked,memoryRevealBoxForPlayer,memoryRevealStateAt,nextAreaIndex,starfallAltarState,watcherChoiceResult}=context.MoonwellCore;

test('the canonical world is a complete 20 by 13 tile canvas',()=>{
  assert.equal(TILE_SIZE,16);
  assert.equal(WORLD_WIDTH,320);
  assert.equal(WORLD_HEIGHT,208);
  const bottom=createWorldObjects(0,false).filter(object=>object.id.startsWith('edge-bottom-'));
  assert.equal(bottom.length,20);
  bottom.forEach(object=>assert.deepEqual({y:object.y,w:object.w,h:object.h},{y:192,w:16,h:16}));
});

test('logical cells are decoupled from the two-times luminous render surface',()=>{
  assert.deepEqual({RENDER_SCALE,RENDER_WIDTH,RENDER_HEIGHT},{RENDER_SCALE:2,RENDER_WIDTH:640,RENDER_HEIGHT:416});
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.tree)),{
    logical:{cellsWide:1,cellsHigh:1,solid:true,colliderWidth:20,colliderHeight:12,colliderOffsetX:-2,colliderOffsetY:4},visual:{perimeterWidth:40,perimeterHeight:56,interiorWidth:24,interiorHeight:40,overhangTop:40,overhangBottom:0}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.exitTree)),{
    logical:{cellsWide:1,cellsHigh:1,solidUntil:'open'},visual:{width:64,height:72,overhangLeft:24,overhangRight:24,overhangTop:56,overhangBottom:0}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.rootPlatform)),{
    logical:{cellsWide:2,cellsHigh:1,solid:true,colliderWidth:40,colliderHeight:14,colliderOffsetX:-4,colliderOffsetY:2},visual:{width:48,height:24,overhangLeft:4,overhangRight:4,overhangTop:8,overhangBottom:0}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.keeper)),{
    logical:{colliderWidth:10,colliderHeight:10,solid:true},visual:{width:14,height:18,anchorOffsetX:-7,anchorOffsetY:-17}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.starrootChime)),{
    logical:{cellsWide:1,cellsHigh:1,solid:false,interactionRadius:15},visual:{width:24,height:24,anchorOffsetX:-12,anchorOffsetY:-16}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.moonwellAltar)),{
    logical:{cellsWide:2,cellsHigh:2,solid:true,colliderWidth:28,colliderHeight:8,colliderOffsetX:-14,colliderOffsetY:-8,interactionRadius:22},visual:{width:32,height:24,anchorOffsetX:-16,anchorOffsetY:-24}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.glowmoss)),{
    logical:{solid:false,collectible:false},visual:{width:16,height:16}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.eir)),{
    logical:{cellsWide:1,cellsHigh:1,solid:false,interactionRadius:22},visual:{width:16,height:24,anchorOffsetX:-8,anchorOffsetY:-22}
  });
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.canopyCurtain)),{
    logical:{cellsWide:20,cellsHigh:1,rootRow:2,solid:true,colliderWidth:20,colliderHeight:12,colliderOffsetX:-2,colliderOffsetY:4},visual:{width:128,height:56,clusters:3,rootContactY:48}
  });
});

test('the bottom forest varies retained spruce silhouettes without moving rooted blockers',()=>{
  assert.equal(BOTTOM_FOREST_LAYOUT.length,20);
  assert.equal(new Set(BOTTOM_FOREST_LAYOUT.map(item=>JSON.stringify(item))).size,20);
  assert.deepEqual([...new Set(BOTTOM_FOREST_LAYOUT.map(item=>item.frame))].sort(),[0,1,2]);
  assert.ok(BOTTOM_FOREST_LAYOUT.some(item=>item.mirror));
  assert.ok(BOTTOM_FOREST_LAYOUT.some(item=>!item.mirror));
  assert.ok(Math.max(...BOTTOM_FOREST_LAYOUT.map(item=>item.width))-Math.min(...BOTTOM_FOREST_LAYOUT.map(item=>item.width))>=8);
  assert.ok(Math.max(...BOTTOM_FOREST_LAYOUT.map(item=>item.height))-Math.min(...BOTTOM_FOREST_LAYOUT.map(item=>item.height))>=8);
  for(let areaIndex=0;areaIndex<4;areaIndex++)createWorldObjects(areaIndex,false).filter(object=>object.id.startsWith('edge-bottom-')).forEach((object,col)=>{
    assert.deepEqual(JSON.parse(JSON.stringify(collisionRectFor(object))),{x:col*16-2,y:196,w:20,h:12});
  });
});

test('side forests vary retained spruce silhouettes without moving rooted blockers',()=>{
  for(const side of ['left','right']){
    const layout=SIDE_FOREST_LAYOUT[side];
    assert.equal(layout.length,11);
    assert.equal(new Set(layout.map(item=>JSON.stringify(item))).size,11);
    assert.deepEqual([...new Set(layout.map(item=>item.frame))].sort(),[0,1,2]);
    assert.ok(layout.some(item=>item.mirror));
    assert.ok(layout.some(item=>!item.mirror));
    assert.ok(Math.max(...layout.map(item=>item.width))-Math.min(...layout.map(item=>item.width))>=8);
    assert.ok(Math.max(...layout.map(item=>item.height))-Math.min(...layout.map(item=>item.height))>=8);
  }
  assert.equal(new Set([...SIDE_FOREST_LAYOUT.left,...SIDE_FOREST_LAYOUT.right].map(item=>JSON.stringify(item))).size,22);
  for(let areaIndex=0;areaIndex<4;areaIndex++){
    const objects=createWorldObjects(areaIndex,false);
    for(const [side,col] of [['left',0],['right',19]])objects.filter(object=>object.id.startsWith(`edge-${side}-`)).forEach((object,index)=>{
      assert.deepEqual(JSON.parse(JSON.stringify(collisionRectFor(object))),{x:col*16-2,y:(index+1)*16+4,w:20,h:12});
    });
  }
});

test('interior blockers vary retained spruce silhouettes without moving their rooted cells',()=>{
  assert.equal(INTERIOR_FOREST_LAYOUT.length,addedTreeCells.length);
  const records=INTERIOR_FOREST_LAYOUT.flat();
  assert.equal(records.length,39);
  assert.equal(new Set(records.map(item=>JSON.stringify(item))).size,records.length);
  INTERIOR_FOREST_LAYOUT.forEach((layout,areaIndex)=>{
    assert.equal(layout.length,addedTreeCells[areaIndex].length);
    assert.deepEqual([...new Set(layout.map(item=>item.frame))].sort(),[0,1,2]);
    assert.ok(layout.some(item=>item.mirror));
    assert.ok(layout.some(item=>!item.mirror));
    assert.ok(Math.max(...layout.map(item=>item.width))-Math.min(...layout.map(item=>item.width))>=6);
    assert.ok(Math.max(...layout.map(item=>item.height))-Math.min(...layout.map(item=>item.height))>=6);
    const objects=createWorldObjects(areaIndex,areaIndex===1);
    addedTreeCells[areaIndex].forEach(([col,row],index)=>{
      const object=objects.find(item=>item.id===`tree-${index}`);
      assert.deepEqual({x:object.x,y:object.y,w:object.w,h:object.h,solid:object.solid},{x:col*16,y:row*16,w:16,h:16,solid:true});
      assert.deepEqual(JSON.parse(JSON.stringify(collisionRectFor(object))),{x:col*16-2,y:row*16+4,w:20,h:12});
    });
  });
});

test('loam patches use distinct irregular retained-sprite layouts without adding geometry',()=>{
  assert.equal(LOAM_PATCH_LAYOUT.length,4);
  assert.equal(new Set(LOAM_PATCH_LAYOUT.map(layout=>JSON.stringify(layout))).size,4);
  LOAM_PATCH_LAYOUT.forEach(layout=>{
    assert.equal(layout.length,30);
    assert.deepEqual([...new Set(layout.map(patch=>patch.frame))].sort(),[0,1,2,3]);
    assert.ok(layout.some(patch=>patch.mirror));
    assert.ok(layout.some(patch=>!patch.mirror));
    assert.equal(new Set(layout.map(patch=>`${patch.x},${patch.y}`)).size,layout.length);
    layout.forEach(patch=>{
      assert.deepEqual({w:patch.w,h:patch.h},{w:80,h:48});
      assert.ok(patch.x%4===0&&patch.y%4===0,'loam patch leaves the four-pixel placement rhythm');
      assert.ok(patch.frame>=0&&patch.frame<4);
      assert.ok(patch.alpha>=.66&&patch.alpha<=.76);
      assert.equal('solid' in patch,false);
    });
  });
});

test('moonlight pools create distinct map-specific interaction hierarchy without adding geometry',()=>{
  assert.equal(MOONLIGHT_POOL_LAYOUT.length,4);
  assert.equal(new Set(MOONLIGHT_POOL_LAYOUT.map(layout=>JSON.stringify(layout))).size,4);
  const areas=createAreas(),targets=[
    [areas[0].lights[1],areas[0].home],
    [areas[1].watcher,{x:160,y:144}],
    [areas[2].runes[0],areas[2].runes[1]],
    [areas[3].altar,areas[3].starroots[2]]
  ];
  MOONLIGHT_POOL_LAYOUT.forEach((layout,areaIndex)=>{
    assert.equal(layout.length,2);
    const [dominant,secondary]=layout;
    assert.deepEqual({w:dominant.w,h:dominant.h},{w:112,h:66});
    assert.ok(secondary.w<dominant.w&&secondary.h<dominant.h);
    layout.forEach((pool,index)=>{
      assert.ok(pool.x%4===0&&pool.y%4===0,'moonlight leaves the four-pixel placement rhythm');
      assert.ok(pool.x>=0&&pool.y>=0&&pool.x+pool.w<=WORLD_WIDTH&&pool.y+pool.h<=WORLD_HEIGHT);
      assert.ok(pool.frame>=0&&pool.frame<3);
      assert.ok(pool.alpha>=.24&&pool.alpha<=.78);
      assert.equal('solid' in pool,false);
      const centre={x:pool.x+pool.w/2,y:pool.y+pool.h/2},target=targets[areaIndex][index];
      assert.ok(Math.hypot(centre.x-target.x,centre.y-target.y)<=33,`area ${areaIndex} pool ${index} loses its interaction anchor`);
    });
    assert.equal(createWorldObjects(areaIndex,areaIndex===1).some(object=>object.kind==='moonlight-pool'),false);
  });
  assert.equal(new Set(MOONLIGHT_POOL_LAYOUT.map(([pool])=>`${pool.x},${pool.y}`)).size,4);
});

test('every visible top-canopy root cell maps to a seam-free blocker in all four areas',()=>{
  assert.deepEqual(JSON.parse(JSON.stringify(TOP_CANOPY_LAYOUT)),[
    {x:-6,y:-3,w:128,h:56,frameOffset:0},
    {x:96,y:-4,w:128,h:56,frameOffset:1},
    {x:202,y:-2,w:128,h:56,frameOffset:0}
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(TOP_CANOPY_ROOT_CELLS)),Array.from({length:20},(_,col)=>[col,2]));
  for(let areaIndex=0;areaIndex<4;areaIndex++){
    const roots=createWorldObjects(areaIndex,areaIndex===1).filter(object=>object.kind==='canopy-root');
    assert.equal(roots.length,20);
    roots.forEach((root,col)=>{
      assert.deepEqual({id:root.id,x:root.x,y:root.y,w:root.w,h:root.h,solid:root.solid,collisionOnly:root.collisionOnly},{id:`canopy-root-${col}`,x:col*16,y:32,w:16,h:16,solid:true,collisionOnly:true});
      assert.deepEqual(JSON.parse(JSON.stringify(collisionRectFor(root))),{x:col*16-2,y:36,w:20,h:12});
      assert.equal(isBlocked(col*16+8,47,areaIndex,areaIndex===1),true,`area ${areaIndex}, canopy root ${col}`);
    });
  }
});

test('all area spawns sit below visible tree roots on clear reachable cells',()=>{
  const canStand=(objects,x,y)=>![[x-5,y-5],[x+5,y-5],[x-5,y+5],[x+5,y+5]].some(([pointX,pointY])=>objects.some(object=>object.solid&&pointX>=collisionRectFor(object).x&&pointX<collisionRectFor(object).x+collisionRectFor(object).w&&pointY>=collisionRectFor(object).y&&pointY<collisionRectFor(object).y+collisionRectFor(object).h));
  createAreas().forEach((area,areaIndex)=>{
    assert.equal(canStand(createWorldObjects(areaIndex,areaIndex===1),area.start.x,area.start.y),true,`${area.name} spawn`);
    assert.ok(area.start.y>=72,`${area.name} remains below the top-canopy contact face`);
  });
});

test('top-edge collectibles and encounters stay on the clear side of the rooted boundary',()=>{
  const canStand=(objects,point)=>![[point.x-5,point.y-5],[point.x+5,point.y-5],[point.x-5,point.y+5],[point.x+5,point.y+5]].some(([pointX,pointY])=>objects.some(object=>object.solid&&pointX>=collisionRectFor(object).x&&pointX<collisionRectFor(object).x+collisionRectFor(object).w&&pointY>=collisionRectFor(object).y&&pointY<collisionRectFor(object).y+collisionRectFor(object).h));
  createAreas().forEach((area,areaIndex)=>{
    const objects=createWorldObjects(areaIndex,areaIndex===1);
    const interactives=[...area.lights,area.memory,area.watcher,...(area.runes||[]),...(area.starroots||[])].filter(Boolean).filter(point=>point.y<=72);
    interactives.forEach(point=>assert.equal(canStand(objects,point),true,`${area.name} top-edge anchor ${point.x},${point.y}`));
  });
});

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
  assert.equal(JSON.stringify(memoryRevealBoxForPlayer(40)),JSON.stringify({x:24,y:132,w:272,h:64}));
  assert.equal(JSON.stringify(memoryRevealBoxForPlayer(140)),JSON.stringify({x:24,y:12,w:272,h:64}));
  assert.equal(MEMORY_REVEAL_LAYOUT.maxLineChars,42);
  assert.equal(MEMORY_REVEAL_LAYOUT.maxLines,3);
  assert.deepEqual(JSON.parse(JSON.stringify(MEMORY_DIALOGUE_TYPOGRAPHY)),{bodyPx:13,titlePx:14,lineHeight:1.45});
});

test('Moonroot memory is an optional far-shore discovery, never bridge guidance',()=>{
  const memory=createAreas()[1].memory;
  assert.deepEqual({x:memory.x,y:memory.y},{x:280,y:168});
  assert.match(memory.text,/^On the far shore,/);
  assert.match(memory.text,/proof that another keeper once crossed safely\.$/);
  assert.doesNotMatch(memory.text,/open|riddle|answer|wake the bridge/i);
});

test('the Moonroot bridge is a narrow four-cell north-to-south crossing',()=>{
  assert.deepEqual(JSON.parse(JSON.stringify(MOONROOT_BRIDGE_LAYOUT)),{water:{firstCol:1,lastCol:18,firstRow:5,lastRow:8},bridge:{col:9,row:5,cols:2,rows:4}});
  assert.equal(isBlocked(160,100,1,false),true);
  assert.equal(isBlocked(160,100,1,true),false);
  assert.equal(isBlocked(160,132,1,true),false);
  assert.equal(isBlocked(80,100,1,true),true);
  assert.equal(isBlocked(8,8,0,false),true);
  const bridge=createWorldObjects(1,true).find(object=>object.kind==='bridge');
  assert.deepEqual(JSON.parse(JSON.stringify(bridge)),{id:'moonroot-bridge',kind:'bridge',x:144,y:80,w:32,h:64,solid:false,orientation:'vertical'});
});

test('Moonroot has a complete playable route from Eir to its lower shore only after all riddles open the bridge',()=>{
  const canStand=(x,y,bridge)=>![[x-5,y-5],[x+5,y-5],[x-5,y+5],[x+5,y+5]].some(([pointX,pointY])=>isBlocked(pointX,pointY,1,bridge));
  const routeExists=bridge=>{
    const start=[248,72],target=[248,168],queue=[start],seen=new Set([start.join(',')]);
    while(queue.length){
      const [x,y]=queue.shift();
      if(Math.hypot(x-target[0],y-target[1])<8)return true;
      for(const [deltaX,deltaY] of [[2,0],[-2,0],[0,2],[0,-2]]){
        const nextX=x+deltaX,nextY=y+deltaY,key=`${nextX},${nextY}`;
        if(nextX<6||nextX>314||nextY<6||nextY>202||seen.has(key)||!canStand(nextX,nextY,bridge))continue;
        seen.add(key);queue.push([nextX,nextY]);
      }
    }
    return false;
  };
  assert.equal(routeExists(false),false);
  assert.equal(routeExists(true),true);
});

test('the first three exits stay solid until parted while Starfall ends at its altar',()=>{
  const areas=createAreas();
  areas.slice(0,3).forEach((area,index)=>{
    const col=Math.floor(area.home.x/16),row=Math.floor(area.home.y/16);
    for(const state of [EXIT_STATES.CLOSED,EXIT_STATES.OPENING,EXIT_STATES.REVEALED]){
      const exit=createWorldObjects(index,false,state).find(object=>object.id===`exit-tree-${index}`);
      assert.deepEqual({x:exit.x,y:exit.y,w:exit.w,h:exit.h,solid:exit.solid,state:exit.state},{x:col*16,y:row*16,w:16,h:16,solid:true,state});
    }
    const openExit=createWorldObjects(index,false,EXIT_STATES.OPEN).find(object=>object.id===`exit-tree-${index}`);
    assert.equal(openExit.solid,false);
  });
  assert.equal(areas[3].home,undefined);
  assert.deepEqual(JSON.parse(JSON.stringify(areas[3].altar)),JSON.parse(JSON.stringify(STARFALL_ALTAR)));
  assert.equal(createWorldObjects(3,false).some(object=>object.kind==='exit-tree'),false);
  const base=createWorldObjects(3,false).find(object=>object.kind==='altar-base');
  assert.deepEqual(JSON.parse(JSON.stringify(base)),{id:'moonwell-altar-base',kind:'altar-base',x:176,y:104,w:28,h:8,solid:true,collisionOnly:true});
});

test('Starfall altar progresses from landmark to awakened return point',()=>{
  assert.equal(starfallAltarState(false,false),STARFALL_ALTAR_STATES.DORMANT);
  assert.equal(starfallAltarState(true,false),STARFALL_ALTAR_STATES.AWAKE);
  assert.equal(starfallAltarState(true,true),STARFALL_ALTAR_STATES.READY);
  assert.equal(isBlocked(190,108,3,false),true);
  assert.equal(isBlocked(190,96,3,false),false);
});

test('Starfall chimes retain one-tile non-solid interaction footprints',()=>{
  const objects=createWorldObjects(3,false);
  createAreas()[3].starroots.forEach(starroot=>{
    assert.equal(objects.some(object=>object.x===starroot.x&&object.y===starroot.y&&object.solid),false);
  });
});

test('the exit tree state sequence cannot remove its collider before the fully parted glimmer',()=>{
  assert.equal(exitStateAt(0),EXIT_STATES.OPENING);
  assert.equal(exitStateAt(.74),EXIT_STATES.OPENING);
  assert.equal(exitStateAt(.75),EXIT_STATES.REVEALED);
  assert.equal(exitStateAt(1.99),EXIT_STATES.REVEALED);
  assert.equal(exitStateAt(2),EXIT_STATES.OPEN);
});

test('the route cue opens as a phone-legible one-tile clearing without widening the exit collider',()=>{
  assert.deepEqual(JSON.parse(JSON.stringify(VISUAL_FOOTPRINTS.exitTree)),{logical:{cellsWide:1,cellsHigh:1,solidUntil:'open'},visual:{width:64,height:72,overhangLeft:24,overhangRight:24,overhangTop:56,overhangBottom:0}});
  assert.deepEqual(JSON.parse(JSON.stringify(EXIT_CLEARING)),{closed:{width:6,pathWidth:4},opening:{width:10,pathWidth:6},revealed:{width:14,pathWidth:10},open:{width:16,pathWidth:12},top:-24,height:40,thresholdY:30});
  assert.ok(EXIT_CLEARING.closed.width<EXIT_CLEARING.opening.width);
  assert.ok(EXIT_CLEARING.opening.width<EXIT_CLEARING.revealed.width);
  assert.ok(EXIT_CLEARING.revealed.width<EXIT_CLEARING.open.width);
  assert.equal(EXIT_CLEARING.open.width,TILE_SIZE);
  assert.ok(EXIT_CLEARING.open.pathWidth<EXIT_CLEARING.open.width);
  createAreas().slice(0,3).forEach((area,index)=>{
    const rooted=createWorldObjects(index,false,EXIT_STATES.REVEALED).find(object=>object.id===`exit-tree-${index}`);
    const open=createWorldObjects(index,false,EXIT_STATES.OPEN).find(object=>object.id===`exit-tree-${index}`);
    assert.deepEqual(collisionRectFor(rooted),collisionRectFor(open));
    assert.equal(rooted.solid,true);
    assert.equal(open.solid,false);
  });
});

test('world records keep rooted blockers to their perceived contact footprint',()=>{
  const glade=createWorldObjects(0,false);
  const tree=glade.find(object=>object.id==='tree-0');
  assert.deepEqual({x:tree.x,y:tree.y,w:tree.w,h:tree.h,solid:tree.solid},{x:32,y:80,w:16,h:16,solid:true});
  assert.deepEqual(JSON.parse(JSON.stringify(collisionRectFor(tree))),{x:30,y:84,w:20,h:12});
  assert.equal(isBlocked(32,84,0,false),true);
  assert.equal(isBlocked(32,83,0,false),false);
  assert.equal(isBlocked(112,32,0,false),false);
  const hollow=createWorldObjects(2,false);
  const sentinel=hollow.find(object=>object.id==='sentinel');
  assert.deepEqual({x:sentinel.x,y:sentinel.y,w:sentinel.w,h:sentinel.h},{x:144,y:96,w:32,h:32});
  assert.equal(isBlocked(144,96,2,false),true);
  assert.equal(isBlocked(175,127,2,false),true);
  assert.equal(isBlocked(176,127,2,false),false);
  const platform=glade.find(object=>object.kind==='platform');
  assert.deepEqual({w:platform.w,h:platform.h,solid:platform.solid},{w:32,h:16,solid:true});
  assert.deepEqual(JSON.parse(JSON.stringify(collisionRectFor(platform))),{x:124,y:50,w:40,h:14});
});

test('tree and platform contact stops Luna from every direction without blocking clear overhang',()=>{
  const objects=createWorldObjects(0,false).filter(object=>object.solid);
  for(const object of [objects.find(item=>item.id==='tree-0'),objects.find(item=>item.kind==='platform')]){
    const canStand=(x,y)=>![[x-5,y-5],[x+5,y-5],[x-5,y+5],[x+5,y+5]].some(([pointX,pointY])=>{const collider=collisionRectFor(object);return pointX>=collider.x&&pointX<collider.x+collider.w&&pointY>=collider.y&&pointY<collider.y+collider.h});
    const sweep=(startX,startY,dx,dy)=>{let x=startX,y=startY;for(let step=0;step<40;step++){const nextX=x+dx,nextY=y+dy;if(!canStand(nextX,nextY))break;x=nextX;y=nextY}return{x,y}};
    const collider=collisionRectFor(object),midX=collider.x+collider.w/2,midY=collider.y+collider.h/2;
    const left=sweep(collider.x-24,midY,2,0),right=sweep(collider.x+collider.w+24,midY,-2,0),top=sweep(midX,collider.y-24,0,2),bottom=sweep(midX,collider.y+collider.h+24,0,-2);
    assert.ok(left.x+5<=collider.x&&collider.x-(left.x+5)<2,`${object.id} left contact`);
    assert.ok(right.x-5>=collider.x+collider.w&&right.x-5-(collider.x+collider.w)<2,`${object.id} right contact`);
    assert.ok(top.y+5<=collider.y&&collider.y-(top.y+5)<2,`${object.id} top contact`);
    assert.ok(bottom.y-5>=collider.y+collider.h&&bottom.y-5-(collider.y+collider.h)<2,`${object.id} bottom contact`);
  }
  const tree=objects.find(item=>item.id==='tree-0'),platform=objects.find(item=>item.kind==='platform');
  const canStandAgainst=(object,x,y)=>![[x-5,y-5],[x+5,y-5],[x-5,y+5],[x+5,y+5]].some(([pointX,pointY])=>{const collider=collisionRectFor(object);return pointX>=collider.x&&pointX<collider.x+collider.w&&pointY>=collider.y&&pointY<collider.y+collider.h});
  assert.equal(canStandAgainst(tree,tree.x+8,tree.y-2),true,'tree canopy overhang remains passable behind its root base');
  assert.equal(canStandAgainst(platform,platform.x+16,platform.y-4),true,'platform top overhang remains passable behind its contact face');
});

test('every tree and root platform instance in all four areas uses the declared collider contract',()=>{
  for(let areaIndex=0;areaIndex<4;areaIndex++)for(const object of createWorldObjects(areaIndex,areaIndex===1)){
    const collider=collisionRectFor(object);
    if(object.kind==='tree')assert.deepEqual(JSON.parse(JSON.stringify(collider)),{x:object.x-2,y:object.y+4,w:20,h:12});
    if(object.kind==='platform')assert.deepEqual(JSON.parse(JSON.stringify(collider)),{x:object.x-4,y:object.y+2,w:40,h:14});
  }
});

test('Lantern Glade composes its corrected landmark clearing without changing simple collider rules',()=>{
  const area=createAreas()[0];
  assert.deepEqual(JSON.parse(JSON.stringify(area.home)),{x:280,y:72});
  const objects=createWorldObjects(0,false);
  const exit=objects.find(object=>object.kind==='exit-tree');
  const platforms=objects.filter(object=>object.kind==='platform');
  assert.deepEqual({x:exit.x,y:exit.y,w:exit.w,h:exit.h,solid:exit.solid},{x:272,y:64,w:16,h:16,solid:true});
  assert.equal(platforms.length,1);
  assert.deepEqual({x:platforms[0].x,y:platforms[0].y,w:platforms[0].w,h:platforms[0].h},{x:128,y:48,w:32,h:16});
});

test('ground enrichment is deterministic, one-cell, and never adds collision',()=>{
  assert.equal(GROUND_DECOR_LAYOUT.length,4);
  const visualPositionsByKind=new Map();
  for(let areaIndex=0;areaIndex<4;areaIndex++){
    const first=createGroundDecor(areaIndex),second=createGroundDecor(areaIndex);
    assert.equal(JSON.stringify(first),JSON.stringify(second));
    assert.equal(first.length,14);
    assert.ok(first.some(item=>item.mirror));
    assert.ok(first.some(item=>!item.mirror));
    assert.deepEqual([...new Set(first.map(item=>item.frame))].sort(),[0,1,2]);
    first.forEach(item=>{
      assert.deepEqual({w:item.w,h:item.h,solid:item.solid},{w:16,h:16,solid:false});
      assert.ok(item.xOffset>=-2&&item.xOffset<=2);
      assert.ok(item.yOffset>=-1&&item.yOffset<=1);
      assert.ok(item.alpha>=.26&&item.alpha<=.92);
      assert.ok(item.frame>=0&&item.frame<=(item.kind==='mushroom'?1:2));
      const positions=visualPositionsByKind.get(item.kind)||new Set(),position=`${item.x+item.xOffset},${item.y+item.yOffset}`;
      assert.equal(positions.has(position),false,`${item.kind} repeats at ${position} across maps`);
      positions.add(position);visualPositionsByKind.set(item.kind,positions);
    });
  }
});

test('keepers, exits, collectibles, and ordinary interactives use tile-centred anchors',()=>{
  const centred=point=>point.x%16===8&&point.y%16===8;
  for(const area of createAreas()){
    assert.equal(centred(area.start),true);
    if(area.home)assert.equal(centred(area.home),true);
    area.lights.forEach(light=>assert.equal(centred(light),true));
    if(area.memory)assert.equal(centred(area.memory),true);
    if(area.watcher)assert.equal(centred(area.watcher),true);
    area.runes?.forEach(rune=>assert.equal(centred(rune),true));
    area.starroots?.forEach(starroot=>assert.equal(centred(starroot),true));
  }
});

test('every intended route has an eight-pixel comfort envelope around trees and props',()=>{
  const areas=createAreas();
  const requiredRoutes=[
    [areas[0].start,...areas[0].lights,areas[0].memory,areas[0].home],
    [areas[1].start,areas[1].watcher,{x:160,y:72},{x:160,y:152},...areas[1].lights,areas[1].memory,areas[1].home],
    [areas[2].start,...areas[2].runes,...areas[2].lights,areas[2].memory,areas[2].home],
    [areas[3].start,...areas[3].starroots,...areas[3].lights,areas[3].altar]
  ];
  const routeExists=(areaIndex,bridge,start,target)=>{
    const objects=createWorldObjects(areaIndex,bridge,EXIT_STATES.OPEN);
    const comfortRadius=8;
    const canStand=(x,y)=>!objects.some(object=>{if(!object.solid)return false;const collider=collisionRectFor(object);return x+comfortRadius>collider.x&&x-comfortRadius<collider.x+collider.w&&y+comfortRadius>collider.y&&y-comfortRadius<collider.y+collider.h});
    const queue=[[start.x,start.y]],seen=new Set([`${start.x},${start.y}`]);
    while(queue.length){const [x,y]=queue.shift();if(Math.hypot(x-target.x,y-target.y)<10)return true;for(const [dx,dy] of [[2,0],[-2,0],[0,2],[0,-2]]){const nextX=x+dx,nextY=y+dy,key=`${nextX},${nextY}`;if(nextX<6||nextX>314||nextY<6||nextY>202||seen.has(key)||!canStand(nextX,nextY))continue;seen.add(key);queue.push([nextX,nextY])}}
    return false;
  };
  addedTreeCells.forEach((cells,areaIndex)=>{
    assert.equal(cells.length,areaIndex===2?9:10);
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
        if(nextX<6||nextX>314||nextY<6||nextY>202||seen.has(key)||!canStand(nextX,nextY))continue;
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

test('Eir is a half-size, non-blocking Moonroot encounter with three retryable riddles',()=>{
  const watcher=createAreas()[1].watcher;
  assert.deepEqual(JSON.parse(JSON.stringify(watcher)),{x:248,y:72});
  assert.equal(isBlocked(watcher.x,watcher.y,1,false),false);
  assert.equal('flower' in createAreas()[1],false);
  assert.equal(WATCHER_DIALOGUE.riddles.length,3);
  const firstWrong=watcherChoiceResult(0,1);
  assert.deepEqual({correct:firstWrong.correct,complete:firstWrong.complete,nextStep:firstWrong.nextStep},{correct:false,complete:false,nextStep:0});
  assert.match(firstWrong.reply,/try once more/i);
  const firstCorrect=watcherChoiceResult(0,0);
  assert.deepEqual({correct:firstCorrect.correct,complete:firstCorrect.complete,nextStep:firstCorrect.nextStep},{correct:true,complete:false,nextStep:1});
  const secondCorrect=watcherChoiceResult(1,0);
  assert.deepEqual({correct:secondCorrect.correct,complete:secondCorrect.complete,nextStep:secondCorrect.nextStep},{correct:true,complete:false,nextStep:2});
  const finalWrong=watcherChoiceResult(2,0);
  assert.deepEqual({correct:finalWrong.correct,complete:finalWrong.complete,nextStep:finalWrong.nextStep},{correct:false,complete:false,nextStep:2});
  const finalCorrect=watcherChoiceResult(2,1);
  assert.deepEqual({correct:finalCorrect.correct,complete:finalCorrect.complete,nextStep:finalCorrect.nextStep},{correct:true,complete:true,nextStep:3});
});
