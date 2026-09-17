# Soundtrack integration verification

- Runtime WAVs match the source PCM hashes exactly; all three rebuild byte-for-byte from the editable scores. Mono extraction retains identical stereo-channel samples without gain changes.
- `npm run verify:audio` passes for timing, identities, sample peak (−6.10 dBFS), DC and endpoints. Exploration has zero amplitude/slope discontinuity at the PCM loop boundary.
- `node --test test/soundtrack.test.js test/sound-effects.test.js`: 20/20 pass. Covers cue mapping, one voice, stale promise rejection, autoplay recovery, saved mute, pause, visibility and completed one-shots.
- `npm run check` and `npm run build` pass.
- Full `npm test`: 85/111 pass; the other 26 art/palette/regeneration tests require the unavailable `magick` executable. No image or gameplay files are changed by this integration.
- Chrome desktop (1280×900) and touch emulation (390×844 portrait gate, 844×390 landscape) exercise normal start/skip, sound control, saved preference/reload, pause/resume and restart. The portrait rotation prompt and landscape controls remain within their viewport; no relevant console errors were observed.
- A local-only browser harness uses the production audio modules with real HTML audio playback for three complete natural exploration loops, arbitrary victory interruption, rapid cue selections, one-shot completion and a five-family SFX burst. No media errors or stale play rejections occurred. Victory does not restart on unmute/resume; SFX retain their three-voice cap. This harness is not a full game playthrough.

The browser runner keeps tabs logically visible when switching pages. Hidden/visible transitions and blocked-autoplay recovery are therefore covered by deterministic lifecycle tests, not represented as native-device/browser-policy signoff. Touch emulation is not a physical iOS/Safari test. Browser/PCM results do not establish perceived transition quality or constitute listening evidence.

Cue switching retains the existing single-element immediate-reset behavior; no preview-only crossfade is silently assumed to exist in the game. Per-cue levels and all game event wiring are unchanged.
