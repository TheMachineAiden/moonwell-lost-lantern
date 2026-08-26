import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import vm from 'node:vm';

const source=await readFile(new URL('../sound-effects.js',import.meta.url),'utf8');

function harness({enabled=true,fetchOk=true,resumeReject=false}={}){
  const listeners={},sources=[],fetches=[],subscribers=[];
  class FakeSource{
    constructor(){this.playbackRate={value:1};this.started=false;this.stopped=false;this.onended=null;sources.push(this)}
    connect(){}
    start(){this.started=true}
    stop(){this.stopped=true}
  }
  class FakeContext{
    constructor(){this.state='suspended';this.currentTime=0;this.destination={}}
    createGain(){return{gain:{value:1},connect(){}}}
    createBufferSource(){this.currentTime+=.01;return new FakeSource()}
    async decodeAudioData(){return{duration:.5}}
    async resume(){if(resumeReject)throw new Error('gesture required');this.state='running'}
    async suspend(){this.state='suspended'}
  }
  const soundtrack={snapshot:()=>({enabled}),subscribe(listener){subscribers.push(listener);listener({enabled});return()=>{}}};
  const document={hidden:false,addEventListener(name,handler){listeners[name]=handler}};
  const context={AudioContext:FakeContext,document,fetch:async path=>{fetches.push(path);return{ok:fetchOk,arrayBuffer:async()=>new ArrayBuffer(8)}},MoonwellSoundtrack:soundtrack,console};
  context.globalThis=context;
  vm.runInNewContext(source,context,{filename:'sound-effects.js'});
  return{api:context.MoonwellEffects,document,listeners,sources,fetches,setEnabled(value){enabled=value;subscribers.forEach(listener=>listener({enabled:value}))}};
}

test('effects stay inert while muted and load the five retained cues after unlock',async()=>{
  const muted=harness({enabled:false});
  assert.equal(await muted.api.unlock(),false);
  assert.equal(muted.fetches.length,0);
  const active=harness();
  assert.equal(active.fetches.length,0);
  assert.equal(await active.api.unlock(),true);
  assert.equal(active.fetches.length,5);
  assert.deepEqual([...active.api.snapshot().loaded],['bridge','echo','firefly','memory','starroot']);
});

test('firefly and Starroot variation is deterministic and family retriggers replace tails',async()=>{
  const {api,sources}=harness();
  await api.unlock();
  await api.firefly(1,false);
  assert.equal(sources.at(-1).playbackRate.value,1.122462);
  const first=sources.at(-1);
  await api.firefly(2,false);
  assert.equal(first.stopped,true);
  assert.equal(sources.at(-1).playbackRate.value,1);
  await api.firefly(3,true);
  assert.equal(sources.at(-1).playbackRate.value,1.259921);
  await api.starroot(1);assert.equal(sources.at(-1).playbackRate.value,1);
  await api.starroot(2);assert.equal(sources.at(-1).playbackRate.value,1.259921);
  await api.starroot(3);assert.equal(sources.at(-1).playbackRate.value,1.498307);
});

test('the voice cap prevents overlap bursts across effect families',async()=>{
  const {api,sources}=harness();
  await api.unlock();
  await api.bridge();await api.memory();await api.echo();
  const oldest=sources.at(-3);
  assert.equal(api.snapshot().active.length,3);
  await api.starroot(1);
  assert.equal(oldest.stopped,true);
  assert.equal(api.snapshot().active.length,3);
  assert.equal(api.snapshot().maxVoices,3);
});

test('mute, game pause, and page hiding stop effects without replay on resume',async()=>{
  const state=harness();
  await state.api.unlock();
  await state.api.bridge();
  const bridge=state.sources.at(-1),before=state.api.snapshot().playCount;
  state.api.pause();
  assert.equal(bridge.stopped,true);
  assert.equal(state.api.snapshot().active.length,0);
  await state.api.resume();
  assert.equal(state.api.snapshot().playCount,before);
  await state.api.memory();
  const memory=state.sources.at(-1);
  state.document.hidden=true;state.listeners.visibilitychange();
  assert.equal(memory.stopped,true);
  state.document.hidden=false;state.listeners.visibilitychange();
  await Promise.resolve();
  assert.equal(state.api.snapshot().playCount,before+1);
  state.setEnabled(false);
  assert.equal(await state.api.firefly(1,false),false);
});

test('loading and autoplay failures are contained without throwing',async()=>{
  const loading=harness({fetchOk:false});
  assert.equal(await loading.api.unlock(),false);
  assert.equal(loading.api.snapshot().loadErrors,1);
  const blocked=harness({resumeReject:true});
  assert.equal(await blocked.api.unlock(),false);
  assert.equal(blocked.api.snapshot().blocked,true);
});

test('game hooks only the retained successful state changes and lifecycle',async()=>{
  const game=await readFile(new URL('../game.js',import.meta.url),'utf8');
  for(const hook of ['bridge','memory','echo','starroot','firefly','pause','resume','unlock'])assert.match(game,new RegExp(`MoonwellEffects\\?\\.${hook}\\(`));
  assert.match(game,/place\.memory\.got=true;[\s\S]*?MoonwellEffects\?\.memory\(\)/);
  assert.match(game,/starroot\.lit=true;starrootsAwake\+\+;globalThis\.MoonwellEffects\?\.starroot\(starrootsAwake\)/);
  assert.match(game,/light\.got=true;[\s\S]*?globalThis\.MoonwellEffects\?\.firefly\(gathered\(\),allHere\(\)\)/);
  assert.match(game,/watcherFeedback\.complete\)\{bridge=true;[^}]*globalThis\.MoonwellEffects\?\.bridge\(\)/);
  const echoCall=game.indexOf('MoonwellEffects?.echo()');
  assert.ok(echoCall>game.indexOf('const replay=createEchoReplay'));
  assert.ok(echoCall<game.indexOf("say('A delayed echo retraces"));
  assert.doesNotMatch(game,/MoonwellEffects\?\.(?:step|collision|wrong|rune|exit|victory)\(/);
});

test('production effects are exactly the five small OGG cues declared by the editable palette',async()=>{
  const palette=JSON.parse(await readFile(new URL('../sound-effects/palette.json',import.meta.url),'utf8'));
  const files=(await readdir(new URL('../assets/audio/sfx/',import.meta.url))).sort();
  assert.deepEqual(files,Object.keys(palette.cues).map(name=>`${name}.ogg`).sort());
  assert.equal(palette.sample_rate,22050);
  assert.deepEqual(Object.keys(palette.cues).sort(),['bridge','echo','firefly','memory','starroot']);
  for(const cue of Object.values(palette.cues)){
    assert.ok(cue.duration>=.4&&cue.duration<=1.1);
    assert.ok(cue.tones.length>0);
  }
});
