// Runs the real browser adapter against a minimal DOM/audio surface. These
// deterministic integration checks complement ordinary browser play, not mimic it.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import * as core from '../../game-core.js';
import * as forest from '../../forest-presentation.js';

export function gameHarness({ search = '', imagesFail = false, fullscreen = 'unsupported', coarsePointer = false } = {}) {
  let now = 0, frame;
  const listeners = {}, elements = new Map(), images = [], paints = [], calls = [], paintOperations = new Set();
  const context = new Proxy({}, { get: (object, key) => object[key] ?? (() => {
    // A long simulated walk needs operation coverage, not millions of draw-call arguments.
    if (!paintOperations.has(key)) { paintOperations.add(key); paints.push([key]); }
    return { width: 0 };
  }) });
  class Element {
    constructor(dataset = {}) { this.dataset = dataset; this.hidden = false; this.disabled = false; this.textContent = ''; this.events = {}; }
    addEventListener(type, callback) { this.events[type] = callback; }
    focus() {} setPointerCapture() {} setAttribute() {}
    getBoundingClientRect() { return { left:0, top:0, width:132, height:132 }; }
    getContext() { return context; }
  }
  const element = selector => { if (!elements.has(selector)) elements.set(selector, new Element()); return elements.get(selector); };
  const directions = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].map(direction => new Element({ direction }));
  const answers = ['stay', 'call'].map(answer => new Element({ answer }));
  const restarts = [new Element()];
  const bodyClasses = new Set();
  const document = { body: { classList: { add: name => bodyClasses.add(name), toggle: (name,on) => on ? bodyClasses.add(name) : bodyClasses.delete(name) } }, documentElement: {}, hidden: false, querySelector: element, addEventListener: (type, fn) => { listeners[type] = fn; }, querySelectorAll: selector => ({ '[data-direction]': directions, '[data-answer]': answers, '[data-restart]': restarts }[selector]) };
  if (fullscreen !== 'unsupported') { document.fullscreenEnabled = true; document.documentElement.requestFullscreen = () => { calls.push('fullscreen.request'); if (fullscreen === 'rejected') return Promise.reject(new Error('Unavailable')); document.fullscreenElement = document.documentElement; return Promise.resolve(); }; }
  const audioState = { ended: false, enabled: true, blocked: false };
  const audio = new Proxy({ snapshot: () => audioState }, { get: (object, key) => object[key] ?? (() => calls.push(`music.${key}`)) });
  const effects = new Proxy({}, { get: (_, key) => (...args) => calls.push(`effects.${key}:${args.join(',')}`) });
  class Image {
    constructor() { images.push(this); this.complete = false; this.naturalWidth = 0; }
    set src(path) { this.path = path; }
  }
  const sandbox = { ...core, ...forest, document, matchMedia: () => ({ matches: coarsePointer }), location: { search, reload: () => calls.push('reload') }, URLSearchParams, Image, HTMLButtonElement: Element,
    performance: { now: () => now }, requestAnimationFrame: fn => { frame = fn; }, addEventListener: (type, fn) => { listeners[type] = fn; }, MoonwellSoundtrack: audio, MoonwellEffects: effects };
  sandbox.window = sandbox;
  runInNewContext(readFileSync(new URL('../../game.js', import.meta.url), 'utf8').replace(/^import[^\n]+\n/gm, ''), sandbox);
  for (const image of images) {
    if (imagesFail) image.onerror();
    else { image.complete = true; image.naturalWidth = 512; image.onload(); }
  }
  const event = { preventDefault() {}, pointerId: 1, target: {}, repeat: false };
  const press = key => { listeners.keydown({ ...event, key }); listeners.keyup({ ...event, key }); };
  return { core, calls, paints, images, audioState, document, element,
    restart: () => restarts[0].onclick(),
    controls: () => JSON.parse(JSON.stringify(sandbox.__moonwell.controls())),
    pointer: (kind, {x=66,y=66,id=1,type='touch'} = {}) => element('.steering').events[kind]({ ...event, pointerId:id, pointerType:type, clientX:x, clientY:y }),
    lifecycle: kind => listeners[kind](),
    snapshot: () => JSON.parse(JSON.stringify(sandbox.__moonwell.snapshot())), press,
    click: selector => element(selector).onclick(),
    answer: value => answers.find(e => e.dataset.answer === value).onclick(),
    touch: direction => { const button = directions.find(e => e.dataset.direction === direction); if (button.events.pointerdown) { button.events.pointerdown(event); button.events.pointerup(event); } else { const [x,y] = {ArrowUp:[66,20],ArrowLeft:[20,66],ArrowDown:[66,110],ArrowRight:[110,66]}[direction]; element('.steering').events.pointerdown({...event,clientX:x,clientY:y,pointerType:'touch'}); element('.steering').events.pointerup(event); } },
    advance: seconds => { for (let t = 0; t < seconds; t += .02) { now += 20; frame(now); } },
  };
}
