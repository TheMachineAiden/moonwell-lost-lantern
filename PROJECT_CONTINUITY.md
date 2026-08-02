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
