"""Verify exact runtime identities, PCM bounds and the exploration loop seam."""
from array import array
import hashlib
import json
import math
from pathlib import Path
import sys
import wave

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT.parents[1]/'assets/audio/hidden-clearing'
manifest=json.loads((ASSETS/'manifest.json').read_text())
for cue,entry in manifest['cues'].items():
    path=ASSETS/entry['file']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==entry['sha256']==entry['source_pcm_sha256']
    score_path=(ASSETS/entry['score_file']).resolve()
    assert hashlib.sha256(score_path.read_bytes()).hexdigest()==entry['score_sha256']
    score=json.loads(score_path.read_text())
    with wave.open(str(path),'rb') as w:
        assert (w.getframerate(),w.getnchannels(),w.getsampwidth(),w.getcomptype())==(48000,1,2,'NONE')
        assert w.getnframes()==entry['frames']
        samples=array('h',w.readframes(w.getnframes()))
    if sys.byteorder!='little':samples.byteswap()
    assert len(samples)==round(score['total_bars']*score['meter'][0]*4/score['meter'][1]*60/score['qpm']*48000)
    peak=max(map(abs,samples))/32768
    assert 0<peak<=10**(-6/20)
    assert abs(sum(samples)/len(samples)/32768)<.005
    assert max(map(abs,samples[-240:]))<=2
    amplitude=abs(samples[0]-samples[-1])/32768
    slope=abs((samples[1]-samples[0])-(samples[-1]-samples[-2]))/32768
    if entry['loop']:
        assert amplitude<=.01 and slope<=.01
    print(json.dumps(dict(cue=cue,frames=len(samples),duration=len(samples)/48000,
        peak_dbfs=20*math.log10(peak),loop=entry['loop'],boundary_delta=amplitude,
        boundary_slope=slope,passed=True)))
