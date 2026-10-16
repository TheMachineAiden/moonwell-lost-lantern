# Gentle Arc soundtrack family

The 66.67-second exploration loop uses a hardware-inspired Game Boy palette: two pulse voices and triangle-like bass, with the noise voice silent. Software envelopes, spectral filtering and offline mastering are deliberate departures from strict hardware execution. The event score is the editable authority; offsets and occupied lengths are quarter-note beats, including release.

The three runtime WAVs are 48 kHz mono PCM16. Their samples exactly match either channel of their stereo masters, with no gain change, resampling or encoder padding. Exploration is 66.67 seconds (6.4 MB) and loops; Before the Forest Wakes is a 15-second one-shot prologue, and The Forest Remembers is a 26.67-second one-shot victory. Existing cue levels remain 0.7 / 0.33 / 0.42. Earlier soundtrack assets and scores are retained unchanged.

Rebuild using Python 3.12, numpy and scipy:

```sh
python3 soundtrack/gentle-arc/build.py
python3 soundtrack/gentle-arc/build.py --verify-only
```

The build reuses `soundtrack/hidden-clearing/renderer.py` and requires exact agreement with the runtime manifest for all three cues. Verification checks source/PCM identity, timing, headroom, the exploration loop boundary and silent one-shot endings; it does not establish perceived musical quality. The existing single-player lifecycle handles immediate skipping and victory interruption without delaying gameplay for musical boundaries.
