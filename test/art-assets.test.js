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
const brightWarm=(r,g,b,a)=>a>15&&r>158&&g>82&&b<82&&r>g*1.08&&g>b*1.2;
const environmentalFrames={
  'assets/moonwell-art/production/moonwell-spruce-overhang-v3.png':80,
  'assets/moonwell-art/production/moonwell-inner-forest-boundary-v1.png':256,
  'assets/moonwell-art/production/moonwell-loam-base-tiles-v1.png':16,
  'assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png':160,
  'assets/moonwell-art/production/moonwell-clearing-moonlight-v4.png':192,
  'assets/moonwell-art/production/moonwell-route-opening-overhang-v1.png':64,
  'assets/moonwell-art/production/moonwell-exit-clearing-states-v4.png':32,
  'assets/moonwell-art/production/moonwell-root-shelf-variants-v2.png':48,
  'assets/moonwell-art/production/moonwell-foliage-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-ground-texture-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-stone-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-mushroom-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-firefly-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-light-pool-variants-v2.png':16,
  'assets/moonwell-art/production/moonwell-memory-loop-v3.png':16,
  'assets/moonwell-art/production/moonwell-bridge-vertical-v5.png':32,
  'assets/moonwell-art/production/moonwell-rune-stone-variants-v1.png':16,
  'assets/moonwell-art/production/moonwell-starroot-chime-variants-v4.png':24,
  'assets/moonwell-art/production/moonwell-sentinel-stones-v2.png':32,
  'assets/moonwell-art/production/moonwell-altar-v3.png':64,
  'assets/moonwell-art/production/moonwell-water-tile-v4.png':16,
  'assets/moonwell-art/production/moonwell-moonroot-shores-v1.png':288
};
const characterFrames={
  'assets/moonwell-art/production/moonwell-keeper-walk-v7.png':26,
  'assets/moonwell-art/production/moonwell-eir-rootwatcher-idle-v2.png':64,
  'assets/moonwell-art/production/moonwell-eir-rootwatcher-portrait-v2.png':512
};
const context={globalThis:{}};
runInNewContext(read('game-core.js').toString(),context);

test('touch direction controls retain the 44-pixel target contract in phone landscape',()=>{
  const html=read('index.html').toString();
  assert.match(html,/grid-template-columns:repeat\(3,44px\);grid-template-rows:repeat\(3,44px\);width:132px;height:132px/);
  assert.match(html,/\.touch button\{margin:0;min-width:44px;min-height:44px/);
});

test('luminous production assets preserve exact render footprints',()=>{
  const expected={
    'assets/moonwell-art/production/moonwell-keeper-walk-v7.png':[104,40],
    'assets/moonwell-art/production/moonwell-spruce-overhang-v3.png':[480,112],
    'assets/moonwell-art/production/moonwell-inner-forest-boundary-v1.png':[512,112],
    'assets/moonwell-art/production/moonwell-loam-base-tiles-v1.png':[64,16],
    'assets/moonwell-art/production/moonwell-clearing-loam-patches-v3.png':[640,96],
    'assets/moonwell-art/production/moonwell-clearing-moonlight-v4.png':[576,112],
    'assets/moonwell-art/production/moonwell-route-opening-overhang-v1.png':[256,72],
    'assets/moonwell-art/production/moonwell-exit-clearing-states-v4.png':[128,40],
    'assets/moonwell-art/production/moonwell-moonroot-shores-v1.png':[288,24],
    'assets/moonwell-art/production/moonwell-root-shelf-variants-v2.png':[288,24],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-idle-v2.png':[256,96],
    'assets/moonwell-art/production/moonwell-eir-rootwatcher-portrait-v2.png':[512,512],
    'assets/moonwell-art/production/moonwell-foliage-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-ground-texture-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-stone-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-mushroom-variants-v2.png':[32,16],
    'assets/moonwell-art/production/moonwell-firefly-variants-v2.png':[512,16],
    'assets/moonwell-art/production/moonwell-light-pool-variants-v2.png':[48,16],
    'assets/moonwell-art/production/moonwell-bridge-vertical-v5.png':[32,64],
    'assets/moonwell-art/production/moonwell-rune-stone-variants-v1.png':[48,16],
    'assets/moonwell-art/production/moonwell-starroot-chime-variants-v4.png':[288,24],
    'assets/moonwell-art/production/moonwell-sentinel-stones-v2.png':[32,32],
    'assets/moonwell-art/production/moonwell-water-tile-v4.png':[64,16]
  };
  for(const [path,size] of Object.entries(expected))assert.deepEqual(dimensions(path),size,path);
});

test('all four areas receive the selected forest floor vocabulary without new collision',()=>{
  const required=['shadow','moon','fern','stone','needles','root','mushroom','glowmoss'];
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
    'moonwell-inner-forest-boundary-v1.png',
    'moonwell-loam-base-tiles-v1.png',
    'moonwell-clearing-loam-patches-v3.png',
    'moonwell-clearing-moonlight-v4.png',
    'moonwell-route-opening-overhang-v1.png',
    'moonwell-exit-clearing-states-v4.png',
    'moonwell-root-shelf-variants-v2.png',
    'moonwell-eir-rootwatcher-idle-v2.png',
    'moonwell-eir-rootwatcher-portrait-v2.png',
    'moonwell-foliage-variants-v2.png',
    'moonwell-ground-texture-variants-v2.png',
    'moonwell-stone-variants-v2.png',
    'moonwell-mushroom-variants-v2.png',
    'moonwell-firefly-variants-v2.png',
    'moonwell-light-pool-variants-v2.png',
    'moonwell-bridge-vertical-v5.png',
    'moonwell-rune-stone-variants-v1.png',
    'moonwell-starroot-chime-variants-v4.png',
    'moonwell-sentinel-stones-v2.png',
    'moonwell-water-tile-v4.png'
  ].forEach(asset=>assert.match(source,new RegExp(asset.replaceAll('.','\\.'))));
  assert.doesNotMatch(source,/selected-forest-production-source|luminous-forest-production-source|bottom-right-clearing-source|world-sprite-source|eir-rootwatcher-(?:sprite|portrait)-source|320x208-art-direction-source/);
});

test('every runtime-loaded raster is explicitly classified for palette audit',()=>{
  const source=read('game.js').toString();
  const runtimeRasters=new Set([...source.matchAll(/assets\/moonwell-art\/production\/[a-z0-9-]+\.png/g)].map(match=>match[0]));
  const audited=new Set([...Object.keys(environmentalFrames),...Object.keys(characterFrames)]);
  assert.deepEqual([...runtimeRasters].sort(),[...audited].sort());
  for(const asset of Object.keys(characterFrames))assert.ok(runtimeRasters.has(asset),`${asset} lost its character palette audit`);
});

