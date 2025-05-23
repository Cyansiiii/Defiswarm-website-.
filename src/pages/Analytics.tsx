
import React, { useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import AgentAnalytics from '@/components/AgentAnalytics';
import { api } from '@/lib/api';

const Analytics: React.FC = () => {
  // Start simulation if it's not already running
  useEffect(() => {
    const checkSimulationStatus = async () => {
      const status = await api.isSimulationActive();
      if (!status.active) {
        await api.startSimulation();
        console.log('Starting simulation from Analytics page');
      }
    };
    
    checkSimulationStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-defi-dark p-4">
      <div className="container mx-auto px-4 py-8">
        <NavigationMenu />
        <h1 className="text-3xl font-bold mb-6 text-white">Agent Analytics</h1>
        <AgentAnalytics />
      </div>
    </div>
  );
};

export default Analytics;
