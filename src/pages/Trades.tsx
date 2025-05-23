
import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import TradesTable from '@/components/TradesTable';

const Trades: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <NavigationMenu />
      <h1 className="text-3xl font-bold mb-6">Trading History</h1>
      <TradesTable />
    </div>
  );
};

export default Trades;