test('firefly collectibles use eight retained source-derived strips without changing their 16-pixel draw',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString(),html=read('index.html').toString();
  const processor=read('scripts/process-firefly-variants-art.sh').toString();
  const generated='assets/generated/moonwell-animated-props-atlas-v2-source.png';
  const asset='assets/moonwell-art/production/moonwell-firefly-variants-v2.png';
  assert.equal(createHash('sha256').update(read(generated)).digest('hex'),'c933e841e31fa5980764353eb6add1796b4a4623cc413bafe2f492f13b09c815');
  assert.match(processor,/moonwell-animated-props-atlas-v2-source\.png/);
  assert.match(processor,/c933e841e31fa5980764353eb6add1796b4a4623cc413bafe2f492f13b09c815/);
  assert.match(processor,/'0:16:16:0'.*'7:15:14:0'/);
  assert.match(source,/FIREFLY_VARIANTS\[area\]\[index\]/);
  assert.match(source,/\(variant\*4\+animationFrame\(\)\)\*16,0,16,16,light\.x-8,light\.y-8,16,16/);
  assert.match(source,/moonwell-firefly-variants-v2\.png\?v=moonwell-varied-fireflies-1/);
  assert.match(html,/moonwell-firefly-variants-v2\.png\?v=moonwell-varied-fireflies-1/);
  assert.match(core,/FIREFLY_VARIANTS=Object\.freeze\(\[\[0,1,2\],\[3,4\],\[5\],\[6,7\]\]/);
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[512,16]);
  const strips=new Set();
  for(let variant=0;variant<8;variant++){
    const strip=Buffer.concat([...Array(height)].map((_,y)=>pixels.subarray((y*width+variant*64)*4,(y*width+(variant+1)*64)*4)));
    strips.add(createHash('sha256').update(strip).digest('hex'));
  }
  assert.equal(strips.size,8,'placed fireflies repeat one retained animation strip');
});

test('Moonroot bridge keeps its retained footprint while yielding warm hierarchy to the crossing',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  const processor=read('scripts/process-moonroot-bridge-art.sh').toString();
  const generated='assets/generated/moonwell-vertical-bridge-source-v1.png';
  const base='assets/moonwell-art/production/moonwell-bridge-vertical-v4.png';
  const asset='assets/moonwell-art/production/moonwell-bridge-vertical-v5.png';
  assert.equal(createHash('sha256').update(read(generated)).digest('hex'),'2be0a36c497445282ffe7e971d6a994b4066dd8e765d2fe4a5ff6f7c9b734f91');
  assert.match(processor,/moonwell-vertical-bridge-source-v1\.png/);
  assert.match(processor,/2be0a36c497445282ffe7e971d6a994b4066dd8e765d2fe4a5ff6f7c9b734f91/);
  assert.match(processor,/moonwell-bridge-vertical-v4\.png/);
  assert.match(processor,/moonwell-bridge-vertical-v5\.png/);
  assert.match(read('scripts/process-no-violet-environment-art.sh').toString(),/process-moonroot-bridge-art\.sh/);
  assert.match(source,/bridge:loadArt\('assets\/moonwell-art\/production\/moonwell-bridge-vertical-v5\.png\?v=moonwell-quiet-bridge-1'\)/);
  assert.match(html,/preload" as="image" href="assets\/moonwell-art\/production\/moonwell-bridge-vertical-v5\.png\?v=moonwell-quiet-bridge-1"/);
  assert.match(html,/script src="game\.js\?v=moonwell-quiet-water-1"/);
  assert.doesNotMatch(source+html,/moonwell-bridge-vertical-v4\.png/);
  assert.match(source,/object\.kind==='bridge'&&loaded\(art\.bridge\)\)ctx\.drawImage\(art\.bridge,object\.x,object\.y,object\.w,object\.h\)/);
  const [basePixels,pixels]=[rgba(base),rgba(asset)];
  assert.deepEqual(dimensions(asset),[32,64]);
  let baseWarm=0,baseWarmValue=0,warmValue=0,baseOpaque=0,opaque=0;
  for(let offset=0;offset<pixels.length;offset+=4){
    const [br,bg,bb,ba]=basePixels.subarray(offset,offset+4),[r,g,b,a]=pixels.subarray(offset,offset+4);
    if(ba>15)baseOpaque++;
    if(a>15)opaque++;
    if(ba>15&&br>bg*1.07&&bg>bb*1.05&&br>41){baseWarm++;baseWarmValue+=br+bg+bb;warmValue+=r+g+b}
  }
  assert.equal(opaque,baseOpaque,'quiet bridge must preserve the accepted raster silhouette');
  assert.ok(baseWarm>800,'accepted bridge no longer exposes the audited warm material field');
  assert.ok(warmValue<baseWarmValue*.88,'warm constructed-wood block did not recede enough');
  assert.notDeepEqual(pixels,basePixels,'quiet bridge derivative is byte-identical to the accepted base');
});

