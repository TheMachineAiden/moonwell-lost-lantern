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

## Rooted-contact and relative-scale acceptance — 2026-08-02

- Deterministic suite: 31/31. New coverage audits every tree/platform instance
  across all four areas, exact logical versus visual footprints, representative
  four-direction contact, overhang passability, route reachability, grounded
  starroot asset/copy/state paths, retired sky-bell runtime absence, and Luna's
  14 × 18 render over the unchanged 10 × 10 movement box.
- Desktop keyboard QA approached a representative spruce and root shelf from
  multiple directions with repeated normal inputs. Contact stopped at the
  visible trunk/root face without tunneling; the clear canopy/platform
  overhang lane remained passable. Touch landscape repeated tree contact and
  completed pause/Continue.
- Figma node `17:2` shows the corrected collider examples, relative Luna
  scale, production starroot strip, and asset provenance. Node `20:2`
  contains verified cache-isolated 640 × 416 captures of all four levels.
- Responsive Eir dialogue stayed inside portrait (307 × 129) and touch
  landscape (564 × 216) viewports, with the 512 × 512 raster portrait loaded.
  Document widths were 1440/1440, 390/390, and 844/844. Final console checks
  were empty; final network inspection loaded the starroot strip with 200 and
  did not request the retired sky-bell strip.

## No-violet environmental acceptance — 2026-08-03

- Deterministic suite: 35/35. The runtime raster inventory is exact and
  exhaustive: 21 environmental layers are zero-tolerance checked for the
  prohibited purple-family predicate, including alpha-connected silhouettes
  and repeated frame/tile seams. Luna and Eir are the only explicit semantic
  character exceptions. Canvas environmental fallbacks and player copy cannot
  reintroduce violet terrain language.
- `scripts/process-no-violet-environment-art.sh` rebuilds from all retained
  generated families into versioned production derivatives. A full rerun is
  byte-identical and does not mutate the retained selected-reference proof.
- Visual evidence at native 640 × 416 scale covers all four levels in
  `artifacts/qa/moonwell-no-violet-four-level-contact-sheet.png`. The exact
  bottom-right reference comparison is
  `artifacts/qa/moonwell-no-violet-reference-level-1-matched.png`, and the
  representative production family is
  `artifacts/qa/moonwell-no-violet-representative-assets.png`.
- Desktop 1440 × 900 uses a 640 × 416 canvas inside a 650 × 426 frame with no
  horizontal overflow. Normal keyboard movement and pause/resume passed.
  Portrait 390 × 844 × 3 keeps the complete rotation gate inside the viewport.
  Touch landscape 844 × 390 × 3 keeps the 600 × 390 canvas, 44 × 44 pause
  control, and 116 × 116 steering control in bounds; normal touch movement and
  pause/Continue passed. Final consoles are empty.
- Every four-level developer-scene navigation loaded the complete current
  production family without failures. Moonroot still reports blocked water and
  a passable bridge; Whispering Hollow still reports its sentinel blocked.
- Figma production evidence: palette contract and matched proof at node `26:2`;
  four-level contact sheet and audit evidence at node `26:3`.

## Top-canopy collision acceptance — 2026-08-03

- Deterministic suite: 43/43. The unchanged three-cluster canopy layout and its
  20 logical row-2 root cells are exported together. Tests audit all 80
  per-area records, exact 20 × 12 contact rectangles, overlapping seams, clear
  arrival/interaction anchors, and full required routes through all four areas.
- Desktop normal input reproduced the original failure before the correction:
  Whispering Hollow began at y=40 inside the tree art and Up moved Luna through
  it to y≈22.54. After correction, repeated desktop Up input in Starfall stops
  at y≈53.45; additional inputs leave the position unchanged. Touch-landscape
  stops at y=54 and likewise rejects the next Up press.
- Every cache-isolated developer scene reports 20 canopy-root colliders from
  x=−2 through x=322 with y=36, height 12. All four were visually reviewed at
  1440 × 900; the repositioned Lantern firefly, Moonroot memory, and arrival
  anchors are visibly clear without changing the enclosing art.
- Desktop start/prologue skip, movement, P pause, and Escape resume pass.
  Portrait 390 × 844 × 3 has document width 390, no horizontal overflow, and a
  fully fitting rotation gate. Touch landscape 844 × 390 × 3 has document
  width 844, a 600 × 390 game surface, fitting 116 × 116 steering and 44 × 44
  pause controls, normal touch movement, and pause/Continue.
- The preserved console across desktop, portrait, touch, and all scene
  navigations is empty. Current production assets and the cache-busted
  `game-core.js` / `game.js` requests all return 200 or 304 locally.

## Luna and Rootwatcher character-art acceptance — 2026-08-03

- Source trace: Eir's four retained 470 × 836 keyed cells are reduced by
  `process-luminous-forest-art.sh`; magenta/fuchsia key fringe survived the
  64 × 96 frame reduction and appeared as the reported outline. The same v1
  portrait source retained sparse purple undergrowth accents. The final
  no-violet processor now derives versioned v2 strip and portrait assets with
  navy/teal replacements at both runtime scales.
- Luna provenance: the approved 1995 × 788 RGB and alpha files are retained at
  `artifacts/owner-handoffs/luna-regeneration-v1/`. The processor checks the
  approved alpha SHA-256 before using the reviewed 64 × 16 native master. Each
  16 × 16 frame has a connected cyan cowlick, teal cloak clusters, at least two
  amber lantern pixels, a shared walking baseline, and a one-pixel ground
  margin.
- Release profile: `npm run check`, 45/45 tests, `npm run build`,
  `git diff --check`, byte-identical runtime regeneration, byte-identical icon
  regeneration, and source/dist asset comparisons passed. All runtime rasters
  remain exhaustively classified; strict character checks find zero purple,
  violet, magenta, or fuchsia pixels.
