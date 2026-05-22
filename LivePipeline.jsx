import { useState, useEffect, useRef } from 'react';
import { Terminal, Send, Edit3, ChevronDown, Activity, Cpu, Mic, Trash2, Globe, Network, Check } from 'lucide-react';
import { DEBATE_LOG_RAHUL, SEED_LEADS } from '../../config/seedData';

const WORKFLOW_AGENTS = [
  { id: 1, name: 'Behavioral Scout', icon: Activity, color: '#ef4444', trigger: 'triggered', nodes: ['Normalize Atom', 'Write to Firestore', 'Webhook Response'], actionsToday: 142, lastAction: '2m ago' },
  { id: 2, name: 'Intent Architect', icon: Cpu, color: '#a855f7', trigger: 'triggered', nodes: ['Groq Intent', 'Parse Intent', 'Webhook Response'], actionsToday: 89, lastAction: '1m ago' },
  { id: 3, name: 'Persona Scriptwriter', icon: Edit3, color: '#f97316', trigger: 'triggered', nodes: ['Groq Email', 'Parse Email', 'Webhook Response'], actionsToday: 34, lastAction: '14m ago' },
  { id: 4, name: 'VAPI Voice Caller', icon: Mic, color: '#3b82f6', trigger: 'scheduled', nodes: ['Fetch Leads', 'Filter Eligible', 'Fire VAPI Call'], actionsToday: 12, lastAction: '1h ago' },
  { id: 5, name: 'Data Custodian', icon: Trash2, color: '#facc15', trigger: 'scheduled', nodes: ['Fetch Leads', 'Filter Expired', 'Delete Lead'], actionsToday: 4, lastAction: '6h ago' },
  { id: 6, name: 'Social Intel Scraper', icon: Globe, color: '#22c55e', trigger: 'complete', nodes: ['Build Jina URLs', 'Jina Fetch', 'Groq Sentiment'], actionsToday: 6, lastAction: '4h ago' },
  { id: 7, name: 'Executive Router', icon: Network, color: '#3b82f6', trigger: 'triggered', nodes: ['Decision Logic', 'Update Lead', 'Slack Alert'], actionsToday: 52, lastAction: '3m ago' },
];