test('exit clearing uses a raster state strip behind the rooted silhouette',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString(),processor=read('scripts/process-exit-moonroot-sprites.sh').toString();
  const exitTree=source.slice(source.indexOf('function exitTree'),source.indexOf('function drawExitClearing'));
  const exitRenderer=source.slice(source.indexOf('function drawExitClearing'),source.indexOf('function watcher'));
  const draw=source.slice(source.indexOf('function draw(){'),source.indexOf('function refreshWorld'));
  assert.match(source,/perimeter\?40:24/);
  assert.match(source,/for\(const pool of MOONLIGHT_POOL_LAYOUT\[area\]\)/);
  assert.match(source,/drawExitClearing\(object\)/);
  assert.match(source,/exitTree:loadArt\('assets\/moonwell-art\/production\/moonwell-route-opening-overhang-v1\.png'\)/);
  assert.match(source,/exitClearing:loadArt\('assets\/moonwell-art\/production\/moonwell-exit-clearing-states-v4\.png\?v=moonwell-quiet-opening-1'\)/);
  assert.match(html,/preload" as="image" href="assets\/moonwell-art\/production\/moonwell-exit-clearing-states-v4\.png\?v=moonwell-quiet-opening-1"/);
  assert.match(source,/const frame=\{closed:0,opening:1,revealed:2,open:3\}\[object\.state\];if\(loaded\(art\.exitClearing\)\)ctx\.drawImage\(art\.exitClearing,frame\*32,0,32,40,object\.x-8,object\.y\+EXIT_CLEARING\.top,32,40\)/);
  assert.ok(exitTree.indexOf('drawExitClearing(object)')<exitTree.indexOf('ctx.drawImage(art.exitTree'),'the clearing must sit behind the exit roots');
  assert.doesNotMatch(draw,/drawExitClearing/,'the clearing must not be repainted over the rooted silhouette');
  assert.doesNotMatch(exitRenderer,/rect\(/);
  assert.doesNotMatch(source,/crescentLandmark|clearing-crescent-landmark/);
  assert.doesNotMatch(html,/clearing-crescent-landmark/);
  assert.match(source,/object\.x-8,object\.y-8,48,24/);
  assert.match(processor,/moonwell-spruce-overhang-v3\.png/);
  assert.match(processor,/moonwell-route-opening-overhang-v1\.png/);
  assert.match(processor,/moonwell-clearing-loam-patches-v3\.png/);
  assert.match(processor,/moonwell-exit-clearing-states-v4\.png/);
  assert.match(exitTree,/frame\*64,0,64,72,x-24,y-56,64,72/);
  assert.doesNotMatch(source+html,/moonwell-exit-clearing-states-v2/);
  assert.doesNotMatch(source+html,/moonwell-crescent-exit-overhang/);
});

test('route-opening overhang parts into a clear central one-tile destination',()=>{
  const asset='assets/moonwell-art/production/moonwell-route-opening-overhang-v1.png';
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[256,72]);
  const centreCoverage=[];
  for(let frame=0;frame<4;frame++){
    let opaque=0;
    for(let y=48;y<72;y++)for(let x=24;x<40;x++)if(pixels[(y*width+frame*64+x)*4+3]>15)opaque++;
    centreCoverage.push(opaque);
  }
  assert.ok(centreCoverage[0]>centreCoverage[1]);
  assert.ok(centreCoverage[1]>centreCoverage[2]);
  assert.ok(centreCoverage[2]>centreCoverage[3]);
  assert.ok(centreCoverage[3]<=8,'open route retains a trunk or root across its one-tile gap');
});

test('exit threshold is an irregular warm loam clearing rather than a slab or point light',()=>{
  const asset='assets/moonwell-art/production/moonwell-exit-clearing-states-v4.png';
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[128,40]);
  const coverage=[];
  for(let frame=0;frame<4;frame++){
    let opaque=0,warm=0,brightPoints=0;
    for(let y=0;y<height;y++)for(let x=0;x<32;x++){
      const offset=(y*width+frame*32+x)*4,r=pixels[offset],g=pixels[offset+1],b=pixels[offset+2],a=pixels[offset+3];
      if(a>15)opaque++;
      if(a>15&&r>g*1.08&&g>b*1.08)warm++;
      if(a>15&&r>220&&g>155&&b<95)brightPoints++;
    }
    coverage.push(opaque);
    assert.ok(warm>=2,`frame ${frame} loses its source-textured warm loam`);
    assert.ok(warm<=15,`frame ${frame} makes the route threshold too warm to stay a subtle destination cue`);
    assert.equal(brightPoints,0,`frame ${frame} introduces a lantern-like point light`);
    const lowerWidths=[];
    for(let y=30;y<height;y++){
      let widthAtRow=0;
      for(let x=0;x<32;x++)if(pixels[(y*width+frame*32+x)*4+3]>15)widthAtRow++;
      lowerWidths.push(widthAtRow);
    }
    assert.ok(new Set(lowerWidths).size>=3,`frame ${frame} restores the old rectangular threshold lip`);
    assert.ok(lowerWidths.at(-1)<Math.max(...lowerWidths),`frame ${frame} loses its tapered clearing foot`);
  }
  assert.ok(coverage[0]<coverage[1]&&coverage[1]<coverage[2]&&coverage[2]<coverage[3]);
});

test('Moonroot water receives a raster shore strip without covering its bridge',()=>{
  const source=read('game.js').toString(),processor=read('scripts/process-exit-moonroot-sprites.sh').toString();
  const draw=source.slice(source.indexOf('function draw(){'),source.indexOf('function refreshWorld'));
  assert.match(source,/moonrootShore:loadArt\('assets\/moonwell-art\/production\/moonwell-moonroot-shores-v1\.png\?v=moonwell-loam-bank-2'\)/);
  assert.match(source,/function drawMoonrootShore\(\)\{if\(area!==1\|\|!loaded\(art\.moonrootShore\)\)return/);
  assert.match(source,/const water=MOONROOT_BRIDGE_LAYOUT\.water,depth=12/);
  assert.match(source,/ctx\.drawImage\(art\.moonrootShore,0,0,288,depth,x,top,width,depth\);ctx\.drawImage\(art\.moonrootShore,0,depth,288,depth,x,bottom-depth,width,depth\)/);
  assert.ok(draw.indexOf("object.kind==='water'")<draw.indexOf('drawMoonrootShore()'));
  assert.ok(draw.indexOf('drawMoonrootShore()')<draw.indexOf("object.kind==='bridge'"));
  assert.match(processor,/shore_source=.*moonwell-clearing-loam-patches-v3\.png/);
  assert.doesNotMatch(processor,/exit_surface_source|route-threshold/);
  assert.match(processor,/moonwell-moonroot-shores-v1\.png/);
  assert.match(processor,/continuous, low-contrast loam-to-wet-soil bank/);
  assert.doesNotMatch(processor,/tile % 3/);
});

test('Moonroot water uses four quieter retained raster variants without a canvas substitute',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString(),processor=read('scripts/process-moonwell-art.sh').toString(),paletteProcessor=read('scripts/process-no-violet-environment-art.sh').toString(),quietProcessor=read('scripts/process-moonroot-water-art.sh').toString();
  const renderer=source.slice(source.indexOf('function drawWater'),source.indexOf('function worldObject'));
  const base='assets/moonwell-art/production/moonwell-water-tile-v3.png',asset='assets/moonwell-art/production/moonwell-water-tile-v4.png',basePixels=rgba(base),pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[64,16]);
  assert.match(source,/water:loadArt\('assets\/moonwell-art\/production\/moonwell-water-tile-v4\.png\?v=moonwell-quiet-water-1'\)/);
  assert.match(html,/preload" as="image" href="assets\/moonwell-art\/production\/moonwell-water-tile-v4\.png\?v=moonwell-quiet-water-1"/);
  assert.match(renderer,/WATER_TILE_LAYOUT\[row\]\[col\]/);
  assert.match(renderer,/ctx\.drawImage\(art\.water,frame\*T,0,T,T,object\.x,object\.y,T,T\)/);
  assert.doesNotMatch(renderer,/\brect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient|\.svg/);
  assert.match(processor,/\.water-source\.png/);
  assert.match(processor,/\.water-border-mask\.png/);
  assert.match(processor,/\.water-frame-\{0,1,2,3\}\.png \+append/);
  assert.match(paletteProcessor,/normalize_water_perimeters/);
  assert.match(paletteProcessor,/process-moonroot-water-art\.sh/);
  assert.match(quietProcessor,/moonwell-world-props-atlas-v2-source\.png/);
  assert.match(quietProcessor,/1f28c764f0a3b4e0c50b287e29312471081f35007265219e87e16aeb80a317b4/);
  assert.match(quietProcessor,/moonwell-water-tile-v3\.png/);
  assert.match(quietProcessor,/moonwell-water-tile-v4\.png/);
  const signatures=new Set();
  let baseValue=0,quietValue=0;
  for(let frame=0;frame<4;frame++){
    const cell=Buffer.concat([...Array(height)].map((_,y)=>pixels.subarray((y*width+frame*16)*4,(y*width+(frame+1)*16)*4)));
    const signature=createHash('sha256').update(cell).digest('hex');
    signatures.add(signature);
    for(let y=0;y<height;y++)for(let x=0;x<16;x++){
      const offset=(y*width+frame*16+x)*4;
      assert.equal(pixels[offset+3],255,`water frame ${frame} leaves a transparent terrain gap`);
      assert.equal(brightWarm(pixels[offset],pixels[offset+1],pixels[offset+2],pixels[offset+3]),false,`water frame ${frame} introduces a warm objective cue`);
      baseValue+=basePixels[offset]+basePixels[offset+1]+basePixels[offset+2];
      quietValue+=pixels[offset]+pixels[offset+1]+pixels[offset+2];
      if(frame>0&&(x===0||x===15||y===0||y===15)){
        const canonical=(y*width+x)*4;
        assert.deepEqual([...pixels.subarray(offset,offset+4)],[...pixels.subarray(canonical,canonical+4)],`water frame ${frame} changes the stable tile perimeter at ${x},${y}`);
      }
    }
  }
  assert.equal(signatures.size,4,'water atlas repeats a packed frame');
  assert.ok(quietValue<baseValue*.86,'Moonroot water remains too bright for the crossing hierarchy');
  assert.notDeepEqual(pixels,basePixels,'quiet water derivative is byte-identical to the accepted atlas');
});

