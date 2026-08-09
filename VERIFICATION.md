# Moonwell visual release audit

## Map-specific moonlight hierarchy — 2026-08-09

- Fresh 1440 × 900 actual-scale review found the remaining shared composition:
  Lantern Glade, Whispering Hollow, and Starfall Grove all placed their
  strongest retained moonlight pool in nearly the same lower-centre band. In
  Hollow it spotlit the sentinel more strongly than the first rune, while in
  Starfall it sat below the altar instead of supporting the finale landmark.
- Four explicit two-pool layouts now place the same retained raster family by
  map purpose. Lantern Glade follows the lower-left gathering route and keeps
  a quiet lead toward its upper-right exit; Moonroot supports Eir and the
  bridge landing; Hollow traces the first-to-second-rune diagonal; Starfall
  centres its dominant cool light behind the altar and quietly marks the left
  chime. Dominant anchors, frames, positions, sizes, and opacity are distinct.
- The renderer still uses only
  `moonwell-clearing-moonlight-v4.png`. The pool records are visual-only and
  never enter `createWorldObjects`; assets, routes, colliders, water, bridge,
  exit timing, interaction anchors, progression, and the dense inner forest
  boundary are unchanged.
- Deterministic coverage pins all four layouts to the four-pixel placement
  rhythm, retained raster footprints, in-world bounds, restrained opacity,
  intended interaction anchors, raster-only rendering, and absence from world
  geometry. Proportional release acceptance covers the full test suite,
  build/source-dist identity, and public desktop, portrait, and touch-landscape
  browser QA.

## Map-specific understory detail layouts — 2026-08-09

- Public 1440 × 900 comparison across all four developer scenes confirmed the
  remaining repeated ground signature: the retained small-prop families were
  map-specific only in part, with exact stone, root, mushroom, needles, fern,
  and glowmoss cells recurring across the later maps.
- Four explicit fourteen-record layouts now choose the retained production
  raster frame, reflection, opacity, and one- or two-pixel placement offset.
  The four maps share the same understated vocabulary without sharing a
  visible coordinate for any one kind. Moonroot keeps these records on its
  dry banks so the water and vertical bridge remain visually dominant.
- The ground renderer contains no rectangle, path, gradient, SVG, or other
  procedural world-art fallback. No new asset was required: all visible detail
  still comes from the established foliage, ground-texture, stone, mushroom,
  and light-pool PNG families and their reproducible managed pipeline.
- Geometry is unchanged. All fifty-six records retain 16 × 16 logical cells,
  `solid:false`, and no participation in `createWorldObjects`; every route,
  tree/root collider, water cell, bridge span, landmark, interaction, exit
  state, and progression contract remains accepted.
- Local release acceptance passed syntax, 75/75 deterministic tests,
  byte-identical environment-art regeneration, build/source-dist identity,
  and diff hygiene. Desktop actual-scale review covered all four maps without
  clipping, landmark competition, false collectible cues, or exposed art
  fallbacks.

## Map-specific loam patch layouts — 2026-08-09

- Baseline comparison at 1440 × 900 showed the four retained loam sprites
  repeating on the same shared staggered lattice in every map. The change is
  limited to their placement contract: four distinct layouts now supply thirty
  records each with one of four source frames, a fixed 80 × 48 draw footprint,
  four-pixel-aligned offsets, reflection, and opacity from 0.66 through 0.76.
- The renderer uses only the existing retained
  `moonwell-clearing-loam-patches-v3.png` atlas; it contains no terrain
  rectangle, path, SVG, gradient, or newly generated asset. The managed
  no-violet workflow still rebuilds the complete runtime raster family
  byte-identically.
- Geometry is unchanged. The new records have no `solid` field and never enter
  `createWorldObjects`; all anchors, collider rectangles, routes, water,
  bridge, Moonroot banks, root shelves, top-root blockers, exit progression,
  interactions, and finale state retain their accepted contracts.
