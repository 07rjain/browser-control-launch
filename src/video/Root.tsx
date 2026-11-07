import { Composition } from 'remotion';
import { LaunchFilm } from './LaunchFilm';

export const RemotionRoot = () => <Composition id="BrowserControl" component={LaunchFilm} durationInFrames={1350} fps={30} width={1920} height={1080} />;