test('Whispering Hollow uses an unlit retained stone sentinel instead of a warm chest-like cue',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  const processor=read('scripts/process-hollow-sentinel-art.sh').toString();
  const paletteProcessor=read('scripts/process-no-violet-environment-art.sh').toString();
  const renderer=source.slice(source.indexOf('function worldObject'),source.indexOf('function rune'));
  const asset='assets/moonwell-art/production/moonwell-sentinel-stones-v2.png';
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[32,32]);
  assert.match(source,/sentinel:loadArt\('assets\/moonwell-art\/production\/moonwell-sentinel-stones-v2\.png'\)/);
  assert.match(html,/preload" as="image" href="assets\/moonwell-art\/production\/moonwell-sentinel-stones-v2\.png"/);
  assert.match(renderer,/object\.kind==='sentinel'.*ctx\.drawImage\(art\.sentinel,object\.x,object\.y,object\.w,object\.h\)/);
  assert.doesNotMatch(renderer,/\bglow\(|\brect\(|create(?:Linear|Radial)Gradient|\.svg/);
  assert.match(processor,/moonwell-hollow-sentinel-source-v1\.png/);
  assert.match(processor,/dc70ee658015592b769d2fdddbc4b8aa549ab9f88bcd634167d0302c642809ea/);
  assert.match(processor,/-trim \+repage -filter point -resize '30x30!'/);
  assert.match(processor,/-gravity south -background none -extent 32x32/);
  assert.match(processor,/moonwell-sentinel-stones-v2\.png/);
  assert.match(paletteProcessor,/process-hollow-sentinel-art\.sh/);
  let opaque=0,warm=0,bright=0;
  const rowWidths=[];
  for(let y=0;y<height;y++){
    let row=0;
    for(let x=0;x<width;x++){
      const offset=(y*width+x)*4,r=pixels[offset],g=pixels[offset+1],b=pixels[offset+2],a=pixels[offset+3];
      if(a<=15)continue;
      opaque++;row++;
      if(brightWarm(r,g,b,a))warm++;
      if((r+g+b)/3>180)bright++;
    }
    rowWidths.push(row);
  }
  assert.ok(opaque>=620&&opaque<=720,'stone sentinel loses its broad but contained two-cell silhouette');
  assert.equal(warm,0,'stone sentinel introduces a warm objective cue');
  assert.ok(bright<=1,'stone sentinel introduces a rune-like bright cluster');
  assert.ok(rowWidths.at(-1)>=6&&Math.max(...rowWidths.slice(-10))>=28,'stone sentinel is not visibly grounded against its collider');
  assert.ok(new Set(rowWidths.filter(Boolean)).size>=6,'stone sentinel loses its irregular three-tier silhouette');
});

test('Whispering Hollow gives its three echo anchors distinct retained rune stones without changing their cells',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  const processor=read('scripts/process-hollow-rune-variants-art.sh').toString();
  const paletteProcessor=read('scripts/process-no-violet-environment-art.sh').toString();
  const generated='assets/moonwell-art/production/moonwell-rune-stone-v3.png';
  const asset='assets/moonwell-art/production/moonwell-rune-stone-variants-v1.png';
  assert.equal(createHash('sha256').update(read(generated)).digest('hex'),'608ba358262eb16de35098dc93b9e0acc5a3c04ac28beba0ee00cfcd91d8d605');
  assert.match(processor,/moonwell-rune-stone-v3\.png/);
  assert.match(processor,/608ba358262eb16de35098dc93b9e0acc5a3c04ac28beba0ee00cfcd91d8d605/);
  assert.match(processor,/'0:16:16:0' '1:15:16:0' '2:15:15:1'/);
  assert.match(processor,/moonwell-rune-stone-variants-v1\.png/);
  assert.match(paletteProcessor,/process-hollow-rune-variants-art\.sh/);
  assert.match(source,/rune:loadArt\('assets\/moonwell-art\/production\/moonwell-rune-stone-variants-v1\.png\?v=moonwell-varied-runes-1'\)/);
  assert.match(html,/preload" as="image" href="assets\/moonwell-art\/production\/moonwell-rune-stone-variants-v1\.png\?v=moonwell-varied-runes-1"/);
  assert.match(source,/ctx\.drawImage\(art\.rune,index\*16,0,16,16,stone\.x-8,stone\.y-8,16,16\)/);
  assert.doesNotMatch(source+html,/moonwell-rune-stone-v3\.png/);
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[48,16]);
  const frames=[];
  for(let frame=0;frame<3;frame++){
    const cell=Buffer.concat([...Array(height)].map((_,y)=>pixels.subarray((y*width+frame*16)*4,(y*width+(frame+1)*16)*4)));
    frames.push(createHash('sha256').update(cell).digest('hex'));
  }
  assert.equal(new Set(frames).size,3,'three echo anchors stamp one rune silhouette');
});

