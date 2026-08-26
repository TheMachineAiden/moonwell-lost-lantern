(()=>{
  const CUES=Object.freeze({
    prologue:Object.freeze({src:'assets/audio/lantern-before-dawn.ogg',loop:false,volume:.7}),
    exploration:Object.freeze({src:'assets/audio/lanterns-through-leaves.ogg',loop:true,volume:.33}),
    victory:Object.freeze({src:'assets/audio/lantern-home.ogg',loop:false,volume:.42})
  });
  const button=document.querySelector('#music'),audio=new Audio(),storageKey='moonwell-music';
  let cue=null,pausedByGame=false,blocked=false,playRejections=0;
  let enabled=true;
  try{enabled=localStorage.getItem(storageKey)!=='off'}catch{}
  audio.preload='auto';audio.playsInline=true;audio.muted=!enabled;
  const suspended=()=>pausedByGame||document.hidden;
  const syncControl=()=>{if(!button)return;button.textContent=enabled?'Music on':'Music off';button.setAttribute('aria-pressed',String(enabled));button.setAttribute('aria-label',enabled?'Mute music':'Play music');button.title=blocked&&enabled?'Music waits for a tap':''};
  const play=()=>{if(!cue||!enabled||suspended())return Promise.resolve(false);blocked=false;const request=audio.play();if(!request?.catch)return Promise.resolve(true);return request.then(()=>true).catch(()=>{blocked=true;playRejections++;syncControl();return false})};
  const select=name=>{const next=CUES[name];if(!next)throw new TypeError(`Unknown Moonwell cue: ${name}`);audio.pause();audio.currentTime=0;cue=name;audio.src=next.src;audio.loop=next.loop;audio.volume=next.volume;audio.muted=!enabled;audio.load();return play()};
  const prologue=()=>select('prologue');
  const exploration=()=>select('exploration');
  const victory=()=>select('victory');
  const pause=()=>{pausedByGame=true;audio.pause()};
  const resume=()=>{pausedByGame=false;return play()};
  const toggle=()=>{enabled=!enabled;audio.muted=!enabled;blocked=false;try{localStorage.setItem(storageKey,enabled?'on':'off')}catch{}syncControl();if(enabled)return play();return Promise.resolve(false)};
  const snapshot=()=>Object.freeze({cue,enabled,paused:audio.paused,pausedByGame,hidden:document.hidden,muted:audio.muted,loop:audio.loop,volume:audio.volume,currentTime:audio.currentTime,currentSrc:audio.currentSrc||audio.src,blocked,playRejections});
  button?.addEventListener('click',toggle);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();else play()});
  syncControl();
  globalThis.MoonwellSoundtrack=Object.freeze({prologue,exploration,victory,pause,resume,toggle,snapshot,cues:CUES});
})();
