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
| Rooted forest exit | 1 x 1 tile (16 x 16) | The warm clearing is painted behind the flanking roots and remains centred on the existing home coordinate; never render it as a point light or lantern. |
| Starroot chime | 1 x 1 logical tile (16 x 16) | Non-solid grounded interaction; 24 × 24 visual with an amber seed glow and one tile-centred interaction point. |
| Tree | 1 x 1 logical tile (16 x 16) | A 20 × 12 rooted contact mask sits at offset −2,+4; perimeter canopy may overhang to 40 × 56 px and interior canopy to 24 × 40 px. |
| Sentinel | 2 x 2 tiles (32 x 32) | Deliberate solid root-bound stone landmark with an exact 2 × 2 mask; unlit and non-interactive, with no face, chest, lantern, glyph, or objective glow. |
| Root platform | 2 x 1 logical tiles (32 x 16) | 48 × 24 visual; its full moss cap, bark forks, and grounded root face must read as a physical shelf rather than a dark opening. The visible shelf/face uses a 40 × 14 contact mask at offset −4,+2, leaving only a clearly decorative 4 px side and 8 px top overhang. |
| Bridge segment | 1 x 1 tile (16 x 16) | Repeat as separate tile records across a passable span. |
| Moonwell endgame altar | 2 x 2 tiles (32 x 32) | Simple focal object; declare its collision choice with the record. |
| Water | 1 x 1 tile (16 x 16) | Seamless on all four edges. |

## Style rules

Original handcrafted 16-bit pixel art, viewed in a slight top-down game perspective. Use chunky, deliberate pixel clusters; a crisp dark-navy one-pixel outline; simple readable silhouettes at 1x; and medium-low detail. No painterly gradients, airbrush blur, photorealistic texture, smooth vector curves, or excessive single-pixel noise.

Use a restricted environmental palette: midnight navy, continuous muted
blue-green loam and moss, deep teal foliage, natural dark bark and roots, cool
cyan/blue moonlight, pale silver, and restrained moon-gold. Purple, magenta,
and violet must not form outlines, seams, halos, repeated marks, or edge
accents on terrain, foliage, props, water, stones, mushrooms, canopy,
characters, portraits, or collider boundaries. Reserve amber for fireflies,
lit lanterns, starroot seed lights, and the final altar. Luna and Eir retain
their established silhouettes and identities through navy, teal, cyan, natural
skin/bark tones, pale neutral, and amber instead of purple-family accents.
Avoid pure white and neon pink.

Every object must look as though one pixel artist made it: identical outline weight, comparable texture density, and the same grounded baseline. The keeper is a compact one-tile visual, with feet aligned to its existing movement point.

## Animation rules

- A frame strip is horizontal, left-to-right, with four equal cells unless a mechanic needs fewer.
- Every frame has the same cell dimensions, anchor point, and baseline.
- Motion is small and legible: fireflies hover, tokens shimmer, lantern flames breathe, and rooted seed chimes warm from teal shadow to amber.
- Do not change an object's silhouette or collision footprint during animation.
- Use no smear frames or motion blur.

## Reusable generation instruction

> Create a grid-aligned pixel-art game sprite for *Moonwell: The Lost Lantern*. Native tile size is 16 x 16 pixels. The requested object occupies **[FOOTPRINT]** tiles and must sit on the same 16-pixel ground baseline in every variant. Original handcrafted 16-bit pixel art, slight top-down view, chunky deliberate pixel clusters, crisp dark-navy 1-pixel outline, simple readable silhouette at 1x, and medium-low detail. Restricted environmental palette: midnight navy, deep teal, muted blue-green loam and moss, natural aged brown, cool cyan/blue moonlight, pale silver, and restrained moon-gold. Do not use purple, magenta, or violet for environmental outlines, seams, halos, repeated strokes, edge accents, or collision cues. No character, text, UI, painterly gradients, blur, smooth vector shapes, photorealism, bright white, neon pink, or high-density texture. For animated props, produce exactly four equally sized horizontal frames with fixed anchor and baseline. Place the sprite on a perfectly flat #00ff00 chroma-key background with generous transparent-safe padding and no shadow outside the sprite.

## Existing generated references

- `atlases/moonwell-world-props-atlas-v1-chroma.png`: visual direction for world props and static interactives.
- `atlases/moonwell-animated-props-atlas-v1-chroma.png`: visual direction for four-frame firefly, memory, lantern, and skybell loops.

These are chroma-key concept atlases, not yet production-cut sprites: their cell boundaries and alpha have not been validated. Use them as the approved art-language reference before generating final tile-exact files.

## Production derivatives

`production/` contains the tile-exact alpha PNGs consumed by `game.js`. Keeper,
firefly, memory, and lantern use 16 × 16 cells. The legacy skybell strip remains
only as retained provenance and is not loaded by the runtime.
`scripts/process-moonwell-art.sh` recreates that legacy family from the retained
v2 source sheets under `assets/generated/`.

The owner-selected forest production family is recreated by
`scripts/process-selected-forest-art.sh`. Its native strips are Keeper
(4 × 16 × 16), spruce (3 × 16 × 16), crescent exit (4 × 16 × 16), root
platform (2 × 32 × 16), foliage/ground/stone/light pools (3 × 16 × 16),
mushrooms (2 × 16 × 16), and fireflies (4 × 16 × 16). These are the current
runtime sources for the shared forest vocabulary across all four areas.

The corrected bottom-right clearing family is recreated by
`scripts/process-bottom-right-clearing-art.sh` from the retained v3 generation
source. It adds a singular crescent landmark, broad root shelf, calmer loam
patches, canopy clusters, three moonlight pools, and an amber firefly loop. The
runtime loads only the keyed/cropped production derivatives, never the source
atlas or concept sheet.

