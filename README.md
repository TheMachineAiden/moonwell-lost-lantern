# Moonwell: The Lost Lantern

A small, original browser game made from a static HTML page and game script. Walk with arrow keys or WASD, collect the first three fireflies, and return them to the lantern. That opens Moonroot Crossing: find its moonflower to raise a stepping-stone path, gather two more fireflies, and light its lantern. Its glow points to Whispering Hollow: touch the first echo-stone, walk to the second, then press `E` (or **Echo** on touch) to send a delayed Luna back along her path. While the echo holds the first rune, reach the third to call back a hidden firefly. Then Starfall Grove opens: ring its three skybells in any order to bring down the final two canopy lights. Three pale forest memories are tucked beside the paths in the first three areas; collect them for small pieces of the keeper’s story, or press `J` to hear the memories found so far. On phones, rotate to landscape, choose the clear fullscreen entry, then use the transparent continuous-direction controls.

`elsewhere.html` remains a separate, playable no-gravity room until its dedicated public repository and Pages URL are verified. Drag its floating objects on touch or desktop, tap open space or choose Drift for a nudge, and optionally enable its gentle synthesized sound.

`field-guide.html` is a mobile-first companion page with short field notes for the moonwell, lantern motes, and gravity seed, plus a direct route back to the game.

The small original raster art pack in `assets/` adds the animated lantern keeper and discovery sprites while retaining the game's no-dependency static setup. The current forest system is derived from the owner-selected framed bottom-right clearing: a singular crescent landmark, broad mossy root shelves, continuous loam, cool moonlight pools, enclosing spruce canopies, raster Eir, warm fireflies, and supporting foliage are integrated as separate production layers across all four levels. Its provenance and reuse note are recorded in `assets/ARTWORK.md`.

For deterministic non-player-facing scene checks, use `?dev=scene&area=0` through `?dev=scene&area=3`. These routes start the requested scene without changing normal gameplay and expose a small `window.__moonwellAudit` assertion surface for browser verification.

## Run locally

Open `index.html` in a modern browser. No install, build step, network access, or third-party assets are needed.

For a local HTTP preview, run `npm run dev` and open `http://127.0.0.1:4173`. Run `npm test` for the dependency-free progression checks and `npm run check` for JavaScript syntax checks.

## Accessibility

The game has keyboard controls, a visible control guide, focus styling, and polite screen-reader updates for important game events. Press `P` or `Escape` at any point during a run to pause; press either key again or choose **Continue** to resume. On touch devices, use the round pause button in the upper-right corner during play.
