import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {runInNewContext} from 'node:vm';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root));
const dimensions=path=>{const png=read(path);assert.equal(png.subarray(1,4).toString(),'PNG');return[png.readUInt32BE(16),png.readUInt32BE(20)]};
const rgba=path=>execFileSync('magick',[fileURLToPath(new URL(path,root)),'-alpha','on','-depth','8','rgba:-'],{maxBuffer:16*1024*1024});
const prohibited=(r,g,b,a)=>a>15&&r>g*1.08&&b>g*1.12&&b>r*.58&&Math.max(r,b)-g>9;
const characterProhibited=(r,g,b,a)=>a>15&&r>g*1.06&&b>g*1.10&&b>r*.30&&Math.max(r,b)-g>9;
const environmentalFrames={
  'assets/moonwell-art/production/moonwell-spruce-overhang-v3.png':80,
  'assets/moonwell-art/production/moonwell-clearing-crescent-landmark-v5.png':96,
  'assets/moonwell-art/production/moonwell-clearing-canopy-v3.png':256,
  'assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png':160,
  'assets/moonwell-art/production/moonwell-clearing-moonlight-v4.png':192,
  'assets/moonwell-art/production/moonwell-crescent-exit-overhang-v4.png':80,
  'assets/moonwell-art/production/moonwell-clearing-root-platform-v3.png':192,
  'assets/moonwell-art/production/moonwell-foliage-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-ground-texture-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-stone-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-mushroom-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-clearing-firefly-loop-v6.png':16,
  'assets/moonwell-art/production/moonwell-light-pool-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-memory-loop-v3.png':16,
  'assets/moonwell-art/production/moonwell-moonflower-v3.png':32,
  'assets/moonwell-art/production/moonwell-bridge-segment-v3.png':16,
  'assets/moonwell-art/production/moonwell-rune-stone-v3.png':32,
  'assets/moonwell-art/production/moonwell-starroot-chime-loop-v2.png':24,
  'assets/moonwell-art/production/moonwell-sentinel-tile-v5.png':32,
  'assets/moonwell-art/production/moonwell-altar-v3.png':64,
  'assets/moonwell-art/production/moonwell-water-tile-v3.png':16
};
const characterFrames={
  'assets/moonwell-art/production/moonwell-keeper-walk-v7.png':26,
  'assets/moonwell-art/production/moonwell-eir-rootwatcher-idle-v2.png':64,
  'assets/moonwell-art/production/moonwell-eir-rootwatcher-portrait-v2.png':512
};
const context={globalThis:{}};
runInNewContext(read('game-core.js').toString(),context);

test('luminous production assets preserve exact render footprints',()=>{
  const expected={
    'assets/moonwell-art/production/moonwell-keeper-walk-v7.png':[104,40],
    'assets/moonwell-art/production/moonwell-spruce-overhang-v3.png':[480,112],
    'assets/moonwell-art/production/moonwell-clearing-crescent-landmark-v5.png':[96,128],
    'assets/moonwell-art/production/moonwell-clearing-canopy-v3.png':[512,112],
    'assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png':[640,96],
    'assets/moonwell-art/production/moonwell-clearing-moonlight-v4.png':[576,112],
    'assets/moonwell-art/production/moonwell-crescent-exit-overhang-v4.png':[320,112],
    'assets/moonwell-art/production/moonwell-clearing-root-platform-v3.png':[192,64],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-idle-v2.png':[256,96],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-portrait-v2.png':[512,512],
    'assets/moonwell-art/production/moonwell-foliage-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-ground-texture-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-stone-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-mushroom-variants-v2.png':[32,16],
    'assets/moonwell-art/production/moonwell-clearing-firefly-loop-v6.png':[64,16],
    'assets/moonwell-art/production/moonwell-light-pool-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-starroot-chime-loop-v2.png':[96,24]
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
    'moonwell-keeper-walk-v7.png',
    'moonwell-spruce-overhang-v3.png',
    'moonwell-clearing-crescent-landmark-v5.png',
    'moonwell-clearing-canopy-v3.png',
    'moonwell-clearing-loam-patches-v3.png',
    'moonwell-clearing-moonlight-v4.png',
    'moonwell-crescent-exit-overhang-v4.png',
    'moonwell-clearing-root-platform-v3.png',
    'moonwell-eir-rootwatcher-idle-v2.png',
    'moonwell-eir-rootwatcher-portrait-v2.png',
    'moonwell-foliage-variants-v2.png',
    'moonwell-ground-texture-variants-v2.png',
    'moonwell-stone-variants-v2.png',
    'moonwell-mushroom-variants-v2.png',
    'moonwell-clearing-firefly-loop-v6.png',
    'moonwell-light-pool-variants-v2.png',
    'moonwell-starroot-chime-loop-v2.png'
  ].forEach(asset=>assert.match(source,new RegExp(asset.replaceAll('.','\\.'))));
  assert.doesNotMatch(source,/selected-forest-production-source|luminous-forest-production-source|bottom-right-clearing-source|eir-rootwatcher-(?:sprite|portrait)-source|320x208-art-direction-source/);
});

