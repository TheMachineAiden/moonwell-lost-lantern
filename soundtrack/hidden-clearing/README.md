# Hidden Clearing

Three related cues: a 15.3-second prologue, 81.7-second exploration loop and 10.2-second victory. The event scores are the editable musical authority. They share a light swing at 94 quarter notes/minute and a hardware-inspired Game Boy palette; software envelopes and filtered synthesis are deliberate departures from strict hardware execution.

Runtime WAVs are 48 kHz mono PCM16. Their samples exactly retain one of the two identical master channels, without lossy encoding, resampling, gain changes or encoder padding. The tradeoff is about 10 MB across the complete family. Per-cue game volumes remain 0.7, 0.33 and 0.42 respectively. `assets/audio/hidden-clearing/manifest.json` records score and PCM hashes, durations and playback forms.

Rebuild with Python 3.12, numpy 2.5.3 and scipy 1.18.1:

```sh
python3 soundtrack/hidden-clearing/build.py
```

The build verifies byte identity with the retained runtime manifest. A deliberate musical revision requires updating the manifest after reviewing the new score and render. The legacy soundtrack remains retained separately; it is no longer selected by runtime cue mapping.

The prologue and victory play once. Exploration loops. A single audio element prevents overlapping stale cues and keeps sound preference, pause and visibility handling shared with the existing effects controls. Technical conformance does not establish perceived balance or transition quality.