function WorkflowCard({ agent }) {
  const Icon = agent.icon;
  const borderColor = agent.trigger === 'triggered' ? '#ef4444' : agent.trigger === 'scheduled' ? '#3b82f6' : '#22c55e';

  return (
    <div style={{
      minWidth: 320, flexShrink: 0, background: '#1a1d2e', borderRadius: 12, padding: 16,
      display: 'flex', flexDirection: 'column', gap: 10, borderTop: `3px solid ${borderColor}`,
      borderLeft: '1px solid #1e2235', borderRight: '1px solid #1e2235', borderBottom: '1px solid #1e2235'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `${agent.color}18`, border: `1px solid ${agent.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8 }}>
            <Icon size={16} color={agent.color} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#ffffff' }}>{agent.name}</div>
        </div>
        <div style={{ fontSize: 10, color: '#475569', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 700 }}>AGT-{String(agent.id).padStart(2,'0')}</div>
      </div>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {agent.nodes.map(node => (
          <span key={node} style={{
            display: 'inline-flex', padding: '4px 12px', borderRadius: 6, fontSize: 11, fontWeight: 700,
            whiteSpace: 'nowrap', background: '#0f1117', color: '#94a3b8', border: '1px solid #1e2235'
          }}>{node}</span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#64748b', fontWeight: 600 }}>
        <span>{agent.actionsToday} actions today</span>
        <span>{agent.lastAction}</span>
      </div>
    </div>
  );
}

function DebateTerminal({ leadName }) {
  const bottomRef = useRef(null);
  const [displayed, setDisplayed] = useState([]);

  useEffect(() => {
    setDisplayed(DEBATE_LOG_RAHUL.flatMap(block => [
      { isHeader: true, agent: block.agentName, time: block.time, agentId: block.agent },
      ...block.lines
    ]));
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [displayed]);

  const agentDotColors = { 1: '#facc15', 2: '#3b82f6', 3: '#facc15', 4: '#3b82f6', 7: '#22c55e' };

  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: '#0f1117', borderRadius: 12, border: '1px solid #1e2235', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', flexShrink: 0, borderBottom: '1px solid #1e2235', background: '#1a1d2e' }}>
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#94a3b8', textTransform: 'uppercase' }}>
          AGENT DEBATE LOG — {leadName?.toUpperCase()} — FINTRACK INC.
        </span>
        <button style={{ marginLeft: 'auto', background: '#334155', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
          ADD PIPELINE
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {displayed.map((line, i) => {
          if (line.isHeader) {
            const dotColor = agentDotColors[line.agentId] || '#3b82f6';
            return (
              <div key={i} style={{ borderTop: i > 0 ? '1px solid #1e2235' : 'none', paddingTop: i > 0 ? 16 : 0 }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 6, fontWeight: 600 }}>{line.time}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#facc15', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }} />
                  ACT-{String(line.agentId).padStart(2,'0')} — {line.agent.toUpperCase()}
                </div>
              </div>
            );
          }
          if (line.text.includes('Slack alert fired') || line.text.includes('Pipeline complete')) {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#86efac', fontWeight: 600 }}>
                <Check size={16} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>{line.text}</span>
              </div>
            );
          }
          const text = line.text;
          const highlightStyle = { color: '#facc15', fontWeight: 700 };
          
          return (
            <div key={i} style={{ fontSize: 14, color: '#cbd5e1', lineHeight: 1.6, paddingLeft: 16 }}>
              {text.split(/(\d+min|api_limit_hit|team of \d+|[\d.]+s)/).map((part, j) => 
                /(\d+min|api_limit_hit|team of \d+|[\d.]+s)/.test(part) ? <span key={j} style={highlightStyle}>{part}</span> : part
              )}
            </div>
          );
        })}
        <div style={{ fontSize: 12, color: '#475569', marginTop: 12, paddingTop: 12, borderTop: '1px solid #1e2235', fontWeight: 600 }}>
          Pipeline complete · Total latency: 4.2s
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function EmailPreview({ lead }) {
  const { subject, body, sales_contact_note } = lead.email_draft;

  return (
    <div style={{ width: 460, minWidth: 460, flexShrink: 0, display: 'flex', flexDirection: 'column', background: '#0f1117', borderRadius: 12, border: '1px solid #1e2235', overflow: 'hidden' }}>
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', padding: '12px 20px', borderBottom: '1px solid #1e2235', background: '#1a1d2e', flexShrink: 0, textTransform: 'uppercase' }}>
        // DRAFTED EMAIL
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', borderLeft: '4px solid #facc15', paddingLeft: 16, lineHeight: 1.4 }}>
          {subject}
        </div>

        <div style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
          {body?.replace('[REP_NAME]', 'Sarah').replace('[CALENDAR_LINK]', 'cal.vortex.ai/sarah')}
        </div>

        <div style={{ fontSize: 15, color: '#94a3b8', marginTop: 8, fontWeight: 500 }}>Best,<br />Sarah</div>

        {sales_contact_note && (
          <div style={{ background: '#1a1d2e', border: '1px solid #2d3148', borderRadius: 10, padding: 16, marginTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', color: '#64748b', marginBottom: 8, textTransform: 'uppercase' }}>// SALES NOTE</div>
            <div style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, fontWeight: 500 }}>{sales_contact_note}</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid #1e2235', flexShrink: 0, background: '#1a1d2e' }}>
        <button style={{ flex: 1, padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 600, border: '1px solid #334155', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>
          Edit Draft
        </button>
        <button style={{ flex: 2, padding: '12px', borderRadius: 10, fontSize: 15, fontWeight: 700, background: '#facc15', color: '#0f1117', border: 'none', cursor: 'pointer' }}>
          Send Now
        </button>
      </div>
    </div>
  );
}

export default function AgentActivity({ agents }) {
  const [selectedLead, setSelectedLead] = useState('usr_4821');
  const lead = SEED_LEADS.find(l => l.id === selectedLead);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflow: 'hidden' }}>
      {/* Top Workflow Row */}
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12, flexShrink: 0 }}>
        {WORKFLOW_AGENTS.map(wa => <WorkflowCard key={wa.id} agent={wa} />)}
      </div>

      {/* Lead Selector */}
      <div style={{ 
        width: '100%', padding: '14px 20px', background: '#1a1d2e', borderRadius: 10, 
        border: '1px solid #1e2235', borderLeft: '4px solid #facc15', flexShrink: 0,
        display: 'flex', alignItems: 'center', position: 'relative'
      }}>
        <select
          value={selectedLead}
          onChange={e => setSelectedLead(e.target.value)}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            color: '#ffffff', fontSize: 15, fontWeight: 600,
            cursor: 'pointer', outline: 'none', appearance: 'none',
          }}
        >
          {SEED_LEADS.map(l => (
            <option key={l.id} value={l.id} style={{ background: '#1a1d2e' }}>
              {l.name} — {l.company} (Score: {l.intent_score})
            </option>
          ))}
        </select>
        <ChevronDown size={18} color="#64748b" style={{ marginLeft: 'auto', pointerEvents: 'none' }} />
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', gap: 16, flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <DebateTerminal key={selectedLead} leadName={lead?.name || 'Rahul Sharma'} />
        {lead?.email_draft && <EmailPreview lead={lead} />}
      </div>
    </div>
  );
}
