
import React from 'react';
import NavigationMenu from '@/components/NavigationMenu';
import AgentAnalytics from '@/components/AgentAnalytics';

const Analytics: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <NavigationMenu />
      <h1 className="text-3xl font-bold mb-6">Agent Analytics</h1>
      <AgentAnalytics />
    </div>
  );
};

export default Analytics;
