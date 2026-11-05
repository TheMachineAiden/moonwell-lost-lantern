import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { gameHarness } from './support/game-harness.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => readFileSync(join(root, path));
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
const dimensions = path => { const png = read(path); assert.equal(png.subarray(1,4).toString(), 'PNG'); return [png.readUInt32BE(16), png.readUInt32BE(20)]; };
const rgba = path => execFileSync('magick', [join(root,path), '-alpha','on','-depth','8','rgba:-'], {maxBuffer:16*1024*1024});
const contract = JSON.parse(read('assets/moonwell-art/homecoming-art.json'));
const production = 'assets/moonwell-art/production/';
const characters = new Set(['moonwell-keeper-walk-v7.png','moonwell-keeper-echo-v1.png','moonwell-eir-empty-hand-idle-v1.png','moonwell-traveller-adult-walk-v1.png','moonwell-traveller-child-walk-v1.png']);
const environmental = new Set(['moonwell-spruce-overhang-v3.png','moonwell-homecoming-loam-tiles-v1.png','moonwell-homecoming-lantern-loop-v1.png','moonwell-homecoming-path-v1.png','moonwell-homecoming-forest-edge-v1.png','moonwell-hollow-bank-v2.png','moonwell-home-window-v1.png','moonwell-homecoming-well-v1.png','moonwell-root-shelf-variants-v2.png','moonwell-water-tile-v4.png','moonwell-bridge-vertical-v5.png','moonwell-rune-stone-variants-v1.png','moonwell-light-pool-variants-v2.png','moonwell-firefly-variants-v2.png','moonwell-memory-loop-v3.png','moonwell-starroot-chime-variants-v5.png','moonwell-exit-clearing-states-v4.png','moonwell-foliage-variants-v2.png','moonwell-homecoming-lantern-off-v1.png']);
const forestLayers = ['moonwell-loam-base-tiles-v1.png','moonwell-clearing-loam-patches-v3.png','moonwell-clearing-moonlight-v4.png','moonwell-forest-atmosphere-v1.png','moonwell-ground-texture-variants-v2.png','moonwell-stone-variants-v2.png','moonwell-mushroom-variants-v2.png','moonwell-inner-forest-boundary-v1.png','moonwell-bottom-forest-clusters-v1.png'];
const forestRevisions = ['moonwell-hollow-bank-v3.png','moonwell-homecoming-path-v2.png'];

test('every loaded world image is a classified production PNG, including unchanged Luna and echo geometry', () => {
  const loaded = gameHarness({search:'?experience=classic'}).images.map(i => i.path);
  assert.deepEqual(new Set(loaded), new Set([...characters,...environmental].map(f => production+f)));
  assert.deepEqual(dimensions(production+'moonwell-keeper-walk-v7.png'), [104,40]);
  assert.deepEqual(dimensions(production+'moonwell-keeper-echo-v1.png'), [104,40]);
  assert.deepEqual(dimensions(production+'moonwell-spruce-overhang-v3.png'), [480,112]);
  for (const asset of contract.assets) if (asset.production_frame) {
    assert.deepEqual(dimensions(asset.production), [asset.production_frame[0]*asset.frames, asset.production_frame[1]]);
    assert.equal(asset.runtime_frame[0]/asset.production_frame[0], asset.runtime_frame[1]/asset.production_frame[1], asset.role+' has distorted scaling');
  }
});

test('restored forest mode reuses classified production raster layers', () => {
  const ordinary = new Set(gameHarness({search:'?experience=classic'}).images.map(i => i.path));
  const forest = gameHarness({search:'?scene=hollow&experience=forest'}).images.map(i => i.path);
  assert.deepEqual(new Set(forest.filter(p => !ordinary.has(p))), new Set([...forestLayers,...forestRevisions].map(p => production+p)));
});

test('new production derivatives and retained generation sources match their public provenance', () => {
  for (const asset of contract.assets) {
    assert.equal(hash(join(root,asset.production)), asset.production_sha256, asset.production);
    if (asset.source) assert.equal(hash(join(root,asset.source)), asset.source_sha256, asset.source);
    else assert.ok(read(asset.retained_source).length);
  }
});

test('current environmental raster family excludes prohibited purple pixels', () => {
  for (const file of new Set([...environmental,...forestLayers,...forestRevisions])) {
    const pixels = rgba(production+file);
    let prohibited = 0;
    for (let o=0;o<pixels.length;o+=4) {
      const [r,g,b,a]=pixels.subarray(o,o+4);
      if (a>15 && r>g*1.08 && b>g*1.12 && b>r*.58 && Math.max(r,b)-g>9) prohibited++;
    }
    assert.equal(prohibited,0,file);
  }
});

test('small actors retain opaque feet at their declared contact baseline', () => {
  for (const [file,fw,fh,baseline] of [
    ['moonwell-keeper-walk-v7.png',26,40,38], ['moonwell-keeper-echo-v1.png',26,40,38],
    ['moonwell-eir-empty-hand-idle-v1.png',64,96,83],
    ['moonwell-traveller-adult-walk-v1.png',32,48,43], ['moonwell-traveller-child-walk-v1.png',32,48,43],
  ]) {
    const pixels=rgba(production+file), width=fw*4;
    for (let frame=0;frame<4;frame++) {
      let bottom=-1;
      for(let y=0;y<fh;y++)for(let x=0;x<fw;x++) if(pixels[(y*width+frame*fw+x)*4+3]>127) bottom=y;
      assert.equal(bottom,baseline,`${file} frame ${frame}`);
    }
  }
});

test('the existing raster processors rebuild all new production images byte-identically in isolation', () => {
  const output=mkdtempSync(join(tmpdir(),'moonwell-art-test-'));
  try {
    const env={...process.env, MOONWELL_ART_OUTPUT:output, MOONWELL_ART_SCOPE:'homecoming'};
    execFileSync('sh',[join(root,'scripts/process-loam-base-art.sh')],{env,stdio:'pipe',timeout:120000});
    execFileSync('bash',[join(root,'scripts/process-moonwell-art.sh')],{env,stdio:'pipe',timeout:120000});
    for(const asset of contract.assets) assert.equal(hash(join(output,asset.production.split('/').at(-1))),asset.production_sha256,asset.production);
  } finally { rmSync(output,{recursive:true,force:true}); }
});
