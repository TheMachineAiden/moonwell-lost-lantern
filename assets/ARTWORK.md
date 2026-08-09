# Moonwell artwork pack

`keeper-walk.png`, `discoveries.png`, and `moon-memories.png` are original, project-bound raster artwork for **Moonwell: The Lost Lantern**. They were authored for this repository as simple pixel illustrations and rasterized locally from adjacent SVG source files on 2026-07-26. `keeper-walk.png` contains the young keeper's idle and walking frames; `moon-memories.png` contains the three collectible keepsakes.

No third-party artwork, model output, or external asset is included. The project owner may use, modify, and publish this pack with Moonwell under the repository's existing publication terms.

The final PNGs are deliberately small (72 × 88, 48 × 32, 96 × 24, and 72 × 24) with transparent backgrounds, keeping the static game's transfer and mobile memory cost negligible.

## Quiet Whispering Hollow sentinel — 2026-08-09

`generated/moonwell-hollow-sentinel-source-v1.png` is the retained 1536 ×
1024 project-bound image-generation source for Whispering Hollow's replacement
stone blocker. It was created with the built-in image-generation workflow
(`gpt-image-2`) using the accepted bottom-right clearing source as a style
reference. Its pinned SHA-256 is
`dc70ee658015592b769d2fdddbc4b8aa549ab9f88bcd634167d0302c642809ea`.

Prompt summary: “Create one compact broad, root-bound blue-green stone
formation on a flat `#ff00ff` key, matching Moonwell's crisp navy/teal pixel
art. It is a silent impassable 2 × 2 forest blocker, not an objective: no
face, eyes, chest, lantern, opening, arch, shrine, rune, glyph, crescent,
symbol, glow, halo, bright point, warm gold, text, grid, or extra object.”

`scripts/process-hollow-sentinel-art.sh` verifies the source identity, removes
the chroma field with hard pixel alpha, point-reduces the complete retained
formation into a 30 × 30 image with a side safety gutter and grounded baseline
inside its exact 32 × 32 footprint, maps remaining prohibited accents to muted
teal, and lowers pale root highlights below objective value. The
byte-reproducible runtime sprite is
`moonwell-art/production/moonwell-sentinel-stones-v2.png` (SHA-256
`e3568515fec56416587438c5fc2118784b671c285743a90693d59f28de7096fa`).
The retained source is never loaded by the page.

## Varied Moonroot water surface — 2026-08-09

The current `moonwell-art/production/moonwell-water-tile-v3.png` supersedes
the earlier single repeated water cell with a four-frame 64 × 16 atlas. No new
generation output was needed: all four frames derive from the water region of
the already retained project-bound
`generated/moonwell-world-props-atlas-v2-source.png` (SHA-256
`1f28c764f0a3b4e0c50b287e29312471081f35007265219e87e16aeb80a317b4`).

`scripts/process-moonwell-art.sh` preserves the accepted frame zero, crops
three additional source regions, point-reduces them to the same 16 × 16 pixel
scale, and copies the accepted one-pixel edge transition around every frame.
The shared no-violet workflow applies its existing water palette pass and
normalizes those final perimeters after recoloring. The reproducible runtime
atlas hash is
`8d12e1c565417bb900944b91bc4a6db4b9d80e0de3a034917ca12d938458429f`.
Runtime selects only these retained PNG cells; it no longer paints a canvas
rectangle behind the touched surface.

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
canvas-drawn Eir substitute. The v1 Eir derivatives remain the reproducible
keyed intermediates. The exact current dialogue portrait is the no-violet
`moonwell-art/production/moonwell-eir-rootwatcher-portrait-v2.png`.

## Corrected bottom-right clearing production family — 2026-08-02

The authoritative target is the framed bottom-right clearing in
`generated/moonwell-320x208-art-direction-source-v1.png`. Its exact matched
crop is retained at `artifacts/qa/moonwell-reference-vignette-matched.png`.
That crop and the luminous v2 production source were supplied as visual
references to the configured built-in image-generation workflow. The new,
unmodified project-bound output is retained as
`generated/moonwell-bottom-right-clearing-source-v3.png`; its keyed alpha
companion is `generated/moonwell-bottom-right-clearing-source-v3-alpha.png`.