test('the opaque raster loam base replaces the exposed procedural forest-floor fill',()=>{
  const source=read('game.js').toString(),processor=read('scripts/process-loam-base-art.sh').toString();
  const floor=source.slice(source.indexOf('function drawLoamFloor'),source.indexOf('function drawMoonlightPools'));
  const asset='assets/moonwell-art/production/moonwell-loam-base-tiles-v1.png';
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[64,16]);
  assert.match(source,/loamBase:loadArt\('assets\/moonwell-art\/production\/moonwell-loam-base-tiles-v1\.png'\)/);
  assert.match(floor,/ctx\.drawImage\(art\.loamBase,frame\*T,0,T,T,x,y,T,T\)/);
  assert.doesNotMatch(floor,/rect\(/);
  for(let offset=3;offset<pixels.length;offset+=4)assert.equal(pixels[offset],255,'loam base leaves a transparent terrain gap');
  assert.match(processor,/moonwell-clearing-loam-patches-v3\.png/);
  assert.match(processor,/moonwell-loam-base-tiles-v1\.png/);
  assert.match(processor,/-filter point -resize '16x16!'/);
});

test('Moonroot shore is a continuous, varied wet-soil bank rather than a repeated transparent rail',()=>{
  const pixels=rgba('assets/moonwell-art/production/moonwell-moonroot-shores-v1.png'),[width,height]=dimensions('assets/moonwell-art/production/moonwell-moonroot-shores-v1.png');
  assert.equal(width,288);assert.equal(height,24);
  for(let x=0;x<width;x++){
    let opaque=0;for(let y=0;y<12;y++)if(pixels[(y*width+x)*4+3]>15)opaque++;
    assert.ok(opaque>=7,`shore has a transparent vertical gap at ${x}`);
  }
  const signatures=new Set();
  for(let tile=0;tile<18;tile++){
    const cell=Buffer.concat([...Array(12)].map((_,y)=>pixels.subarray((y*width+tile*16)*4,(y*width+(tile+1)*16)*4)));
    signatures.add(createHash('sha256').update(cell).digest('hex'));
  }
  assert.ok(signatures.size>8,'shore must not repeat a small obvious tile cycle');
  const fringeDepths=new Set();
  for(let x=0;x<width;x++){
    let depth=0;for(let y=0;y<12;y++)if(pixels[(y*width+x)*4+3]>15)depth=y+1;
    fringeDepths.add(depth);
  }
  assert.ok(fringeDepths.size>=3,'shore must retain a visibly irregular loam fringe');
});

test('the inner forest boundary is a retained dense raster curtain over every top-root blocker',()=>{
  const source=read('game.js').toString(),processor=read('scripts/process-inner-forest-boundary-art.sh').toString();
  const asset='assets/moonwell-art/production/moonwell-inner-forest-boundary-v1.png';
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[512,112]);
  assert.match(source,/canopy:loadArt\('assets\/moonwell-art\/production\/moonwell-inner-forest-boundary-v1\.png\?v=moonwell-inner-forest-boundary-1'\)/);
  assert.match(processor,/moonwell-inner-forest-boundary-source-v1\.png/);
  assert.match(processor,/moonwell-clearing-canopy-v3\.png/);
  assert.match(processor,/filter point/);
  for(const frameOffset of [0,256])for(let x=frameOffset;x<frameOffset+256;x++){
    let coverage=0;
    for(let y=72;y<=103;y++)if(pixels[(y*width+x)*4+3]>15)coverage++;
    assert.ok(coverage>0,`frame ${frameOffset/256} has a transparent corridor at ${x-frameOffset}`);
  }
});

test('inner forest boundary regeneration is byte-identical',()=>{
  const asset='assets/moonwell-art/production/moonwell-inner-forest-boundary-v1.png';
  const source='assets/generated/moonwell-inner-forest-boundary-source-v1.png';
  const digest=path=>createHash('sha256').update(read(path)).digest('hex');
  const before={asset:digest(asset),source:digest(source)};
  execFileSync('sh',[fileURLToPath(new URL('scripts/process-inner-forest-boundary-art.sh',root))],{stdio:'pipe',timeout:120000});
  assert.deepEqual({asset:digest(asset),source:digest(source)},before);
});

test('Starfall chimes bake their grounded clearings into retained raster frames',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString(),processor=read('scripts/process-starroot-chime-art.sh').toString();
  const renderer=source.slice(source.indexOf('function starroot('),source.indexOf('function moonwellAltar'));
  assert.match(source,/const lit=starroot\.lit,frame=lit\?3:reduce\.matches\?0:Math\.floor\(step\/30\+index\)%2,sourceX=\(index\*4\+frame\)\*24/);
  assert.match(renderer,/ctx\.drawImage\(art\.starroot,sourceX,0,24,24,starroot\.x-12,starroot\.y-16,24,24\)/);
  assert.doesNotMatch(renderer,/rect\(|STARROOT_CLEARING|#25463f|#31564b|#52796a/);
  assert.doesNotMatch(core,/STARROOT_CLEARING/);
  assert.match(processor,/moonwell-starroot-clearing-source-v2\.png/);
  assert.match(processor,/a5b36b3470eea3e0eaf854938c0e58f0c25b94c1eb2df8c75cdd8d5107db9aa7/);
  assert.match(processor,/moonwell-starroot-chime-variants-v3\.png/);
  assert.match(processor,/'0:22:22:0' '1:20:21:1' '2:22:20:0'/);
  assert.match(processor,/-resize "\$\{width\}x\$\{height\}!"/);
  assert.match(processor,/-flop/);
  assert.match(source,/place\.starroots\.forEach\(\(item,index\)=>entities\.push\(\{y:item\.y\+8,draw:\(\)=>starroot\(item,index\)\}\)\)/);
  assert.doesNotMatch(source,/starroot.*lantern/i);
});

test('Starfall uses grounded starroot art and contains no sky-bell runtime path or copy',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString(),html=read('index.html').toString();
  assert.match(source,/moonwell-starroot-chime-variants-v4\.png\?v=moonwell-varied-starroots-1/);
  assert.match(source+core,/starroot chime/i);
  assert.doesNotMatch(source+core+html,/skybell|sky-bell|\.bells\b/);
  assert.match(html,/game-core\.js\?v=moonwell-map-bottoms-1/);
  assert.match(html,/game\.js\?v=moonwell-quiet-water-1/);
});

