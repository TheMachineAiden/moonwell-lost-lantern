# Luna regeneration handoff

Owner direction:

- Luna should inherit the richer colors and character language of the published Moonwell icon.
- Preserve a readable single cowlick and a clearly framed warm lantern.
- The production sprite must still fit Moonwell's existing four-frame 16×16 gameplay grid and remain proportionate beside trees, props, Eir, collision footprints, and the player camera scale.
- Treat the generated images here as high-resolution source/reference material, not as production-ready runtime assets.
- Derive a deterministic production sprite, inspect it at native and gameplay zoom, and reject it if the cowlick/lantern disappear or if Luna becomes larger/noisier than adjacent world objects.
- Avoid violet, purple, lavender, mauve, fuchsia, and magenta in Luna. Preserve the no-violet invariant.

Files:

- `luna-icon-language-generated-source-v1.png`: built-in image-generation output on a removable chroma background.
- `luna-icon-language-generated-alpha-v1.png`: locally keyed transparent reference; transparent corners and alpha coverage were validated.

Generation prompt:

> Regenerate Luna as a polished four-frame horizontal right-facing pixel-art walk cycle using the published Moonwell icon as the authoritative palette, cowlick, cloak, and lantern reference while preserving the current walk-cycle layout. Use near-black navy outlines, deep teal and blue-green hair/cloak, cool cyan edge light, restrained pale skin, and a warm amber framed lantern. Keep four equal cells, consistent baseline and scale, crisp pixels, no antialiasing, and no purple-family colors.

The owner also revised the environment direction in the same conversation: replace the visually blended top tree strip with readable ordinary ground and add separate scattered trees with explicit trunk/root colliders and canopy overhangs that match their visual footprints.
