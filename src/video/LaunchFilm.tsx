import type { CSSProperties, ReactNode } from 'react';
import { AbsoluteFill, Audio, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { ArrowRight, Brain, Check, Chrome, Globe2, MousePointer2, ShieldCheck, Square, WandSparkles } from 'lucide-react';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '../styles.css';
import './video.css';
import { ProductPreview } from '../components/ProductPreview';
import type { FeatureId } from '../content';
import captions from './captions.json';
import metadata from './metadata.json';

const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
const blue = '#2563eb';
const featureData = {
  browse: { label: 'Browse', icon: MousePointer2, headline: <>Less busywork.<br /><em>More browsing.</em></>, description: 'Attach a page. Ask in plain English.', note: 'You choose when to share page context.' },
  memory: { label: 'Memory', icon: Brain, headline: <>A little memory.<br /><em>Less repeating.</em></>, description: 'Keep useful preferences for your next chat.', note: 'Opt-in. Stored locally. Edit or forget anytime.' },
  skills: { label: 'Skills', icon: WandSparkles, headline: <>Show it once.<br /><em>Use it again.</em></>, description: 'Record. Review. Save a reusable workflow.', note: 'Recording starts only when you choose.' },
  permissions: { label: 'Control', icon: ShieldCheck, headline: <>Your browser.<br /><em>Your rules.</em></>, description: 'Choose your permission mode.', note: 'Auto review uses extra Codex usage. Site access is separate.' },
};

function pop(frame: number, fps: number, delay = 0) {
  return spring({ frame: frame - delay, fps, config: { damping: 24, stiffness: 110, mass: .8 } });
}

function Enter({ children, delay = 0, distance = 30, className = '', style }: { children: ReactNode; delay?: number; distance?: number; className?: string; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const amount = pop(frame, fps, delay);
  return <div className={className} style={{ opacity: amount, transform: `translateY(${(1 - amount) * distance}px)`, ...style }}>{children}</div>;
}

function Header() {
  const frame = useCurrentFrame();
  const current = frame < 120 ? 'Meet Browser Control' : frame < 330 ? '01 — Browse' : frame < 510 ? '02 — Memory' : frame < 720 ? '03 — Skills' : frame < 900 ? '04 — Control' : 'Make it yours';
  return <div className="movie-header"><div className="movie-brand"><Img src={staticFile('icon.png')} /><span>Browser Control</span></div><span>{current}</span></div>;
}

function Subtitles() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cue = captions.find(item => frame >= item.from * fps && frame < item.to * fps);
  if (!cue) return null;
  const local = frame - cue.from * fps;
  const duration = (cue.to - cue.from) * fps;
  const opacity = interpolate(local, [0, 6, duration - 6, duration], [0, 1, 1, 0], clamp);
  return <div className="movie-subtitles" style={{ opacity, transform: `translateY(${interpolate(local, [0, 9], [9, 0], clamp)}px)` }}><span key={cue.from}>{cue.text}</span></div>;
}

function Intro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <AbsoluteFill className="movie-scene">
    <Enter className="movie-intro-label" delay={4}><span /> An open-source Chrome extension</Enter>
    <div className="movie-intro-title"><Enter delay={8}><h1>ChatGPT, right beside</h1></Enter><Enter delay={15}><h1 className="muted-heading">the page you’re on.</h1></Enter></div>
    <Enter className="movie-intro-description" delay={23}>Ask. Remember. Get things done.</Enter>
    <div className="movie-intro-features">{Object.entries(featureData).map(([key, value], index) => { const Icon = value.icon; const amount = pop(frame, fps, 30 + index * 6); return <div key={key} style={{ opacity: amount, transform: `translateY(${(1 - amount) * 28}px) scale(${.94 + amount * .06})` }}><span><Icon size={24} /></span>{value.label}</div>; })}</div>
  </AbsoluteFill>;
}

function Cursor({ feature, frame }: { feature: FeatureId; frame: number }) {
  const clickFrame = feature === 'permissions' ? 92 : 42;
  const opacity = interpolate(frame, [clickFrame - 25, clickFrame - 16, clickFrame + 20, clickFrame + 30], [0, 1, 1, 0], clamp);
  const x = feature === 'permissions' ? interpolate(frame, [clickFrame - 25, clickFrame], [790, 705], clamp) : interpolate(frame, [clickFrame - 25, clickFrame], [880, 944], clamp);
  const y = feature === 'permissions' ? interpolate(frame, [clickFrame - 25, clickFrame], [420, 345], clamp) : interpolate(frame, [clickFrame - 25, clickFrame], [550, 502], clamp);
  const ring = interpolate(frame, [clickFrame, clickFrame + 15], [0, 1], clamp);
  return <div className="movie-cursor" style={{ opacity, left: x, top: y }}><div className="cursor-click" style={{ opacity: frame >= clickFrame ? 1 - ring : 0, transform: `translate(-50%, -50%) scale(${.4 + ring * 1.7})` }} /><MousePointer2 size={30} fill="#2563eb" stroke="white" strokeWidth={1.6} /></div>;
}