test('generated starroot grounding source is pinned and produces three distinct tapered strips',()=>{
  const source='assets/generated/moonwell-starroot-clearing-source-v2.png';
  const asset='assets/moonwell-art/production/moonwell-starroot-chime-variants-v4.png';
  assert.equal(createHash('sha256').update(read(source)).digest('hex'),'a5b36b3470eea3e0eaf854938c0e58f0c25b94c1eb2df8c75cdd8d5107db9aa7');
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[288,24]);
  const stripSignatures=new Set();
  for(let variant=0;variant<3;variant++){
    const strip=Buffer.concat([...Array(height)].map((_,y)=>pixels.subarray((y*width+variant*96)*4,(y*width+(variant+1)*96)*4)));
    stripSignatures.add(createHash('sha256').update(strip).digest('hex'));
  }
  assert.equal(stripSignatures.size,3,'placed starroots repeat one retained strip');
  for(let frame=0;frame<12;frame++){
    const columnCoverage=[];
    for(let x=frame*24;x<(frame+1)*24;x++){
      let opaque=0;for(let y=0;y<height;y++)if(pixels[(y*width+x)*4+3]>15)opaque++;
      columnCoverage.push(opaque);
    }
    assert.equal(columnCoverage[0]+columnCoverage[23],0,`frame ${frame} reaches an atlas boundary`);
    assert.ok(columnCoverage.slice(2,22).filter(value=>value>0).length>=13,`frame ${frame} loses its broad rooted contact`);
  }
});

