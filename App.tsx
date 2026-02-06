
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ResumeMentor from './components/ResumeMentor';
import CareerStrategist from './components/CareerStrategist';
import CommandCenter from './components/CommandCenter';
import VoiceAssistant from './components/VoiceAssistant';
import { NavigationTab } from './types';
import { IntentResponse } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const handleRoute = (intent: IntentResponse) => {
    setActiveTab(intent.tab);
    console.log(`Routed to ${intent.tab} because: ${intent.reason}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.DASHBOARD:
        return <Dashboard onNavigate={setActiveTab} />;
      case NavigationTab.RESUME:
        return <ResumeMentor />;
      case NavigationTab.STRATEGIST:
        return <CareerStrategist />;
      case NavigationTab.VOICE:
        return <VoiceAssistant />;
      default:
        return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onStartSession={() => setIsCommandOpen(true)}
      >
        {renderContent()}
      </Layout>
      
      <CommandCenter 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)}
        onRoute={handleRoute}
      />
    </>
  );
};

export default App;
