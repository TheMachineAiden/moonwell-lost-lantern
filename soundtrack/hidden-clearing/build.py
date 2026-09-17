"""Reproduce the three runtime PCM assets from the editable event scores."""
import hashlib
import json
from pathlib import Path
import tempfile
import wave
import renderer

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT.parents[1]/'assets/audio/hidden-clearing'
def digest(data):return hashlib.sha256(data).hexdigest()
def main():
 manifest=json.loads((ASSETS/'manifest.json').read_text())
 with tempfile.TemporaryDirectory(dir=ROOT,prefix='.render-') as folder:
  renderer.ROOT=Path(folder)
  for cue,contract in manifest['cues'].items():
   score=ROOT/f'{cue}.score.json'
   assert digest(score.read_bytes())==contract['score_sha256'],f'{cue}: score changed'
   renderer.render(score)
   name=f'mosslight-steps-hidden-clearing--{cue}.wav'
   with wave.open(str(Path(folder)/'previews'/name),'rb') as w:
    data=w.readframes(w.getnframes())
   import numpy as np
   samples=np.frombuffer(data,dtype='<i2').reshape(-1,2)
   assert np.array_equal(samples[:,0],samples[:,1])
   target=Path(folder)/f'{cue}.wav'
   with wave.open(str(target),'wb') as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(48000);w.writeframes(samples[:,0].tobytes())
   encoded=target.read_bytes()
   assert digest(encoded)==contract['sha256'],f'{cue}: render differs'
   (ASSETS/f'{cue}.wav').write_bytes(encoded)
   print(f'{cue}: exact PCM identity verified')
if __name__=='__main__':main()
