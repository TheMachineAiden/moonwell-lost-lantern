# Moonwell: The Lost Lantern

A small, original browser game made from a static HTML page and game script. Its skippable in-canvas prologue drifts through Moonwell’s own quiet forest imagery before play, with a static reduced-motion presentation. Walk with arrow keys or WASD, collect the first three fireflies, and return them to the lantern. That opens Moonroot Crossing: meet Eir on the north shore and solve her three gentle riddles to grow a vertical bridge, then cross south to gather two more fireflies and light the next passage. Its glow points to Whispering Hollow: touch the first echo-stone, walk to the second, then press `E` (or **Echo** on touch) to send a delayed Luna back along her path. While the echo holds the first rune, reach the third to call back a hidden firefly. Then Starfall Grove opens: wake its three grounded starroot chimes in any order, gather the final two canopy lights, and return them to the awakened Moonwell altar. Three pale forest memories are tucked beside the paths in the first three areas; collect them for small pieces of the keeper’s story, or press `J` to hear the memories found so far. Small cool glowmoss clusters are static floor flora, visually distinct from the animated amber collectibles. On phones, rotate to landscape, choose the clear fullscreen entry after the prologue, then use the transparent continuous-direction controls.

`elsewhere.html` remains a separate, playable no-gravity room until its dedicated public repository and Pages URL are verified. Drag its floating objects on touch or desktop, tap open space or choose Drift for a nudge, and optionally enable its gentle synthesized sound.

`field-guide.html` is a mobile-first companion page with short field notes for the moonwell, lantern motes, and gravity seed, plus a direct route back to the game.

The small original raster art pack in `assets/` adds the animated lantern keeper and discovery sprites while retaining the game's no-dependency static setup. Luna's current four-frame v7 walk atlas is a direct, transparency-only 26 × 40-cell reduction of the exact retained owner attachment; runtime drawing scales those unchanged cells to 13 × 20 with nearest-neighbor rendering. Her Whispering Hollow replay uses a retained cool-cyan derivative with the same four poses, alpha silhouette, draw box, and anchor, making the returning echo legible without changing its path or timing. Eir's unchanged runtime strip now draws at 16 × 24—exactly half her former size—with nearest-neighbor rendering, the same grounded baseline, and her existing non-solid 22-pixel interaction reach. Luna's 10 × 10 movement box is unchanged. The current forest system is derived from the owner-selected framed bottom-right clearing: parted-spruce route openings, broad mossy root shelves, continuous loam, cool moonlight pools, enclosing spruce canopies, raster Eir, warm fireflies, and supporting foliage are integrated as separate production layers across all four levels. Its provenance and reuse note are recorded in `assets/ARTWORK.md`.

For deterministic non-player-facing scene checks, use `?dev=scene&area=0` through `?dev=scene&area=3`. These routes start the requested scene without changing normal gameplay and expose a small `window.__moonwellAudit` assertion surface for browser verification.

## Run locally

Open `index.html` in a modern browser. No install, build step, network access, or third-party assets are needed.

For a local HTTP preview, run `npm run dev` and open `http://127.0.0.1:4173`. Run `npm test` for the dependency-free progression checks and `npm run check` for JavaScript syntax checks.

## Accessibility

The game has keyboard controls, a visible control guide, focus styling, and polite screen-reader updates for important game events. The prologue is a semantic dialog with fixed **Skip prologue** and **Enter the forest** controls; reduced-motion users receive the complete story statically with no timed wait. Press `P` or `Escape` at any point during a run to pause; press either key again or choose **Continue** to resume. On touch devices, use the round pause button in the upper-right corner during play.
