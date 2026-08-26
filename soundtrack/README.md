# Moonwell soundtrack sources

Moonwell ships three lightweight Ogg/Vorbis cues from `assets/audio/`:

- **Lantern Before Dawn** — bounded prologue cue.
- **Lanterns Through Leaves** — seamless exploration loop selected for the game.
- **Lantern Home** — bounded victory reprise.

The JSON scores and standard-library Python renderer are the editable,
deterministic sources. `Lantern Before Dawn` and `Lantern Home` are original
companion pieces derived from the rising D–F♯–A Lanterns motif and its brief
E–G♯ woodland turn. No outside melody or third-party audio asset is used.

Run `npm run build:audio` with Python 3 and FFmpeg available to regenerate the
two companion OGG files. Pass `lanterns_through_leaves` explicitly to render a
new encoding from the selected score; the checked-in selected master remains
the canonical production encoding. Intermediate WAV files are created only in
a temporary directory and are never shipped. `npm run verify:audio` checks cue format,
duration, loudness, peaks, loop metadata, and the exploration seam.

The retained selected master is intentionally unchanged in production:

- OGG SHA-256: `94884630895e04a59ef99a8ce954b7900e37eafec5a295d2007e99e5cc12db8b`
- Score SHA-256: `a5e0807707180389d069fec3507dd124b6665eb965c18f1717d9daee6fef5893`
- Renderer SHA-256: `b6ed7c6aa63fcaf11d83881943b8e9ebc844a961b26d6ba1b0b072eb7ce580da`
