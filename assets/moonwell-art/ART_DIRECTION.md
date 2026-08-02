# Moonwell pixel-art system

## Purpose

This is the visual contract for every Moonwell asset. It is intended to stop mixed pixel densities and make new objects interchangeable.

## Native geometry

- Game canvas: 320 x 208 native pixels: exactly 20 × 13 complete tiles.
- World tile: 16 x 16 native pixels.
- All placement, collision, and sprite baselines snap to the 16-pixel tile grid.
- Work at native resolution; scale only with nearest-neighbour filtering.
- Leave a one-pixel transparent safety margin around sprites. Do not bake a cast shadow beyond the sprite footprint.
- Scale the world equally on both axes. Prefer integer 2× desktop display
  (640 × 416) whenever the responsive shell permits; never stretch to a
  different X/Y ratio.

### Standard footprints

The runtime now treats 1 × 1 as the default. A larger footprint is a deliberate
landmark exception and must be declared in the shared world-object record used
for both drawing and collision. Legacy v2 art below documents source-sheet
geometry, not permission to render beyond the runtime footprint.

| Object | Footprint | Notes |
| --- | --- | --- |
| Firefly, memory token | 1 x 1 tile (16 x 16) | Centre on the tile; animation must not change collision centre. |
| Flower, rune stone | 1 x 1 tile (16 x 16) | May rise above its baseline, never spill sideways. |
| Lantern | 1 x 1 tile (16 x 16) | Small character-scale destination point; its interaction remains centred on the existing home coordinate. |
| Skybell | 2 x 3 visual tiles (32 x 48) | Deliberate non-solid landmark exception; its interaction point stays on one tile centre. |
| Tree | 1 x 1 tile (16 x 16) | One tile record, never a repeated oversized cluster. |
| Sentinel | 2 x 2 tiles (32 x 32) | Deliberate solid landmark with an exact 2 × 2 mask. |
| Fairy platform / root log | 2 x 1 tiles (32 x 16) | Flat, obvious standing surface with the same solid cells. |
| Bridge segment | 1 x 1 tile (16 x 16) | Repeat as separate tile records across a passable span. |
| Moonwell endgame altar | 2 x 2 tiles (32 x 32) | Simple focal object; declare its collision choice with the record. |
| Water | 1 x 1 tile (16 x 16) | Seamless on all four edges. |

## Style rules

Original handcrafted 16-bit pixel art, viewed in a slight top-down game perspective. Use chunky, deliberate pixel clusters; a crisp dark-navy one-pixel outline; simple readable silhouettes at 1x; and medium-low detail. No painterly gradients, airbrush blur, photorealistic texture, smooth vector curves, or excessive single-pixel noise.

Use a restricted palette: midnight navy, deep teal, blue-violet, muted moss green, aged brown, pale silver, and pale moon-gold. Magenta is a tiny accent only. Reserve gold light for fireflies, lit lanterns, and the final altar. Avoid pure white and neon pink.

Every object must look as though one pixel artist made it: identical outline weight, comparable texture density, and the same grounded baseline. The keeper is a compact one-tile visual, with feet aligned to its existing movement point.

## Animation rules

- A frame strip is horizontal, left-to-right, with four equal cells unless a mechanic needs fewer.
- Every frame has the same cell dimensions, anchor point, and baseline.
- Motion is small and legible: fireflies hover, tokens shimmer, lantern flames breathe, bells sway/ring.
- Do not change an object's silhouette or collision footprint during animation.
- Use no smear frames or motion blur.

## Reusable generation instruction

> Create a grid-aligned pixel-art game sprite for *Moonwell: The Lost Lantern*. Native tile size is 16 x 16 pixels. The requested object occupies **[FOOTPRINT]** tiles and must sit on the same 16-pixel ground baseline in every variant. Original handcrafted 16-bit pixel art, slight top-down view, chunky deliberate pixel clusters, crisp dark-navy 1-pixel outline, simple readable silhouette at 1x, and medium-low detail. Restricted palette: midnight navy, deep teal, blue-violet, muted moss green, aged brown, pale silver, pale moon-gold; tiny violet/magenta accent only. No character, text, UI, painterly gradients, blur, smooth vector shapes, photorealism, bright white, neon pink, or high-density texture. For animated props, produce exactly four equally sized horizontal frames with fixed anchor and baseline. Place the sprite on a perfectly flat #00ff00 chroma-key background with generous transparent-safe padding and no shadow outside the sprite.

## Existing generated references

- `atlases/moonwell-world-props-atlas-v1-chroma.png`: visual direction for world props and static interactives.
- `atlases/moonwell-animated-props-atlas-v1-chroma.png`: visual direction for four-frame firefly, memory, lantern, and skybell loops.

These are chroma-key concept atlases, not yet production-cut sprites: their cell boundaries and alpha have not been validated. Use them as the approved art-language reference before generating final tile-exact files.

## Production derivatives

`production/` contains the tile-exact alpha PNGs consumed by `game.js`. The
four animation strips have fixed cells: keeper, firefly, memory, and lantern
use 16 × 16 cells; skybell uses 32 × 48 cells. `scripts/process-moonwell-art.sh`
recreates them from the retained v2 source sheets under `assets/generated/`.

The owner-selected forest production family is recreated by
`scripts/process-selected-forest-art.sh`. Its native strips are Keeper
(4 × 16 × 16), spruce (3 × 16 × 16), crescent exit (4 × 16 × 16), root
platform (2 × 32 × 16), foliage/ground/stone/light pools (3 × 16 × 16),
mushrooms (2 × 16 × 16), and fireflies (4 × 16 × 16). These are the current
runtime sources for the shared forest vocabulary across all four areas.
