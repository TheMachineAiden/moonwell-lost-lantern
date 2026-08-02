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

## Selected forest post-release acceptance — 2026-08-02

- Deterministic suite: 22/22. New assertions cover exact production-strip
  dimensions, the full floor vocabulary in each of four areas, non-solid
  decoration, and the prohibition on loading the retained source sheet.
- Desktop 1200 × 780: 320 × 208 intrinsic canvas displayed at 640 × 416,
  equal X/Y scale, no horizontal overflow. Normal `#moonwell` start,
  keyboard movement, P pause, and Escape resume completed.
- Portrait 390 × 844 × 3: native 320 × 208 canvas and complete rotation gate
  fit with no horizontal overflow.
- Touch landscape 844 × 390 × 3: canvas displayed at 600 × 390, touch
  steering changed the rendered frame, and the 44 × 44 pause button completed
  pause/continue without overflow.
- All four developer scenes were visually reviewed. Moonroot water remained
  blocked outside the passable bridge, the Hollow sentinel remained solid,
  and every reviewed console was clean.
- Evidence: `assets/generated/moonwell-before-selected-reference-desktop.png`,
  `moonwell-after-selected-reference-desktop.png`,
  `moonwell-after-selected-reference-four-levels.png`,
  `moonwell-after-selected-reference-portrait.png`, and
  `moonwell-after-selected-reference-touch-landscape.png`.

## Luminous rebuild acceptance — 2026-08-02

- Matched 640 × 416 proof is
  `artifacts/qa/moonwell-baseline-reference-after-matched.png`: baseline,
  retained reference crop, and rebuilt Lantern Glade at the same play ratio.
- All four rebuilt 640 × 416 canvases and the contact sheet are under
  `artifacts/qa/`. They visibly retain continuous loam, layered spruce canopy,
  moonlight, amber light points, navy enclosure, and distinct level landmarks.
- Deterministic suite: 24/24. It covers the 320 × 208 logical / 640 × 416
  visual split, tree/platform/Eir overhang mapping, unchanged route and
  collider behavior, production asset dimensions, raster Eir/portrait paths,
  and the absence of an SVG/drawn-sigil fallback.
- Browser acceptance includes desktop keyboard movement and edge collision,
  portrait rotation-gate fit, touch-landscape movement/pause, Eir dialogue at
  all three presentations, required-element visibility, clean consoles, and
  zero unacceptable overflow.
- Final measured presentation: desktop 1200 × 780 uses a 640 × 416 CSS and
  intrinsic canvas with logical audit 320 × 208 at renderScale 2; portrait
  390 × 844 uses a 320 × 208 screen and a 307 × 129 dialogue with no internal
  scroll; touch landscape 844 × 390 uses a 440 × 286 preview (600 × 390 while
  playing) and a 414 × 251 dialogue with no internal scroll. The portrait
  decodes at 512 × 512. Document scroll width equals viewport width in all
  three checks, and all final consoles are empty.
- Editable Figma production system: node `11:2` in
  `https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl?node-id=11-2`.