function Feature({ feature, duration }: { feature: FeatureId; duration: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const data = featureData[feature];
  const Icon = data.icon;
  const progress = interpolate(frame, [30, duration - 42], [0, 1], clamp);
  const browser = pop(frame, fps, 10);
  const saved = pop(frame, fps, duration - 76);
  return <AbsoluteFill className={`movie-scene movie-feature movie-${feature}`}>
    <div className="movie-feature-copy"><Enter delay={4}><div className="movie-feature-icon"><Icon size={32} /></div></Enter><Enter delay={9}><span className="movie-eyebrow">{data.label}</span><h2>{data.headline}</h2></Enter><Enter delay={17}><p className="movie-description">{data.description}</p></Enter><Enter delay={24}><p className="movie-note"><ShieldCheck size={18} />{data.note}</p></Enter></div>
    <div className="movie-stage" style={{ opacity: browser, transform: `translateX(${(1 - browser) * 65}px) scale(${interpolate(frame, [0, duration], [.99, 1.01], clamp)})` }}>
      <ProductPreview feature={feature} iconSrc={staticFile('icon.png')} progress={progress} animate />
      {(feature === 'browse' || feature === 'permissions') && <Cursor feature={feature} frame={frame} />}
      {feature === 'memory' && <div className="movie-toast" style={{ opacity: saved, transform: `translateY(${(1 - saved) * 20}px) scale(${.94 + saved * .06})` }}><span className="toast-check"><Check size={19} /></span><div>Preference saved.<small>Ready for your next regular chat.</small></div><Brain size={22} /></div>}
      {feature === 'skills' && <div className="movie-toast" style={{ opacity: saved, transform: `translateY(${(1 - saved) * 20}px) scale(${.94 + saved * .06})` }}><span className="toast-check"><Check size={19} /></span><div>Your workflow, saved.<small>Available for matching requests.</small></div><WandSparkles size={22} /></div>}
      {feature === 'permissions' && <div className="movie-control-status" style={{ opacity: saved, transform: `translateY(${(1 - saved) * 12}px)` }}><span><span className="activity-dot" /> Activity stays visible</span><span className="movie-stop"><Square size={11} fill="currentColor" /> Stop</span></div>}
    </div>
  </AbsoluteFill>;
}

function Outro() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <AbsoluteFill className="movie-scene movie-outro">
    <Enter className="movie-outro-icon" delay={5}><Img src={staticFile('icon.png')} /></Enter>
    <Enter delay={12}><h2>A better flow.<br /><span>One side panel.</span></h2></Enter>
    <Enter delay={21}><div className="movie-install"><Chrome size={27} /> Add to Chrome <ArrowRight size={24} /></div></Enter>
    <Enter delay={29}><div className="movie-domain"><Globe2 size={24} /> browser-control.subdomain.wtf</div></Enter>
    <div className="movie-setup">{['Add the extension', 'Install the companion', 'Sign in with ChatGPT'].map((step, index) => { const amount = pop(frame, fps, 35 + index * 9); return <div key={step} style={{ opacity: amount, transform: `translateY(${(1 - amount) * 16}px)` }}><span>{index + 1}</span>{step}{index < 2 && <ArrowRight size={17} />}</div>; })}</div>
    <Enter className="movie-requirements" delay={50}>Requires Node.js 20+, a compatible Codex CLI, the free local companion,<br />and an eligible ChatGPT/Codex account. No API key.</Enter>
  </AbsoluteFill>;
}

export function LaunchFilm() {
  const frame = useCurrentFrame();
  const duration = metadata.durationSeconds * metadata.fps;
  const opacity = interpolate(frame, [0, 8, duration - 10, duration - 1], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ background: '#fff', color: '#1d2636', fontFamily: 'DM Sans, sans-serif' }}>
    <AbsoluteFill style={{ opacity }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={138}><Intro /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={228}><Feature feature="browse" duration={228} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={198}><Feature feature="memory" duration={198} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={228}><Feature feature="skills" duration={228} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: 'from-bottom' })} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={198}><Feature feature="permissions" duration={198} /></TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 18 })} />
        <TransitionSeries.Sequence durationInFrames={180}><Outro /></TransitionSeries.Sequence>
      </TransitionSeries>
      <Header /><Subtitles />
      <div className="movie-footer"><span>Open source. No API key.</span><span>Animated feature walkthrough</span></div>
      <div className="movie-progress"><div style={{ width: `${frame / (duration - 1) * 100}%`, background: blue }} /></div>
    </AbsoluteFill>
    <Audio src={staticFile('assets/ambient.wav')} volume={.55} />
  </AbsoluteFill>;
}