- Automated local acceptance passed syntax and 74/74 deterministic tests.
  Browser review covered all four maps at 1440 × 900, the 390 × 844 × 3
  portrait gate, and Lantern Glade at 844 × 390 × 3. The 600 × 390 game view,
  116 × 116 steering control, and 44 × 44 pause control fit; touch movement and
  pause/Continue passed, the portrait gate had zero horizontal overflow, and
  the preserved console was empty.

## Varied interior spruce blockers — 2026-08-09

- The verified public baseline used one 24 × 40 footprint for all 39 ordinary
  interior tree blockers. Four-map desktop review and 844 × 390 × 3 touch
  review showed repeated pairs reading as placed obstacles rather than varied
  forest growth.
- The revised renderer selects 39 distinct placement records from the retained
  no-violet spruce atlas. Every area uses all three frames, mirrored and
  unmirrored states, at least six pixels of width and height variation, and a
  common root baseline. Runtime contains no rectangle, path, gradient, SVG, or
  other procedural substitute in the tree renderer.
- Gameplay identity is fixed: the original tile records remain 16 × 16 and
  every ordinary tree retains its exact 20 × 12 collider. Existing all-map
  route tests continue to prove the eight-pixel comfort envelope around every
  required pickup, encounter, crossing, exit, and finale destination.
- Local release acceptance passed syntax, 72/72 deterministic tests including
  byte-identical managed art regeneration, build/source-dist identity, and
  diff hygiene. Desktop review covered all four maps and all three open routes;
  keyboard movement and pause/Continue passed. Portrait 390 × 844 × 3 retained
  its complete rotation gate with zero horizontal overflow. Touch landscape
  844 × 390 × 3 retained a 600 × 390 canvas, 116 × 116 steering control, and
  44 × 44 pause control; touch movement and pause/Continue passed. All reviewed
  assets and cache-keyed scripts returned 200/304 and consoles were empty.

## Irregular loam route clearing — 2026-08-09

- Public actual-scale review found that the accepted parted-spruce exit still
  exposed an opaque, high-contrast rectangular root-platform lip. In the open
  state it read as an upright tan slab rather than space between trees.
- `moonwell-exit-clearing-states-v3.png` keeps the four 32 × 40 raster states
  but derives one widening, tapered loam silhouette from the retained
  no-violet clearing texture. The rectangular lip is gone; each lower profile
  varies across at least three row widths, ends narrower than its apron, grows
  monotonically by state, retains muted warm loam pixels, and contains no
  lantern-bright point.
- Runtime still draws the clearing behind the unchanged paired-spruce v1
  overhang. All three one-tile anchors, the 24 × 12 rooted collider, blocked
  closed/opening/revealed states, two-second timing, open-state passability,
  routes, and progression remain unchanged.
- Focused acceptance passed 70/70 tests, including byte-identical managed
  no-violet regeneration, raster-only rendering, palette classification,
  retained-source routing, and the new anti-slab lower-profile invariant.
- Local Chrome acceptance reviewed all four maps at 1440 × 900 and the open
  cue at all three placements. The 640 × 416 canvas remained undistorted;
  normal Arrow-key movement and pause/Continue passed. At 390 × 844 × 3 the
  342 × 267 rotation gate fit with no horizontal overflow. At 844 × 390 × 3,
  the 600 × 390 screen, 116 × 116 steering control, 44 × 44 pause control,
  open clearing, touch movement, and pause/Continue all passed. The v3 asset
  and cache-keyed scripts returned 200/304, and final consoles were empty.

## Varied loam root shelves — 2026-08-09

- The public baseline used one identical broad rooted sprite for all seven
  platform blockers. Four-map desktop comparison showed the repeated dark
  ribs reading as benches or fences and overpowering map-specific landmarks.
- `moonwell-root-shelf-variants-v1.png` packs six 48 × 24 retained-raster
  frames. Runtime varies only the source frame; every platform anchor, draw
  rectangle, 2 × 1 logical footprint, and 40 × 14 contact rectangle remains
  unchanged.
- Deterministic coverage pins the six distinct raster signatures and lower
  silhouettes, exact retained inputs, managed regeneration, palette audit,
  raster-only renderer, cache identity, and existing all-map collider tests.
