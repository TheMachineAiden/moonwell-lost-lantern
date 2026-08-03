# Moonwell visual art system — continuity record

## Canonical 20 × 13 implementation — 2026-08-02

- The current visual contract is 320 × 208 (20 × 13 complete 16-pixel
  tiles). Earlier 320 × 200 notes below are retained as historical release
  evidence and are superseded for current implementation work.
- The approved four-level route system remains intact. The new v2 SVG/Figma
  extension adds safe bands, footprint mapping, controlled overhang, ground
  value hierarchy, and representative Keeper/exit/spruce/detail/platform art.
- The runtime now keeps every bottom-row tree visible, scales the world equally
  on both axes, centres ordinary anchors, and enriches all four areas with
  deterministic non-solid edge detail and stepped value patches.

## Folder identity and context

- **Repository:** Moonwell: The Lost Lantern
- **Workspace:** `/Users/martinwerner/.aiden/workspaces/projects/.bindings/05aae0ee-7539-40cd-bb2e-f6179f468a0e/moonwell`
- **Baseline HEAD:** `4dbbb6de0c1d76b082f66c0befbc6eca2db8aae9`
- **Local preview:** `http://127.0.0.1:4173`

The game is a dependency-free static HTML canvas adventure. This visual-system
work applies only to non-character world art. The existing keeper/player asset
(`assets/moonwell-keeper-walk-v3.png`) remains unchanged.

## Completed on 2026-07-31

- Turned the approved v1 chroma-key concept atlases into a documented,
  reusable tile-first production direction.
- Generated fresh non-character static and animated source sheets, retained
  under `assets/generated/` for provenance and future re-cropping.
- Added compact alpha runtime sprites in `assets/moonwell-art/production/`:
  world props, a seamless water tile, and four-frame firefly, memory, lantern,
  and skybell strips.
- Added `scripts/process-moonwell-art.sh`, a reproducible chroma-key, crop,
  point-scale, and strip-assembly pipeline.
- Rewired `game.js` and image preloads to use the production atlas derivatives;
  updated the build to retain nested asset directories.

## Verification

- `npm run check` — passed.
- `npm test` — 5/5 progression checks passed.
- `npm run build` — passed; confirmed nested production and retained-source
  assets are present in `dist/assets/`.
- Browser QA at `http://127.0.0.1:4173`: reviewed all four developer scenes,
  the normal start button and arrow-key input, mobile portrait rotation gate,
  and mobile-landscape playing mode. No console messages were reported.
- Scene assertions confirmed the 320 × 200 canvas, blocked Moonroot water,
  passable bridge span, and blocked Whispering Hollow sentinel.
- Continuation recheck on 2026-07-31: `npm run check`, `npm test` (5/5), and
  `npm run build` all passed again. The build still contains the nested
  production lantern loop and retained world-props source sheet.

## Workspace state

- Modified: `assets/ARTWORK.md`, `game.js`, `index.html`, `package.json`.
- Added by this work: retained v2 source sheets, production sprites,
  `scripts/process-moonwell-art.sh`, and this record.
- Pre-existing untracked direction references retained unchanged:
  `assets/moonwell-art/ART_DIRECTION.md` and the two v1 chroma atlases.

## Completed on 2026-07-31 — pause control

- Added an in-game pause overlay that preserves the current run, with
  **Continue** and **Start again** actions.
- Added `P` and `Escape` keyboard toggles, visible entry guidance, and an
  expanded canvas label so the control is discoverable to screen-reader users.
- The keeper and tile-first world art remain unchanged.

## Verification

- `npm test` — 5/5 progression checks passed.
- `npm run check` and `npm run build` — passed.
- Browser QA at `http://127.0.0.1:4173`: normal-input start → `P` pause →
  `Escape` resume on desktop; normal-input start → `P` pause → **Continue**
  resume on touch landscape. The pause panel, canvas, and touch control fit
  the reviewed viewports; no browser console messages were reported.
