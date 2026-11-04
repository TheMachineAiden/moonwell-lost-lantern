import test from 'node:test';
import assert from 'node:assert/strict';
import { gameHarness } from './support/game-harness.js';

const dismiss = h => { while (h.snapshot().dialogue.length) h.press('Enter'); };
function walk(h, key, count) { for (let i = 0; i < count; i++) h.press(key); }
function startHollow() { const h = gameHarness({ search: '?scene=hollow' }); h.click('#start'); dismiss(h); walk(h, 'd', 2); walk(h, 'w', 3); return h; }

test('ordinary entry waits for art, starts silently, and paints only raster world images', () => {
  const h = gameHarness();
  assert.equal(h.element('#start').disabled, false);
  assert.equal(h.calls.length, 0);
  assert.ok(h.images.length > 20);
  assert.ok(h.images.every(i => i.path.startsWith('assets/moonwell-art/production/')));
  assert.ok(h.paints.some(([op]) => op === 'drawImage'));
  assert.ok(!h.paints.some(([op]) => ['fillRect','strokeRect','fillText','beginPath','createRadialGradient'].includes(op)));
  const failed = gameHarness({ imagesFail: true });
  failed.click('#start');
  assert.equal(failed.element('#start').disabled, true);
  assert.equal(failed.calls.length, 0);
  assert.match(failed.element('#entry-copy').textContent, /Reload/);
});

test('touch taps and keyboard taps share collision, dialogue, pause and notebook rules', () => {
  const keyboard = startHollow(), touch = startHollow();
  keyboard.press('f'); touch.click('#act');
  walk(keyboard, 'd', 30);
  for (let i = 0; i < 30; i++) touch.touch('ArrowRight');
  assert.deepEqual(touch.snapshot().player, keyboard.snapshot().player);
  assert.ok(touch.snapshot().player.x <= 108);
  const before = touch.snapshot().player;
  touch.click('#pause'); touch.touch('ArrowUp'); assert.deepEqual(touch.snapshot().player, before);
  touch.click('#resume'); touch.click('#notebook'); touch.touch('ArrowUp'); assert.deepEqual(touch.snapshot().player, before);
  touch.click('#close-journal'); touch.touch('ArrowUp'); assert.ok(touch.snapshot().player.y < before.y);
});

test('one created echo sounds once; recall and a rejected creation are silent', () => {
  const h = startHollow(); h.press('e');
  assert.equal(h.calls.filter(c => c === 'effects.echo:').length, 0);
  h.press('f'); h.press('e');
  assert.equal(h.snapshot().echo.holding, true);
  assert.match(h.element('#echo').textContent, /Recall echo/);
  h.press('e'); assert.equal(h.snapshot().echo, null);
  assert.match(h.element('#echo').textContent, /Create echo/);
  assert.equal(h.calls.filter(c => c === 'effects.echo:').length, 1);
});

test('a hollow repair sounds once and retains the light after movement and recall', () => {
  const h = startHollow(); h.press('f'); h.press('e');
  walk(h, 'w', 9); walk(h, 'd', 20); walk(h, 's', 9); h.press('f');
  assert.ok(h.snapshot().connections.hollow);
  assert.equal(h.calls.filter(c => c === 'effects.starroot:2').length, 1);
  dismiss(h); h.advance(15); h.press('e'); h.press('d');
  assert.equal(h.calls.filter(c => c === 'effects.starroot:2').length, 1);
});

test('cue completion, mute fallback, notebook, pause and restart use the real adapter', () => {
  const h = gameHarness(); h.click('#start');
  assert.equal(h.calls.filter(c => c === 'music.prologue').length, 1);
  h.advance(1); assert.ok(!h.calls.includes('music.exploration'));
  h.audioState.ended = true; h.advance(.1); h.advance(1);
  assert.equal(h.calls.filter(c => c === 'music.exploration').length, 1);
  h.click('#pause'); assert.ok(h.calls.includes('music.pause')); assert.ok(h.calls.includes('effects.pause:'));
  h.click('#resume'); assert.ok(h.calls.includes('music.resume')); assert.ok(h.calls.includes('effects.resume:'));
  const muted = gameHarness(); muted.audioState.enabled = false; muted.click('#start'); muted.click('#notebook'); muted.advance(16);
  assert.equal(muted.calls.filter(c => c === 'music.exploration').length, 1);
  h.restart(); assert.equal(h.calls.at(-1), 'reload');
  const paused = gameHarness(); paused.audioState.enabled = false; paused.click('#start'); paused.click('#pause'); paused.advance(16);
  assert.ok(!paused.calls.includes('music.exploration'));
});
