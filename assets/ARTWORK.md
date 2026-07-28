# Moonwell artwork pack

`keeper-companion.png`, `keeper-walk.png`, `discoveries.png`, and `moon-memories.png` are original, project-bound raster artwork for **Moonwell: The Lost Lantern**. They were authored for this repository as simple pixel illustrations and rasterized locally from the adjacent SVG source files on 2026-07-26. `keeper-walk.png` contains the young keeper's idle and walking frames; `moon-memories.png` contains the three collectible keepsakes.

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

The game repeats the 16 × 16 tile across Moonroot Crossing and keeps that water collidable except for the revealed bridge gap. The generated platforms use explicit solid collision boxes, the non-collidable fairy sprite overlays have been removed, and the previous statue-like guardian asset is no longer loaded or drawn: Whispering Hollow now draws and collides with the new moonwell sentinel only.