- Release acceptance passed: syntax, 70/70 tests, byte-identical art
  regeneration, build and source/dist identity, and desktop all-map visual
  review. Normal keyboard input stopped Luna at y=54.67 against the unchanged
  Moonroot shelf contact at y=34–48. The open Lantern Glade exit stayed
  passable and visually clear.
- At 390 × 844 × 3, the portrait modal and complete 342 × 267 gate fit with
  document width 390. At 844 × 390 × 3, the 600 × 390 screen, 116 × 116 touch
  steering, and 44 × 44 pause control fit; touch movement and the complete
  pause/Continue cycle passed. The new raster, cache-keyed scripts, and all
  reviewed assets returned 200/304, with no console errors or warnings.

## Varied side forest edges — 2026-08-09

- Public desktop inspection across all four developer scenes found the left
  and right equal-size spruce stacks still reading as regular vertical rails.
  The revised side bands vary retained sprite frame, width, height, horizontal
  offset, and reflection while keeping their rooted baselines and corner
  overlaps coherent with the accepted top curtain and bottom edge.
- The change reuses only `moonwell-spruce-overhang-v3.png`; no generated
  source, production PNG, route, collider, exit, water, bridge, landmark, or
  interaction record changed.
- Deterministic checks cover all twenty-two unique side placement records,
  exact rooted colliders in every map, retained-raster-only tree rendering,
  route preservation, and cache identity. Required release validation is
  syntax, all tests, build, desktop four-map and open-exit review, portrait
  rotation gate, touch-landscape movement and pause/resume, viewport fit,
  asset responses, source/dist identity, and clean consoles.
- Local validation passed: `npm run check`, 67/67 tests including
  byte-identical managed art regeneration, `npm run build`, source/dist hashes,
  asset-tree identity, and `git diff --check`. At 1440 × 900, all four maps and
  representative right-side/lower-left open exits remained clear; repeated
  normal input stopped Luna at the rooted side contact face and pause/resume
  completed. The 390 × 844 × 3 portrait gate and 844 × 390 × 3 touch landscape
  fit without horizontal overflow; touch movement and pause/Continue passed,
  and final consoles were empty.

## Varied bottom forest edge — 2026-08-09

- Desktop actual-scale comparison across all four developer scenes found the
  former bottom picket row and confirmed that the revised edge reads as a
  denser, irregular foreground forest. The existing top raster curtain remains
  continuous and visually dominant at the inner boundary.
- The change reuses only `moonwell-spruce-overhang-v3.png`; runtime varies
  retained frames through placement, scale, and reflection. No generated
  source, production PNG, world record, route, collider, or interaction changed.
- Deterministic checks cover the twenty unique placement records, exact rooted
  colliders in all four maps, retained-raster-only tree rendering, and cache
  identity. Required release validation is syntax, all tests, build, desktop
  four-map review, portrait rotation gate, touch-landscape movement and
  pause/resume, viewport fit, asset responses, and console cleanliness.

## Opaque loam substrate — 2026-08-09

- The semi-transparent loam overlay exposed a canvas-painted full-world base;
  `moonwell-loam-base-tiles-v1.png` now supplies that visible terrain as four
  opaque retained 16 × 16 raster cells. Its deterministic processor derives
  the cells from the reviewed no-violet loam family, and regression coverage
  verifies dimensions, full alpha coverage, runtime loading, no procedural
  floor rectangle, palette classification, and byte-identical regeneration.
- The Moonroot water tile was separately alpha-audited as fully opaque, so its
  backing rectangle is not visible runtime art and no unrelated water change
  was made. Water collision, shore order, bridge footprint, exits, and all
  route/collider records remain unchanged.
- `npm run check`, `npm test` (63/63), `npm run build`, and `git diff --check`
  pass. Local Chrome QA on `http://127.0.0.1:4174` visually reviewed all four
  developer scenes at 1440 × 900, the 390 × 844 × 3 portrait rotation gate,
  and Moonroot at 844 × 390 × 3 touch landscape. Keyboard start/prologue skip,
  movement, pause/resume, touch movement, and touch pause/resume pass; the
  canvas and required controls fit with no horizontal overflow, the new asset
  returns HTTP 200, and consoles are empty.

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

