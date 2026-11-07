import { AbsoluteFill, Audio, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { ArrowRight, Brain, Check, Chrome, Code2, MousePointer2, ShieldCheck, Sparkles, WandSparkles } from 'lucide-react';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import { DemoBrowser } from '../components/DemoBrowser';
import { type FeatureId } from '../content';
import './video.css';

const lime = '#d1ee9b';
const clamp = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
function useEntrance(delay = 0) { const frame = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: frame - delay, fps, config: { damping: 22, stiffness: 95, mass: .9 } }); }
function Brand() { return <div className="film-brand"><Img src={staticFile('icon.png')} /><span>browser<span>control</span><b>.</b></span></div>; }
function Caption({ children }: { children: React.ReactNode }) { return <div className="film-caption"><span>{children}</span></div>; }
function Frame({ children, chapter }: { children: React.ReactNode; chapter: string }) { return <AbsoluteFill className="film-scene"><div className="film-grid" /><div className="film-top"><Brand /><span>YOUR BROWSER, A LITTLE MORE CAPABLE.</span></div>{children}<div className="film-bottom"><span>OPEN SOURCE. BUILT FOR YOUR EVERYDAY.</span><span>{chapter}</span></div></AbsoluteFill>; }

function Intro() {
  const frame = useCurrentFrame(); const enter = useEntrance(); const text = useEntrance(6);
  return <Frame chapter="MEET BROWSER CONTROL"><div className="film-intro-copy" style={{ opacity: text, transform: `translateY(${(1-text)*30}px)` }}><div className="film-eyebrow"><span /> YOUR NEW FAVORITE EXTENSION</div><h1>Your browser.<br />Now with a little<br /><em>superpower.</em></h1><p>Your ChatGPT/Codex account.<br />Right beside the page you’re on.</p><div className="film-tags"><span><Chrome size={22} /> Chrome extension</span><span><Code2 size={22} /> Open source</span></div></div><div className="film-intro-art" style={{ opacity: enter, transform: `translateY(${(1-enter)*55}px) rotate(${interpolate(frame,[0,150],[-4,-1],clamp)}deg)` }}><div className="film-orbit orbit-one" /><div className="film-orbit orbit-two" /><div className="film-big-icon"><Img src={staticFile('icon.png')} /></div><div className="film-floating floating-memory"><Brain size={31} /><span>A little memory.</span><Check size={20} /></div><div className="film-floating floating-skills"><WandSparkles size={30} /><span>A better workflow.</span><Sparkles size={22} /></div><div className="film-intro-dot d1" /><div className="film-intro-dot d2" /></div><Caption>Meet Browser Control. A little help, right where you are.</Caption></Frame>;
}

const scenes: Record<FeatureId, { number: string; eyebrow: string; heading: React.ReactNode; body: string; caption: string; note: string }> = {
  browse: { number:'01', eyebrow:'BROWSER ACTIONS', heading:<>Less clicking.<br /><em>More doing.</em></>, body:'Attach a page. Ask a question. Organize tabs and work through browser tasks in plain English.', caption:'Bring page context into the conversation. Keep every browser action in view.', note:'You choose when to attach page context.' },
  memory: { number:'02', eyebrow:'SAVED MEMORY', heading:<>Skip the<br /><em>reintroductions.</em></>, body:'Your useful preferences, ready for the next regular chat. Edit or forget them whenever you like.', caption:'Enable memory once. Keep useful preferences across regular chats.', note:'Opt-in memory. Stored on this computer.' },
  skills: { number:'03', eyebrow:'REUSABLE SKILLS', heading:<>Show it once.<br /><em>Use it again.</em></>, body:'Demonstrate your browser workflow. Review the recording. Save a skill for matching requests.', caption:'Describe. Demonstrate. Review. Save your way of doing things as a local skill.', note:'Recording starts only when you choose Start recording.' },
  permissions: { number:'04', eyebrow:'YOUR BROWSER. YOUR CALL.', heading:<>Find your flow.<br /><em>Set the rules.</em></>, body:'Ask every time, Auto review, or Full access. Choose your mode, follow the activity, and stop anytime.', caption:'Choose how actions are approved. Activity, action limits, and Stop stay available.', note:'Auto review uses extra Codex usage; site access is separate.' },
};
function FeatureScene({ feature, duration }: { feature: FeatureId; duration: number }) {
  const frame = useCurrentFrame(); const enter = useEntrance(); const ui = useEntrance(7); const data = scenes[feature];
  const progress = interpolate(frame, [20, Math.min(duration-35,150)], [0,1], clamp);
  const Icon = feature === 'browse' ? MousePointer2 : feature === 'memory' ? Brain : feature === 'skills' ? WandSparkles : ShieldCheck;
  return <Frame chapter={`${data.number} / 04 — ${data.eyebrow}`}><div className="film-feature-copy" style={{ opacity:enter,transform:`translateY(${(1-enter)*30}px)` }}><div className="film-chapter-icon"><Icon size={34} /></div><div className="film-eyebrow">{data.eyebrow}</div><h2>{data.heading}</h2><p>{data.body}</p><div className="film-feature-note"><ShieldCheck size={20} /><span>{data.note}</span></div></div><div className="film-browser-stage" style={{ opacity:ui,transform:`translateX(${(1-ui)*70}px) scale(${interpolate(frame,[0,duration],[.98,1.015],clamp)})` }}><div className="film-browser-label"><span /> A LITTLE LESS BUSYWORK.</div><div className="film-browser-scale"><DemoBrowser feature={feature} progress={progress} video iconSrc={staticFile('icon.png')} /></div><div className="film-illustration-label">Illustrative feature walkthrough</div></div><Caption>{data.caption}</Caption></Frame>;
}

