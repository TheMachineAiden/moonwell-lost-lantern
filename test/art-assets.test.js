import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root));
const dimensions=path=>{const png=read(path);assert.equal(png.subarray(1,4).toString(),'PNG');return[png.readUInt32BE(16),png.readUInt32BE(20)]};
const context={globalThis:{}};
runInNewContext(read('game-core.js').toString(),context);

test('luminous production assets preserve exact render footprints',()=>{
  const expected={
    'assets/moonwell-art/production/moonwell-keeper-walk-v5.png':[64,16],
    'assets/moonwell-art/production/moonwell-spruce-overhang-v2.png':[480,112],
    'assets/moonwell-art/production/moonwell-canopy-curtains-v1.png':[512,112],
    'assets/moonwell-art/production/moonwell-loam-patches-v1.png':[512,96],
    'assets/moonwell-art/production/moonwell-moonlight-pools-v2.png':[384,96],
    'assets/moonwell-art/production/moonwell-crescent-exit-overhang-v3.png':[320,112],
    'assets/moonwell-art/production/moonwell-root-platform-overhang-v1.png':[256,48],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-idle-v1.png':[256,96],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-portrait-v1.png':[512,512],
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

test('runtime references only production derivatives, never retained generation sources',()=>{
  const source=read('game.js').toString();
  [
    'moonwell-keeper-walk-v5.png',
    'moonwell-spruce-overhang-v2.png',
    'moonwell-canopy-curtains-v1.png',
    'moonwell-loam-patches-v1.png',
    'moonwell-moonlight-pools-v2.png',
    'moonwell-crescent-exit-overhang-v3.png',
    'moonwell-root-platform-overhang-v1.png',
    'moonwell-eir-rootwatcher-idle-v1.png',
    'moonwell-eir-rootwatcher-portrait-v1.png',
    'moonwell-foliage-variants-v1.png',
    'moonwell-ground-texture-variants-v1.png',
    'moonwell-stone-variants-v1.png',
    'moonwell-mushroom-variants-v1.png',
    'moonwell-firefly-loop-v4.png',
    'moonwell-light-pool-variants-v1.png'
  ].forEach(asset=>assert.match(source,new RegExp(asset.replaceAll('.','\\.'))));
  assert.doesNotMatch(source,/selected-forest-production-source|luminous-forest-production-source|eir-rootwatcher-(?:sprite|portrait)-source|320x208-art-direction-source/);
});

test('Eir dialogue uses raster production art and has no SVG or drawn-sigil fallback',()=>{
  const source=read('game.js').toString();
  const html=read('index.html').toString();
  assert.match(source,/moonwell-eir-rootwatcher-idle-v1\.png/);
  assert.match(source,/moonwell-eir-rootwatcher-portrait-v1\.png/);
  assert.match(source,/data-qa-required','Eir dialogue/);
  assert.match(html,/<canvas[^>]+width="640"[^>]+height="416"/);
  assert.doesNotMatch(source+html,/eir[^\n"']*\.svg|watcher-dialogue__sigil/i);
});
