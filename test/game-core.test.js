import test from 'node:test';
import assert from 'node:assert/strict';
import { SCENES, createGame, acknowledge, act, echoAction, move, tick, lit, canStand, crewPositions } from '../game-core.js';

const dismiss = s => { while (s.dialogue.length) acknowledge(s); };
function walk(s, ...points) {
  for (const p of points) { move(s, p.x - s.player.x, 0); move(s, 0, p.y - s.player.y); }
}
function hollow() { const s = createGame({ scene: 'hollow' }); dismiss(s); walk(s, SCENES.hollow.A); return s; }
function detour(s) { walk(s, { x: 80, y: 72 }, { x: 240, y: 72 }, SCENES.hollow.C); }
// Final-scene tests seed only already-earned earlier progress, not an active echo or recording.
function grove() {
  const s = createGame({ scene: 'hollow' }); dismiss(s);
  Object.assign(s, { area: 'grove', groupArea: 'grove', player: { ...SCENES.grove.V }, slice: false });
  s.connections.hollow = [{ x: 80, y: 144 }, { x: 80, y: 72 }, { x: 240, y: 72 }, { x: 240, y: 144 }];
  return s;
}
function recordVillage(s) { act(s); dismiss(s); walk(s, SCENES.grove.M); }

test('the start needs an explicit action; failed creation costs no progress', () => {
  const s = hollow(); echoAction(s);
  assert.equal(s.echo, null); assert.equal(s.recording, null);
  assert.match(s.message, /Shine here/); assert.ok(s.connections.bridge);
});
test('creation at A is valid and an echo has no timeout', () => {
  const s = hollow(); act(s); echoAction(s);
  assert.equal(s.echo.holding, true); assert.equal(lit(s, 'A'), true);
  tick(s, 3600); assert.equal(s.echo.holding, true);
  move(s, 0, -32); assert.equal(s.hold, null); assert.equal(lit(s, 'A'), true);
});
test('one echo action recalls, and only the following action creates another', () => {
  const s = hollow(); act(s); echoAction(s); echoAction(s);
  assert.equal(s.echo, null); assert.equal(s.recording.start, 'A');
  echoAction(s); assert.ok(s.echo); assert.equal(s.echo.path.length, 1);
});
test('the echo freezes actual steps while the carried lantern keeps recording', () => {
  const s = hollow(); act(s); walk(s, { x: 80, y: 72 }, SCENES.hollow.B); echoAction(s);
  const replay = structuredClone(s.echo.path);
  walk(s, { x: 240, y: 72 }, SCENES.hollow.C);
  assert.deepEqual(s.echo.path, replay);
  assert.ok(s.recording.path.length > replay.length);
  assert.deepEqual(replay.at(-1), SCENES.hollow.A);
  assert.ok(s.recording.path.every(p => canStand(s, p.x, p.y)));
});
test('the blocked direct route never records a shortcut through the bank', () => {
  const s = hollow(); act(s); move(s, 160, 0);
  assert.ok(s.player.x <= 108); assert.ok(s.recording.path.every(p => p.x <= 108));
  assert.equal(s.connections.hollow, null);
});
test('C can wait for the echo; success is checked when both ends become lit', () => {
  const s = hollow(); act(s); detour(s); echoAction(s); act(s);
  assert.equal(s.connections.hollow, null); assert.equal(lit(s, 'C'), true); assert.equal(lit(s, 'A'), false);
  tick(s, 10);
  assert.ok(s.connections.hollow); assert.equal(s.echo, null);
  dismiss(s); tick(s, 20); assert.equal(s.crewArrived, true);
  assert.deepEqual(crewPositions(s), [{ x: 240, y: 144 }, { x: 264, y: 160 }, { x: 240, y: 176 }]);
});
test('walking away from C before the echo arrives prevents success and can recover', () => {
  const s = hollow(); act(s); detour(s); echoAction(s); act(s); move(s, 32, 0); tick(s, 20);
  assert.equal(s.connections.hollow, null); assert.equal(lit(s, 'C'), false);
  walk(s, SCENES.hollow.C); act(s); assert.ok(s.connections.hollow);
});
test('completed hollow survives recall, walking away, and revisiting the scene', () => {
  const s = hollow(); act(s); echoAction(s); detour(s); act(s); dismiss(s); tick(s, 20);
  const saved = structuredClone(s.connections.hollow);
  echoAction(s); echoAction(s); // Completed progress cannot be consumed by later echo use.
  walk(s, { x: 240, y: 72 }, { x: 80, y: 72 }, { x: 80, y: 176 }, SCENES.hollow.back); act(s);
  assert.equal(s.area, 'crossing');
  s.metEir = true; s.crossed = true; // The isolated scene began after this already-completed meeting.
  walk(s, { x: 288, y: 168 }); act(s);
  assert.equal(s.area, 'hollow'); assert.deepEqual(s.connections.hollow, saved);
});
test('the village mark loses real light when Luna leaves; the well alone does not complete it', () => {
  const s = grove(); recordVillage(s);
  assert.equal(lit(s, 'V'), false); act(s);
  assert.equal(s.lantern, 'docked'); assert.equal(lit(s, 'M'), true); assert.equal(s.connections.village, null);
});
test('early lantern removal keeps the final connection dark until it is replaced', () => {
  const s = grove(); recordVillage(s); echoAction(s); act(s); act(s); tick(s, 20);
  assert.equal(s.lantern, 'carried'); assert.equal(lit(s, 'V'), true); assert.equal(lit(s, 'M'), false);
  assert.equal(s.connections.village, null); act(s);
  assert.ok(s.connections.village); assert.equal(s.echo, null);
  dismiss(s); act(s); assert.equal(s.lantern, 'carried'); assert.ok(s.connections.village);
  assert.ok(s.connections.bridge); assert.ok(s.connections.hollow);
});
test('early recall at the well requires a real retry and preserves earlier connections', () => {
  const s = grove(); recordVillage(s); echoAction(s); act(s); echoAction(s); tick(s, 30);
  assert.equal(s.connections.village, null); assert.ok(s.connections.bridge); assert.ok(s.connections.hollow);
  act(s); walk(s, SCENES.grove.V); act(s); walk(s, SCENES.grove.M); echoAction(s); act(s); tick(s, 30);
  assert.ok(s.connections.village);
});
test('creating at V and walking to M obeys the same simultaneous-end rule', () => {
  const s = grove(); act(s); dismiss(s); echoAction(s); walk(s, SCENES.grove.M);
  assert.equal(s.connections.village, null); act(s); assert.ok(s.connections.village);
});
test('the child waits when Luna leaves; the ending requires help and a walk home', () => {
  const s = grove(); recordVillage(s); echoAction(s); act(s); tick(s, 20); dismiss(s); act(s);
  walk(s, { x: 192, y: 72 }, SCENES.grove.footing); act(s); dismiss(s); tick(s, 1);
  const partial = s.childProgress; move(s, 24, 0); tick(s, 20);
  assert.equal(s.childProgress, partial); assert.equal(s.childHelped, false); assert.equal(s.won, false);
  walk(s, SCENES.grove.footing); act(s); dismiss(s); tick(s, 2);
  assert.equal(s.childHelped, true); dismiss(s); tick(s, 1); dismiss(s); assert.equal(s.won, false);
  walk(s, { x: 240, y: 144 }, { x: 240, y: 72 }, SCENES.grove.home); tick(s, 1);
  assert.equal(s.won, false); // Eir walks the authored route; she cannot teleport to the window.
  tick(s, 5);
  assert.equal(s.won, true); assert.equal(s.memories.length, 0);
});

