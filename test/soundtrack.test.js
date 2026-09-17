import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import vm from 'node:vm';

const source=await readFile(new URL('../soundtrack.js',import.meta.url),'utf8');

function harness({stored='on',rejectPlay=false,deferPlay=false}={}){
  const pending=[];
  const listeners={},storage=new Map([['moonwell-music',stored]]);
  const button={textContent:'',attributes:{},title:'',handler:null,setAttribute(name,value){this.attributes[name]=value},addEventListener(name,handler){if(name==='click')this.handler=handler}};
  class FakeAudio{
    constructor(){this.paused=true;this.ended=false;this.currentTime=0;this.currentSrc='';this.src='';this.loop=false;this.volume=1;this.muted=false;this.loads=0;this.plays=0;this.pauses=0;FakeAudio.instances.push(this)}
    setAttribute(){}
    load(){this.loads++;this.currentSrc=this.src;this.ended=false}
    play(){this.plays++;if(deferPlay)return new Promise((resolve,reject)=>pending.push({resolve:()=>{this.paused=false;resolve()},reject}));if(rejectPlay)return Promise.reject(new Error('gesture required'));this.paused=false;return Promise.resolve()}
    pause(){this.pauses++;this.paused=true}
  }
  FakeAudio.instances=[];
  const document={hidden:false,querySelector:selector=>selector==='#music'?button:null,addEventListener(name,handler){listeners[name]=handler}};
  const context={Audio:FakeAudio,document,localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>storage.set(key,value)},console,setTimeout,clearTimeout};
  context.globalThis=context;
  vm.runInNewContext(source,context,{filename:'soundtrack.js'});
  return{api:context.MoonwellSoundtrack,audio:FakeAudio.instances[0],button,document,listeners,storage,pending,setReject:value=>{rejectPlay=value},instances:FakeAudio.instances};
}

test('soundtrack stays silent until a cue is selected after user input',()=>{
  const {api,audio,button}=harness();
  assert.equal(audio.plays,0);
  assert.equal(api.snapshot().cue,null);
  assert.equal(button.textContent,'Sound on');
  assert.equal(button.attributes['aria-label'],'Mute sound');
});

test('prologue, exploration, and victory use one non-overlapping audio voice',async()=>{
  const {api,audio}=harness();
  await api.prologue();
  assert.match(audio.src,/hidden-clearing\/prologue\.wav$/);
  assert.equal(audio.loop,false);
  assert.equal(audio.volume,.7);
  assert.equal(audio.plays,1);
  await api.exploration();
  assert.match(audio.src,/hidden-clearing\/exploration\.wav$/);
  assert.equal(audio.loop,true);
  assert.equal(audio.volume,.33);
  assert.equal(audio.currentTime,0);
  assert.equal(audio.pauses,2);
  await api.victory();
  assert.match(audio.src,/hidden-clearing\/victory\.wav$/);
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

test('sound control persists mute state, notifies effects, and restores playback only on input',async()=>{
  const {api,audio,button,storage}=harness();
  const states=[];
  const unsubscribe=api.subscribe(state=>states.push(state.enabled));
  await api.exploration();
  await button.handler();
  assert.equal(audio.muted,true);
  assert.equal(storage.get('moonwell-music'),'off');
  assert.equal(button.textContent,'Sound off');
  assert.equal(button.attributes['aria-pressed'],'false');
  await button.handler();
  assert.equal(audio.muted,false);
  assert.equal(storage.get('moonwell-music'),'on');
  assert.equal(audio.paused,false);
  assert.deepEqual(states,[true,false,true]);
  unsubscribe();
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

test('Hidden Clearing runtime PCM and editable scores match their provenance manifest',async()=>{
  const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
  const base=new URL('../assets/audio/hidden-clearing/',import.meta.url);
  const manifest=JSON.parse(await readFile(new URL('manifest.json',base),'utf8'));
  const {api}=harness();
  for(const [cue,entry] of Object.entries(manifest.cues)){
    const wav=await readFile(new URL(entry.file,base));
    assert.equal(hash(wav),entry.sha256);
    assert.equal(hash(wav),entry.source_pcm_sha256);
    assert.equal(hash(await readFile(new URL(entry.score_file,base))),entry.score_sha256);
    assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.readUInt16LE(22),1);
    assert.equal(wav.readUInt32LE(24),48000);assert.equal(wav.readUInt16LE(34),16);
    assert.equal(wav.readUInt32LE(40)/2,entry.frames);
    assert.equal(api.cues[cue].src,`assets/audio/hidden-clearing/${entry.file}`);
    assert.equal(api.cues[cue].loop,entry.loop);
  }
});

test('production audio root preserves exactly the three OGG masters beside isolated effects',async()=>{
  const entries=await readdir(new URL('../assets/audio/',import.meta.url),{withFileTypes:true});
  assert.deepEqual(entries.filter(entry=>entry.isFile()).map(entry=>entry.name).sort(),['lantern-before-dawn.ogg','lantern-home.ogg','lanterns-through-leaves.ogg']);
  assert.deepEqual(entries.filter(entry=>entry.isDirectory()).map(entry=>entry.name).sort(),['hidden-clearing','sfx']);
});

test('a stale rejection cannot block the latest cue after a rapid skip',async()=>{
  const {api,pending,instances}=harness({deferPlay:true});
  const old=api.prologue(),next=api.exploration();
  pending[1].resolve();await next;
  pending[0].reject(new Error('replaced'));await old;
  assert.equal(api.snapshot().blocked,false);assert.equal(api.snapshot().playRejections,0);
  assert.equal(api.snapshot().cue,'exploration');assert.equal(instances.length,1);
});

test('pause and mute invalidate outstanding rejection reports',async()=>{
  for(const action of ['pause','toggle']){
    const {api,pending}=harness({deferPlay:true});
    const request=api.exploration();api[action]();pending[0].reject(new Error('interrupted'));await request;
    assert.equal(api.snapshot().blocked,false);
  }
});

test('completed one-shots stay ended after visibility, resume and mute changes',async()=>{
  const {api,audio,document,listeners}=harness();
  for(const cue of ['prologue','victory']){
    await api[cue]();audio.ended=true;audio.paused=true;const count=audio.plays;
    document.hidden=true;listeners.visibilitychange();document.hidden=false;listeners.visibilitychange();
    await api.resume();await api.toggle();await api.toggle();
    assert.equal(audio.plays,count);
    await api[cue]();assert.equal(audio.ended,false);assert.equal(audio.plays,count+1);
  }
});

test('trusted subsequent input recovers blocked autoplay without unmuting a preference',async()=>{
  const state=harness({rejectPlay:true});
  await state.api.prologue();state.setReject(false);
  state.listeners.pointerdown({isTrusted:false});assert.equal(state.audio.plays,1);
  state.listeners.keydown({isTrusted:true});await Promise.resolve();
  assert.equal(state.api.snapshot().blocked,false);assert.equal(state.audio.paused,false);
  const muted=harness({stored:'off'});await muted.api.exploration();
  muted.listeners.pointerdown({isTrusted:true});assert.equal(muted.audio.plays,0);
});

test('visibility recovery cannot override a game pause or saved mute',async()=>{
  const {api,audio,document,listeners}=harness();await api.exploration();audio.currentTime=12;
  api.pause();document.hidden=true;listeners.visibilitychange();document.hidden=false;listeners.visibilitychange();
  assert.equal(audio.paused,true);assert.equal(audio.currentTime,12);
  await api.resume();assert.equal(audio.currentTime,12);
});
