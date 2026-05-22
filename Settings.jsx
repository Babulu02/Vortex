import { useState, useEffect } from 'react';
import { AlertCircle, ThumbsUp, Zap, Bot, Radio, TrendingUp, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const FREQ_COLORS = { HIGH: '#ef4444', MEDIUM: '#f97316', LOW: '#3b82f6' };

const COMPETITORS = [
  { name: 'Apollo.io', mentions: 42, sentiment: 65, complaint: 'Data accuracy in EMEA is lagging.' },
  { name: 'Clay', mentions: 38, sentiment: 82, complaint: 'Pricing is complex for small teams.' },
  { name: 'Outreach', mentions: 29, sentiment: 45, complaint: 'Platform feels too bloated now.' },
  { name: 'Salesloft', mentions: 24, sentiment: 52, complaint: 'Sync issues with Salesforce.' },
  { name: 'HubSpot', mentions: 18, sentiment: 78, complaint: 'Email sequencing is too basic.' },
  { name: 'Instantly', mentions: 31, sentiment: 71, complaint: 'Analytics dashboard is limited.' },
];

const TRENDS = [
  { keyword: 'AI SDR fatigue', volume: '↑ 34%', sources: ['Reddit', 'LinkedIn'], relevance: 'HIGH' },
  { keyword: 'Personalization at scale', volume: '↑ 22%', sources: ['YouTube'], relevance: 'MEDIUM' },
  { keyword: 'Data privacy in outreach', volume: '↑ 41%', sources: ['Reddit'], relevance: 'HIGH' },
  { keyword: 'Cold email deliverability', volume: '↑ 18%', sources: ['LinkedIn'], relevance: 'MEDIUM' },
  { keyword: 'Sales automation ROI', volume: '↑ 29%', sources: ['YouTube', 'Reddit'], relevance: 'HIGH' },
  { keyword: 'Intent data accuracy', volume: '↑ 15%', sources: ['LinkedIn'], relevance: 'MEDIUM' },
];

function ComplaintCard({ item }) {
  return (
    <div style={{ background: '#0f1117', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #1e2235' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{item.issue}</span>
        <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 4, background: '#7f1d1d', color: '#fca5a5' }}>HIGH</span>
      </div>
      <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', lineHeight: 1.6 }}>"{item.example_quote}"</div>
    </div>
  );
}

function PraiseCard({ item }) {
  return (
    <div style={{ background: '#0f1117', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #1e2235' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{item.point}</span>
        <span style={{ fontSize: 11, fontWeight: 800, padding: '2px 10px', borderRadius: 4, background: '#064e3b', color: '#6ee7b7' }}>TOP</span>
      </div>
      <div style={{ fontSize: 12, color: '#64748b', fontStyle: 'italic', lineHeight: 1.6 }}>"{item.example_quote || 'Users love the speed and UI.'}"</div>
    </div>
  );
}

function FeatureItem({ item, maxCount }) {
  const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
  return (
    <div style={{ background: '#0f1117', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6, border: '1px solid #1e2235' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{item.feature}</span>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{item.count}</span>
      </div>
      <div style={{ height: 4, background: '#2d3148', borderRadius: 3, marginTop: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: '#7c6ff7', borderRadius: 3 }} />
      </div>
    </div>
  );
}

export default function ProductIntelligence({ intel }) {
  const score = intel.sentiment_score || 73;
  const pieData = [{ value: score }, { value: 100 - score }];
  const maxCount = Math.max(...(intel.feature_requests || []).map(f => f.count || 0), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%', overflowY: 'auto', paddingRight: 6 }}>
      {/* Sentiment Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32, background: '#1a1d2e', borderRadius: 14, padding: '24px 32px', flexShrink: 0 }}>
        <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} innerRadius={42} outerRadius={55} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                <Cell fill="#3b82f6" />
                <Cell fill="#2d3148" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>{score}</div>
            <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#94a3b8', marginTop: 4, fontWeight: 700 }}>NEUTRAL</div>
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#ffffff' }}>Overall Market Sentiment</div>
          <div style={{ fontSize: 14, color: '#64748b', marginTop: 6, fontWeight: 500 }}>
            Based on {(intel.sources?.reddit || 4) + (intel.sources?.youtube || 1)} posts across Reddit & YouTube
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <span style={{ padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#2d3148', color: '#cbd5e1' }}>Reddit · {intel.sources?.reddit || 4}</span>
            <span style={{ padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, background: '#2d3148', color: '#cbd5e1' }}>YouTube · {intel.sources?.youtube || 1}</span>
          </div>
        </div>

        <div style={{ fontSize: 12, color: '#475569', alignSelf: 'flex-start', fontWeight: 600 }}>Updated: 2h ago</div>
      </div>

      {/* 3-Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, flexShrink: 0 }}>
        <div style={{ background: '#1a1d2e', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#ef4444', textTransform: 'uppercase' }}>
            <AlertCircle size={16} /> TOP COMPLAINTS
          </div>
          {(intel.top_complaints || []).map((c, i) => <ComplaintCard key={i} item={c} />)}
        </div>

        <div style={{ background: '#1a1d2e', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#22c55e', textTransform: 'uppercase' }}>
            <ThumbsUp size={16} /> TOP PRAISE
          </div>
          {(intel.top_praise || []).map((p, i) => <PraiseCard key={i} item={p} />)}
        </div>

        <div style={{ background: '#1a1d2e', borderRadius: 12, padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#3b82f6', textTransform: 'uppercase' }}>
            <Zap size={16} /> FEATURE REQUESTS
          </div>
          {(intel.feature_requests || []).map((f, i) => <FeatureItem key={i} item={f} maxCount={maxCount} />)}
        </div>
      </div>

      {/* AI Summary */}
      <div style={{ background: '#1a1d2e', borderRadius: 12, padding: '18px 24px', display: 'flex', alignItems: 'flex-start', gap: 16, flexShrink: 0 }}>
        <Bot size={24} color="#7c6ff7" style={{ flexShrink: 0, marginTop: 4 }} />
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.1em', color: '#7c6ff7', marginBottom: 6, fontWeight: 800 }}>// AI SUMMARY</div>
          <div style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.7, fontWeight: 500 }}>{intel.summary}</div>
        </div>
      </div>

      {/* Competitive Landscape */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#475569', textTransform: 'uppercase' }}>// COMPETITIVE LANDSCAPE</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {COMPETITORS.map(comp => (
            <div key={comp.name} style={{ background: '#1a1d2e', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{comp.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{comp.mentions} mentions</div>
              </div>
              <div style={{ height: 6, background: '#2d3148', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${comp.sentiment}%`, background: comp.sentiment > 60 ? '#22c55e' : comp.sentiment > 40 ? '#facc15' : '#ef4444' }} />
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', borderLeft: '2px solid #334155', paddingLeft: 10, marginTop: 6, lineHeight: 1.5 }}>
                {comp.complaint}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Signals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0, paddingBottom: 30 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.08em', color: '#475569', textTransform: 'uppercase' }}>// TREND SIGNALS THIS WEEK</div>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {TRENDS.map(trend => (
            <div key={trend.keyword} style={{ minWidth: 220, background: '#1a1d2e', borderRadius: 12, padding: '14px 18px', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{trend.keyword}</div>
                <div style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 4, background: trend.relevance === 'HIGH' ? '#7f1d1d' : '#1e3a8a', color: trend.relevance === 'HIGH' ? '#fca5a5' : '#bfdbfe' }}>{trend.relevance}</div>
              </div>
              <div style={{ fontSize: 12, color: '#22c55e', fontWeight: 800 }}>{trend.volume} this week</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {trend.sources.map(s => (
                  <span key={s} style={{ fontSize: 9, padding: '3px 8px', background: '#0f1117', color: '#64748b', borderRadius: 4, border: '1px solid #1e2235', fontWeight: 700 }}>{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
