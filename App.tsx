
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Compass,
  Zap,
  FileSearch,
  Mic,
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HeroCard from './components/HeroCard';
import GrowthPath from './components/GrowthPath';
import ResumeReviewer from './components/ResumeReviewer';
import VoiceMentor from './components/VoiceMentor';

export type DashboardMetrics = {
  score: number;
};

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Control Center');
  const [isSessionActive] = useState(true);
  
  const [metrics] = useState<DashboardMetrics>({
    score: 94,
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-indigo-500/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          isSessionActive={isSessionActive}
        />
        
        <div className="p-6 lg:p-8 space-y-8 flex-1 max-w-[1400px] mx-auto w-full">
          {activeTab === 'Control Center' && (
            <>
              <HeroCard 
                onNavigateGrowth={() => setActiveTab('Growth Path')} 
                onNavigateAudit={() => setActiveTab('Resume Audit')} 
                onNavigateVoice={() => setActiveTab('Voice Mentor')}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard 
                  icon={<Zap className="w-6 h-6" />} 
                  label="Optimization Score" 
                  value={`${metrics.score}%`} 
                  color="indigo" 
                />
              </div>
            </>
          )}

          {activeTab === 'Growth Path' && (
            <GrowthPath />
          )}

          {activeTab === 'Resume Audit' && (
            <ResumeReviewer />
          )}

          {activeTab === 'Voice Mentor' && (
            <VoiceMentor />
          )}

          {!['Control Center', 'Growth Path', 'Resume Audit', 'Voice Mentor'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 space-y-4">
              <LayoutDashboard size={48} className="animate-pulse" />
              <p className="text-xl font-medium">{activeTab} module is coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const MetricCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string }> = ({ icon, label, value, color }) => {
  const colorClasses = {
    indigo: "bg-indigo-500/20 text-indigo-400",
  }[color] || "bg-indigo-500/20 text-indigo-400";

  return (
    <div className="glass-card p-6 rounded-2xl flex items-center space-x-4 hover:border-white/20 transition-all duration-300">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{label}</p>
        <h3 className="text-2xl font-bold tracking-tight text-white">{value}</h3>
      </div>
    </div>
  );
};

export default App;
