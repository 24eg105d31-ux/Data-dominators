
import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ResumeMentor from './components/ResumeMentor';
import CareerPlanner from './components/CareerPlanner';
import InterviewCoach from './components/InterviewCoach';
import CommandCenter from './components/CommandCenter';
import { NavigationTab } from './types';
import { IntentResponse } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  const handleRoute = (intent: IntentResponse) => {
    setActiveTab(intent.tab);
    // You could also pass intent.initialData to components via global state/context if needed
    console.log(`Routed to ${intent.tab} because: ${intent.reason}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.DASHBOARD:
        return <Dashboard onNavigate={setActiveTab} />;
      case NavigationTab.RESUME:
        return <ResumeMentor />;
      case NavigationTab.PLANNER:
        return <CareerPlanner />;
      case NavigationTab.INTERVIEW:
        return <InterviewCoach />;
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
