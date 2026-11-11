import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowRight, ArrowUpRight, Brain, Check, ChevronDown, Chrome, Download, Github, Menu, MousePointer2, Play, ShieldCheck, WandSparkles, X } from 'lucide-react';
import { ProductPreview } from './components/ProductPreview';
import { RoutingArt } from './components/RoutingArt';
import { features, GITHUB_URL, PRIVACY_URL, STORE_URL, SUPPORT_URL } from './content';
import videoMetadata from './video/metadata.json';

const featureTabs = [
  { label: 'Browse', icon: MousePointer2, title: 'A hand with the page you’re on.', description: 'Attach a page for context. Ask questions, organize tabs, and work through browser tasks in plain English.' },
  { label: 'Memory', icon: Brain, title: 'A little less explaining, every time.', description: 'Opt in to save useful preferences across regular chats. View, edit, or forget them in Settings.' },
  { label: 'Skills', icon: WandSparkles, title: 'Teach it your way of doing things.', description: 'Record a workflow, review the steps, and save a local skill for similar requests later.' },
  { label: 'Control', icon: ShieldCheck, title: 'Your browser. Your rules.', description: 'Choose Ask every time, Auto review, or Full access. Follow the activity and stop any task.' },
];

const faqs = [
  { question: 'What do I need to get started?', answer: 'A current stable version of Chrome or Brave, Node.js 20+, a compatible Codex CLI, the free local Browser Control companion, and an eligible ChatGPT/Codex account. The setup guide covers macOS, Windows, and Linux. Snap and Flatpak browsers are not supported.' },
  { question: 'How do permissions and Auto review work?', answer: 'Ask every time uses exact-site access and confirmations for supported consequential actions. Auto review adds a separate model to review eligible routine actions; risky or unclear actions still ask you. Reviews use extra Codex usage and do not grant site access. Full access requires an explicit site-access grant and can perform supported consequential actions after your request without another Browser Control confirmation. Every mode keeps activity, action limits, and Stop available.' },
  { question: 'Where do my data, memories, and skills go?', answer: 'Saved memories and recorded skills are stored locally with the companion. Memory is opt-in, and selected memories are sent to your Codex model when used. Page context is shared only when you attach it. Incognito chats use neither saved memory nor local conversation history; provider and attachment retention still apply. The extension has no publisher analytics or advertising. This website uses Vercel Web Analytics to measure visits.' },
];

function InstallLink() {
  return <a className="button primary" href={STORE_URL} target="_blank" rel="noreferrer"><Chrome size={18} /> Add to Chrome <ArrowUpRight size={15} /></a>;
}

function VideoDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    element?.addEventListener('close', onClose);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element?.removeEventListener('close', onClose);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);
  return <dialog ref={dialog} className="video-dialog" aria-label="Browser Control demo video" onClick={event => { if (event.target === dialog.current) onClose(); }}>
    <div className="video-dialog-heading"><span>Browser Control in {videoMetadata.durationSeconds} seconds</span><button onClick={onClose} aria-label="Close video"><X size={21} /></button></div>
    <video src="/browser-control-demo.mp4" poster="/assets/video-poster.jpg" controls autoPlay playsInline preload="metadata"><track kind="captions" src="/demo-captions.vtt" srcLang="en" label="English" /></video>
    <div className="video-dialog-footer"><span>An animated walkthrough of the extension’s features.</span><a href="/browser-control-demo.mp4" download><Download size={14} /> Download</a></div>
  </dialog>;
}