- Mobile portrait at 390 × 844 retains the intentional rotation gate without
  horizontal overflow. Mobile landscape at 844 × 390 retains fitting touch
  controls and a legible pause panel.
- Publication validation found the hosted document can refresh before its
  unversioned script is evicted from a browser cache. The game script now uses
  a narrow pause-control cache key so the visible control and its logic arrive
  together.

## Workspace state

- Current source baseline: `e17fa66b99b6bbbc3485c67e958a7b5b62c4f7a0`.
- This iteration modifies `game.js`, `index.html`, `README.md`, and this
  continuity record. The generated `dist/` output remains ignored.

## Completed on 2026-07-31 — touch pause control

- Added a labelled, round pause button in the upper-right of the mobile
  landscape play view, so touch-only players can pause without a keyboard.
- The control hides behind the pause panel and returns after **Continue**;
  it does not alter desktop presentation, the keeper, or world art.
- Local browser check at `http://127.0.0.1:4173`: touch start → pause button
  → pause panel completed with no console errors. `npm test` (5/5),
  `npm run check`, `npm run build`, and `git diff HEAD --check` passed.

## Next concrete action

Inspect the released pause control at the public game URL after publication,
then look for the next small player-visible improvement.

## Whispering Hollow lantern echo — 2026-08-01

- Replaced the Hollow's former automatic three-rune proximity sequence with a
  delayed lantern echo puzzle. Luna touches the first rune, walks to the
  second, and calls Echo with `E` (or the touch **Echo** button). The one-tile
  echo retraces her recorded route to hold the first rune while Luna reaches
  the third.
- Added the inspectable route, footprint, and collider plan at
  `assets/moonwell-art/wireframes/whispering-hollow-echo-route-v1.svg`.
  The echo is visual-only; all tree, water, bridge, exit, and sentinel
  collision records remain unchanged.
- The action is keyboard-accessible, exposed in the canvas label and entry
  instructions, and placed beneath the existing 44px pause button on touch
  landscape without changing the canvas size.

## Compact scale correction — 2026-08-01

- Rechecked the runtime against the 16 × 16 tree tile and found the keeper
  (24 × 30 render) and lantern (32 × 48 render) still violated the stated
  scale contract despite their existing collision records.
- Added the inspectable scale wireframe at
  `assets/moonwell-art/wireframes/keeper-lantern-fairy-scale-pass-v1.svg`.
  It maps every visual to the same existing player, light, and home anchors;
  no collision or interaction radius changed.
- Generated and retained a new project-bound compact source sheet, then added
  16 × 16 production cells for the keeper, lantern, and firefly. The live
  renderer now draws the keeper at 16 × 16, lantern at 16 × 16, and both
  loops in four 16 × 16 frames.
- Mobile portrait QA also revealed clipped rotation-gate copy. A compact gate
  card now fits inside the intentional 320 × 200 frame at 390 × 844.

### Verification

- `npm run check`, `npm test` (6/6), `npm run build`, and `git diff --check`
  passed.
- Browser QA at 1200px desktop and 844 × 390 touch landscape confirmed the
  compact sprites, tree-relative scale, touch controls, pause/resume cycle,
  and no console messages. At 390 × 844 touch portrait, the rotation card and
  its full message fit with no console messages.

## Owner-selected forest production integration — 2026-08-02

- Generated and retained a new production atlas from the owner-selected
  moonlit forest reference. The game does not load the large source.
- Added ten tile-exact alpha strips: Keeper animation, spruce family,
  crescent-exit states, root-platform variants, foliage, ground textures,
  stones, mushrooms, fireflies, and light pools.
- Replaced the old Keeper/tree/exit/platform/firefly runtime references and
  routed every deterministic floor-detail kind through the selected forest
  family across all four levels.
- Preserved the 320 × 208 / 20 × 13 world, all tile-centred anchors,
  one-cell ordinary-object records, the 2 × 1 platform and 2 × 2 sentinel
  exceptions, routes, puzzles, dialogue, progression, touch shell, and
  `#moonwell` route.
