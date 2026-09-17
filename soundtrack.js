(()=>{
  const CUES=Object.freeze({
    prologue:Object.freeze({src:'assets/audio/hidden-clearing/prologue.wav',loop:false,volume:.7}),
    exploration:Object.freeze({src:'assets/audio/hidden-clearing/exploration.wav',loop:true,volume:.33}),
    victory:Object.freeze({src:'assets/audio/hidden-clearing/victory.wav',loop:false,volume:.42})
  });
  const button=document.querySelector('#music'),audio=new Audio(),storageKey='moonwell-music',listeners=new Set();
  let cue=null,pausedByGame=false,blocked=false,playRejections=0,enabled=true,requestId=0;
  try{enabled=localStorage.getItem(storageKey)!=='off'}catch{}
  audio.preload='auto';audio.playsInline=true;audio.muted=!enabled;
  const suspended=()=>pausedByGame||document.hidden;
  const snapshot=()=>Object.freeze({cue,enabled,paused:audio.paused,pausedByGame,hidden:document.hidden,muted:audio.muted,loop:audio.loop,volume:audio.volume,currentTime:audio.currentTime,duration:audio.duration,ended:audio.ended,readyState:audio.readyState,currentSrc:audio.currentSrc||audio.src,blocked,playRejections});
  const notify=()=>{const state=snapshot();listeners.forEach(listener=>listener(state))};
  const syncControl=()=>{if(!button)return;button.textContent=enabled?'Sound on':'Sound off';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Mute sound':'Play sound');button.title=blocked&&enabled?'Sound waits for a tap':''};
  const play=()=>{if(!cue||!enabled||suspended()||audio.ended&&!audio.loop)return Promise.resolve(false);const id=++requestId;blocked=false;syncControl();const request=audio.play();if(!request?.catch)return Promise.resolve(true);return request.then(()=>id===requestId).catch(()=>{if(id===requestId&&enabled&&!suspended()){blocked=true;playRejections++;syncControl()}return false})};
  const select=name=>{const next=CUES[name];if(!next)throw new TypeError(`Unknown Moonwell cue: ${name}`);requestId++;blocked=false;audio.pause();audio.currentTime=0;cue=name;audio.src=next.src;audio.loop=next.loop;audio.volume=next.volume;audio.muted=!enabled;audio.load();return play()};
  const prologue=()=>select('prologue');
  const exploration=()=>select('exploration');
  const victory=()=>select('victory');
  const pause=()=>{requestId++;pausedByGame=true;audio.pause()};
  const resume=()=>{pausedByGame=false;return play()};
  const toggle=()=>{requestId++;enabled=!enabled;audio.muted=!enabled;blocked=false;try{localStorage.setItem(storageKey,enabled?'on':'off')}catch{}syncControl();notify();if(enabled)return play();return Promise.resolve(false)};
  const subscribe=listener=>{if(typeof listener!=='function')throw new TypeError('Moonwell audio listener must be a function');listeners.add(listener);listener(snapshot());return()=>listeners.delete(listener)};
  button?.addEventListener('click',toggle);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){requestId++;audio.pause()}else play()});
  const recover=event=>{if(event.isTrusted&&blocked&&enabled&&!suspended())play()};
  document.addEventListener('pointerdown',recover);
  document.addEventListener('keydown',recover);
  syncControl();
  globalThis.MoonwellSoundtrack=Object.freeze({prologue,exploration,victory,pause,resume,toggle,subscribe,snapshot,cues:CUES});
})();
