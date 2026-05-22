import { Activity, Zap, BarChart2, Settings as SettingsIcon } from 'lucide-react';

const TABS = [
  { label: 'Live Pipeline', icon: Activity },
  { label: 'Agent Activity', icon: Zap },
  { label: 'Product Intel', icon: BarChart2 },
  { label: 'Settings', icon: SettingsIcon },
];

const STATUS_ICON = {
  ACTIVE: { color: '#22c55e' },
  PROCESSING: { color: '#facc15', spin: true },
  STANDBY: { color: '#475569' },
};

function AgentRow({ agent }) {
  const cfg = STATUS_ICON[agent.status] || STATUS_ICON.STANDBY;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px',
      whiteSpace: 'nowrap', overflow: 'hidden'
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0,
        animation: cfg.spin ? 'pulse 1s infinite' : 'none'
      }} />
      <span style={{ fontSize: 13, color: agent.status === 'STANDBY' ? '#475569' : '#cbd5e1', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
        {agent.name}
      </span>
      <span style={{ fontSize: 10, color: '#475569', fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>
        {agent.lastAction}
      </span>
    </div>
  );
}

export default function LeftSidebar({ activeTab, setActiveTab, agents }) {
  return (
    <aside style={{
      width: 200, minWidth: 200, flexShrink: 0,
      background: '#0a0c14',
      borderRight: '1px solid #1e2235',
      display: 'flex', flexDirection: 'column',
      height: '100%',
      overflowY: 'auto'
    }}>
      <div style={{ marginTop: 48 }}>
        <div style={{
          padding: '20px 14px 10px',
          fontSize: 11, fontWeight: 700, color: '#475569',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          // NAVIGATION
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '0 8px' }}>
          {TABS.map(({ label, icon: Icon }) => {
            const active = activeTab === label;
            return (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: active ? '#facc1514' : 'transparent',
                  border: 'none',
                  color: active ? '#facc15' : '#94a3b8',
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  textAlign: 'left',
                  borderLeft: active ? '4px solid #facc15' : '4px solid transparent'
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </div>

        <div style={{
          padding: '32px 14px 10px',
          fontSize: 11, fontWeight: 700, color: '#475569',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          // AGENTS
        </div>

        <div style={{ paddingBottom: 30 }}>
          {agents.map(agent => <AgentRow key={agent.id} agent={agent} />)}
        </div>
      </div>
    </aside>
  );
}