## Half-size Eir and vertical Moonroot riddle crossing — 2026-08-03

- Eir identity and scale: the retained four-frame v2 strip is unchanged at
  SHA-256 `4bc70c41fd73e083af2f1654ee38273981da949928c57229b553831f6d22a4cd`.
  Each 64 × 96 cell now draws at exactly 16 × 24 from −8,−22 with smoothing
  disabled. Her fixed ground contact, frame timing, non-solid anchor, and
  22-pixel interaction radius are unchanged.
- Riddle progression: Moonroot contains no runtime moonflower/pressure trigger.
  Eir asks three concise moon, echo, and lantern riddles. Browser normal-input
  checks passed wrong-answer feedback and same-riddle retry, correct-answer
  feedback, leaving and resuming at the next retained step, all three correct
  answers, the final bridge reveal, and the solved-state follow-up. The bridge
  is absent and its corridor solid before completion; it appears and becomes
  passable only after the final correct answer.
- Vertical layout: the new bridge is one 32 × 64 transparent production asset
  with a 2 × 4-cell north-to-south contract at x=144, y=80. Its retained source
  SHA-256 is `2be0a36c497445282ffe7e971d6a994b4066dd8e765d2fe4a5ff6f7c9b734f91`;
  the deterministic no-violet runtime SHA-256 is
  `f08046bae24d93b0d783b1b08a1a0adfe73aed2b6f08337a779893e730a8de1d`.
  The water is four rows deep, stays solid outside the narrow bridge, and has
  complete collision-safe routes from the north-shore spawn through Eir and
  the bridge to both lower-shore lights, memory, and exit.
- Responsive interaction: desktop 1440 × 900 passed the entire dialogue flow
  and a physical Arrow-key crossing to y=153 on the lower shore. Portrait
  390 × 844 × 3 fit the 307 × 129 dialogue with no inner scroll or horizontal
  document overflow. Touch landscape 844 × 390 × 3 fit the 564 × 216 dialogue,
  600 × 390 game screen, 116 × 116 movement control, and 44 × 44 pause control;
  the Talk button reopened Eir normally and touch movement changed Luna's
  collision-aware position.
- Regression and visual review: all four 640 × 416 scenes were reviewed at
  desktop scale. Moonroot reads as a vertical crossing with the bridge centered
  between distinct north and south shores; the former water-platform was moved
  onto the south shore. Lantern Glade, Whispering Hollow, and Starfall Grove
  retained their established composition. Local console was empty and every
  observed request returned 200 or 304. All 45 tests, syntax checks, production
  build, and source-to-dist identity checks pass.

## Route clarity, altar finale, and in-canvas prologue — 2026-08-03

- Route clearance: Whispering Hollow's required route now has one fewer tree at
  the lower-left pinch, and its memory moved to x=264, y=88. A deterministic
  navigation test checks every required pickup, interaction, bridge crossing,
  and finale route in all four scenes with an eight-logical-pixel comfort
  envelope around Luna's movement box.
- Clear visual semantics: decorative firefly-like ground marks are now static,
  low-contrast cyan `glowmoss`, with no amber collectible sprite, white core,
  halo, or animation. The genuine collectible fireflies remain animated amber.
  Starfall Grove's central platform is now explicitly the Moonwell altar: it is
  always visible, wakes after all three starroots, releases the final two
  lights, and completes the story only when Luna returns those lights to it.
  Its 32 × 24 visual, 28 × 8 solid base, and 22-pixel interaction reach agree.
- Story sequencing: the Moonroot memory remains on the far shore and now reads
  as proof that another keeper crossed safely, not as bridge-opening guidance.
  The final area's obsolete exit tree was removed so the awakened altar is the
  single, unambiguous destination.