- Extended the editable Figma file with the validated vector production panel
  at node `6:2`, beside the canonical geometry frame.
- Retained owner-visible comparison, before/after, all-level, portrait, and
  touch-landscape captures under `assets/generated/`.

### Verification

- `npm run check`, `npm test` (22/22), `npm run build`, and
  `git diff --check` passed.
- Chrome QA covered all four developer scenes, normal desktop keyboard
  movement, keyboard pause/resume, the 390 × 844 portrait gate, and 844 × 390
  touch movement plus pause/continue. The intrinsic canvas stayed 320 × 208,
  all viewports had zero horizontal overflow, collision assertions remained
  true, production assets resolved successfully, and every reviewed console
  was clean.

## Luminous reference rebuild — 2026-08-02

- Re-audited the cache-isolated public baseline against the retained approved
  vignette. Material gaps were flat teal ground, repeated tiny silhouettes,
  sparse enclosure, weak light pools, little canopy depth, and no loamy floor.
- Rebuilt all four levels on a 640 × 416 render surface while preserving the
  320 × 208 logical world, 16-pixel movement grid, routes, puzzles, dialogue,
  progression, and touch contract.
- Added overlapping loam, cool screen-composited moonlight, tall y-sorted
  spruce overhangs, top and foreground canopy curtains, amber focus glows,
  and a deep navy vignette. Direct matched proof is retained at
  `artifacts/qa/moonwell-baseline-reference-after-matched.png`; the all-level
  sheet is `artifacts/qa/moonwell-luminous-four-level-contact-sheet.png`.
- Replaced the old drawn Watcher with an image-generated four-frame raster Eir
  sprite and an image-generated 512 × 512 dialogue portrait. Runtime tests
  prohibit SVG/drawn-sigil fallback and retained-source loading.
- The visual/collider mapping and every deliberate exception are documented in
  `assets/moonwell-art/ART_DIRECTION.md` and exported from `game-core.js`.
- The editable production system is extended at Figma node `11:2` with the
  semantic palette, live scene proof, Eir idle strip and portrait, four-level
  contact sheet, layer order, and the same exported collider/overhang table:
  `https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl?node-id=11-2`.

### Deterministic verification

- `npm run check`: passed.
- `npm test`: 24/24 passed, including render dimensions, overhang contracts,
  Eir raster paths, absence of SVG fallback, routes, colliders, and progression.

## Corrected bottom-right clearing audit — 2026-08-02

- Confirmed that the exact authoritative reference is the framed bottom-right
  clearing in `assets/generated/moonwell-320x208-art-direction-source-v1.png`,
  not the earlier ambiguous vignette label. A cache-isolated public pass against
  merged revision `126cbdb6c0b73dab4fcb0e414ee88167e5242ee9` found an overly
  repeated wall-to-wall thicket, weak central clearing, several competing
  crescent/root motifs, undersized root shelf, and fragmented moonlight.
- Added a newly generated separated production atlas and six transparent
  runtime derivatives. Lantern Glade now uses one dominant upper-right crescent,
  one broad upper root platform, a calm loamy central route, one strong cool
  moonlight pool, restrained amber points, and side-weighted spruce enclosure.
  The same calmer loam/light/canopy vocabulary carries across all four levels.
- Preserved the 320 × 208 logical world and 16 px cells while revising visual
  footprints. Perimeter/interior spruces render at 40 × 56 / 28 × 40, the
  crescent at 48 × 64, the 2 × 1 platform at 96 × 32, loam at 80 × 48,
  moonlight at 112 × 66, and canopy at 128 × 56. The only larger logical
  collider exceptions remain the 2 × 1 platform and 2 × 2 Hollow sentinel.
- Matched target / previous live / corrected-after proof is
  `artifacts/qa/moonwell-bottom-right-reference-live-matched-v3.png`; the fresh
  four-level sheet is
  `artifacts/qa/moonwell-bottom-right-four-level-contact-sheet-v3.png`.
