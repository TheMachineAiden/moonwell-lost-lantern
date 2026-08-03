import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';

const root=new URL('../',import.meta.url);
const read=path=>readFileSync(new URL(path,root));
const hash=path=>createHash('sha256').update(read(path)).digest('hex');
const dimensions=path=>{const png=read(path);assert.equal(png.subarray(1,4).toString(),'PNG');return[png.readUInt32BE(16),png.readUInt32BE(20)]};
const rgba=path=>execFileSync('magick',[fileURLToPath(new URL(path,root)),'-alpha','on','-depth','8','rgba:-'],{maxBuffer:16*1024*1024});
const prohibited=(r,g,b,a)=>a>15&&r>g*1.08&&b>g*1.12&&b>r*.58&&Math.max(r,b)-g>9;
const icons={
  'assets/moonwell-art/app-icon/moonwell-home-screen-icon-1024.png':1024,
  'assets/moonwell-art/app-icon/moonwell-home-screen-icon-512.png':512,
  'assets/moonwell-art/app-icon/moonwell-home-screen-icon-192.png':192,
  'assets/moonwell-art/app-icon/moonwell-apple-touch-icon-180.png':180,
  'assets/moonwell-art/app-icon/moonwell-favicon-32.png':32,
  'assets/moonwell-art/app-icon/moonwell-favicon-16.png':16,
  'assets/moonwell-art/app-icon/moonwell-maskable-512.png':512
};

test('Moonwell home-screen icon family has every required production size',()=>{
  for(const [path,size] of Object.entries(icons))assert.deepEqual(dimensions(path),[size,size],path);
  assert.equal(read('favicon.ico').subarray(0,4).toString('hex'),'00000100');
});

test('icon source and every production derivative exclude purple-family pixels',()=>{
  for(const path of ['assets/generated/moonwell-home-screen-icon-source-v1.png',...Object.keys(icons)]){
    const pixels=rgba(path);
    for(let offset=0;offset<pixels.length;offset+=4)assert.equal(prohibited(pixels[offset],pixels[offset+1],pixels[offset+2],pixels[offset+3]),false,`${path} has a prohibited purple-family pixel`);
  }
});

test('home-screen icon regeneration is byte-identical',()=>{
  const before=Object.fromEntries(['assets/generated/moonwell-home-screen-icon-source-v1.png',...Object.keys(icons),'favicon.ico','artifacts/qa/moonwell-home-screen-icon-scale-proof.png'].map(path=>[path,hash(path)]));
  execFileSync('sh',[fileURLToPath(new URL('scripts/process-home-screen-icon.sh',root))],{stdio:'pipe',timeout:120000});
  for(const [path,digest] of Object.entries(before))assert.equal(hash(path),digest,path);
});

test('manifest and head install metadata name Moonwell and use the generated icon family',()=>{
  const manifest=JSON.parse(read('manifest.webmanifest'));
  const html=read('index.html').toString();
  assert.equal(manifest.name,'Moonwell: The Lost Lantern');
  assert.equal(manifest.short_name,'Moonwell');
  assert.equal(manifest.display,'standalone');
  assert.equal(manifest.background_color,'#06182a');
  assert.deepEqual(manifest.icons.map(icon=>icon.sizes),['192x192','512x512','512x512']);
  assert.equal(manifest.icons.at(-1).purpose,'maskable');
  assert.match(html,/rel="manifest" href="manifest\.webmanifest\?v=moonwell-icon-1"/);
  assert.match(html,/application-name" content="Moonwell: The Lost Lantern"/);
  assert.match(html,/apple-mobile-web-app-title" content="Moonwell"/);
  assert.match(html,/moonwell-apple-touch-icon-180\.png\?v=moonwell-icon-1/);
  assert.match(html,/favicon\.ico\?v=moonwell-icon-1/);
});