test('every runtime-loaded raster is explicitly classified for palette audit',()=>{
  const source=read('game.js').toString();
  const runtimeRasters=new Set([...source.matchAll(/assets\/moonwell-art\/production\/[a-z0-9-]+\.png/g)].map(match=>match[0]));
  const audited=new Set([...Object.keys(environmentalFrames),...Object.keys(characterFrames)]);
  assert.deepEqual([...runtimeRasters].sort(),[...audited].sort());
  for(const asset of Object.keys(characterFrames))assert.ok(runtimeRasters.has(asset),`${asset} lost its character palette audit`);
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
  assert.match(source,/moonwell-starroot-chime-loop-v2\.png/);
  assert.match(source+core,/starroot chime/i);
  assert.doesNotMatch(source+core+html,/skybell|sky-bell|\.bells\b/);
  assert.match(html,/game-core\.js\?v=moonwell-luna-exact-8/);
  assert.match(html,/game\.js\?v=moonwell-luna-half-9/);
});

test('environmental rasters contain no prohibited purple-family silhouette or seam pixels',()=>{
  for(const [asset,frameWidth] of Object.entries(environmentalFrames)){
    const [width,height]=dimensions(asset),pixels=rgba(asset);
    let prohibitedPixels=0,prohibitedEdges=0,prohibitedSeams=0;
    const alphaAt=(x,y)=>x<0||y<0||x>=width||y>=height?0:pixels[(y*width+x)*4+3];
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const offset=(y*width+x)*4,r=pixels[offset],g=pixels[offset+1],b=pixels[offset+2],a=pixels[offset+3];
      if(!prohibited(r,g,b,a))continue;
      prohibitedPixels++;
      if(alphaAt(x-1,y)<16||alphaAt(x+1,y)<16||alphaAt(x,y-1)<16||alphaAt(x,y+1)<16)prohibitedEdges++;
      if(x%frameWidth===0||x%frameWidth===frameWidth-1)prohibitedSeams++;
    }
    assert.equal(prohibitedPixels,0,`${asset} contains purple-family pixels`);
    assert.equal(prohibitedEdges,0,`${asset} recreates a purple silhouette`);
    assert.equal(prohibitedSeams,0,`${asset} recreates a purple tiled seam`);
  }
});

test('Eir retains the corrected no-purple character palette',()=>{
  for(const asset of Object.keys(characterFrames).filter(asset=>asset.includes('eir-rootwatcher'))){
    const pixels=rgba(asset);
    let prohibitedPixels=0;
    for(let offset=0;offset<pixels.length;offset+=4){
      if(characterProhibited(pixels[offset],pixels[offset+1],pixels[offset+2],pixels[offset+3]))prohibitedPixels++;
    }
    assert.equal(prohibitedPixels,0,`${asset} contains a prohibited character-palette pixel`);
  }
});

test('exact owner Luna source reduces literally to four readable padded frames',()=>{
  const ownerSource='artifacts/owner-handoffs/luna-exact-owner-source-2026-08-03.png';
  const runtimeAtlas='assets/moonwell-art/production/moonwell-keeper-walk-v7.png';
  assert.deepEqual(dimensions(ownerSource),[1995,788]);
  assert.equal(createHash('sha256').update(read(ownerSource)).digest('hex'),'50258352972739d24748684eb433c50aefad4393d08b0b1461e3c82e49a86249');
  assert.deepEqual(dimensions(runtimeAtlas),[104,40]);
  assert.equal(createHash('sha256').update(read(runtimeAtlas)).digest('hex'),'a287641c02f9e243d5f58d8188e7a54084c42a92150542ce52adfa29e8315f07');
  const processor=read('scripts/process-no-violet-environment-art.sh').toString();
  assert.match(processor,/luna-exact-owner-source-2026-08-03\.png/);
  assert.match(processor,/-filter point -resize 23x38/);
  assert.doesNotMatch(processor,/moonwell-luna-walk-v6\.xpm/);
  const pixels=rgba('assets/moonwell-art/production/moonwell-keeper-walk-v7.png');
  for(let frame=0;frame<4;frame++){
    let cowlick=0,teal=0,amber=0,skin=0,baseline=0,bottomMargin=0,leftEdge=0,rightEdge=0,chromaResidue=0;
    for(let y=0;y<40;y++)for(let x=0;x<26;x++){
      const offset=(y*104+frame*26+x)*4,r=pixels[offset],g=pixels[offset+1],b=pixels[offset+2],a=pixels[offset+3];
      if(a<16)continue;
      if(y<=7&&b>r*1.2)cowlick++;
      if(g>r*1.3&&b>g*1.05)teal++;
      if(r>150&&g>55&&g<r&&b<120)amber++;
      if(r>140&&g>70&&b<g)skin++;
      if(y===38)baseline++;
      if(y===39)bottomMargin++;
      if(x===0)leftEdge++;
      if(x===25)rightEdge++;
      if(r>115&&b>115&&g<Math.min(r,b)*.45)chromaResidue++;
    }
    assert.ok(cowlick>=40,`frame ${frame} loses Luna's cowlick and hair silhouette`);
    assert.ok(teal>=250,`frame ${frame} loses Luna's teal/cyan clothing shapes`);
    assert.ok(amber>=10,`frame ${frame} loses Luna's warm framed lantern`);
    assert.ok(skin>=20,`frame ${frame} loses Luna's recognizable face and hand`);
    assert.ok(baseline>=4,`frame ${frame} loses its shared walking baseline`);
    assert.equal(bottomMargin,0,`frame ${frame} loses the one-pixel ground margin`);
    assert.equal(leftEdge+rightEdge,0,`frame ${frame} reaches an atlas boundary`);
    assert.equal(chromaResidue,0,`frame ${frame} retains keyed magenta background`);
  }
});

