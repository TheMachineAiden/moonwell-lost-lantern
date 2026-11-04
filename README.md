# Moonwell: The Lost Lantern

A quiet browser walking tale about bringing everyone home after a storm. Luna finds her grandmother Eir’s dropped lantern and its three sparks in Lantern Glade. Eir waits with an adult and child on the south bank. Together they restore the bridge, light a safe detour through Whispering Hollow, and reconnect the village path at the Moonwell. Luna then holds the light for the child’s next step and walks home with Grandma.

The lantern remembers the steps Luna actually walks. Choose **Shine here** at a start stone, then **Create echo**: a single echo retraces those steps and waits at the start, without a timer. Creating it before walking is valid too. **Recall echo** only recalls it; the following action creates another. Both ends must be lit together to repair a path. Completed connections keep their light after Luna leaves or picks up the lantern. The village mark and well ring follow the same rule.

Three optional keepsakes recall last autumn’s walk with Eir. They deepen the story without unlocking essential progress. The [guide](field-guide.html) explains the controls and light rules.

## Play and controls

Use **arrows/WASD**, or drag on the steering circle to walk continuously. Release or return to its centre to stop; tapping a direction takes a short step. **F** or the nearby-action button interacts; **E** creates or recalls an echo. **Enter** continues dialogue. **J** opens the paged notebook; on a phone choose Notebook from Pause. **P/Escape** pauses; restart from the pause menu or walk again after the ending. The sound button preserves the chosen mute setting across a restart.

The world fills the viewport at its original aspect ratio, with compact contextual controls and dialogue. Start requests fullscreen where supported; ordinary viewport play remains available otherwise. Landscape gives the widest phone view, while portrait keeps the complete map and controls below it. Full guidance, progress and the notebook are available from Pause. Dialogue waits for the player. Moving away from the child’s footing pauses their next step; returning with the lantern lets them continue. There is no countdown.

## Run and check

Serve the files over HTTP (the game uses JavaScript modules):

```sh
npm run dev
```

Open `http://127.0.0.1:4173/`. Set `MOONWELL_PORT` to choose another loopback port. No package installation is required. `npm run build` creates the portable static site in `dist/`.

```sh
npm run check
npm test
```

Tests cover progression, persistent connections, echo lifecycle, early removal/recall recovery, child waiting, the shared home arrival, browser-adapter inputs/audio, retained audio and raster provenance. Raster/icon palette and reproducibility tests require **ImageMagick 7** (`magick`) on PATH. Diagnostic `?scene=hollow` begins an isolated scene with earlier progress already earned; it is not a full playthrough. `?layout=1` shows the retained blockout. The ordinary route uses production raster art; `window.__moonwell.snapshot()` exposes read-only inspection.

## Art and music

The world is 320×208 logical pixels with 16-pixel tiles, rendered with nearest-neighbour PNG composition. Source rasters remain under `assets/generated/`; deterministic derivatives are under `assets/moonwell-art/production/`. The [homecoming asset manifest](assets/moonwell-art/homecoming-art.json) records the new sources and processor contracts. Existing processing scripts produce the derivatives; no procedural world-art fallback is used in ordinary play.

The released arrangements of **Before the Forest Wakes**, **Beyond the Crossing – Gentle Arc**, and **The Forest Remembers** are retained. Music begins with a player action, changes from the opening cue to exploration, and resolves at home. Pause, page visibility and mute preserve the audio lifecycle. Editable scores and provenance remain in `soundtrack/` and `assets/audio/`.
