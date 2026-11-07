import { Composition } from 'remotion';
import { LaunchFilm } from './LaunchFilm';
import metadata from './metadata.json';

export const RemotionRoot = () => <Composition id="BrowserControl" component={LaunchFilm} durationInFrames={metadata.durationSeconds * metadata.fps} fps={metadata.fps} width={metadata.width} height={metadata.height} />;