- Prologue: the former timer-driven cards are replaced by a semantic, skippable
  14-second Moonwell-native upward drift inside the game screen. It never starts
  play without a trusted Enter/Skip action. Reduced motion shows the complete
  copy statically and exposes Enter immediately; Escape remains a normal pause
  control after the prologue DOM is removed.
- Local validation: syntax checks, all 50 tests, deterministic art regeneration,
  production build, source-to-dist identity, and `git diff --check` pass.
  Desktop normal input completed the two-light altar return and reached the
  ending. The opening, moving, ready, and reduced-motion prologue states; all
  four scenes; 844 × 390 touch landscape; and 390 × 844 portrait were visually
  reviewed. Controls remain at least 44 pixels tall, layouts do not overflow,
  and the browser console is empty with all observed requests returning 200 or
  304.

## Root-masked forest threshold acceptance — 2026-08-08

- Visual-layer invariant: the tile-scale clearing is drawn before the existing
  four-state rooted exit raster and is never repainted after the atmosphere
  pass. Regression coverage pins that order so the tree silhouette continues
  to mask the warm threshold rather than exposing a rectangular lantern/door.
- Gameplay invariant: Lantern Glade, Moonroot Crossing, and Whispering Hollow
  remain blocked in `closed` and `revealed` and become passable only in `open`;
  Starfall Grove still returns no exit. Existing route and collider assertions
  remain unchanged.
- Release profile: `npm run check`, 56/56 tests including byte-identical
  environmental regeneration, `npm run build`, and `git diff --check` pass.
- Browser profile: desktop normal entry, prologue skip, movement, pause/resume,
  all four staged exit visuals, and all four complete scenes passed. Portrait
  390 × 844 × 3 retained the full rotation gate and zero horizontal overflow.
  Touch landscape 844 × 390 × 3 retained its 600 × 390 undistorted canvas,
  116 × 116 steering control, and 44 × 44 pause control; touch movement and the
  pause/Continue cycle passed. All observed requests returned 200 or 304 and
  the preserved console was empty.

## Moonroot shoreline acceptance — 2026-08-08

- Visual invariant: only Moonroot Crossing receives the shallow ragged shore;
  it derives both water edges from `MOONROOT_BRIDGE_LAYOUT` and the 16 px tile
  size. Water is painted first, the shore second, and the bridge last, keeping
  the crossing above the wet-soil overlap in both gated and solved states.
- Gameplay invariant: no world record or collision function changed. Existing
  tests still prove the water blocks before the riddles, the 32 × 64 bridge is
  passable after them, and the complete north-to-south route remains available.
- Regression coverage asserts Moonroot-only rendering, tile-derived edge
  depths, muted forest colors, and the water/shore/bridge order. The release
  profile now contains 57 deterministic tests.

## Moonroot wet-bank refinement — 2026-08-08

- The shore processor now makes eight source-derived moss/wet-soil sections
  with a continuous opaque lower bank and a shallow irregular moss edge,
  replacing the former transparent-edged three-tile cycle.
- Regression coverage confirms the production strip has no transparent
  vertical gap and more than eight distinct tile-scale signatures across its
  north row; water remains before shore and the bridge remains after shore.
- `npm test` passed 59/59, `npm run check`, `npm run build`, deterministic
  regeneration, and source/dist identity all passed. Browser review passed at
  1440 × 900 desktop, 844 × 390 × 3 touch landscape, and 390 × 844 × 3
  portrait rotation gate with no console warnings or errors.

## Moonroot loam-bank correction acceptance — 2026-08-09

- Visual invariant: `moonwell-moonroot-shores-v1.png` is now a 288 × 24
  retained raster derived from `moonwell-clearing-loam-patches-v3.png`, not a
  compressed root-platform silhouette. Its two 12-pixel rows have a continuous
  seven-pixel wet-soil join and at least three source-shaped fringe depths, so
  the river edges read as irregular banks rather than straight root rails.
- Runtime invariant: only `drawMoonrootShore` changed its visual depth from 8
  to 12 pixels. Water still draws first, the two raster banks draw second, and
  the unchanged 32 × 64 bridge draws last. `MOONROOT_BRIDGE_LAYOUT`, world
  objects, collision, riddles, routes, exit timing, and all non-Moonroot maps
  are unchanged.
