
import React from 'react';
import { 
  LayoutDashboard, 
  Compass,
  Zap,
  Settings,
  LogOut,
  ChevronRight,
  FileSearch,
  Mic
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-lg shadow-indigo-500/10' 
        : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
    }`}
  >
    <span className={`transition-colors duration-200 ${active ? 'text-indigo-400' : 'group-hover:text-indigo-400'}`}>
      {icon}
    </span>
    <span className="font-medium text-sm flex-1 text-left">{label}</span>
    {active && <ChevronRight className="w-4 h-4 opacity-50" />}
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'Control Center', icon: <LayoutDashboard size={20} /> },
    { id: 'Growth Path', icon: <Compass size={20} /> },
    { id: 'Resume Audit', icon: <FileSearch size={20} /> },
    { id: 'Voice Mentor', icon: <Mic size={20} /> },
  ];

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 transform bg-slate-950/80 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full px-6 py-8">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-10 group cursor-pointer" onClick={() => setActiveTab('Control Center')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Vidya<span className="text-indigo-400">Guide AI</span></span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4 ml-4">Main Navigation</p>
          {tabs.map((tab) => (
            <NavItem 
              key={tab.id}
              icon={tab.icon} 
              label={tab.id} 
              active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                onClose();
              }}
            />
          ))}
        </nav>

        {/* Footer Settings */}
        <div className="mt-auto pt-8 border-t border-white/5 space-y-2">
          <NavItem icon={<Settings size={20} />} label="Workspace Settings" onClick={() => {}} />
          <NavItem icon={<LogOut size={20} />} label="Sign Out" onClick={() => {}} />
          
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-violet-600/20 border border-white/5 relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-indigo-500/20 blur-2xl group-hover:bg-indigo-500/40 transition-all duration-500"></div>
            <p className="text-xs font-semibold text-indigo-400 mb-1">PRO PLAN</p>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">Unlock unlimited AI insights and personalized roadmaps.</p>
            <button className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