test('environmental canvas fallbacks and copy do not reintroduce violet language',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  assert.doesNotMatch(source+html,/violet (?:rune|glow)|magenta|purple/i);
  assert.doesNotMatch(source,/rgba\((?:189,150,255|216,180,254)/);
  assert.doesNotMatch(html,/rgba\(196,181,253|#(?:a78bfa|c4b5fd|7c3aed|e9d5ff)/i);
});

test('no-violet runtime regeneration is byte-identical',()=>{
  const digest=asset=>createHash('sha256').update(read(asset)).digest('hex');
  const runtimeAssets=[...Object.keys(environmentalFrames),...Object.keys(characterFrames)];
  const before=Object.fromEntries(runtimeAssets.map(asset=>[asset,digest(asset)]));
  const retainedProof='assets/generated/moonwell-selected-reference-sprite-comparison-v1.png';
  const retainedStarrootAlpha='assets/generated/moonwell-starroot-chime-source-v1-alpha.png';
  const proofBefore=digest(retainedProof);
  const starrootAlphaBefore=digest(retainedStarrootAlpha);
  execFileSync('sh',[fileURLToPath(new URL('scripts/process-no-violet-environment-art.sh',root))],{stdio:'pipe',timeout:120000});
  for(const [asset,hash] of Object.entries(before))assert.equal(digest(asset),hash,asset);
  assert.equal(digest(retainedProof),proofBefore,'composite regeneration rewrote a retained proof image');
  assert.equal(digest(retainedStarrootAlpha),starrootAlphaBefore,'composite regeneration rewrote a retained generated source companion');
});

test('Luna draws the unchanged v7 atlas at exact half size over one-cell control',()=>{
  const source=read('game.js').toString();
  assert.match(source,/moonwell-keeper-walk-v7\.png/);
  assert.match(source,/KEEPER_SOURCE_WIDTH=26,KEEPER_SOURCE_HEIGHT=40,KEEPER_DRAW_WIDTH=13,KEEPER_DRAW_HEIGHT=20,KEEPER_DRAW_X=-6\.5,KEEPER_DRAW_Y=-19\.5/);
  assert.match(source,/walking&&!reduce\.matches\?Math\.floor\(walkClock\/\.11\)%4:0/);
  assert.match(source,/frame\*KEEPER_SOURCE_WIDTH,0,KEEPER_SOURCE_WIDTH,KEEPER_SOURCE_HEIGHT,KEEPER_DRAW_X,KEEPER_DRAW_Y,KEEPER_DRAW_WIDTH,KEEPER_DRAW_HEIGHT/);
  assert.match(source,/ctx\.drawImage\(keeperArt,0,0,KEEPER_SOURCE_WIDTH,KEEPER_SOURCE_HEIGHT,KEEPER_DRAW_X,KEEPER_DRAW_Y,KEEPER_DRAW_WIDTH,KEEPER_DRAW_HEIGHT\)/);
  assert.match(source,/ctx\.imageSmoothingEnabled=false/);
  assert.match(source,/canMove=.*wall\(x-5,y-5\).*wall\(x\+5,y\+5\)/);
});

test('Eir dialogue uses raster production art and has no SVG or drawn-sigil fallback',()=>{
  const source=read('game.js').toString();
  const html=read('index.html').toString();
  assert.match(source,/moonwell-eir-rootwatcher-idle-v2\.png/);
  assert.match(source,/moonwell-eir-rootwatcher-portrait-v2\.png/);
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

test('the unchanged top-canopy renderer consumes the same exported layout as its root colliders',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  assert.match(source,/for\(const curtain of TOP_CANOPY_LAYOUT\)/);
  assert.match(source,/worldObjects\.filter\(object=>!object\.collisionOnly/);
  assert.match(html,/game-core\.js\?v=moonwell-luna-exact-8/);
  assert.match(html,/game\.js\?v=moonwell-luna-half-9/);
});
