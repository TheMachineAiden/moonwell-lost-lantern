(()=>{
  const CUES=Object.freeze({
    firefly:Object.freeze({src:'assets/audio/sfx/firefly.ogg'}),
    bridge:Object.freeze({src:'assets/audio/sfx/bridge.ogg'}),
    memory:Object.freeze({src:'assets/audio/sfx/memory.ogg'}),
    echo:Object.freeze({src:'assets/audio/sfx/echo.ogg'}),
    starroot:Object.freeze({src:'assets/audio/sfx/starroot.ogg'})
  });
  const AudioContextClass=globalThis.AudioContext||globalThis.webkitAudioContext;
  const MAX_VOICES=3,MASTER_LEVEL=.82;
  const buffers=new Map(),active=new Map(),generations=new Map();
  let context=null,master=null,loadPromise=null,pausedByGame=false,enabled=globalThis.MoonwellSoundtrack?.snapshot().enabled??true,blocked=false,loadErrors=0,playCount=0;
  const suspended=()=>pausedByGame||document.hidden||!enabled;
  const stop=name=>{const record=active.get(name);if(!record)return;record.source.onended=null;try{record.source.stop()}catch{}active.delete(name)};
  const stopAll=()=>[...active.keys()].forEach(stop);
  const load=()=>{
    if(loadPromise)return loadPromise;
    loadPromise=Promise.all(Object.entries(CUES).map(async([name,cue])=>{
      const response=await fetch(cue.src,{cache:'force-cache'});
      if(!response.ok)throw new Error(`Moonwell effect failed to load: ${name}`);
      const bytes=await response.arrayBuffer();
      const buffer=await context.decodeAudioData(bytes);
      buffers.set(name,buffer);
    })).then(()=>true).catch(()=>{loadErrors++;loadPromise=null;return false});
    return loadPromise
  };
  const unlock=async()=>{
    if(!AudioContextClass||suspended())return false;
    try{
      if(!context){context=new AudioContextClass();master=context.createGain();master.gain.value=MASTER_LEVEL;master.connect(context.destination)}
      if(context.state==='suspended')await context.resume();
      blocked=false;
      return await load()
    }catch{blocked=true;return false}
  };
  const play=async(name,rate=1)=>{
    if(!CUES[name]||suspended())return false;
    const generation=(generations.get(name)||0)+1;
    generations.set(name,generation);
    if(!await unlock()||suspended()||generations.get(name)!==generation)return false;
    stop(name);
    if(active.size>=MAX_VOICES){const oldest=[...active.entries()].sort((a,b)=>a[1].startedAt-b[1].startedAt)[0];stop(oldest[0])}
    const source=context.createBufferSource();
    source.buffer=buffers.get(name);source.playbackRate.value=rate;source.connect(master);
    const record={source,rate,startedAt:context.currentTime};
    active.set(name,record);
    source.onended=()=>{if(active.get(name)===record)active.delete(name)};
    try{source.start();playCount++;return true}catch{active.delete(name);blocked=true;return false}
  };
  const firefly=(collected,complete=false)=>play('firefly',complete?1.259921:Number(collected)%2?1.122462:1);
  const bridge=()=>play('bridge');
  const memory=()=>play('memory');
  const echo=()=>play('echo');
  const starroot=awake=>play('starroot',[1,1.259921,1.498307][Math.max(0,Math.min(2,Number(awake)-1))]);
  const pause=()=>{pausedByGame=true;stopAll();if(context?.state==='running')context.suspend().catch(()=>{})};
  const resume=async()=>{pausedByGame=false;if(enabled&&!document.hidden&&context?.state==='suspended')try{await context.resume();return true}catch{blocked=true}return false};
  const snapshot=()=>Object.freeze({enabled,pausedByGame,hidden:document.hidden,blocked,loaded:[...buffers.keys()].sort(),active:[...active.entries()].map(([name,record])=>({name,rate:record.rate})),loadErrors,playCount,contextState:context?.state||'uninitialized',maxVoices:MAX_VOICES,masterLevel:MASTER_LEVEL});
  globalThis.MoonwellSoundtrack?.subscribe(state=>{const changed=enabled!==state.enabled;enabled=state.enabled;if(!enabled)stopAll();else if(changed&&!pausedByGame&&!document.hidden)unlock()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){stopAll();if(context?.state==='running')context.suspend().catch(()=>{})}else if(!pausedByGame&&enabled&&context?.state==='suspended')context.resume().catch(()=>{blocked=true})});
  globalThis.MoonwellEffects=Object.freeze({unlock,firefly,bridge,memory,echo,starroot,pause,resume,snapshot,cues:CUES});
})();