function ActualExtension() {
  const frame=useCurrentFrame(); const enter=useEntrance();
  return <Frame chapter="INSIDE THE EXTENSION"><div className="film-proof-copy" style={{opacity:enter}}><div className="film-eyebrow">REAL EXTENSION. REAL SIDE PANEL.</div><h2>Stay focused.<br /><em>Keep control.</em></h2><p>Chat beside the page.<br />Keep the conversation in context.</p><span className="film-proof-note">Screenshot from the open-source project</span></div><div className="film-real-screen" style={{opacity:enter,transform:`translateY(${(1-enter)*25}px) scale(${interpolate(frame,[0,120],[1,1.025],clamp)})`}}><Img src={staticFile('assets/extension-screenshot.png')} /></div><Caption>One small side panel. A more capable everyday browser.</Caption></Frame>;
}
function Outro() {
  const frame=useCurrentFrame(); const enter=useEntrance();
  return <Frame chapter="MAKE IT YOURS"><div className="film-outro" style={{opacity:enter,transform:`translateY(${(1-enter)*25}px)`}}><div className="film-eyebrow">SAME BROWSER. NEW POSSIBILITIES.</div><h2>A little help.<br /><em>A lot more possible.</em></h2><div className="film-cta"><Chrome size={28} /> Add Browser Control to Chrome <ArrowRight size={25} /></div><div className="film-outro-steps"><span>01 <b>Add the extension</b></span><ArrowRight size={18} /><span>02 <b>Install the companion</b></span><ArrowRight size={18} /><span>03 <b>Sign in with ChatGPT</b></span></div><p>Find “Browser Control” in the Chrome Web Store</p><small>Requires Node.js 20+, a compatible Codex CLI, the free local companion,<br />and an eligible ChatGPT/Codex account. macOS · Windows · Linux.</small></div><div className="film-end-line" style={{width:interpolate(frame,[0,120],[0,100],clamp)+'%'}} /><Caption>Open source. No API key. Set up the local companion, sign in, and make it yours.</Caption></Frame>;
}

export function LaunchFilm() {
  const frame = useCurrentFrame();
  const fade = interpolate(frame,[0,10,1332,1349],[0,1,1,0],clamp);
  return <AbsoluteFill style={{background:'#101110',fontFamily:'DM Sans, sans-serif',color:'#eeefe6'}}><AbsoluteFill style={{opacity:fade}}><Sequence durationInFrames={150}><Intro /></Sequence><Sequence from={150} durationInFrames={300}><FeatureScene feature="browse" duration={300} /></Sequence><Sequence from={450} durationInFrames={240}><FeatureScene feature="memory" duration={240} /></Sequence><Sequence from={690} durationInFrames={240}><FeatureScene feature="skills" duration={240} /></Sequence><Sequence from={930} durationInFrames={180}><FeatureScene feature="permissions" duration={180} /></Sequence><Sequence from={1110} durationInFrames={120}><ActualExtension /></Sequence><Sequence from={1230} durationInFrames={120}><Outro /></Sequence><div className="film-progress"><div style={{width:`${frame/1349*100}%`,background:lime}} /></div></AbsoluteFill><Audio src={staticFile('assets/ambient.wav')} volume={.55} /></AbsoluteFill>;
}