export function App() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const videoTrigger = useRef<HTMLButtonElement>(null);
  const closeVideo = () => { setVideoOpen(false); videoTrigger.current?.focus(); };

  function changeTab(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % features.length;
    else if (event.key === 'ArrowLeft') next = (index + features.length - 1) % features.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = features.length - 1;
    else return;
    event.preventDefault();
    setActiveFeature(next);
    document.getElementById(`tab-${features[next].id}`)?.focus();
  }

  return <div className="launch-page">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header page-width">
      <a className="brand" href="#" aria-label="Browser Control home"><img src="/icon.png" alt="" /> Browser Control</a>
      <nav id="main-navigation" className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation">
        <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
        <a href="#how-it-works" onClick={() => setMenuOpen(false)}>Setup</a>
        <a className="github-link" href={GITHUB_URL} target="_blank" rel="noreferrer"><Github size={17} /> GitHub <ArrowUpRight size={13} /></a>
      </nav>
      <button className="mobile-menu" aria-controls="main-navigation" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <main id="main">
      <div className="hero-stage">
        <RoutingArt signal={activeFeature} />
        <section className="hero page-width" aria-labelledby="hero-title">
          <a className="product-label" href={GITHUB_URL} target="_blank" rel="noreferrer"><span /> An open-source Chrome extension <ArrowUpRight size={12} /></a>
          <h1 id="hero-title">ChatGPT, right beside<br className="hero-break" /> <span>the page you’re on.</span></h1>
          <p className="hero-description">Ask about a page. Remember what matters.<br className="hero-break" /> Turn everyday browser tasks into a conversation.</p>
          <div className="hero-actions"><InstallLink /><button ref={videoTrigger} className="button secondary" onClick={() => setVideoOpen(true)}><Play size={16} /> Watch the demo <span>{videoMetadata.durationSeconds} sec</span></button></div>
          <p className="hero-requirements">Uses your ChatGPT/Codex account. <a href="#how-it-works">Free local companion required <ArrowRight size={12} /></a></p>
        </section>

        <section className="feature-explorer page-width" id="features" aria-label="Explore Browser Control features">
          <div className="feature-tabs" role="tablist" aria-label="Explore features">
            {featureTabs.map((tab, index) => { const Icon = tab.icon; const feature = features[index]; return <button key={feature.id} type="button" role="tab" id={`tab-${feature.id}`} aria-label={feature.label} aria-selected={activeFeature === index} aria-controls="feature-panel" tabIndex={activeFeature === index ? 0 : -1} onClick={() => setActiveFeature(index)} onKeyDown={event => changeTab(event, index)}><Icon size={17} /><span>{tab.label}</span></button>; })}
          </div>
          <div className="preview-surround"><div className="feature-panel" id="feature-panel" role="tabpanel" aria-labelledby={`tab-${features[activeFeature].id}`} tabIndex={0}>
            <ProductPreview feature={features[activeFeature].id} />
            <div className="feature-description"><div><h2>{featureTabs[activeFeature].title}</h2><p>{featureTabs[activeFeature].description}</p></div><span className="preview-label">Illustrative preview</span></div>
          </div></div>
          <div className="compatibility"><span><Check size={14} /> Chrome & Brave</span><span><Check size={14} /> macOS, Windows & Linux</span><span><Check size={14} /> No API key</span></div>
        </section>
      </div>

      <section className="setup-section page-width" id="how-it-works" aria-labelledby="setup-title">
        <div className="section-heading"><div><span className="section-label">Getting started</span><h2 id="setup-title">Three steps. Then you’re in.</h2></div><a className="inline-link" href={SUPPORT_URL} target="_blank" rel="noreferrer">Full setup guide <ArrowUpRight size={15} /></a></div>
        <ol className="setup-steps">
          <li><span className="step-number">1</span><div><h3>Add the extension</h3><p>Install Browser Control from the Chrome Web Store.</p><a href={STORE_URL} target="_blank" rel="noreferrer">Add to Chrome <ArrowUpRight size={13} /></a></div></li>
          <li><span className="step-number">2</span><div><h3>Install the companion</h3><p>Connect Chrome to Codex locally. The guide covers the prerequisites.</p><a href={SUPPORT_URL} target="_blank" rel="noreferrer">Installation guide <ArrowUpRight size={13} /></a></div></li>
          <li><span className="step-number">3</span><div><h3>Sign in and start chatting</h3><p>Open the side panel and sign in with your eligible ChatGPT/Codex account.</p><span className="step-note">You’re ready to go <Check size={13} /></span></div></li>
        </ol>
      </section>

      <section className="faq-section page-width" aria-labelledby="faq-title">
        <div className="faq-heading"><h2 id="faq-title">A few useful details.</h2><a className="inline-link" href={SUPPORT_URL} target="_blank" rel="noreferrer">Need a hand? <ArrowUpRight size={14} /></a></div>
        <div className="faq-list">{faqs.map(({ question, answer }) => <details key={question}><summary>{question}<ChevronDown size={17} /></summary><p>{answer}</p></details>)}</div>
      </section>
    </main>

    <footer className="site-footer page-width"><div><a className="footer-brand" href="#">Browser Control</a><p>Independent and open source. Not affiliated with OpenAI.</p></div><div className="footer-links"><a href={GITHUB_URL} target="_blank" rel="noreferrer">GitHub</a><a href={SUPPORT_URL} target="_blank" rel="noreferrer">Support</a><a href={PRIVACY_URL} target="_blank" rel="noreferrer">Privacy</a></div></footer>
    {videoOpen && <VideoDialog onClose={closeVideo} />}
  </div>;
}
