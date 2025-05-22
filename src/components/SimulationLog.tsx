
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ChartLine, Activity, FileBarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SimulationMetrics {
  volatility: number;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  trades: {
    total: number;
    buys: number;
    sells: number;
    successRate: number;
  };
  events: {
    timestamp: string;
    description: string;
    impact: "LOW" | "MEDIUM" | "HIGH";
  }[];
}

const SimulationLog: React.FC = () => {
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [metrics, setMetrics] = useState<SimulationMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(null);

  useEffect(() => {
    // Check if simulation is already running
    const checkSimulationStatus = () => {
      const status = api.isSimulationActive();
      setIsSimulationActive(status.active);
      
      if (status.active && refreshInterval === null) {
        fetchMetrics();
        startPeriodicRefresh();
      }
    };
    
    checkSimulationStatus();
    
    return () => {
      if (refreshInterval !== null) {
        clearInterval(refreshInterval);
      }
    };
  }, []);
  
  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSimulationMetrics();
      setMetrics(data);
    } catch (error) {
      console.error('Failed to fetch simulation metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const startPeriodicRefresh = () => {
    const interval = window.setInterval(() => {
      fetchMetrics();
    }, 30000); // Refresh data every 30 seconds
    
    setRefreshInterval(interval);
  };
  
  const toggleSimulation = async () => {
    if (isSimulationActive) {
      // Stop simulation
      const status = api.stopSimulation();
      setIsSimulationActive(status.active);
      
      if (refreshInterval !== null) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    } else {
      // Start simulation
      const status = api.startSimulation();
      setIsSimulationActive(status.active);
      
      fetchMetrics();
      startPeriodicRefresh();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const getImpactClass = (impact: string) => {
    switch (impact) {
      case 'HIGH':
        return 'bg-defi-red/20 text-defi-red';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-500';
      default:
        return 'bg-defi-bright-teal/20 text-defi-bright-teal';
    }
  };

  return (
    <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Simulation Log</h2>
        
        <Button
          onClick={toggleSimulation}
          variant={isSimulationActive ? "destructive" : "default"}
          className={`flex items-center space-x-2 ${
            isSimulationActive 
              ? 'bg-defi-red hover:bg-defi-red/90' 
              : 'bg-defi-green hover:bg-defi-green/90'
          }`}
        >
          {isSimulationActive ? "Stop Simulation" : "Start Simulation"}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse text-defi-gray">Loading simulation data...</div>
        </div>
      ) : metrics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-defi-blue/30 rounded-lg p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <ChartLine className="h-4 w-4 text-defi-bright-teal" />
                <span className="text-sm text-defi-gray">Price Volatility</span>
              </div>
              <span className="text-2xl font-semibold">{formatPercentage(metrics.volatility)}</span>
            </div>
            
            <div className="bg-defi-blue/30 rounded-lg p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-defi-bright-teal" />
                <span className="text-sm text-defi-gray">Price Range</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-defi-gray text-sm">Low:</span>
                <span className="font-semibold">{formatPrice(metrics.priceRange.min)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-defi-gray text-sm">High:</span>
                <span className="font-semibold">{formatPrice(metrics.priceRange.max)}</span>
              </div>
            </div>
            
            <div className="bg-defi-blue/30 rounded-lg p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <FileBarChart className="h-4 w-4 text-defi-bright-teal" />
                <span className="text-sm text-defi-gray">Trade Statistics</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <span className="text-defi-gray text-xs">Total:</span>
                <span className="text-sm font-semibold">{metrics.trades.total}</span>
                
                <span className="text-defi-gray text-xs">Buys:</span>
                <span className="text-sm font-semibold text-defi-green">{metrics.trades.buys}</span>
                
                <span className="text-defi-gray text-xs">Sells:</span>
                <span className="text-sm font-semibold text-defi-red">{metrics.trades.sells}</span>
                
                <span className="text-defi-gray text-xs">Success Rate:</span>
                <span className="text-sm font-semibold">{formatPercentage(metrics.trades.successRate)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-defi-blue/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold">Market Events</h3>
            </div>
            
            <div className="max-h-48 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Time</TableHead>
                    <TableHead className="w-2/3">Event</TableHead>
                    <TableHead className="w-1/12">Impact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metrics.events.length > 0 ? (
                    metrics.events.map((event, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-xs text-defi-gray">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>{event.description}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getImpactClass(event.impact)}`}>
                            {event.impact}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-defi-gray">
                        No significant market events detected
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="text-xs text-defi-gray italic text-center">
            DeFiSwarm simulation analysis is updated every 30 seconds
          </div>
        </>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center">
          <p className="text-defi-gray">No simulation data available</p>
          <Button
            onClick={fetchMetrics}
            variant="ghost" 
            className="mt-4 text-defi-bright-teal">
            Retry
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimulationLog;
