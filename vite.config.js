import { Zap, Radio, TrendingUp, Target, Clock } from 'lucide-react';
import LeadCard from './LeadCard';
import { useCountUp } from '../../hooks';

const COLUMNS = [
  { key: 'WATCHING',  label: 'WATCHING',  color: '#3b82f6', accent: '#3b82f614' },
  { key: 'WARM_LEAD', label: 'WARM',      color: '#f97316', accent: '#f9731614' },
  { key: 'HOT_LEAD',  label: 'HOT',       color: '#ef4444', accent: '#ef444414' },
  { key: 'CONVERTED', label: 'CONVERTED', color: '#22c55e', accent: '#22c55e14' },
];

const AGENT_COLORS = { 1: '#ef4444', 2: '#a855f7', 3: '#f97316', 4: '#22c55e', 7: '#3b82f6' };

function HeroMetric({ label, value, sub, color, icon: Icon }) {
  return (
    <div style={{
      background: '#1a1d2e',
      border: `1px solid #1e2235`,
      borderTop: `3px solid ${color}`,
      padding: '16px 20px',
      minHeight: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>{label}</span>
      </div>
      <div style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, color: '#ffffff', lineHeight: 1, whiteSpace: 'nowrap', fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div> 
      <div style={{ fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{sub}</div>
    </div>
  );
}

function FeedItem({ event, isNew }) {
  const agentColor = AGENT_COLORS[event.agent] || '#3b82f6';
  const timeAgo = (ts) => {
    const s = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    return `${Math.floor(s / 3600)}h`;
  };

  return (
    <div style={{
      padding: '12px 14px',
      borderLeft: `3px solid ${agentColor}`,
      background: '#0f1117',
      marginBottom: 8,
      borderRadius: '0 6px 6px 0',
      animation: isNew ? 'feedIn 300ms ease-out' : 'none',
      border: '1px solid #1e2235',
      borderLeftWidth: 3
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{
          fontSize: 10, color: agentColor,
          fontFamily: "'IBM Plex Mono', monospace", fontWeight: 800,
        }}>
          AGT-{String(event.agent).padStart(2,'0')} {event.agentName?.toUpperCase()}
        </span>
        <span style={{ fontSize: 10, color: '#475569', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{timeAgo(event.timestamp)}</span>
      </div>
      <div style={{ fontSize: 14, color: '#e2e8f0', lineHeight: 1.5, fontWeight: 600 }}>{event.action}</div>       
      {event.detail && <div style={{ fontSize: 11, color: '#64748b', fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>{event.detail}</div>}
    </div>
  );
}

export default function LivePipeline({ leads, events, metrics, newLeadId }) {
  const hotLeadCount = useCountUp(metrics.hotLeads, 800);

  const leadsByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.key] = leads.filter(l => l.status === col.key);
    return acc;
  }, {});

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, height: '100%' }}>
      {/* Hero metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, alignItems: 'stretch' }}>
        <HeroMetric
          label="Highest Intent Today"
          value={metrics.highestScore || 0}
          sub={metrics.highestScoreLead ? `${metrics.highestScoreLead.name} @ ${metrics.highestScoreLead.company}` : 'No leads captured yet'}
          color="#ef4444"
          icon={Target}
        />
        <HeroMetric
          label="Hot Leads"
          value={hotLeadCount}
          sub={hotLeadCount > 0 ? "Requiring immediate action" : "All signals processed"}
          color="#f97316"
          icon={Zap}
        />
        <HeroMetric
          label="Time to Outreach"
          value={metrics.totalLeads > 0 ? "<10s" : "0s"}
          sub="Signal to email latency"
          color="#3b82f6"
          icon={Clock}
        />
        <HeroMetric
          label="Conversion Rate"
          value={`${metrics.conversionRate}%`}
          sub={metrics.totalLeads > 0 ? "+3.2% vs last week" : "Waiting for conversions"}
          color="#22c55e"
          icon={TrendingUp}
        />
      </div>

      {/* Pipeline + Feed */}
      <div style={{ display: 'flex', gap: 20, flex: 1, overflow: 'hidden' }}>
        {/* Kanban Columns */}
        <div style={{ flex: 1, display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
          {COLUMNS.map(col => {
            const colLeads = leadsByStatus[col.key] || [];
            return (
              <div key={col.key} style={{ width: 300, minWidth: 300, display: 'flex', flexDirection: 'column' }}>
                {/* Column header */}
                <div style={{
                  padding: '12px 16px',
                  background: col.accent,
                  border: `1px solid ${col.color}33`,
                  borderBottom: `2px solid ${col.color}`,
                  marginBottom: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  flexShrink: 0,
                  borderRadius: 8
                }}>
                  <span style={{ fontSize: 13, color: col.color, fontWeight: 800, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.1em' }}>
                    {col.label}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 800, color: col.color,
                    fontFamily: "'IBM Plex Mono', monospace",
                    background: `${col.color}22`, border: `1px solid ${col.color}44`,
                    padding: '2px 8px', borderRadius: 4
                  }}>
                    {colLeads.length}
                  </span>
                </div>

                {/* Lead cards scrollable area */}
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: 6 }}>
                  {colLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} isNew={lead.id === newLeadId} />
                  ))}
                  {colLeads.length === 0 && (
                    <div style={{
                      fontSize: 12, color: '#475569', textAlign: 'center',
                      padding: '40px 0',
                      border: '1px dashed #1e2235',
                      fontFamily: "'IBM Plex Mono', monospace",
                      borderRadius: 10,
                      fontWeight: 600
                    }}>
                      NO LEADS IN QUEUE
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Feed */}
        <div style={{ width: 360, minWidth: 360, flexShrink: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            background: '#1a1d2e',
            border: '1px solid #1e2235',
            borderRadius: 12,
            display: 'flex', flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
          }}>
            {/* Feed header */}
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid #1e2235',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#1a1d2e',
              flexShrink: 0
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Radio size={16} color="#facc15" />
                <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.05em' }}>LIVE EVENTS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>LIVE</span>
              </div>
            </div>

            {/* Feed items scrollable */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {events.map((ev, i) => <FeedItem key={ev.id} event={ev} isNew={i === 0} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
