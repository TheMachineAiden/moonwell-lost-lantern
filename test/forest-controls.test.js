import test from 'node:test';
import assert from 'node:assert/strict';
import { gameHarness } from './support/game-harness.js';

function forest(options={}) {
  const h=gameHarness({search:'?scene=hollow&experience=forest',...options});
  h.click('#start');while(h.snapshot().dialogue.length)h.press('Enter');return h;
}

test('touch presentation keeps full guidance in Pause and restores expired feedback on another attempt',()=>{
  const h=forest({coarsePointer:true});assert.equal(h.element('#act').textContent,'Look nearby');
  assert.equal(h.element('#echo').textContent,'Create echo');assert.equal(h.element('#next').textContent,'Continue');
  assert.equal(h.element('#objective').textContent,'Light the near stone');
  assert.match(h.element('#pause-task').textContent,/Shine here/);
  assert.equal(h.element('#feedback').hidden,true);
  h.press('f');assert.equal(h.element('#feedback').hidden,false);const message=h.element('#feedback').textContent;
  h.advance(7);assert.equal(h.element('#feedback').hidden,true);
  h.press('f');assert.equal(h.element('#feedback').hidden,false);assert.equal(h.element('#feedback').textContent,message);
});

test('the restored pad follows pointer direction and a neutral centre stops movement',()=>{
  const h=forest();h.pointer('pointerdown',{x:110,y:66});h.advance(.2);
  const right=h.snapshot().player;assert.ok(right.x>64);assert.equal(right.y,168);
  h.pointer('pointermove',{x:66,y:20});h.advance(.2);
  const up=h.snapshot().player;assert.ok(up.y<right.y);assert.equal(up.x,right.x);
  h.pointer('pointermove');const neutral=h.snapshot().player;h.advance(1);
  assert.deepEqual(h.snapshot().player,neutral);assert.equal(h.controls().direction,null);
});

test('one pointer owns steering; release, cancellation and lost capture stop without drift',()=>{
  for(const stop of ['pointerup','pointercancel','lostpointercapture']){
    const h=forest();h.pointer('pointerdown',{x:110,y:66});h.pointer('pointermove',{id:2,x:66,y:20});
    h.pointer('pointerup',{id:2});assert.equal(h.controls().pointerActive,true);
    assert.deepEqual(h.controls().direction,[1,0]);h.advance(.1);
    h.pointer(stop);const stopped=h.snapshot().player;h.advance(2);
    assert.deepEqual(h.snapshot().player,stopped,stop);assert.equal(h.controls().pointerActive,false);
  }
});

test('pointer movement uses the existing bank collision and records traversed steps only',()=>{
  const h=forest();h.press('d');h.press('d');h.press('w');h.press('w');h.press('w');h.press('f');
  h.pointer('pointerdown',{x:110,y:66});h.advance(4);
  assert.ok(h.snapshot().player.x>=106 && h.snapshot().player.x<=108);assert.equal(h.snapshot().connections.hollow,null);
  assert.ok(h.snapshot().recording.path.every(p=>p.x<=108));
});

test('pause, notebook, viewport resize and blur clear a held pointer',()=>{
  for(const kind of ['resize','blur']){
    const h=forest();h.pointer('pointerdown',{x:66,y:20});h.lifecycle(kind);
    const stopped=h.snapshot().player;h.advance(1);assert.deepEqual(h.snapshot().player,stopped);assert.equal(h.controls().pointerActive,false);
  }
  const h=forest();h.pointer('pointerdown',{x:66,y:20});h.click('#pause');assert.equal(h.controls().pointerActive,false);
  h.click('#pause-notebook');h.pointer('pointerdown',{x:66,y:20});assert.equal(h.controls().pointerActive,false);
  const stopped=h.snapshot().player;h.advance(1);assert.deepEqual(h.snapshot().player,stopped);
  h.click('#close-journal');h.pointer('pointerdown',{x:66,y:20});assert.equal(h.controls().pointerActive,true);
});

test('fullscreen is requested on Start and rejection preserves playable viewport fallback',async()=>{
  const supported=forest({fullscreen:'supported'});assert.equal(supported.calls.filter(c=>c==='fullscreen.request').length,1);
  assert.equal(supported.element('#fullscreen').hidden,true);
  supported.click('#pause');supported.document.fullscreenElement=null;supported.lifecycle('fullscreenchange');
  assert.equal(supported.element('#fullscreen').hidden,false,'fullscreen can be restored after leaving it while paused');
  supported.click('#fullscreen');supported.lifecycle('fullscreenchange');assert.equal(supported.element('#fullscreen').hidden,true);
  const rejected=forest({fullscreen:'rejected'});await Promise.resolve();rejected.pointer('pointerdown',{x:66,y:20});rejected.advance(.2);
  assert.equal(rejected.element('#entry').hidden,true);assert.ok(rejected.snapshot().player.y<168);
  const unsupported=forest();assert.ok(!unsupported.calls.includes('fullscreen.request'));assert.equal(unsupported.element('#fullscreen').hidden,true);
  unsupported.press('w');assert.ok(unsupported.snapshot().player.y<168);
});
