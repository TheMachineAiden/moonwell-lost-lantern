# Gentle Arc exploration

The 66.67-second exploration loop uses a hardware-inspired Game Boy palette: two pulse voices and triangle-like bass, with the noise voice silent. Software envelopes, spectral filtering and offline mastering are deliberate departures from strict hardware execution. The event score is the editable authority; offsets and occupied lengths are quarter-note beats, including release.

The runtime WAV is 48 kHz mono PCM16. Its samples exactly match either channel of the stereo master, with no gain change, resampling or encoder padding. This preserves loop timing at a cost of 6.4 MB. Exploration volume remains 0.33; Hidden Clearing prologue and victory remain selected, and the earlier exploration is retained.

Rebuild using Python 3.12, numpy and scipy:

```sh
python3 soundtrack/gentle-arc/build.py
python3 soundtrack/gentle-arc/build.py --verify-only
```

The build reuses `soundtrack/hidden-clearing/renderer.py` and requires exact agreement with the runtime manifest. Verification checks source/PCM identity, timing, headroom and the loop boundary; it does not establish perceived musical quality.