test('retained Starroot variant processing is byte-identical',()=>{
  const source='assets/generated/moonwell-starroot-clearing-source-v2.png';
  const alpha='assets/generated/moonwell-starroot-clearing-source-v2-alpha.png';
  const intermediate='assets/moonwell-art/production/moonwell-starroot-chime-variants-v3.png';
  const digest=asset=>createHash('sha256').update(read(asset)).digest('hex');
  const before={source:digest(source),alpha:digest(alpha),intermediate:digest(intermediate)};
  execFileSync('sh',[fileURLToPath(new URL('scripts/process-starroot-chime-art.sh',root))],{stdio:'pipe',timeout:120000});
  assert.deepEqual({source:digest(source),alpha:digest(alpha),intermediate:digest(intermediate)},before);
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
  const retainedStarrootAlpha='assets/generated/moonwell-starroot-clearing-source-v2-alpha.png';
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

test('world characters, collectibles, memories, and landmarks have no procedural raster fallbacks',()=>{
  const source=read('game.js').toString();
  const renderer=(start,end)=>source.slice(source.indexOf(start),source.indexOf(end));
  const renderers=[
    renderer('function firefly(','function rootPlatform'),
    renderer('function watcher(','function openWatcherDialogue'),
    renderer('function memory(','function memoryRevealBox'),
    renderer('function playerKeeper(','function drawGroundSprite'),
    renderer('function rune(','function heldRadius'),
    renderer('function starroot(','function drawLoamFloor')
  ];
  for(const section of renderers)assert.doesNotMatch(section,/\brect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient|\.svg/);
  assert.match(source,/function firefly\(light,index\)\{if\(light\.got\|\|\(light\.hidden&&!hiddenLightVisible\(area,echoAwake,starfallAwake\)\)\|\|!loaded\(art\.firefly\)\)return/);
  assert.match(source,/function memory\(place,index\)\{if\(!place\.memory\|\|place\.memory\.got\|\|!loaded\(art\.memory\)\)return/);
  assert.match(source,/function playerKeeper\(\)\{if\(!loaded\(keeperArt\)\)return/);
  assert.match(source,/function echoKeeper\(\)\{if\(!echo\.active\|\|!loaded\(keeperArt\)\)return/);
  assert.match(source,/function moonwellAltar\(point\)\{if\(!loaded\(art\.altar\)\)return/);
});

test('Eir dialogue uses raster production art and has no SVG or drawn-sigil fallback',()=>{
  const source=read('game.js').toString();
  const html=read('index.html').toString();
  assert.match(source,/moonwell-eir-rootwatcher-idle-v2\.png/);
  assert.match(source,/moonwell-eir-rootwatcher-portrait-v2\.png/);
  assert.match(source,/frame\*64,0,64,96,point\.x-8,point\.y-22,16,24/);
  assert.match(source,/Math\.hypot\(player\.x-point\.x,player\.y-point\.y\)>22/);
  assert.match(source,/data-qa-required','Eir dialogue/);
  assert.match(html,/<canvas[^>]+width="640"[^>]+height="416"/);
  assert.match(html,/\.watcher-dialogue\[hidden\]\{display:none\}/);
  assert.doesNotMatch(source+html,/eir[^\n"']*\.svg|watcher-dialogue__sigil/i);
  assert.doesNotMatch(source+html,/moonflower|bridge-segment/i);
});

test('normal keyboard and touch presses produce deterministic collision-aware movement',()=>{
  const source=read('game.js').toString();
  assert.match(source,/function keyNudge\(direction\).*canMove\(player\.x\+dx,player\.y\)/);
  assert.match(source,/if\(!event\.repeat\)keyNudge\(direction\)/);
  assert.match(source,/keyNudge\(steer\(event\)\)/);
});

test('ambient glowmoss cannot be mistaken for a collectible firefly',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString();
  const renderer=source.slice(source.indexOf('function drawGroundDetail'),source.indexOf('function worldObject'));
  assert.match(source,/kind==='glowmoss'/);
  assert.doesNotMatch(source,/kind==='firefly'/);
  assert.doesNotMatch(core,/\['firefly',/);
  assert.match(renderer,/kind==='glowmoss'\)drawGroundSprite\(art\.foliage,item,3,12,2,4\)/);
  assert.doesNotMatch(renderer,/kind==='glowmoss'[^}]*rect\(/);
});

test('ambient tree and canopy pinlights stay cool while gameplay fireflies retain amber',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  const ambientRegions=[
    ['assets/moonwell-art/production/moonwell-spruce-overhang-v3.png',[[39,85,50,97]]],
    ['assets/moonwell-art/production/moonwell-inner-forest-boundary-v1.png',[[86,68,98,81],[154,77,166,89],[340,68,352,79],[414,82,426,96],[454,79,466,91]]]
  ];
  for(const [asset,regions] of ambientRegions){
    const [width]=dimensions(asset),pixels=rgba(asset);
    let falseAmber=0;
    for(const [left,top,right,bottom] of regions)for(let y=top;y<=bottom;y++)for(let x=left;x<=right;x++){
      const offset=(y*width+x)*4;
      if(brightWarm(pixels[offset],pixels[offset+1],pixels[offset+2],pixels[offset+3]))falseAmber++;
    }
    assert.equal(falseAmber,0,`${asset} restores an ambient amber objective cue`);
  }
  const fireflies=rgba('assets/moonwell-art/production/moonwell-firefly-variants-v2.png');
  let collectibleAmber=0;
  for(let offset=0;offset<fireflies.length;offset+=4)if(brightWarm(fireflies[offset],fireflies[offset+1],fireflies[offset+2],fireflies[offset+3]))collectibleAmber++;
  assert.ok(collectibleAmber>=8,'collectible fireflies lose their warm hierarchy');
  assert.match(source,/moonwell-spruce-overhang-v3\.png\?v=moonwell-ambient-cues-21/);
  assert.match(source,/moonwell-inner-forest-boundary-v1\.png\?v=moonwell-inner-forest-boundary-1/);
  assert.match(html,/moonwell-spruce-overhang-v3\.png\?v=moonwell-ambient-cues-21/);
  assert.match(html,/moonwell-inner-forest-boundary-v1\.png\?v=moonwell-inner-forest-boundary-1/);
});

test('map-specific bottom forest variation uses only retained spruce frames and no procedural tree substitute',()=>{
  const source=read('game.js').toString();
  const treeRenderer=source.slice(source.indexOf('function tree('),source.indexOf('function glow('));
  assert.match(treeRenderer,/BOTTOM_FOREST_LAYOUTS\[area\]\[Math\.floor\(x\/T\)\]/);
  assert.match(treeRenderer,/ctx\.scale\(-1,1\)/);
  assert.match(treeRenderer,/ctx\.drawImage\(art\.spruce/);
  assert.doesNotMatch(treeRenderer,/rect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient/);
});

test('side forest variation uses the retained spruce raster across both perimeter junctions',()=>{
  const source=read('game.js').toString();
  const treeRenderer=source.slice(source.indexOf('function tree('),source.indexOf('function glow('));
  assert.match(treeRenderer,/SIDE_FOREST_LAYOUT\[side\]\[area\]\[Math\.floor\(y\/T\)-1\]/);
  assert.match(treeRenderer,/frame=layout\?\.frame\?\?/);
  assert.match(treeRenderer,/ctx\.scale\(-1,1\)/);
  assert.match(treeRenderer,/ctx\.drawImage\(art\.spruce/);
  assert.doesNotMatch(treeRenderer,/rect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient/);
});

test('interior forest variation uses only retained spruce frames at rooted anchors',()=>{
  const source=read('game.js').toString();
  const treeRenderer=source.slice(source.indexOf('function tree('),source.indexOf('function glow('));
  assert.match(treeRenderer,/INTERIOR_FOREST_LAYOUT\[area\]\[treeIndex\]/);
  assert.match(treeRenderer,/ctx\.scale\(-1,1\)/);
  assert.match(treeRenderer,/ctx\.drawImage\(art\.spruce/);
  assert.doesNotMatch(treeRenderer,/rect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient/);
});

test('loam enrichment uses map-specific retained sprite records instead of a shared stamp lattice',()=>{
  const source=read('game.js').toString();
  const renderer=source.slice(source.indexOf('function drawLoamFloor'),source.indexOf('function drawMoonlightPools'));
  assert.match(renderer,/for\(const patch of LOAM_PATCH_LAYOUT\[area\]\)/);
  assert.match(renderer,/ctx\.drawImage\(art\.loam,patch\.frame\*160,0,160,96/);
  assert.match(renderer,/ctx\.scale\(-1,1\)/);
  assert.doesNotMatch(renderer,/for\(let y=-6|x=-28|x\+=66|y\+=42/);
  assert.doesNotMatch(renderer,/\brect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient/);
});

test('map-specific moonlight hierarchy uses only the retained raster pool atlas',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString();
  const renderer=source.slice(source.indexOf('function drawMoonlightPools'),source.indexOf('function drawMoonrootShore'));
  assert.match(core,/const MOONLIGHT_POOL_LAYOUT=moonlightPoolLayout\(/);
  assert.match(source,/luminousPool:loadArt\('assets\/moonwell-art\/production\/moonwell-clearing-moonlight-v4\.png'\)/);
  assert.match(renderer,/for\(const pool of MOONLIGHT_POOL_LAYOUT\[area\]\)/);
  assert.match(renderer,/ctx\.drawImage\(art\.luminousPool,pool\.frame\*192,0,192,112,pool\.x,pool\.y,pool\.w,pool\.h\)/);
  assert.doesNotMatch(renderer,/\brect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient|\.svg/);
});

test('ground details use explicit map-specific raster records without a procedural substitute',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString();
  const renderer=source.slice(source.indexOf('function drawGroundSprite'),source.indexOf('function worldObject'));
  assert.match(core,/const GROUND_DECOR_LAYOUT=groundDecorLayout\(/);
  assert.match(core,/frame:record\.frame,xOffset:record\.xOffset,yOffset:record\.yOffset,mirror:record\.mirror,alpha:record\.alpha/);
  assert.match(renderer,/item\.x\+item\.xOffset/);
  assert.match(renderer,/ctx\.scale\(-1,1\)/);
  assert.match(renderer,/ctx\.drawImage\(image,frame\*T,0,T,T/);
  for(const name of ['lightPool','ground','foliage','stone','mushroom'])assert.match(renderer,new RegExp(`art\\.${name}`));
  assert.doesNotMatch(renderer,/Math\.floor\(x\/T\)|\brect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient/);
});

test('root platforms render as tangled retained rootfalls without a procedural substitute',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  const renderer=source.slice(source.indexOf('function rootPlatform'),source.indexOf('function exitTree'));
  const processor=read('scripts/process-root-shelf-art.sh').toString();
  const asset='assets/moonwell-art/production/moonwell-root-shelf-variants-v2.png';
  const pixels=rgba(asset),[width,height]=dimensions(asset);
  assert.deepEqual([width,height],[288,24]);
  assert.match(source,/platform:loadArt\('assets\/moonwell-art\/production\/moonwell-root-shelf-variants-v2\.png\?v=moonwell-rooted-shelves-2'\)/);
  assert.match(html,/moonwell-root-shelf-variants-v2\.png\?v=moonwell-rooted-shelves-2/);
  assert.match(renderer,/frame=\(area\*2\+index\)%6/);
  assert.match(renderer,/frame\*48,0,48,24,object\.x-8,object\.y-8,48,24/);
  assert.doesNotMatch(renderer,/rect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient/);
  assert.match(processor,/moonwell-root-platform-v2\.png/);
  assert.match(processor,/0:46:22:1:2:0:76/);
  assert.match(processor,/-resize "\$\{width\}x\$\{height\}!"/);
  assert.match(processor,/-modulate "\$lightness,72,100"/);
  assert.doesNotMatch(processor,/moonwell-moonroot-shores|statistic Median|xc:'#?[0-9a-f]{6}'/i);
  const signatures=new Set(),bottomProfiles=new Set();
  for(let frame=0;frame<6;frame++){
    const cell=Buffer.concat([...Array(height)].map((_,y)=>pixels.subarray((y*width+frame*48)*4,(y*width+(frame+1)*48)*4)));
    signatures.add(createHash('sha256').update(cell).digest('hex'));
    const depths=[];let top=height,bottom=-1,rootPixels=0;
    for(let x=frame*48;x<(frame+1)*48;x++){
      let depth=0;for(let y=0;y<height;y++)if(pixels[(y*width+x)*4+3]>15)depth=y+1;
      depths.push(depth);
      for(let y=0;y<height;y++)if(pixels[(y*width+x)*4+3]>15){top=Math.min(top,y);bottom=Math.max(bottom,y);if(y>=10)rootPixels++}
    }
    bottomProfiles.add(depths.join(','));
    assert.ok(bottom-top+1>=19,`frame ${frame} collapses back into a shallow slab`);
    assert.ok(bottom>=22,`frame ${frame} loses its grounded root baseline`);
    assert.ok(rootPixels>=90,`frame ${frame} loses too much tangled lower root mass`);
    assert.ok(new Set(depths).size>=3,`frame ${frame} loses its irregular root edge`);
  }
  assert.equal(signatures.size,6,'root shelves visibly repeat a packed frame');
  assert.equal(bottomProfiles.size,6,'root shelves repeat the same lower silhouette');
});

test('Starfall altar has an undistorted draw, solid base, and explicit return finale',()=>{
  const source=read('game.js').toString(),core=read('game-core.js').toString();
  assert.match(source,/ctx\.drawImage\(art\.altar,point\.x-16,point\.y-24,32,24\)/);
  assert.match(core,/moonwell-altar-base'.*x:176,y:104,w:28,h:8,solid:true,collisionOnly:true/);
  assert.match(source,/Return them to the awakened Moonwell altar/);
  assert.match(source,/nearPoint\(player,place\.altar,place\.altar\.interactionRadius\)\)finish\(\)/);
  assert.doesNotMatch(core,/name:'Starfall Grove'[^\n]*home:/);
});

test('the in-canvas prologue drifts, stays skippable, and becomes static for reduced motion',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  assert.match(source,/class=\"prologue-stage\"/);
  assert.match(source,/Skip prologue/);
  assert.match(source,/Enter the forest/);
  assert.match(source,/setTimeout\(\(\)=>\{enterButton\.hidden=false/);
  assert.match(html,/@keyframes moonwell-prologue-drift/);
  assert.match(html,/@media\(prefers-reduced-motion:reduce\).*\.prologue-copy\{[^}]*animation:none/s);
  assert.match(source,/if\(reduce\.matches\)enterButton\.hidden=false/);
  assert.doesNotMatch(source,/setTimeout\([^)]*begin/);
});

test('Light the way requests fullscreen before opening the prologue and tolerates unavailable fullscreen',()=>{
  const source=read('game.js').toString();
  const show=source.match(/const show=\(\)=>\{([^]*?)\};start\.onclick=show/);
  assert.ok(show);
  assert.ok(show[1].indexOf('requestPrologueFullscreen()')<show[1].indexOf("modal.classList.add('prologue-active')"));
  assert.match(source,/const requestPrologueFullscreen=\(\)=>\{if\(document\.fullscreenEnabled!==true\|\|document\.fullscreenElement\|\|typeof document\.documentElement\.requestFullscreen!=='function'\)return;const request=document\.documentElement\.requestFullscreen\(\);if\(request\?\.catch\)request\.catch\(\(\)=>\{\}\)\}/);
  assert.doesNotMatch(source,/await document\.documentElement\.requestFullscreen/);
});

test('phone portrait uses a full-viewport Moonwell orientation interstitial before landscape entry',()=>{
  const html=read('index.html').toString();
  assert.match(html,/phone-gate__title">MOONWELL: THE LOST LANTERN/);
  assert.match(html,/@media\(pointer:coarse\) and \(orientation:portrait\)\{body\{overflow:hidden\}\.screen\{overflow:visible\}\.modal\{position:fixed;inset:0;z-index:20/);
  assert.match(html,/\.phone-gate\.card\{width:min\(100%,25rem\).*background:#071d28eF/s);
  assert.match(html,/Rotate to landscape, then light the way/);
});

test('844 by 390 phone landscape keeps entry compact and prologue at the undistorted viewport maximum',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  assert.match(html,/body:not\(\.playing\):not\(\.prologue-active\) h1.*\.hud.*\.touch\{display:none\}/);
  assert.match(html,/body:not\(\.playing\):not\(\.prologue-active\) main\{padding:0\}body:not\(\.playing\):not\(\.prologue-active\) \.screen\{margin:0 auto\}/);
  assert.match(html,/\.entry-controls\{display:none\}/);
  assert.match(html,/body\.prologue-active \.screen\{position:fixed;inset:50% auto auto 50%;width:min\(100dvw,calc\(100dvh \* 20 \/ 13\)\);height:min\(100dvh,calc\(100dvw \* 13 \/ 20\)\)/);
  assert.match(source,/document\.body\.classList\.add\('prologue-active'\)/);
  assert.match(source,/document\.fullscreenEnabled!==true/);
});

test('the dense top-canopy renderer consumes the same exported layout as its root colliders',()=>{
  const source=read('game.js').toString(),html=read('index.html').toString();
  const renderer=source.slice(source.indexOf('function drawCanopyBackdrop'),source.indexOf('function drawAtmosphere'));
  assert.match(source,/for\(const curtain of TOP_CANOPY_LAYOUTS\[area\]\)/);
  assert.match(renderer,/if\(curtain\.mirror\)/);
  assert.match(renderer,/ctx\.scale\(-1,1\)/);
  assert.doesNotMatch(renderer,/\brect\(|fillRect|strokeRect|create(?:Linear|Radial)Gradient|\.svg/);
  assert.match(source,/worldObjects\.filter\(object=>!object\.collisionOnly/);
  assert.match(html,/game-core\.js\?v=moonwell-map-bottoms-1/);
  assert.match(html,/game\.js\?v=moonwell-quiet-water-1/);
});
