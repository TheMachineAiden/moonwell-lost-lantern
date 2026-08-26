import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const source=await readFile(new URL('../soundtrack.js',import.meta.url),'utf8');

function harness({stored='on',rejectPlay=false}={}){
  const listeners={},storage=new Map([['moonwell-music',stored]]);
  const button={textContent:'',attributes:{},title:'',handler:null,setAttribute(name,value){this.attributes[name]=value},addEventListener(name,handler){if(name==='click')this.handler=handler}};
  class FakeAudio{
    constructor(){this.paused=true;this.currentTime=0;this.currentSrc='';this.src='';this.loop=false;this.volume=1;this.muted=false;this.loads=0;this.plays=0;this.pauses=0;FakeAudio.instances.push(this)}
    setAttribute(){}
    load(){this.loads++;this.currentSrc=this.src}
    play(){this.plays++;if(rejectPlay)return Promise.reject(new Error('gesture required'));this.paused=false;return Promise.resolve()}
    pause(){this.pauses++;this.paused=true}
  }
  FakeAudio.instances=[];
  const document={hidden:false,querySelector:selector=>selector==='#music'?button:null,addEventListener(name,handler){listeners[name]=handler}};
  const context={Audio:FakeAudio,document,localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},console,setTimeout,clearTimeout};
  context.globalThis=context;
  vm.runInNewContext(source,context,{filename:'soundtrack.js'});
  return{api:context.MoonwellSoundtrack,audio:FakeAudio.instances[0],button,document,listeners,storage};
}

test('soundtrack stays silent until a cue is selected after user input',()=>{
  const {api,audio,button}=harness();
  assert.equal(audio.plays,0);
  assert.equal(api.snapshot().cue,null);
  assert.equal(button.textContent,'Music on');
  assert.equal(button.attributes['aria-label'],'Mute music');
});

test('prologue, exploration, and victory use one non-overlapping audio voice',async()=>{
  const {api,audio}=harness();
  await api.prologue();
  assert.match(audio.src,/lantern-before-dawn\.ogg$/);
  assert.equal(audio.loop,false);
  assert.equal(audio.volume,.7);
  assert.equal(audio.plays,1);
  await api.exploration();
  assert.match(audio.src,/lanterns-through-leaves\.ogg$/);
  assert.equal(audio.loop,true);
  assert.equal(audio.volume,.33);
  assert.equal(audio.currentTime,0);
  assert.equal(audio.pauses,2);
  await api.victory();
  assert.match(audio.src,/lantern-home\.ogg$/);
  assert.equal(audio.loop,false);
  assert.equal(audio.volume,.42);
  assert.equal(api.snapshot().cue,'victory');
});

test('game pause and page visibility suspend and resume the active cue',async()=>{
  const {api,audio,document,listeners}=harness();
  await api.exploration();
  api.pause();
  assert.equal(audio.paused,true);
  assert.equal(api.snapshot().pausedByGame,true);
  await api.resume();
  assert.equal(audio.paused,false);
  document.hidden=true;
  listeners.visibilitychange();
  assert.equal(audio.paused,true);
  document.hidden=false;
  listeners.visibilitychange();
  await Promise.resolve();
  assert.equal(audio.paused,false);
});

test('music control persists mute state and restores playback only on input',async()=>{
  const {api,audio,button,storage}=harness();
  await api.exploration();
  await button.handler();
  assert.equal(audio.muted,true);
  assert.equal(storage.get('moonwell-music'),'off');
  assert.equal(button.textContent,'Music off');
  assert.equal(button.attributes['aria-pressed'],'false');
  await button.handler();
  assert.equal(audio.muted,false);
  assert.equal(storage.get('moonwell-music'),'on');
  assert.equal(audio.paused,false);
});

test('autoplay rejection is contained and reported without throwing',async()=>{
  const {api}=harness({rejectPlay:true});
  assert.equal(await api.prologue(),false);
  assert.equal(api.snapshot().blocked,true);
  assert.equal(api.snapshot().playRejections,1);
});

test('game lifecycle invokes each cue and pause transition',async()=>{
  const game=await readFile(new URL('../game.js',import.meta.url),'utf8');
  for(const hook of ['prologue','exploration','victory','pause','resume'])assert.match(game,new RegExp(`MoonwellSoundtrack\\?\\.${hook}\\(`));
});

test('selected master and editable source retain verified identities',async()=>{
  const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
  assert.equal(hash(await readFile(new URL('../assets/audio/lanterns-through-leaves.ogg',import.meta.url))),'94884630895e04a59ef99a8ce954b7900e37eafec5a295d2007e99e5cc12db8b');
  assert.equal(hash(await readFile(new URL('../soundtrack/scores/lanterns_through_leaves.json',import.meta.url))),'a5e0807707180389d069fec3507dd124b6665eb965c18f1717d9daee6fef5893');
  assert.equal(hash(await readFile(new URL('../soundtrack/render.py',import.meta.url))),'b6ed7c6aa63fcaf11d83881943b8e9ebc844a961b26d6ba1b0b072eb7ce580da');
});

test('production audio directory contains only the three OGG masters',async()=>{
  assert.deepEqual((await readdir(new URL('../assets/audio/',import.meta.url))).sort(),['lantern-before-dawn.ogg','lantern-home.ogg','lanterns-through-leaves.ogg']);
});
