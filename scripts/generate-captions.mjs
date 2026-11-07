import { readFileSync, writeFileSync } from 'node:fs';

const captions = JSON.parse(readFileSync('src/video/captions.json', 'utf8'));
const metadata = JSON.parse(readFileSync('src/video/metadata.json', 'utf8'));
const timestamp = seconds => new Date(seconds * 1000).toISOString().slice(11, 23);
let previousEnd = 0;
for (const cue of captions) {
  if (cue.from !== previousEnd || cue.to <= cue.from || cue.to > metadata.durationSeconds) throw new Error('Captions must cover the timeline without gaps or overlaps.');
  previousEnd = cue.to;
}
if (previousEnd !== metadata.durationSeconds) throw new Error('Captions must cover the complete film.');
writeFileSync('public/demo-captions.vtt', `WEBVTT\n\n${captions.map(cue => `${timestamp(cue.from)} --> ${timestamp(cue.to)}\n${cue.text}\n`).join('\n')}`);
console.log(`Generated ${captions.length} concise captions for ${metadata.durationSeconds} seconds.`);
