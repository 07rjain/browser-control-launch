import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Check, ChevronDown, Ellipsis, Globe2, LockKeyhole, Plus, Settings2, ShieldCheck, Sparkles, X } from 'lucide-react';
import { features, type FeatureId } from '../content';
import './demo.css';

export function DemoBrowser({ feature = 'browse', progress = 1, onNext, video = false, iconSrc = '/icon.png' }: { feature?: FeatureId; progress?: number; onNext?: () => void; video?: boolean; iconSrc?: string }) {
  const item = features.find(f => f.id === feature)!;
  const complete = progress > .65;
  return <div className={`demo-browser feature-${feature} ${video ? 'demo-video' : ''}`}>
    <div className="browser-tabs"><div className="traffic"><i /><i /><i /></div><div className="browser-tab"><Globe2 size={12} /> Weekend in Kyoto <X size={11} /></div><div className={`tab-group ${complete ? 'ready' : ''}`}><span /> Research <b>6</b></div><Plus size={13} /><span className="browser-dots"><Ellipsis size={18} /></span></div>
    <div className="browser-address"><ArrowLeft /><ArrowRight /><div><LockKeyhole size={11} /> wanderjournal.example/kyoto</div><img src={iconSrc} alt="" /></div>
    <div className="browser-body">
      <div className="travel-page"><div className="travel-nav"><span>wander<span className="serif-dot">.</span></span><span>PLACES &nbsp; JOURNAL &nbsp; ABOUT</span></div><div className="travel-hero"><div className="travel-label">THE SLOW TRAVEL SERIES — NO. 08</div><h3>A quieter<br />side of Kyoto.</h3><p>Small streets. Secret gardens.<br />A different kind of itinerary.</p><div className="landscape"><div className="sun" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="temple"><div /><i /><b /></div><div className="landscape-caption">35.0116° N &nbsp; 135.7681° E</div></div></div><div className="travel-bottom"><span>01 — Take the scenic route</span><ArrowDown size={16} /></div><div className="travel-lines"><i /><i /><i /></div></div>
      <div className="extension-panel"><div className="panel-header"><div><img src={iconSrc} alt="" /><strong>Browser Control</strong></div><div><Plus size={14} /><Ellipsis size={17} /></div></div><div className="panel-model"><span><span className="status-dot" /> Codex</span><span>Connected <ChevronDown size={10} /></span></div>
        <div className="chat-scroll"><div className="chat-date">A little help, right where you are.</div><div className="user-message">{item.prompt}</div><div className="attached-page"><Globe2 size={12} /><span>A quieter side of Kyoto</span><Check size={12} /></div><div className="assistant-message"><div className="assistant-symbol"><Sparkles size={14} /></div><strong>{complete ? item.response : 'Let’s take care of that.'}</strong><div className="activity-list">{item.activity.map((line, i) => <div key={line} className={progress >= .25 + i * .2 ? 'activity-done' : ''}><span><Check size={10} /></span>{line}</div>)}</div>
        {feature === 'browse' && complete && <div className="result-card"><span>YOUR KYOTO SHORTLIST</span><strong>Slow mornings, good discoveries.</strong><p>Walk the Philosopher’s Path early. Explore a quiet garden. Leave time for a little wandering.</p><div><span>6 tabs organized</span><Check size={12} /></div></div>}
        {feature === 'memory' && <div className="memory-preview"><span><Sparkles size={12} /> Saved memory</span><p>Prefers quiet places and vegetarian food.</p><small>You can edit or forget this anytime.</small></div>}
        {feature === 'skills' && <div className="skill-preview"><span className="record-dot" /> Weekly research <span className="skill-tag">3 steps</span><div>Describe → Demonstrate → Review</div></div>}
        {feature === 'permissions' && <div className="permission-preview">{['Ask every time', 'Auto review', 'Full access'].map((mode, i) => <div key={mode}><span className={i === 1 ? 'radio selected' : 'radio'} />{mode}{i === 1 && <span className="recommended">Selected</span>}</div>)}</div>}
        </div><p className="panel-note">{item.detail}</p></div>
        <div className="panel-compose"><div>What can I help you with?</div><div><Plus size={15} /><span><Globe2 size={12} /> Attach page</span><button aria-label="Explore the next feature" onClick={onNext} disabled={!onNext}><ArrowUp size={14} /></button></div></div><div className="panel-footer"><ShieldCheck size={10} /> You’re in control <span><Settings2 size={11} /></span></div>
      </div>
    </div>
  </div>;
}
