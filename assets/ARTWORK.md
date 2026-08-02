# Moonwell artwork pack

`keeper-walk.png`, `discoveries.png`, and `moon-memories.png` are original, project-bound raster artwork for **Moonwell: The Lost Lantern**. They were authored for this repository as simple pixel illustrations and rasterized locally from adjacent SVG source files on 2026-07-26. `keeper-walk.png` contains the young keeper's idle and walking frames; `moon-memories.png` contains the three collectible keepsakes.

No third-party artwork, model output, or external asset is included. The project owner may use, modify, and publish this pack with Moonwell under the repository's existing publication terms.

The final PNGs are deliberately small (72 × 88, 48 × 32, 96 × 24, and 72 × 24) with transparent backgrounds, keeping the static game's transfer and mobile memory cost negligible.

## Generated refresh — 2026-07-28

`moonwell-forest-v2.png` (40 × 48), `moonwell-fairies-v2.png` (54 × 24), and `moonwell-keeper-v2.png` (32 × 40) are new project-bound pixel-art assets for the environment, fireflies, and playable keeper. They were generated with the built-in ChatGPT image-generation tool (`gpt-image-2`), then chroma-keyed, cropped, point-downsampled, and palette-limited locally with ImageMagick. The unmodified source output is retained at `assets/generated/moonwell-sprite-source.png`.

Prompt: “Original quiet moonlit 8-bit forest art sheet: a dark evergreen and undergrowth cluster, three luminous fairies, and a young violet-hooded lantern keeper; crisp limited-palette pixel art on a flat magenta chroma-key background; no text, watermark, gradients, or photorealism.”

The game only transfers the three compact transparent derivatives. The retained source is not referenced by the page and exists solely for local provenance and future re-cropping.

`moonwell-world-v1.png` (128 × 86) is an original project-bound environmental sprite sheet generated with the built-in ChatGPT image-generation tool (`gpt-image-2`) on 2026-07-28. It supplies the moon lanterns, moonflower, stepping stones, echo-stones, skybells, hollow arch, falling canopy lights, and finished-lantern scene. The original 1536 × 1024 tool output is retained at `assets/generated/moonwell-world-sprite-source.png`; the runtime asset was chroma-keyed, point-downsampled, and stored with alpha via ImageMagick. Prompt: “Original quiet moonlit 8-bit forest art sheet … on a flat magenta chroma-key background; no text, watermark, gradients, or photorealism.”

The player uses the generated `moonwell-keeper-v2.png` with a compact two-phase walk gait at runtime. Its facing is mirrored from horizontal player input, while `prefers-reduced-motion` keeps the idle pose stable.

## Movement and world-object polish — 2026-07-28

`moonwell-keeper-walk-v3.png` (252 × 68) is a compact project-bound derivative generated for the movement/world-object polish pass. It was generated with the built-in ChatGPT image-generation tool (`gpt-image-2`), keyed from a flat magenta background, cropped, point-downsampled, and palette-limited locally with ImageMagick. The unmodified tool output is retained as `assets/generated/moonwell-polish-source.png`.

Prompt: “Original 8-bit pixel-art sheet: a four-frame violet-hooded lantern keeper walk cycle; three friendly luminous fairies sitting on mushroom or twig perches; a moonlit reed-lined water crossing with a short wooden bridge; and a mossy stone lantern-watcher with amber eyes. Flat magenta chroma-key background, limited palette, no text, watermark, gradients, or photorealism.”

At runtime, the keeper uses the four frames at a time-based 9 fps gait only while actually moving, with horizontal mirroring for left/right facing and a stable idle under reduced motion.

## Corrected water and world objects — 2026-07-28

`moonwell-water-tile-v1.png` (16 × 16), `moonwell-fairy-platform-v2.png` (52 × 28), and `moonwell-moonwell-sentinel-v2.png` (40 × 46) are new project-bound runtime assets generated with the built-in ChatGPT image-generation tool (`gpt-image-2`). Their untouched tool outputs are retained at `assets/generated/moonwell-water-tile-source.png` and `assets/generated/moonwell-world-objects-source.png`. The compact derivatives were chroma-keyed from flat magenta, cropped, and point-downsampled with ImageMagick. The first is deliberately a single repeated water tile; it is not a map-spanning strip.

Water prompt: “Create one small 8-bit pixel-art water tile, designed to repeat edge-to-edge in both directions without a visible seam … a dark moonlit forest stream surface, tiny cyan ripple highlights and violet reflections … flat magenta chroma-key background.”

World-object prompt: “Create a clean two-object sprite sheet for Moonwell: The Lost Lantern … a sturdy mossy moonstone mushroom-and-root perch/platform … and a distinct collidable ancient moonwell sentinel, a low rounded stone shrine with a crescent lantern niche … flat magenta chroma-key background.”

The game repeats the 16 × 16 tile across Moonroot Crossing over a matching opaque base cell, so transparent source edges cannot create seams at the native pixel scale. Water remains collidable except for the revealed bridge gap. The generated platforms use explicit solid collision boxes, the non-collidable fairy sprite overlays have been removed, and the previous large guardian and companion sprites have been removed: Whispering Hollow now draws and collides with the compact moonwell sentinel only.

## Tile-first world-art refresh — 2026-07-31

The reusable world art in `moonwell-art/production/` is a project-bound,
non-character replacement system for every in-world prop. Its retained source
sheets are `generated/moonwell-world-props-atlas-v2-source.png` and
`generated/moonwell-animated-props-atlas-v2-source.png`, created with the
built-in ChatGPT image-generation tool (`gpt-image-2`) using the visual
contract in `moonwell-art/ART_DIRECTION.md`. The existing keeper asset was not
modified.

