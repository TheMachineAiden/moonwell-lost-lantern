# Moonwell visual art system — continuity record

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

## Next concrete action

Request owner visual feedback from the local preview before any aesthetic
iteration. If approved, a later commit can include the retained references,
reproducible pipeline, production assets, and runtime integration together.
