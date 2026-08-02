# Moonwell visual release audit

This release is checked against the actual canvas at its canonical 320 × 208
native resolution via the developer-only routes `?dev=scene&area=0` through
`?dev=scene&area=3`.

- Four desktop captures cover Lantern Glade, Moonroot Crossing, Whispering Hollow, and Starfall Grove.
- Four mobile-landscape touch captures cover the same four views and confirm that the touch control remains present.
- Moonroot Crossing was visually checked at both sizes: the water has a continuous opaque base beneath each repeated tile, with no transparent cell-edge gaps; the bridge stays visibly separate.
- The complete progression assertion advances 0 → 1 → 2 → 3 → completion.
- Collision assertions confirm ordinary crossing water is blocked, the revealed bridge gap is passable, and the compact Hollow sentinel remains solid.
- Every audited route completed without browser console errors.

## 320 × 208 acceptance inventory

- Desktop 1440 × 900: entry/prologue, first movement and collision probe,
  spawn cue, compact one-line statistics, pause/resume, memory and Watcher
  dialogue, all four representative scenes, and opened exit.
- Mobile portrait 390 × 844 at DPR 3: rotation gate, complete card copy,
  bounds, overflow, and console.
- Touch landscape 844 × 390 at DPR 3: full 20:13 world, transparent steering,
  pause/resume, Echo/Talk control bands, canvas bounds, and console.
- Exploratory scenarios: repeated movement against the newly visible bottom
  collider row; dense dialogue near both safe bands; an unopened exit viewed
  before its lights are gathered; bridge/water and Hollow sentinel collision.
- Rejection criteria: bottom clipping, unequal X/Y scale, non-centred ordinary
  anchors, HUD wrap/overflow, ambiguous exit/collider cues, route obscuration,
  touch interception, or any console error.

### Recorded local results

- 1440 × 900 desktop: 320 × 208 intrinsic canvas → 640 × 416 CSS pixels;
  X/Y scale = 2 / 2. The 650 × 426 bordered screen and 640-pixel HUD fit
  without page overflow. All three statistics share one row; guidance uses a
  separate no-wrap row.
- 390 × 844 × 3 portrait: the rotation-gate canvas remains native 320 × 208;
  X/Y scale = 1 / 1. The 326 × 214 bordered frame, complete gate card, HUD,
  footer, and field-guide link produce zero page overflow.
- 844 × 390 × 3 touch landscape: entry/prologue uses 440 × 286;
  X/Y scale = 1.375 / 1.375 and the compact 400-pixel card stays inside the
  frame. Playing uses 600 × 390; X/Y scale = 1.875 / 1.875. Touch steering and
  pause controls sit in the side bands, with zero overflow.
- Normal keyboard and touch input, held-key movement, pause/resume, Watcher
  wrong-answer/retry/correct flow, memory safe band, water/bridge, sentinel,
  closed/revealed/open exits, and all four developer scenes were exercised.
  Browser console: no messages after the final desktop, portrait, and touch
  landscape navigations.

`node --check game.js` and `git diff --check` are required local release checks. The hidden query route is intentionally not linked from the player experience; its small `window.__moonwellAudit` API exists only for deterministic browser checks.