`scripts/process-moonwell-art.sh` is the reproducible post-processing step. It
removes the chroma-key field while retaining foliage, crops each source
object to its approved tile footprint using point scaling, and creates compact
four-frame firefly, memory, lantern, and skybell strips. Runtime code loads
only the compact derivatives. The source sheets remain for provenance and
future re-cropping; neither source is served by the game page.

## Compact keeper, lantern, and firefly pass — 2026-08-01

`generated/moonwell-compact-character-source-v1.png` is the retained
project-bound source sheet for the compact keeper, destination lantern, and
firefly pass. It was created with the built-in image-generation workflow on a
flat magenta chroma-key field. The selected regions were key-removed,
point-scaled, and packed into
`moonwell-art/production/moonwell-keeper-walk-v4.png`,
`moonwell-lantern-{off,on,loop}-v3.png`, and
`moonwell-firefly-loop-v3.png`.

The runtime cells are 16 × 16 (four horizontal cells for loops), keeping all
three visuals within a single world tile. The player movement point, firefly
pickup radius, and lantern destination radius are unchanged. Source prompt:
“tiny violet-hooded young lantern keeper, tiny brass crescent lantern as a
point of light, and tiny yellow-white fireflies; crisp limited-palette pixel
art on a flat magenta chroma-key background.”

## 320 × 208 art-direction pass — 2026-08-02

`generated/moonwell-320x208-art-direction-source-v1.png` is the retained
project-bound image-assisted concept sheet for the complete 20 × 13 world
pass. It was generated with the built-in image-generation workflow in
stylized-concept mode using the fresh pre-change Lantern Glade screenshots,
the approved forest-density concept, and the existing keeper/platform sprites
as visual references.

Prompt summary: “Create a cohesive Moonwell pixel-art direction sheet for a
canonical 320 × 208 / 20 × 13 world: a brighter violet Keeper with one warm
lantern accent; a one-cell spruce exit marked by an in-cell crescent/glowing
root; clustered Scandinavian spruce and a dead sentinel; restrained ferns,
stones, needles, roots, mushrooms and fireflies; stepped moonlit/shadow ground
patches; and a quieter mossy 2 × 1 root platform. Preserve dark navy/teal,
pale silver and moon-gold hierarchy; reserve violet/pink for memories and
objectives; crisp limited-palette pixels, no UI or text.”

The concept is not referenced or transferred by the runtime. Deterministic geometry and the
selected production interpretation are code-native: the editable v2 Figma
system and SVG wireframes define cells/footprints; runtime details are compact
canvas primitives; the quieter platform and crescent exit mark are tile-exact
SVGs.

## Owner-selected forest production pass — 2026-08-02

The owner selected the concept sheet's compact moonlit forest scene for live
production. The built-in image-generation workflow used
`generated/moonwell-320x208-art-direction-source-v1.png` as its sole visual
reference and produced the retained flat-magenta source
`generated/moonwell-selected-forest-production-source-v1.png`.

Prompt summary: “Create a clean orthographic production atlas from the
selected Moonwell forest reference: four violet Keeper frames, three spruce
variants, four crescent-exit states, two 32 × 16 root platforms, foliage,
ground textures, stones, mushrooms, four firefly frames, and moonlight pools;
crisp limited-palette pixels on a flat #ff00ff key, no labels, sample scene,
grid, watermark, or overlap.”

`scripts/process-selected-forest-art.sh` removes the key, applies hard
pixel-art alpha, point-scales each approved crop, and packs ten compact runtime
strips in `moonwell-art/production/`. Keeper, spruce, exit, foliage, ground,
stones, mushrooms, fireflies, and light pools use 16 × 16 cells. Root
platforms remain the declared 32 × 16 exception. The large retained source is
never referenced by `game.js`; the runtime transfers only the compact
derivatives.

Representative source-to-sprite evidence is retained as
`generated/moonwell-selected-reference-sprite-comparison-v1.png`. Desktop
before/after captures, the four-level production contact sheet, portrait, and
touch-landscape captures are retained beside it under `generated/`.

## Luminous forest rebuild and Eir production art — 2026-08-02

The post-release rebuild uses three new retained, project-bound generation
sources: `generated/moonwell-luminous-forest-production-source-v2.png`,
`generated/moonwell-eir-rootwatcher-sprite-source-v1.png`, and
`generated/moonwell-eir-rootwatcher-portrait-source-v1.png`. The approved
`moonwell-320x208-art-direction-source-v1.png` vignette was supplied to the
configured image-generation workflow as the visual reference.

Environment prompt summary: “Build a transparent-ready pixel-art production
atlas that carries the approved forest vignette into play: six large
asymmetric Scandinavian spruces, two enclosing canopy curtains, continuous
loamy floor patches, pale moonlight pools, and root platforms; deep navy and
teal depth, warm amber points, restrained violet magic, flat #ff00ff key, no
text or sample scene.”

Eir sprite prompt summary: “Four coherent full-body idle frames of Eir,
Rootwatcher: an older woman in a dark teal hood with silver hair, crescent
brooch, root staff, and amber lantern, matching Moonwell’s 16-bit forest art;
fixed baseline, flat magenta key.” Portrait prompt summary: “A larger square
classic 16-bit JRPG dialogue portrait of the same Eir, framed by deep spruce,
with cool moonlight on her hood and warm lantern light on her face and staff.”

`scripts/process-luminous-forest-art.sh` performs fixed chroma-key crops and
packs the production files. Runtime code loads only the transparent PNG
derivatives. It never loads the retained sources and contains no SVG or
canvas-drawn Eir substitute. The exact Eir portrait shown in dialogue is
`moonwell-art/production/moonwell-eir-rootwatcher-portrait-v1.png`.