Prompt summary: “Create a separated transparent-ready 16-bit pixel-art
production atlas, not a sample scene: one dominant crescent-trunk spruce, one
broad mossy root platform, four continuous loamy forest-floor patches, two
enclosing spruce-canopy clusters, three soft cool moonlight pools, and four
restrained amber firefly points. Match the supplied bottom-right clearing's
deep navy negative space, teal depth, moss, roots, stone, and cool moonlight;
keep generous spacing on a flat magenta key; no text, UI, characters,
grid, watermark, or baked composition.”

`scripts/process-bottom-right-clearing-art.sh` reproducibly removes the
border-connected magenta key, crops the approved cells, point-scales them, and
writes the six production PNGs named `moonwell-clearing-*-v*.png`. Runtime code
loads those derivatives only. The matched comparison and four-level contact
sheet are retained at
`artifacts/qa/moonwell-bottom-right-reference-live-matched-v3.png` and
`artifacts/qa/moonwell-bottom-right-four-level-contact-sheet-v3.png`.

## No-violet environmental production pass — 2026-08-03

The framed bottom-right reference is also authoritative for palette. The
runtime environment therefore contains no purple-family pixels in terrain,
tree/canopy silhouettes, roots and root shelves, stones, mushrooms, water,
decorative detail, magical terrain props, or tiled seams. The retained
generated sources remain unchanged as provenance; the deterministic
`scripts/process-no-violet-environment-art.sh` rebuilds them into new
versioned teal/bark/cyan/amber-neutral production derivatives. The same final
pass now also removes the keyed-source magenta/fuchsia fringe from all four Eir
idle frames, maps sparse purple portrait accents to muted teal, and emits the
reviewed Luna runtime atlas without changing either character's collision or
interaction contract.

## Dense inner-forest boundary — 2026-08-09

`generated/moonwell-inner-forest-boundary-source-v1.png` is a retained
1024 × 224 raster composition built from the owner-selected no-violet canopy
derivative `moonwell-clearing-canopy-v3.png`. Its unevenly offset, mirrored
canopy layers create overlapping crowns, root faces, moss, and undergrowth
without a regular gap or ground channel. The deterministic
`scripts/process-inner-forest-boundary-art.sh` point-reduces that source into
the two-frame 512 × 112 production sprite
`moonwell-inner-forest-boundary-v1.png`. Runtime preserves the existing three
curtain placements and row-2 collider cells, so this is visual occlusion only:
playable bounds, routes, and collisions do not move.

## Sprite-first Starroot grounding — 2026-08-09

`generated/moonwell-starroot-clearing-source-v2.png` is a retained 1536 ×
1024 project-bound source edit made with the built-in image-generation
workflow from `generated/moonwell-starroot-chime-source-v1.png`. Its pinned
SHA-256 is
`a5b36b3470eea3e0eaf854938c0e58f0c25b94c1eb2df8c75cdd8d5107db9aa7`.

Prompt summary: “Preserve the four Starroot chimes and their left-to-right
waking sequence; change only their ground contact into low, irregular tapered
roots and moss on a flat `#ff00ff` key. Match Moonwell's navy/teal, bark, muted
moss, cool wet-soil, and restrained inner amber palette; no rectangle, cross,
platform, path, doorway, lantern, halo, text, grid, or extra object.”

`scripts/process-starroot-chime-art.sh` verifies the exact source hash, removes
the keyed field with a hard pixel-art alpha predicate, point-reduces each
quarter to a common 24 × 24 cell with transparent gutters, and packs
`moonwell-starroot-chime-loop-v2.png`. The shared no-violet processor writes
the runtime `moonwell-starroot-chime-loop-v3.png`. The authored root-and-moss
contact is now inside every raster frame; runtime canvas shapes no longer draw
a Starroot clearing. The small static glowmoss floor marks now select, scale,
and dim the retained `moonwell-foliage-variants-v2.png` strip rather than
drawing rectangle clusters.

## Opaque loam substrate — 2026-08-09

`moonwell-loam-base-tiles-v1.png` is an opaque four-cell 16 × 16 raster base
derived reproducibly from the reviewed no-violet
`moonwell-clearing-loam-patches-v3.png` family. The transparent larger loam
patches remain their existing visual detail layer; the new base fills only
their exposed gaps with sampled deep loam, preserving native pixel scale and
removing the former canvas-painted terrain rectangle. The water tile was
inspected separately and is already fully opaque, so its backing rectangle is
not visible runtime art. `scripts/process-loam-base-art.sh`, invoked by the
managed no-violet art workflow, rebuilds the base byte-identically.

### Map-specific loam placement — 2026-08-09

