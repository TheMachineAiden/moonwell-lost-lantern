# Moonwell sound-effect sources

Moonwell's five short state-change cues are original deterministic synthesis:

- `firefly` — delicate pickup glint, with restrained runtime pitch color;
- `bridge` — low root movement opening into a larger materialization rise;
- `memory` — pale descending discovery shimmer;
- `echo` — cool receding confirmation for a valid lantern echo;
- `starroot` — grounded chime transposed through three deterministic pitches.

`palette.json` is the editable source. `build.py` renders mono 22.05 kHz PCM
with only Python's standard library, then uses FFmpeg to create five small
dual-mono production Ogg/Vorbis files in `assets/audio/sfx/` (the repository's
FFmpeg Vorbis encoder requires two channels). Temporary WAV files are
never shipped. Run `npm run build:sfx` to regenerate the production assets and
`npm run verify:sfx` to check deterministic PCM, format, duration, loudness,
peak, and file-size bounds.

This is a separate sound-effects workstream. It neither imports nor rewrites
the soundtrack scores, renderer, or three production music masters.
