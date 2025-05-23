
import React, { useEffect } from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import TradesTable from '@/components/TradesTable';
import { api } from '@/lib/api';

const Trades: React.FC = () => {
  // Start simulation if it's not already running
  useEffect(() => {
    const checkSimulationStatus = async () => {
      const status = await api.isSimulationActive();
      if (!status.active) {
        await api.startSimulation();
        console.log('Starting simulation from Trades page');
      }
    };
    
    checkSimulationStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-defi-dark p-4">
      <div className="container mx-auto px-4 py-8">
        <NavigationMenu />
        <h1 className="text-3xl font-bold mb-6 text-white">Trading History</h1>
        <TradesTable />
      </div>
    </div>
  );
};

export default Trades;