The four transparent 160 × 96 source cells in
`moonwell-clearing-loam-patches-v3.png` remain the unchanged retained runtime
family and keep their documented generated-source provenance. Runtime reduces
them to the accepted 80 × 48 logical footprint, but now selects them through
four explicit thirty-record placement layouts rather than one repeated stamp
lattice. Code varies only sprite frame, four-pixel-aligned position,
horizontal reflection, and subdued opacity. This creates distinct ground
texture across the four maps without a new art source, derivative, procedural
terrain primitive, or collision record; the managed processor remains the
reproducible source-to-production workflow for every pixel used.

## Luna handoff reduction and Eir outline correction — 2026-08-03

The approved Luna generation is retained intact under
`artifacts/owner-handoffs/luna-regeneration-v1/`. It is a high-resolution
four-pose reference, not a runtime sheet. Whole-figure downsample prototypes
made the cowlick and lantern disappear, so the production reduction was
authored deliberately at Moonwell's native scale in
`moonwell-art/source/moonwell-luna-walk-v6.xpm`. Its colors are sampled from
the approved teal/cyan, skin, navy, and amber families; every frame preserves
the connected cowlick, cloak edge, framed warm lantern, fixed ground margin,
and source walk-pose intent inside an exact 16 × 16 cell.

The final processor verifies the approved alpha handoff and native master by
SHA-256 before emitting `moonwell-keeper-walk-v6.png`. It also derives
`moonwell-eir-rootwatcher-idle-v2.png` and
`moonwell-eir-rootwatcher-portrait-v2.png` from the retained Eir sources. The
strict character predicate covers violet, purple, magenta, and fuchsia pixels;
Eir's idle fringe becomes near-black navy and portrait undergrowth becomes
muted teal. Runtime dimensions and anchors remain 14 × 18 over Luna's 10 × 10
movement box, and 32 × 48 over Eir's non-solid interaction point.

## Exact-source Luna correction — 2026-08-03

The owner superseded the preceding Luna abstraction with the exact
`generated-image.png` attachment now retained byte-for-byte as
`artifacts/owner-handoffs/luna-exact-owner-source-2026-08-03.png`. Its
sidecar records the 1995 × 788 dimensions and SHA-256 provenance. This image,
not the earlier v6 XPM or regeneration handoff, is authoritative for Luna.

Visual comparison at actual runtime scale showed that 16 × 28 and 20 × 34
literal reductions lost the supplied face, clothing shapes, and lantern frame.
A 23 × 38 literal figure is the smallest version that keeps the cyan cowlick,
eye and face, deep-teal hair and cloak silhouette, stride, and warm framed
lantern readable. The deterministic no-violet processor converts only the
magenta generation background and fringe to transparency, point-reduces each
of the four supplied poses, and pads it into a 26 × 40 cell with safe frame
edges and a shared one-pixel ground margin. It performs no redraw, generated
replacement, palette reinterpretation, or per-frame motion invention.

The v7 runtime atlas is `moonwell-keeper-walk-v7.png` (104 × 40). It renders
at its native 26 × 40 footprint from anchor −13,−39 while Luna's existing
10 × 10 movement and collision box remains unchanged. Eir, world art, routes,
colliders, and install icons are independent and unchanged.

## Moonwell home-screen icon — 2026-08-03

`assets/generated/moonwell-home-screen-icon-generated-raw-v1.png` is the
retained high-resolution image-generation output. The deterministic
`scripts/process-home-screen-icon-source.sh` rebuilds the approved,
no-violet `assets/generated/moonwell-home-screen-icon-source-v1.png` from it,
normalizing the five isolated near-black violet pixels into blue-green night.
The resulting text-free icon centers Luna, the Lost Lantern, and a cyan
moonwell on a deeply padded teal/bark forest field so its essential focal
silhouette remains in Android's maskable safe zone and iOS's rounded-square
crop.

`scripts/process-home-screen-icon.sh` deterministically produces the complete
opaque production family under `assets/moonwell-art/app-icon/`: 1024, 512,
192, Apple 180, browser 32/16, and a declared 512 maskable icon, plus the
multi-resolution root `favicon.ico`. The source and every derivative are
covered by no-purple pixel and byte-determinism tests.

`artifacts/qa/moonwell-home-screen-icon-scale-proof.png` is the retained
deterministic native/small-size visual check built by the same script.

## Vertical Moonroot bridge and half-size Eir — 2026-08-03

