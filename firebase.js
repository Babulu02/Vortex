import { Zap, Clock, Users, Flame, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import { useClock, useCountUp } from '../../hooks';

const METRIC_CONFIG = [
  { key: 'totalLeads',     label: 'Leads',     icon: Users,      color: '#facc15' },
  { key: 'hotLeads',       label: 'Hot',       icon: Flame,      color: '#ef4444' },
  { key: 'emailsSent',     label: 'Emails',    icon: Mail,       color: '#3b82f6' },
  { key: 'callsPlaced',    label: 'Calls',     icon: Phone,      color: '#a855f7' },
  { key: 'demosBooked',    label: 'Demos',     icon: Calendar,   color: '#22c55e' },
  { key: 'conversionRate', label: 'Conv.',     icon: TrendingUp, color: '#06b6d4', suffix: '%' },
];

function MiniMetric({ label, value, icon: Icon, color, suffix = '', index }) {
  const numeric = parseFloat(value);
  const animated = useCountUp(isNaN(numeric) ? 0 : numeric, 900 + index * 80);
  const display = isNaN(numeric) ? value : `${animated}${suffix}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderLeft: '1px solid #1e2235', height: '70%' }}>
      <Icon size={14} color={color} />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1 }}>{display}</div>
        <div style={{ fontSize: 9, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

export default function TopNav({ metrics }) {
  const time = useClock();

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 48, zIndex: 300,
      background: '#0C0C0C',
      borderBottom: '1px solid #1e2235',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px'
    }}>
      {/* Logo block */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <Zap size={20} color="#facc15" fill="#facc15" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.5px', lineHeight: 1 }}>VORTEX</div>
          <div style={{ fontSize: 9, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.15em', fontFamily: "'IBM Plex Mono', monospace" }}>AI SALES OPS</div>
        </div>
      </div>

      {/* Metrics Center */}
      <div style={{ display: 'flex', alignItems: 'center', flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
        {METRIC_CONFIG.map((m, i) => (
          <MiniMetric
            key={m.key}
            label={m.label}
            value={metrics[m.key]}
            icon={m.icon}
            color={m.color}
            index={i}
            suffix={m.suffix}
          />
        ))}
      </div>

      {/* Right section */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: '#22c55e', fontWeight: 700 }}>ACTIVE</span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12, color: '#64748b', whiteSpace: 'nowrap', borderLeft: '1px solid #1e2235', paddingLeft: 16
        }}>
          <Clock size={14} />
          {time}
        </div>
      </div>
    </header>
  );
}
