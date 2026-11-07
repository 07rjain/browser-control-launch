import { useState } from 'react';
import { ArrowUp, BookOpen, Brain, Check, ChevronDown, Globe2, LockKeyhole, MoreHorizontal, Plus, ShieldCheck, WandSparkles } from 'lucide-react';
import { features, type FeatureId } from '../content';

const permissionModes = [
  { name: 'Ask every time', description: 'Confirm supported actions as you go.' },
  { name: 'Auto review', description: 'A reviewer checks eligible routine actions.' },
  { name: 'Full access', description: 'Act on your requests after you grant site access.' },
];

export function ProductPreview({ feature, iconSrc = '/icon.png', progress = 1, animate = false }: { feature: FeatureId; iconSrc?: string; progress?: number; animate?: boolean }) {
  const item = features.find(value => value.id === feature)!;
  const [permission, setPermission] = useState('Auto review');
  const reveal = (threshold: number) => ({ opacity: Math.min(1, Math.max(0, (progress - threshold) / .12)), transform: `translateY(${Math.max(0, 1 - (progress - threshold) / .12) * 9}px)` });
  const prompt = animate ? item.prompt.slice(0, Math.floor(Math.min(1, progress / .33) * item.prompt.length)) : item.prompt;
  const selectedPermission = animate ? progress < .5 ? 'Ask every time' : 'Auto review' : permission;
  return <div className="product-preview">
    <div className="window-bar"><div className="window-dots" aria-hidden="true"><i /><i /><i /></div><span className="window-address"><LockKeyhole size={11} /> Illustrative product preview</span><span className="window-extension"><img src={iconSrc} alt="" /></span></div>
    <div className="workspace">
      <div className="example-page" aria-hidden="true">
        <div className="example-header"><BookOpen size={18} /><span>Fieldnotes</span><span>Stories & places</span></div>
        <div className="article-category">THE TRAVEL EDIT</div><h3>A slower weekend<br />in Kyoto.</h3><p>A few quiet corners, a good meal, and<br />a little room to wander.</p>
        <div className="article-illustration"><div className="article-sun" /><div className="article-hill hill-one" /><div className="article-hill hill-two" /><div className="article-path" /><span>35.0116° N, 135.7681° E</span></div>
        <div className="article-bottom"><span>Make space for a different pace.</span><span>5 min read</span></div>
      </div>
      <div className="assistant-preview">
        <div className="assistant-header"><img src={iconSrc} alt="" /><span>Browser Control</span><span className="assistant-header-icons" aria-hidden="true"><Plus size={17} /><MoreHorizontal size={18} /></span></div>
        <div className="assistant-model"><span><i /> Codex</span><span>Connected <ChevronDown size={11} /></span></div>
        <div className="conversation">
          <div className="example-prompt">{prompt}{animate && progress < .33 && <span className="typing-caret">|</span>}</div>
          {feature === 'browse' && <div className="page-attachment" style={reveal(.24)}><Globe2 size={12} /> A slower weekend in Kyoto <Check size={12} /></div>}
          <div className="example-answer" style={reveal(.34)}><span className="answer-marker">B</span><div><p className="answer-text">{item.response}</p>
            {feature === 'browse' && <><ul className="task-results">{item.activity.map((activity, index) => <li key={activity} style={reveal(.4 + index * .1)}><Check size={13} />{activity}</li>)}</ul><div className="answer-result" style={reveal(.7)}><strong>Slow mornings, good discoveries.</strong><p>A quiet garden, the Philosopher’s Path, and a few places worth saving.</p><span><Check size={12} /> 6 research tabs organized</span></div></>}
            {feature === 'memory' && <div className="saved-memory" style={reveal(.56)}><span><Brain size={15} /> Saved memory</span><p>Prefers quiet places and vegetarian food.</p><small>Stored on this computer. Edit or forget anytime.</small></div>}
            {feature === 'skills' && <div className="saved-skill" style={reveal(.4)}><span><WandSparkles size={15} /> Weekly research</span><ol>{['Describe the workflow', 'Record and review the steps', 'Save the local skill'].map((step, index) => <li key={step} style={reveal(.48 + index * .13)}><Check size={12} />{step}</li>)}</ol><small>Recording starts when you select Start recording.</small></div>}
            {feature === 'permissions' && <div className="permission-options" role="group" aria-label="Try a permission mode in the example">{permissionModes.map(mode => <button key={mode.name} type="button" aria-pressed={selectedPermission === mode.name} onClick={() => setPermission(mode.name)}><span className={`mode-radio ${selectedPermission === mode.name ? 'is-selected' : ''}`}>{selectedPermission === mode.name && <i />}</span><span><strong>{mode.name}</strong><small>{mode.description}</small></span>{selectedPermission === mode.name && <Check size={14} />}</button>)}</div>}
          </div></div>
        </div>
        <div className="example-composer" aria-hidden="true"><span>What can I help you with?</span><div><Plus size={15} /><span>Attach page</span><span className="example-send"><ArrowUp size={14} /></span></div></div>
        <div className="assistant-preview-note"><ShieldCheck size={11} /><span>{feature === 'permissions' ? 'Example only. Your extension settings stay unchanged.' : feature === 'memory' ? 'Saved memory is opt-in.' : feature === 'skills' ? 'Skills stay on this computer.' : 'You choose when to share page context.'}</span></div>
      </div>
    </div>
  </div>;
}