`assets/generated/moonwell-vertical-bridge-source-v1.png` is the retained
project-bound image-generation source for Moonroot Crossing's north-to-south
bridge. The configured built-in image workflow used the former bridge strip
and the authoritative 320 × 208 Moonwell art-direction sheet as references.
The prompt requested one top-down bridge with continuous horizontal planks,
root-rope rails, bark/moss/cyan materials, and a removable flat magenta field.

The deterministic no-violet processor keys, trims, point-reduces, and
palette-normalizes that source to the transparent 32 × 64 production asset
`moonwell-bridge-vertical-v4.png`. It occupies exactly two columns by four
rows and is drawn only after Eir's three-riddle sequence is complete. The old
moonflower pressure trigger and horizontal bridge strip are no longer loaded,
preloaded, drawn, collided with, or described by the runtime.

Eir's retained `moonwell-eir-rootwatcher-idle-v2.png` bytes and four-frame
timing remain unchanged. Runtime drawing alone scales each 64 × 96 cell to
16 × 24 with nearest-neighbor rendering at anchor −8,−22. Her established
one-cell non-solid encounter anchor and 22-pixel talk radius are unchanged.

## Raster exit and Moonroot shore correction — 2026-08-08

`scripts/process-exit-moonroot-sprites.sh` is the deterministic processor for
the final two world-art cues that previously used canvas rectangles. It uses
the retained no-violet spruce, root-platform, and loam production families and
produces the compact transparent runtime strips
`moonwell-route-opening-overhang-v1.png` (four 64 × 72 frames),
`moonwell-exit-clearing-states-v2.png` (four 32 × 40 frames), and
`moonwell-moonroot-shores-v1.png` (two 288 × 12 river-bank rows).

The overhang strip parts two source-derived spruce silhouettes from a closed
thicket to a complete one-tile gap. The clearing strip holds a tapered,
source-textured loam trail and muted warm threshold behind those roots, with no
lantern-like point light. The shore strip layers over the existing water tiles
before the unchanged vertical bridge. Game code only selects, positions, and
layers these PNG cells; exit timing and collider state, Moonroot water
collision, and the bridge footprint are unchanged.

### Moonroot bank refinement — 2026-08-08

The deterministic processor now builds the shore from eight overlapping crops
of the retained no-violet loam family. Each north-bank section combines dark
wet soil with source-shaped moss, stones, and a transparent fringe; the south
bank is the retained pixel-art inverse for the far shore. Seven continuous
pixels join the forest floor while the remaining five pixels produce a varied
waterline. This supersedes the compressed root-platform bank, which still read
as a straight root fence at actual desktop scale. The 288 × 24 raster remains
purely visual: layer order, water collision, and the bridge's four-cell
crossing are unchanged. The shared no-violet workflow rebuilds this derivative
after its final loam and root inputs, keeping regeneration byte-identical.

### Irregular loam opening refinement — 2026-08-09

`moonwell-exit-clearing-states-v3.png` supersedes the v2 clearing strip at
runtime. Actual-scale review showed that v2's shallow retained root-platform
lip stayed too rectangular and too light, so the open state read as an upright
wooden slab even though the paired spruces had parted correctly.

The same deterministic `scripts/process-exit-moonroot-sprites.sh` workflow now
uses only `moonwell-clearing-loam-patches-v3.png` for the clearing surface. It
packs four 32 × 40 stepped silhouettes whose mouths, middles, and irregular
aprons widen with the existing state sequence and taper again at the near edge.
The asset retains muted warm loam texture but no root-platform rectangle,
lantern-bright point, runtime shape drawing, or new generated source. The
existing retained generation provenance of the no-violet loam family therefore
remains the complete source-to-production evidence for this derivative.

## Varied loam root shelves — 2026-08-09

`scripts/process-root-shelf-art.sh` replaces the repeated bench-like runtime
platform with six compact raster variants. It derives the broken 48 × 16 loam
caps from `moonwell-clearing-loam-patches-v3.png`, the shallow soil texture from
the approved rooted `moonwell-clearing-root-platform-v3.png`, and six distinct
lower alpha profiles from `moonwell-moonroot-shores-v1.png`. The output is the
288 × 24 strip `moonwell-root-shelf-variants-v1.png`.

These retained inputs remain reproducible from their documented image-
generated sources through the managed no-violet workflow. The shelf processor
uses point reduction, a bounded median texture pass, retained alpha masks, and
fixed palette reduction; it strips metadata for byte-identical output. Runtime
only selects one of six packed frames and draws it at the existing 48 × 24
visual footprint. All seven 2 × 1 anchors and 40 × 14 colliders are unchanged.