- Processing invariant: the shared no-violet environment workflow invokes the
  exit/Moonroot processor after the final loam and root families, and the full
  runtime family regenerates byte-identically. The cache-keyed shore URL and
  page script keys prevent a mixed old/new bank draw after publication.
- Local release profile: `npm run check`, 67/67 tests, deterministic managed
  art regeneration, `npm run build`, source/dist byte identity, and diff checks
  pass. Browser QA reviewed all four desktop maps, gated and solved Moonroot,
  Eir's complete three-riddle flow, 390 × 844 portrait, and 844 × 390 × 3 touch
  landscape. Touch movement and pause/Continue worked; viewport fit held and
  the preserved console contained no warnings, errors, or issues.

## Parted-spruce route opening acceptance — 2026-08-09

- Sprite provenance: `moonwell-route-opening-overhang-v1.png` is a deterministic
  four-cell derivative of the retained no-violet spruce atlas;
  `moonwell-exit-clearing-states-v2.png` is a deterministic four-cell derivative
  of the retained loam and root-platform families. Runtime loads only these PNG
  derivatives and performs no procedural route or tree drawing.
- Visual invariant: central root coverage decreases in every state and leaves
  at most eight opaque pixels in the open cell's 16 × 24 passage sample. The
  loam trail grows monotonically, retains broad warm source texture, and has no
  lantern-bright point pixels.
- Gameplay invariant: all three exit anchors, their 24 × 12 colliders, staged
  blocked states, two-second reveal timing, open-state passability, routes, and
  progression are unchanged. Starfall Grove remains exit-free.
- Local release profile: `npm run check`, 69/69 tests including full
  byte-identical environment regeneration, `npm run build`, source/dist byte
  identity, and `git diff HEAD --check` pass. Browser review covered every exit
  state and placement at 1440 × 900, the 390 × 844 × 3 portrait gate, and
  844 × 390 × 3 touch landscape with movement, pause/Continue, viewport fit,
  and no console messages.

## Sprite-first Starroot grounding acceptance — 2026-08-09

- Provenance: retained source
  `assets/generated/moonwell-starroot-clearing-source-v2.png` is 1536 × 1024
  with SHA-256
  `a5b36b3470eea3e0eaf854938c0e58f0c25b94c1eb2df8c75cdd8d5107db9aa7`.
  The processor pins that identity, uses a hard chroma-alpha predicate, crops
  four fixed quarters, point-reduces into 24 × 24 cells with transparent
  gutters, and produces byte-identical no-violet runtime hash
  `8688a8826e3c764329267b7c29bf379526bfb5725a42cab0b6333e2f31e7d574`.
- Sprite-first invariant: the Starroot renderer contains one raster draw and a
  transient state halo, with no rectangle/path clearing and no exported
  `STARROOT_CLEARING`. Glowmoss selects and dims retained foliage raster cells;
  it no longer draws rectangle clusters. Runtime paths never load the retained
  generation source.
- Gameplay invariant: every Starroot remains non-solid with the same centered
  one-cell visual contract and 15-pixel touch radius. Three-touch progression,
  final-light release, altar dominance, routes, colliders, top-root boundary,
  and the other three maps are unchanged.
- Automated acceptance: `npm run check`, 62/62 tests, byte-identical no-violet
  family regeneration, `npm run build`, source/dist identity, and diff hygiene
  passed locally.
- Browser acceptance: 1440 × 900 desktop passed entry, prologue skip, keyboard
  movement, P/Continue and Escape resume; 844 × 390 × 3 touch landscape passed
  movement and pause/Continue with a 600 × 390 canvas, 116 × 116 steering, and
  44 × 44 pause control; 390 × 844 × 3 retained the full portrait gate and
  zero horizontal overflow. Starfall's inactive and waking raster states were
  reviewed at both gameplay scales. No important clipping, hierarchy conflict,
  procedural cross, or console message remained.