- Desktop, 390 × 844 portrait, and 844 × 390 touch-landscape browser QA covered
  normal keyboard/touch movement, left-edge collision, pause/resume, dialogue
  retry/success/leave, portrait loading, rotation gate, dense scenes, responsive
  fit, and all four developer scenes. Every reviewed console was clean and no
  viewport had unacceptable overflow. A hidden-dialogue CSS regression found
  during normal-input QA was fixed and covered by a deterministic assertion.
- Figma node `14:2` adds the corrected matched proof, four-level contact sheet,
  retained raster Eir production art, and revised collider/overhang table:
  `https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl?node-id=14-2`.

## Rooted collision truth, starroot chimes, and Luna scale — 2026-08-02

- Ordinary spruce collision now follows a 20 × 12 trunk/root base offset
  `(-2,+4)` from its one-cell anchor; the 24 × 40 interior or 40 × 56
  perimeter canopy remains a visual overhang. Root shelves use a 40 × 14
  contact face offset `(-4,+2)` beneath a 48 × 24 visual. Exit trees retain
  their deliberate 24 × 12 closed-root contract. These rectangles are
  exported by `collisionRectFor` and used by both gameplay and QA.
- Audited every tree and platform record in all four areas. Deterministic
  four-direction contact sweeps stop Luna at the perceived solid face, reject
  tunneling, preserve the clear overhang lane, and rerun every required route
  and puzzle path through the same collision function.
- Replaced Starfall's floating sky bells with three grounded, non-solid
  starroot chimes: image-generated root-knot/seed-pod animation in restrained
  navy, teal, loam, and amber. The three-touch wake gate and hidden-light
  progression remain unchanged. No HTML or JavaScript runtime path requests
  the retired sky-bell strip.
- Luna now renders at 14 × 18 from the existing four-frame raster animation,
  foot-anchored to the unchanged 10 × 10 one-cell movement box. At normal play
  scale she is visibly smaller than Eir, ordinary spruces, root shelves, and
  the crescent landmark without implying extra collision.
- Editable production contract:
  `https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl?node-id=17-2`.
  Four-level live contact sheet:
  `https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl?node-id=20-2`.

### Verification

- `npm run check`, `npm test` (31/31), `npm run build`, and byte-identical
  starroot regeneration passed. Final asset SHA-256:
  `21dc10309bdd7e312a8fe4c21a65f7a7c20c797b6f869df1fe1ab16d35aa5261`.
- Normal keyboard/touch contact, representative tree/platform approaches,
  pause/continue, raster Eir dialogue, all four cache-isolated scenes, and
  desktop 1440 × 900 / portrait 390 × 844 × 3 / touch landscape
  844 × 390 × 3 fit were checked. Final local consoles are empty and document
  width equals viewport width at every presentation.

## No-violet environmental palette correction — 2026-08-03

- Rebuilt every runtime environmental raster from the retained generated
  sources into a new versioned production family. A shared deterministic
  processor maps prohibited purple/magenta/violet pixels to material-specific
  teal, bark, cyan, or amber-neutral hues; it does not tint or filter the
  canvas at runtime. Luna and Eir remain explicitly outside the environmental
  processor.
- Runtime now loads 21 audited no-violet environmental derivatives, plus only
  the established Luna and Eir character rasters as semantic character art.
  Moonflower, memory, rune, starroot, sentinel, water, ground detail, roots,
  spruces, canopy, loam, stones, mushrooms, and all tiled/seamed layers are
  covered by the same prohibited-pixel predicate.
- `assets/moonwell-art/ART_DIRECTION.md` and `assets/ARTWORK.md` now make the
  framed bottom-right palette authoritative: continuous muted blue-green loam
  and moss, deep teal foliage, natural bark/root tones, cool cyan moonlight,
  pale neutral magic, and restrained amber focal light. Environmental purple
  outlines, seams, halos, repeated strokes, edge accents, and collider cues are
  prohibited.