## Luminous visual/logical contract — current runtime

Gameplay remains a deterministic 20 × 13 grid of 16-pixel logical cells, but
the canvas now renders at 640 × 416 (2× logical resolution). Overhanging
production art is baseline-anchored and y-sorted independently from collision.
This is the authoritative mapping:

| Runtime object | Logical footprint / collider | Visual footprint and anchor |
| --- | --- | --- |
| Luna | 10 × 10 px solid movement box | 26 × 40 px; anchor −13, −39 from the precise foot point; four direct-reduction v7 cells |
| Ordinary spruce | rooted 20 × 12 px mask at −2,+4 from its 1-cell anchor | Perimeter 40 × 56 px; interior 24 × 40 px; canopy overhang is passable, trunk/root contact is not |
| Rooted forest exit | 1 × 1 cell, solid through `revealed`; non-solid at `open` | 48 × 64 px; 16 px left/right and 48 px top overhang. Its one-cell warm clearing is drawn behind the rooted silhouette so the tree masks it into a natural threshold. |
| Root platform | 40 × 14 px contact mask at −4,+2 from its 2 × 1 record | 48 × 24 px; full-height irregular moss-and-root silhouette, with 4 px side and 8 px top overhang |
| Starroot chime | non-solid one-cell interaction anchor, radius 15 px | 24 × 24 px; anchor −12,−16; rooted baseline and fixed silhouette |
| Hollow sentinel | exact 32 × 32 px solid record | 32 × 32 px retained raster with a side safety gutter and grounded baseline; quiet root-bound stone, no separate light or procedural backing |
| Eir | one non-solid cell-centred interaction anchor, radius 22 px | 16 × 24 px runtime draw; anchor −8, −22; four unchanged 64 × 96 raster source cells |
| Loam patch | no collider | 80 × 48 px overlapping floor layer; four explicit thirty-record map layouts select retained frames, aligned offsets, reflection, and restrained opacity |
| Moonroot shore | no collider; water remains solid outside the revealed bridge cells | Two 288 × 12 px retained raster rows, layered over the north/south water edges and under the 32 × 64 bridge |
| Moonlight pool | no collider | Four explicit two-pool map layouts: one 112 × 66 px dominant screen-composited interaction anchor and one smaller route-support pool, aligned to a four-pixel placement rhythm |
| Top canopy curtain | 20 one-cell root records across row 2; each uses the rooted 20 × 12 px mask at −2,+4 and is collision-only because the art is drawn as a shared backdrop | Three unchanged 128 × 56 px overlapping clusters begin at viewport y=0; their visible root contact ends at y=48. Top-edge and first side-row perimeter records remain collision-only so no baseline-anchored individual crown or trunk is sliced by the viewport. |

The only larger logical collider exception remains the 2 × 2 Hollow sentinel.
Its complete retained stone-and-root formation fills the same raster cell and
stays deliberately below the three cool echo runes in value hierarchy.
The root platform uses a 40 × 14 perceived-contact mask around its 2 × 1 record
so its shelf face and collision agree. Eir and starroot chimes are deliberately
non-blocking. Spruce canopy overhang does not enlarge its rooted contact mask;
the trunk and visible base do. Decorative loam and light layers never collide.
The top canopy is not decorative ground: its three clusters read as one dense,
rooted boundary, so its declared row-2 root cells block while the overhead
foliage remains visual overhang. The runtime contract and shared canopy layout
are exported from `game-core.js` and covered by deterministic tests.

Starfall Grove consumes `moonwell-starroot-chime-variants-v4.png`, rebuilt from
the retained `moonwell-starroot-clearing-source-v2.png` through
`scripts/process-starroot-chime-art.sh` and the shared no-violet processor.
Its three four-state strips use varied retained scale and reflection so the
placed chimes share one authored family without stamping one silhouette. The
irregular root-and-moss contact is authored into every raster frame; the runtime
adds no rectangle, path, or other procedural clearing beneath it.

`scripts/process-no-violet-environment-art.sh` is the authoritative final
runtime-art pass. It rebuilds the source-derived family in an isolated
directory, maps prohibited purple-family pixels to material-specific teal,
bark, cyan, amber-neutral, or character-outline colors, and writes only
versioned production derivatives. Luna's four-cell native master is
`source/moonwell-luna-walk-v6.xpm`, a deliberate 16 px reduction tied by hash
to the approved high-resolution owner handoff. Its predicate and complete
runtime family are covered by pixel, silhouette-edge, tiled-seam,
runtime-path, feature-presence, and byte-determinism tests.

Lighting order is continuous loam → screen-composited moonlight → waterways
and detail → canopy depth → baseline-sorted sprites → navy vignette. Lantern
Glade deliberately keeps an open central route, a broad upper root shelf, and
one dominant upper-right crescent instead of repeating large landmark trees.
Its moonlight follows the lower-left gathering route and only whispers toward
the upper-right exit. Moonroot weights Eir and the bridge landing; Whispering
Hollow lights the first-to-second-rune diagonal instead of the sentinel;
Starfall Grove holds its dominant cool pool behind the altar, with the left
chime as the quiet secondary anchor.
Amber is reserved for lantern/firefly/starroot focal points. Memory and rune
magic use cool cyan, pale neutral, and teal so they remain localized without
creating terrain or collider-edge language.

The top inner forest uses four explicit compositions of the retained two-frame
canopy atlas. Each map keeps three overlapping 128 × 56 clusters across the
full 320-pixel width, while frame order, horizontal overlap, vertical offset,
and reflection vary by map. The continuous row-2 root collider band remains
shared and unchanged; the variation is visual placement only.
