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
    'assets/moonwell-art/production/moonwell-clearing-crescent-landmark-v4.png':[96,128],
    'assets/moonwell-art/production/moonwell-clearing-canopy-v2.png':[512,112],
    'assets/moonwell-art/production/moonwell-clearing-loam-patches-v2.png':[640,96],
    'assets/moonwell-art/production/moonwell-clearing-moonlight-v3.png':[576,112],
    'assets/moonwell-art/production/moonwell-crescent-exit-overhang-v3.png':[320,112],
    'assets/moonwell-art/production/moonwell-clearing-root-platform-v2.png':[192,64],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-idle-v1.png':[256,96],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-portrait-v1.png':[512,512],
    'assets/moonwell-art/production/moonwell-foliage-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-ground-texture-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-stone-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-mushroom-variants-v1.png':[32,16],
    'assets/moonwell-art/production/moonwell-clearing-firefly-loop-v5.png':[64,16],
    'assets/moonwell-art/production/moonwell-light-pool-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-starroot-chime-loop-v1.png':[96,24]
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
    'moonwell-clearing-crescent-landmark-v4.png',
    'moonwell-clearing-canopy-v2.png',
    'moonwell-clearing-loam-patches-v2.png',
    'moonwell-clearing-moonlight-v3.png',
    'moonwell-crescent-exit-overhang-v3.png',
    'moonwell-clearing-root-platform-v2.png',
    'moonwell-eir-rootwatcher-idle-v1.png',
    'moonwell-eir-rootwatcher-portrait-v1.png',
    'moonwell-foliage-variants-v1.png',
    'moonwell-ground-texture-variants-v1.png',
    'moonwell-stone-variants-v1.png',
    'moonwell-mushroom-variants-v1.png',
    'moonwell-clearing-firefly-loop-v5.png',
    'moonwell-light-pool-variants-v1.png',
    'moonwell-starroot-chime-loop-v1.png'
  ].forEach(asset=>assert.match(source,new RegExp(asset.replaceAll('.','\\.'))));
  assert.doesNotMatch(source,/selected-forest-production-source|luminous-forest-production-source|bottom-right-clearing-source|eir-rootwatcher-(?:sprite|portrait)-source|320x208-art-direction-source/);
});

test('corrected clearing renderer keeps a dominant light pool and separates perimeter from interior scale',()=>{
  const source=read('game.js').toString();
  assert.match(source,/perimeter\?40:24/);
  assert.match(source,/w:112,h:66,alpha:\.9/);
  assert.match(source,/state==='closed'.*crescentLandmark/);
  assert.match(source,/object\.x-8,object\.y-8,48,24/);
});

test('Starfall uses grounded starroot art and contains no sky-bell runtime path or copy',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString(),html=read('index.html').toString();
  assert.match(source,/moonwell-starroot-chime-loop-v1\.png/);
  assert.match(source+core,/starroot chime/i);
  assert.doesNotMatch(source+core+html,/skybell|sky-bell|\.bells\b/);
  assert.match(html,/game-core\.js\?v=moonwell-rooted-contact-4/);
  assert.match(html,/game\.js\?v=moonwell-rooted-contact-4/);
});

test('Luna remains one-cell controlled while rendering smaller than ordinary rooted landmarks',()=>{
  const source=read('game.js').toString();
  assert.match(source,/player\.y-17/);
  assert.match(source,/frame\*16,0,16,16,-7,0,14,18/);
  assert.match(source,/canMove=.*wall\(x-5,y-5\).*wall\(x\+5,y\+5\)/);
});

test('Eir dialogue uses raster production art and has no SVG or drawn-sigil fallback',()=>{
  const source=read('game.js').toString();
  const html=read('index.html').toString();
  assert.match(source,/moonwell-eir-rootwatcher-idle-v1\.png/);
  assert.match(source,/moonwell-eir-rootwatcher-portrait-v1\.png/);
  assert.match(source,/data-qa-required','Eir dialogue/);
  assert.match(html,/<canvas[^>]+width="640"[^>]+height="416"/);
  assert.match(html,/\.watcher-dialogue\[hidden\]\{display:none\}/);
  assert.doesNotMatch(source+html,/eir[^\n"']*\.svg|watcher-dialogue__sigil/i);
});

test('normal keyboard and touch presses produce deterministic collision-aware movement',()=>{
  const source=read('game.js').toString();
  assert.match(source,/function keyNudge\(direction\).*canMove\(player\.x\+dx,player\.y\)/);
  assert.match(source,/if\(!event\.repeat\)keyNudge\(direction\)/);
  assert.match(source,/keyNudge\(steer\(event\)\)/);
});