- Matched local proof is
  `artifacts/qa/moonwell-no-violet-reference-level-1-matched.png`; the four
  640 × 416 scenes are composed at
  `artifacts/qa/moonwell-no-violet-four-level-contact-sheet.png`; representative
  regenerated assets are shown at
  `artifacts/qa/moonwell-no-violet-representative-assets.png`.
- Editable Figma evidence extends the existing production file at node `26:2`
  (palette contract, matched proof, and representative assets) and node `26:3`
  (four-level contact sheet and audit evidence):
  `https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl?node-id=26-2` and
  `https://www.figma.com/design/3mcJh1WvCC8tqOTg2cWLHl?node-id=26-3`.

### Verification

- `npm run check`, 35/35 deterministic tests, `npm run build`, and
  `git diff --check` pass. Regression coverage classifies every runtime raster,
  rejects prohibited environmental pixels at silhouettes and frame/tile seams,
  checks canvas fallbacks/copy, preserves exact dimensions, and proves
  byte-identical regeneration without rewriting retained proof images.
- Cache-isolated local Chrome QA covered normal desktop keyboard start,
  movement, pause/resume; the 390 × 844 × 3 portrait rotation gate; 844 × 390 ×
  3 touch movement and pause/Continue; and all four developer scenes. The
  640 × 416 canvas fits every reviewed presentation, document width equals
  viewport width, consoles are empty, and all 23 eagerly loaded production
  image requests complete successfully. Moonroot water/bridge and Hollow
  sentinel audit assertions remain correct.

## Top boundary rooted-collision correction — 2026-08-03

- Traced the reported walk-through defect to the three 128 × 56 top-canopy
  clusters. They were rendered as visibly rooted trees down to the playfield
  but were classified as non-solid decoration; only the shallower row-0 spruce
  anchors had collision.
- Exported the unchanged canopy composition as `TOP_CANOPY_LAYOUT` and mapped
  its continuous visible contact face to 20 collision-only `canopy-root`
  records across logical row 2. Each record reuses the established 20 × 12
  rooted tree mask, so adjacent cells overlap by four pixels and cannot drift
  into passable seams. The overhead foliage remains visual overhang.
- Moved the three invalid top-band arrival anchors to the nearest clear
  tile-centred row and moved only the two affected top-band pickups (Lantern
  Glade's first firefly and Moonroot's optional memory) to adjacent clear
  anchors. Encounter order, routes, art, puzzles, water, exits, sentinel,
  controls, install metadata, and no-violet assets are unchanged.
- Added a cache-busted runtime URL and deterministic coverage for the exact
  visual layout, all 80 canopy-root instances across four areas, collider
  rectangles, seam-free blocking, clear spawns and interactives, and every
  required route.

### Verification

- `npm run check`, 43/43 tests, `npm run build`, byte-identical icon and
  environmental regeneration, and `git diff --check` pass.
- Desktop keyboard and 844 × 390 × 3 touch input both stop Luna at the visible
  root face after repeated Up input; further input does not move her into the
  canopy. All four developer scenes expose 20 matching root colliders and were
  visually reviewed. Moonroot water/bridge and Hollow sentinel checks remain
  correct.
- Desktop play/start/pause/resume, the 390 × 844 × 3 portrait rotation gate,
  and touch-landscape movement/pause/Continue pass. Reviewed layouts have no
  horizontal overflow, required controls fit, all current asset/script requests
  succeed, and the preserved browser console is empty.

## Luna native reduction and Rootwatcher no-violet correction — 2026-08-03

- Traced Eir's purple outline to magenta/fuchsia key fringe surviving the
  retained generated idle sheet's 64 × 96 frame reduction. The portrait also
  retained sparse purple undergrowth accents because character rasters were
  exempted from the earlier environmental processor.
