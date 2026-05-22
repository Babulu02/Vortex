import { Wifi, Database, Mic, GitBranch, Server } from 'lucide-react';

const ITEMS = [
  { label: 'GROQ', status: 'READY', color: '#22c55e', icon: Server },
  { label: 'FIREBASE', status: 'SYNC', color: '#22c55e', icon: Database },
  { label: 'VAPI', status: 'STANDBY', color: '#facc15', icon: Mic },
  { label: 'N8N', status: 'ACTIVE', color: '#22c55e', icon: GitBranch },
];

export default function BottomStatusBar() {
  return (
    <footer style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, height: 28, zIndex: 400,
      background: '#0a0c14',
      borderTop: '1px solid #1e2235',
      display: 'flex', alignItems: 'center', gap: 20, padding: '0 16px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10,
    }}>
      {ITEMS.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
          <span style={{ color: '#475569' }}>{item.label}:</span>
          <span style={{ color: item.color }}>{item.status}</span>
        </div>
      ))}

      <div style={{ marginLeft: 'auto', color: '#475569', fontSize: 10 }}>
        VORTEX AI v1.0.4 · CLUSTER-A-W2
      </div>
    </footer>
  );
}
