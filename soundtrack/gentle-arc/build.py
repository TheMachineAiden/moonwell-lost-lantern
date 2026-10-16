"""Reproduce or verify the Gentle Arc exploration PCM without changing its mix."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import wave

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT.parents[1]/'assets/audio/gentle-arc'
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--verify-only',action='store_true');args=parser.parse_args()
    entry=json.loads((ASSETS/'manifest.json').read_text())
    score=ROOT/'exploration.score.json'
    assert sha(score)==entry['score_sha256']
    if not args.verify_only:
        import numpy as np
        spec=importlib.util.spec_from_file_location('renderer',ROOT.parent/'hidden-clearing/renderer.py')
        renderer=importlib.util.module_from_spec(spec);spec.loader.exec_module(renderer)
        with tempfile.TemporaryDirectory(dir=ROOT,prefix='.render-') as folder:
            renderer.ROOT=Path(folder);renderer.render(score)
            with wave.open(str(Path(folder)/'previews/beyond-the-crossing-gentle--song.wav'),'rb') as wav:
                pcm=np.frombuffer(wav.readframes(wav.getnframes()),dtype='<i2').reshape(-1,2)
            assert np.array_equal(pcm[:,0],pcm[:,1])
            mono=Path(folder)/'exploration.wav'
            with wave.open(str(mono),'wb') as wav:
                wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(48000);wav.writeframes(pcm[:,0].tobytes())
            assert sha(mono)==entry['sha256'],'Render differs from reference PCM'
            (ASSETS/'exploration.wav').write_bytes(mono.read_bytes())
    assert sha(ASSETS/'exploration.wav')==entry['sha256']
    with wave.open(str(ASSETS/'exploration.wav'),'rb') as wav:
        assert (wav.getnchannels(),wav.getsampwidth(),wav.getframerate(),wav.getnframes())==(1,2,48000,3200000)
        from array import array
        import sys
        samples=array('h',wav.readframes(wav.getnframes()))
        if sys.byteorder!='little':samples.byteswap()
    assert max(map(abs,samples))<=16422
    assert abs(sum(samples)/len(samples)/32768)<.005
    assert abs(samples[0]-samples[-1])/32768<=.01
    assert abs((samples[1]-samples[0])-(samples[-1]-samples[-2]))/32768<=.01
    print('Gentle Arc: exact score/PCM identity, duration, headroom and loop seam verified')
if __name__=='__main__':main()
