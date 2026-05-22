import { useState, useCallback } from 'react';
import TopNav from './components/layout/TopNav';
import LeftSidebar from './components/layout/LeftSidebar';
import BottomStatusBar from './components/layout/BottomStatusBar';
import LivePipeline from './components/pipeline/LivePipeline';
import AgentActivity from './components/agents/AgentActivity';
import ProductIntelligence from './components/intelligence/ProductIntelligence';
import Settings from './components/shared/Settings';
import DemoButton from './components/shared/DemoButton';
import { useLeads, useActivityFeed, useProductIntel, useAgentStatus, useMetrics } from './hooks';

export default function App() {
  const [activeTab, setActiveTab] = useState('Live Pipeline');
  const [newLeadId, setNewLeadId] = useState(null);

  const { leads, addLead, updateLead } = useLeads();
  const { events, prependEvent } = useActivityFeed();
  const { intel } = useProductIntel();
  const { agents, setProcessing } = useAgentStatus();
  const metrics = useMetrics(leads);

  const handleDemoStep = useCallback((type, data) => {
    if (type === 'feed') prependEvent(data);
    if (type === 'agent') setProcessing(data.id);
    if (type === 'lead') {
      addLead(data);
      setNewLeadId(data.id);
      setActiveTab('Live Pipeline');
      setTimeout(() => setNewLeadId(null), 5000);
    }
  }, [prependEvent, setProcessing, addLead]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Live Pipeline':  return <LivePipeline leads={leads} events={events} metrics={metrics} newLeadId={newLeadId} />;
      case 'Agent Activity': return <AgentActivity agents={agents} />;
      case 'Product Intel':  return <ProductIntelligence intel={intel} />;
      case 'Settings':       return <Settings />;
      default:               return null;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0C0C0C', fontFamily: "'Space Grotesk', sans-serif", color: '#F0F0F0', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes slideUp { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes borderFlash { 0%,100%{border-color:#FF2D5533} 50%{border-color:#FF2D55BB} }
        @keyframes feedIn { from{transform:translateY(-8px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes countUp { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @keyframes slideUp { from{transform:translateY(8px);opacity:0} to{transform:translateY(0);opacity:1} }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#2A2A2A; border-radius:2px; }
        button { font-family: inherit; cursor:pointer; }
        select, input { font-family: inherit; }
      `}</style>

      <TopNav metrics={metrics} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} agents={agents} />

        <main style={{
          flex: 1,
          marginTop: 48,
          padding: '20px 24px',
          overflowY: 'auto',
          animation: 'slideUp 200ms ease-out',
        }}>
          {renderContent()}
        </main>
      </div>

      <BottomStatusBar />
      <DemoButton onDemoStep={handleDemoStep} />
    </div>
  );
}
