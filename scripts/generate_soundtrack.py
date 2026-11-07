"""Generate the film's original, sample-free ambient instrumental with stdlib only."""
import array
import math
import json
import wave
from pathlib import Path

sample_rate = 44100
metadata = json.loads((Path(__file__).resolve().parent.parent / 'src/video/metadata.json').read_text())
duration = metadata['durationSeconds']
chords = [(130.81, 164.81, 196), (110, 130.81, 164.81),
          (87.31, 110, 130.81), (98, 123.47, 146.83)]
samples = array.array("h")
for index in range(sample_rate * duration):
    time = index / sample_rate
    chord = chords[int(time / 3.75) % 4]
    fade = min(1, time / 2, max(0, (duration - time) / 2.5))
    value = 0
    for note, frequency in enumerate(chord):
        value += math.sin(2 * math.pi * frequency * time + .09 * math.sin(time * .4 + note)) * .022
        value += math.sin(2 * math.pi * frequency * .5 * time) * .016
        value += math.sin(2 * math.pi * frequency * 2 * time) * .005
    beat = time % .46875
    tone = chord[int(time / .46875) % 3] * 4
    value += math.sin(2 * math.pi * tone * beat) * math.exp(-beat * 15) * .031
    pulse = time % .9375
    value += math.sin(2 * math.pi * (45 * pulse + 2.2 * (1 - math.exp(-pulse * 18)))) * math.exp(-pulse * 18) * .065
    for side in (0, 1):
        stereo = value + math.sin(2 * math.pi * chord[1] * 2 * time + side * .6) * .006
        samples.append(int(max(-1, min(1, stereo * fade * 3.2)) * 32767))
target = Path(__file__).resolve().parent.parent / "public/assets/ambient.wav"
with wave.open(str(target), "w") as output:
    output.setnchannels(2)
    output.setsampwidth(2)
    output.setframerate(sample_rate)
    output.writeframes(samples.tobytes())
print(f"Generated {duration}-second original soundtrack: {target}")