test('scripted companions stay on traversable ground and do not repeat in earlier areas', () => {
  const s = hollow(); act(s); echoAction(s); detour(s); act(s); dismiss(s);
  for (let i = 0; i < 160; i++) {
    tick(s, .1);
    for (const p of crewPositions(s)) assert.ok(canStand(s, p.x, p.y), `Hollow actor at ${p.x},${p.y}`);
  }
  walk(s, { x: 240, y: 72 }, { x: 80, y: 72 }, { x: 80, y: 176 }, SCENES.hollow.back); act(s);
  assert.equal(s.area, 'crossing'); assert.equal(s.groupArea, 'hollow'); assert.deepEqual(crewPositions(s), []);
});

test('village arrival and home walk are played movements with safe contact footprints', () => {
  const s = grove(); recordVillage(s); echoAction(s); act(s);
  for (let i = 0; i < 120; i++) {
    tick(s, .1);
    for (const p of crewPositions(s)) assert.ok(canStand(s, p.x, p.y), `Grove actor at ${p.x},${p.y}`);
  }
  assert.equal(s.groveCrew.arrived, true); dismiss(s); act(s);
  walk(s, { x: 192, y: 72 }, SCENES.grove.footing); act(s); dismiss(s); tick(s, 3); dismiss(s);
  assert.equal(s.childHelped, true);
  tick(s, 1); dismiss(s);
  walk(s, { x: 240, y: 144 }, { x: 240, y: 72 }, SCENES.grove.home);
  for (let i = 0; i < 70; i++) {
    tick(s, .1);
    for (const p of crewPositions(s)) assert.ok(canStand(s, p.x, p.y), `Home actor at ${p.x},${p.y}`);
  }
  assert.equal(s.homeCrew.arrived, true); assert.equal(s.won, true);
});

test('home arrival leaves a clear shared window view before the ending and resets when Luna steps away', () => {
  const s=grove(); recordVillage(s); echoAction(s); act(s); tick(s,20); dismiss(s); act(s);
  walk(s,{x:192,y:72},SCENES.grove.footing); act(s); dismiss(s); tick(s,3); dismiss(s);
  tick(s,1); dismiss(s);
  assert.deepEqual(crewPositions(s)[0],{x:176,y:144});
  assert.equal(s.homeCrew.ready,true);
  // Both walk the same authored leg at ordinary speed, one tile apart.
  for(let i=0;i<24;i++){move(s,2,0);tick(s,2/65);}
  assert.deepEqual(crewPositions(s)[0],{x:224,y:144});
  walk(s,{x:240,y:144},{x:240,y:72},SCENES.grove.home);
  for(let i=0;i<200&&!s.homeCrew.arrived;i++)tick(s,.02);
  assert.equal(s.homeCrew.arrived,true);assert.equal(s.won,false);assert.equal(s.message,'');
  assert.deepEqual(crewPositions(s)[0],{x:272,y:40});
  assert.ok(s.homeWalk<.05);
  move(s,-24,0);tick(s,.02);assert.equal(s.homeWalk,0);
  walk(s,SCENES.grove.home);tick(s,1.5);assert.equal(s.won,false);
  tick(s,.26);assert.equal(s.won,true);
});
