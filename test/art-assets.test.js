import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root));
const dimensions=path=>{const png=read(path);assert.equal(png.subarray(1,4).toString(),'PNG');return[png.readUInt32BE(16),png.readUInt32BE(20)]};
const context={globalThis:{}};
runInNewContext(read('game-core.js').toString(),context);

test('selected-reference production strips preserve exact tile footprints',()=>{
  const expected={
    'assets/moonwell-art/production/moonwell-keeper-walk-v5.png':[64,16],
    'assets/moonwell-art/production/moonwell-spruce-family-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-crescent-exit-states-v2.png':[64,16],
    'assets/moonwell-art/production/moonwell-root-platform-variants-v5.png':[64,16],
    'assets/moonwell-art/production/moonwell-foliage-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-ground-texture-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-stone-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-mushroom-variants-v1.png':[32,16],
    'assets/moonwell-art/production/moonwell-firefly-loop-v4.png':[64,16],
    'assets/moonwell-art/production/moonwell-light-pool-variants-v1.png':[48,16]
  };
  for(const [path,size] of Object.entries(expected))assert.deepEqual(dimensions(path),size,path);
});

test('all four areas receive the selected forest floor vocabulary without new collision',()=>{
  const required=['shadow','moon','fern','stone','needles','root','mushroom','firefly'];
  for(let area=0;area<4;area++){
    const decor=context.globalThis.MoonwellCore.createGroundDecor(area);
    required.forEach(kind=>assert.ok(decor.some(item=>item.kind===kind),`area ${area} lacks ${kind}`));
    decor.forEach(item=>assert.equal(item.solid,false));
  }
});

test('runtime references only compact derivatives, never the large selected source sheet',()=>{
  const source=read('game.js').toString();
  [
    'moonwell-keeper-walk-v5.png',
    'moonwell-spruce-family-v2.png',
    'moonwell-crescent-exit-states-v2.png',
    'moonwell-root-platform-variants-v5.png',
    'moonwell-foliage-variants-v1.png',
    'moonwell-ground-texture-variants-v1.png',
    'moonwell-stone-variants-v1.png',
    'moonwell-mushroom-variants-v1.png',
    'moonwell-firefly-loop-v4.png',
    'moonwell-light-pool-variants-v1.png'
  ].forEach(asset=>assert.match(source,new RegExp(asset.replaceAll('.','\\.'))));
  assert.doesNotMatch(source,/selected-forest-production-source|320x208-art-direction-source/);
});