- The authoritative final processor now maps Eir's four-frame fringe to
  near-black navy and the portrait accents to muted teal, producing versioned
  v2 runtime derivatives. A stricter character predicate rejects purple,
  violet, magenta, and fuchsia across both rendered scales.
- Retained the approved Luna high-resolution source under
  `artifacts/owner-handoffs/luna-regeneration-v1/`. Blind whole-figure
  reductions were rejected because they lost the cowlick and lamp. The
  reviewed native master instead preserves a connected cowlick, teal/cyan
  cloak, amber framed lantern, four gait poses, common baseline, and ground
  margin in four exact 16 × 16 cells.
- Luna still renders at 14 × 18 over the unchanged 10 × 10 movement box. Eir
  remains a 32 × 48 non-solid encounter. Top-root colliders, routes, puzzles,
  world art, install metadata, and icon/PWA files are unchanged.

### Local verification

- `npm test`: 45/45 passed, including strict character palette coverage,
  retained-source hashes, per-frame Luna feature checks, and byte-identical
  regeneration of all runtime art.
- Desktop normal keyboard movement and P/Escape pause/resume passed. Touch
  landscape normal movement and pause/Continue passed; the 600 × 390 canvas,
  116 × 116 steering control, and 44 × 44 pause control fit. Portrait
  390 × 844 × 3 kept the full rotation gate and zero horizontal overflow.
- All four 640 × 416 scenes were reviewed at actual scale. Luna stays smaller
  than Eir, rooted trees, platforms, and landmarks; her cyan cowlick and amber
  lamp remain readable. Eir's idle strip and 512 × 512 dialogue portrait are
  clean at runtime scale. The preserved console is empty and all current
  character/script requests returned 200 or 304.

## Exact owner-source Luna v7 — 2026-08-03

- Owner correction supersedes the prior manually authored v6 abstraction.
  The exact 1995 × 788 `generated-image.png` attachment is retained with its
  original bytes, dimensions, date, project provenance, and SHA-256.
- Actual-scale visual comparison selected a 23 × 38 direct figure reduction
  padded into four 26 × 40 cells. Smaller 16 × 28 and 20 × 34 candidates lost
  the supplied face, garment shapes, and lantern frame; larger candidates did
  not materially improve recognition in context.
- The processor performs only chroma transparency cleanup, point reduction,
  shared-baseline placement, and safe frame padding. It does not redraw Luna
  or use the prior v6 XPM as an art target.
- Luna now renders natively at 26 × 40 from anchor −13,−39. Her 10 × 10 solid
  movement box, entity depth point, routes, puzzles, and gameplay balance are
  unchanged. Eir's corrected v2 assets and all icon/PWA assets remain intact.

## Exact half-size Luna v7 runtime draw — 2026-08-03

- The owner-approved v7 source and 104 × 40 four-frame atlas remain unchanged.
  Runtime source crops stay 26 × 40 and now draw at exactly 13 × 20 with
  image smoothing disabled; no art-processing script or raster changed.
- Player and Hollow echo rendering share centered horizontal offset −6.5 and
  grounded vertical offset −19.5. On Moonwell's 2× intrinsic render surface,
  these half-pixel logical offsets become whole physical pixels, preserving the
  complete 23 × 38 figure silhouette, common foot baseline, crisp pixels, and
  the existing four-frame order and timing.
- The 10 × 10 movement/collision footprint, interaction reach, entity depth,
  routes, colliders, camera, scenes, Eir, dialogue, controls, and PWA assets are
  unchanged. Only Luna's player/echo draw geometry and `game.js` cache key
  changed at runtime.
- The visual-judgment pass compared public 26 × 40 and local 13 × 20 rendering
  at the same actual 640 × 416 game scale. All four scenes passed beside Eir,
  spruces, Rootwatcher-scale scenery, water, paths, platforms, runes, starroots,
  props, and the altar. Retained comparison attachments are
  `moonwell-luna-current-26x40-public-baseline-area-2.png` and
  `moonwell-luna-half-runtime-area-2.png`.
