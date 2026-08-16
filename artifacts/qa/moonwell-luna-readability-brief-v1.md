# Luna readability derivative brief

- **Problem:** At the accepted 13 × 20 runtime draw, Luna's dark outer pixels merge into Moonroot's lower foliage and Whispering Hollow's loam. Eir's retained 16 × 24 readability edge and the cool echo remain easier to locate.
- **Logical footprint:** unchanged 10 × 10 movement/collision box centred on `player.x, player.y`.
- **Visual footprint:** unchanged 13 × 20 draw from a four-cell 26 × 40 atlas; anchor `(-6.5, -19.5)`, shared baseline, no collider movement, no cast shadow.
- **Overhang:** visual only; 6.5 px left/right and 19.5 px above the player anchor, with the existing half-pixel ground alignment.
- **Frames:** four, retaining the exact-owner gait order and runtime timing/mirroring.
- **Cue hierarchy:** preserve Luna's teal clothing, skin, cyan cowlick and restrained amber lantern. Add only a one-runtime-pixel muted teal contact silhouette, below Eir/firefly objective brightness and without purple or violet.
- **Retained source:** the authoritative exact-owner handoff at `artifacts/owner-handoffs/luna-exact-owner-source-2026-08-03.png`, deterministically reduced to the accepted `moonwell-keeper-walk-v7.png` base.
- **Production candidate:** `assets/moonwell-art/production/moonwell-keeper-walk-v8.png`, derived from the hash-pinned v7 base by preserving every authored source pixel and adding only a one-source-pixel retained raster contact edge inside the unchanged 26 × 40 cells.
- **Actual-scale acceptance:** Luna must remain visibly the same character and gait, become locatable over all four public maps without reading as a glow or objective, preserve frame boundaries/baseline/anchor/collision, and pass desktop 1440 × 900, portrait 390 × 844 × 3, and touch-landscape 844 × 390 × 3 normal-input QA.
