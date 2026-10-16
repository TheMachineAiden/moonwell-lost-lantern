"""Reproduce or verify the Gentle Arc cue family without changing its mix."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import wave
from array import array
import sys

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT.parents[1]/'assets/audio/gentle-arc'
def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--verify-only',action='store_true');args=parser.parse_args()
    manifest=json.loads((ASSETS/'manifest.json').read_text())
    engine=ROOT.parent/'hidden-clearing/renderer.py'
    assert sha(engine)==manifest['renderer_sha256']
    for cue,entry in manifest['cues'].items():
        score=ROOT/f'{cue}.score.json'
        assert sha(score)==entry['score_sha256']
        data=json.loads(score.read_text())
        assert data['loop']==entry['loop']
        if not args.verify_only:
            import numpy as np
            spec=importlib.util.spec_from_file_location('renderer',engine)
            renderer=importlib.util.module_from_spec(spec);spec.loader.exec_module(renderer)
            with tempfile.TemporaryDirectory(dir=ROOT,prefix='.render-') as folder:
                renderer.ROOT=Path(folder);renderer.render(score)
                with wave.open(str(Path(folder)/'previews'/f"{data['family']}--{data['cue']}.wav"),'rb') as wav:
                    pcm=np.frombuffer(wav.readframes(wav.getnframes()),dtype='<i2').reshape(-1,2)
                assert np.array_equal(pcm[:,0],pcm[:,1])
                mono=Path(folder)/entry['file']
                with wave.open(str(mono),'wb') as wav:
                    wav.setnchannels(1);wav.setsampwidth(2);wav.setframerate(48000);wav.writeframes(pcm[:,0].tobytes())
                assert sha(mono)==entry['sha256'],'Render differs from reference PCM'
                (ASSETS/entry['file']).write_bytes(mono.read_bytes())
        assert sha(ASSETS/entry['file'])==entry['sha256']
        with wave.open(str(ASSETS/entry['file']),'rb') as wav:
            assert (wav.getnchannels(),wav.getsampwidth(),wav.getframerate(),wav.getnframes())==(1,2,48000,entry['frames'])
            samples=array('h',wav.readframes(wav.getnframes()))
            if sys.byteorder!='little':samples.byteswap()
        assert max(map(abs,samples))<=16422
        assert abs(sum(samples)/len(samples)/32768)<.005
        if entry['loop']:
            assert abs(samples[0]-samples[-1])/32768<=.01
            assert abs((samples[1]-samples[0])-(samples[-1]-samples[-2]))/32768<=.01
        else:
            assert max(map(abs,samples[-480:]))<=2
        print(f'Gentle Arc {cue}: exact score/PCM identity, timing, headroom and boundary verified')
if __name__=='__main__':main()
