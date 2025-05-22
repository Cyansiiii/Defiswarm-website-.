
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  BarChart2, 
  AlertTriangle, 
  TrendingUp, 
  Settings, 
  ExternalLink 
} from 'lucide-react';

interface Activity {
  id: string;
  timestamp: string;
  type: 'ANALYSIS' | 'PRICE_ALERT' | 'TRADE_SIGNAL' | 'SYSTEM';
  message: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
}

const ActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await api.getActivityLog();
        setActivities(data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ANALYSIS':
        return <BarChart2 className="h-4 w-4 text-defi-bright-teal" />;
      case 'PRICE_ALERT':
        return <AlertTriangle className="h-4 w-4 text-defi-red" />;
      case 'TRADE_SIGNAL':
        return <TrendingUp className="h-4 w-4 text-defi-green" />;
      case 'SYSTEM':
        return <Settings className="h-4 w-4 text-defi-gray" />;
      default:
        return <Settings className="h-4 w-4 text-defi-gray" />;
    }
  };

  const getActivityClass = (type: string) => {
    switch (type) {
      case 'ANALYSIS':
        return 'bg-defi-bright-teal/10 border-defi-bright-teal/20';
      case 'PRICE_ALERT':
        return 'bg-defi-red/10 border-defi-red/20';
      case 'TRADE_SIGNAL':
        return 'bg-defi-green/10 border-defi-green/20';
      case 'SYSTEM':
        return 'bg-defi-blue/20 border-defi-blue/30';
      default:
        return 'bg-defi-blue/20 border-defi-blue/30';
    }
  };

  const filteredActivities = activeFilter
    ? activities.filter(activity => activity.type === activeFilter)
    : activities;

  return (
    <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Activity Log</h2>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 text-xs rounded-md ${
              activeFilter === null
                ? 'bg-defi-blue text-white'
                : 'bg-defi-blue/30 text-defi-gray'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('ANALYSIS')}
            className={`px-3 py-1 text-xs rounded-md ${
              activeFilter === 'ANALYSIS'
                ? 'bg-defi-bright-teal/20 text-defi-bright-teal border border-defi-bright-teal/30'
                : 'bg-defi-blue/30 text-defi-gray'
            }`}
          >
            Analysis
          </button>
          <button
            onClick={() => setActiveFilter('TRADE_SIGNAL')}
            className={`px-3 py-1 text-xs rounded-md ${
              activeFilter === 'TRADE_SIGNAL'
                ? 'bg-defi-green/20 text-defi-green border border-defi-green/30'
                : 'bg-defi-blue/30 text-defi-gray'
            }`}
          >
            Trades
          </button>
          <button
            onClick={() => setActiveFilter('PRICE_ALERT')}
            className={`px-3 py-1 text-xs rounded-md ${
              activeFilter === 'PRICE_ALERT'
                ? 'bg-defi-red/20 text-defi-red border border-defi-red/30'
                : 'bg-defi-blue/30 text-defi-gray'
            }`}
          >
            Alerts
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-defi-blue/30 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-defi-blue/50 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-defi-blue/40 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-defi-gray">No activities to display</p>
            </div>
          ) : (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className={`rounded-lg p-4 border transition-all hover:border-opacity-50 ${getActivityClass(
                  activity.type
                )}`}
              >
                <div className="flex items-start">
                  <div className="mr-3 mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1">
                    <p className="text-white text-sm mb-1">{activity.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-defi-gray text-xs">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                      {activity.impact === 'HIGH' && (
                        <span className="bg-defi-red/20 text-defi-red text-xs px-2 py-0.5 rounded">
                          High Impact
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-defi-blue/30 flex justify-between items-center">
        <span className="text-defi-gray text-sm">
          {filteredActivities.length} activities
        </span>
        <button className="text-defi-bright-teal text-sm flex items-center hover:underline">
          View Full History
          <ExternalLink className="ml-1 h-3 w-3" />
        </button>
      </div>
    </div>
  );
};

export default ActivityLog;