- Gameplay contract: Luna still draws at 14 × 18 over the unchanged 10 × 10
  collision footprint; Eir still draws at 32 × 48 over a non-solid interaction
  anchor. All route, tree/root, water/bridge, sentinel, echo, and progression
  tests pass. Browser audit still reports twenty top-root colliders,
  Moonroot water blocked, and its revealed bridge passable.
- Desktop 1440 × 900 normal-input coverage passed start, prologue skip,
  movement, P pause, Escape resume, Eir riddle retry/leave, and all four
  developer scenes. Portrait 390 × 844 × 3 has a complete rotation gate and
  no horizontal overflow. Touch landscape 844 × 390 × 3 passed movement and
  pause/Continue; its 600 × 390 canvas, 116 × 116 steering, and 44 × 44 pause
  control all fit.
- Final local console is empty. The Luna v6 strip, Eir v2 strip, Eir v2
  portrait, complete production family, and cache-busted scripts returned 200
  or 304; the portrait decoded at 512 × 512. Actual-scale evidence is retained
  at `artifacts/qa/moonwell-character-four-area-contact-sheet.png`,
  `artifacts/qa/moonwell-character-context-moonroot-local.png`, and
  `artifacts/qa/moonwell-eir-dialogue-local-desktop.png`.

## Exact owner-source Luna v7 acceptance — 2026-08-03

- Provenance: the exact owner attachment is retained as
  `artifacts/owner-handoffs/luna-exact-owner-source-2026-08-03.png` at
  1995 × 788 with SHA-256
  `50258352972739d24748684eb433c50aefad4393d08b0b1461e3c82e49a86249`.
  Its sidecar records the original `generated-image.png` name and P10313262
  owner handoff. The deterministic processor rejects any source hash drift.
- Selection: the requested visual-judgment pass compared literal 16 × 28,
  20 × 34, 24 × 40, 28 × 46, and 32 × 54 treatments at actual game scale.
  A 23 × 38 figure padded into a 26 × 40 cell is the smallest treatment that
  retains the supplied face/eye, hair and cowlick, cloak shape, stride, and
  framed warm lantern. The final sheet is
  `artifacts/qa/moonwell-luna-v7-source-reduction-context-contact-sheet.png`.
- Processing: only magenta-background transparency cleanup, point reduction,
  shared baseline alignment, and safe cell padding are applied. Four focused
  frame assertions cover source identity, dimensions, hair/cowlick, teal/cyan
  clothing, skin/face, lantern, common baseline, transparent ground margin,
  clear frame edges, and zero keyed chroma residue. Regeneration is
  byte-identical.
- Gameplay: Luna renders at native 26 × 40 from anchor −13,−39 while her
  existing 10 × 10 movement box and depth point remain unchanged. All root,
  platform, route, Moonroot water/bridge, Hollow sentinel/echo, Eir, exit, and
  progression tests pass. Eir v2 and all app-icon/PWA assets are unchanged.
- Validation: `npm run check`, all 45 tests, and `npm run build` pass. Desktop
  1440 × 900 normal input passed prologue skip, animated keyboard movement,
  P pause, and Escape resume. All four developer scenes were visually reviewed
  at actual 640 × 416 scale. Touch landscape 844 × 390 × 3 passed movement,
  pause/Continue, fitted 600 × 390 canvas, fitted 116 × 116 movement control,
  and fitted 44 × 44 pause control. Portrait 390 × 844 × 3 retained the full
  rotation gate, fitted modal, and zero horizontal overflow. Eir's dialogue,
  wrong-answer retry, and leave flow passed. Local console remained empty and
  all requested assets/scripts returned 200 or 304.

## Exact half-size Luna v7 acceptance — 2026-08-03

- Identity: the retained 1995 × 788 owner source remains SHA-256
  `50258352972739d24748684eb433c50aefad4393d08b0b1461e3c82e49a86249`;
  the unchanged 104 × 40 v7 atlas remains SHA-256
  `a287641c02f9e243d5f58d8188e7a54084c42a92150542ce52adfa29e8315f07`.
  Focused assertions pin both dimensions and hashes.
- Geometry: the four unchanged 26 × 40 source cells draw at exactly 13 × 20
  from offsets −6.5,−19.5 with smoothing disabled. Browser Canvas2D inspection
  at the 2× intrinsic render scale found every complete 23 × 38 figure, with
  frame centers within one physical pixel of the anchor, feet ending one pixel
  above it, and 14–20 visible warm-lantern pixels per frame. Frame selection and
  `.11` walk timing are unchanged.
- Actual-scale visual judgment: public 26 × 40 and requested 13 × 20 draws were
  compared at 640 × 416 across Lantern Glade, Moonroot Crossing, Whispering
  Hollow, and Starfall Grove. The requested render is exactly half-size, crisp,
  fully unclipped, centered, grounded, and readable beside Eir, trees, paths,
  water, root platforms, runes, starroots, props, and altar scenery. Evidence is
  retained as `moonwell-luna-current-26x40-public-baseline-area-2.png` and
  `moonwell-luna-half-runtime-area-2.png`.
- Local interaction QA: desktop 1440 × 900 passed entry, prologue skip,
  keyboard movement, pause, and Escape resume. Touch landscape 844 × 390 × 3
  passed entry, movement buttons, pause/Continue, a fitted 600 × 390 canvas,
  116 × 116 movement control, and zero document overflow. Portrait
  390 × 844 × 3 retained its complete rotation gate, fitted 320 × 208 canvas,
  and zero horizontal overflow. Eir's dialogue passed wrong-answer retry,
  correct-answer response, and leave. All four developer scenes, local console,
  and 200/304 network health passed.
