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
