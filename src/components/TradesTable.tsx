
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Trade {
  id: string;
  timestamp: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  value: number;
  status: 'SUCCESS' | 'FAILED';
}

const TradesTable: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setIsLoading(true);
        const metrics = await api.getSimulationMetrics();
        
        // Generate detailed trade list from the high-level metrics
        const generatedTrades: Trade[] = [];
        
        // Use the trade statistics to create realistic trade entries
        const totalTrades = metrics.trades.total;
        const buyTrades = metrics.trades.buys;
        const sellTrades = metrics.trades.sells;
        const successRate = metrics.trades.successRate;
        
        // Generate trade history based on the metrics
        for (let i = 0; i < totalTrades; i++) {
          const isBuy = i < buyTrades;
          const isSuccess = Math.random() <= successRate;
          const tradeTime = new Date();
          tradeTime.setMinutes(tradeTime.getMinutes() - Math.floor(Math.random() * 60 * 24)); // Random time in last 24h
          
          const price = metrics.priceRange.min + Math.random() * (metrics.priceRange.max - metrics.priceRange.min);
          const amount = 0.05 + Math.random() * 0.5; // Random ETH amount between 0.05 and 0.55
          const value = price * amount;
          
          generatedTrades.push({
            id: `trade-${Date.now()}-${i}`,
            timestamp: tradeTime.toISOString(),
            type: isBuy ? 'BUY' : 'SELL',
            price: parseFloat(price.toFixed(2)),
            amount: parseFloat(amount.toFixed(4)),
            value: parseFloat(value.toFixed(2)),
            status: isSuccess ? 'SUCCESS' : 'FAILED'
          });
        }
        
        // Sort by timestamp (newest first)
        generatedTrades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setTrades(generatedTrades);
      } catch (error) {
        console.error('Failed to fetch trade data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrades();
  }, []);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-6">Trading History</h2>
      
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-pulse text-defi-gray">Loading trade history...</div>
          </div>
        ) : trades.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Amount (ETH)</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className="text-xs text-defi-gray">
                    {new Date(trade.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.type === 'BUY' ? 'bg-defi-green/20 text-defi-green' : 'bg-defi-red/20 text-defi-red'
                    }`}>
                      {trade.type}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(trade.price)}</TableCell>
                  <TableCell>{trade.amount}</TableCell>
                  <TableCell>{formatCurrency(trade.value)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.status === 'SUCCESS' ? 'bg-defi-bright-teal/20 text-defi-bright-teal' : 'bg-defi-red/20 text-defi-red'
                    }`}>
                      {trade.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-defi-gray py-8">
            No trade history available
          </div>
        )}
      </div>
    </div>
  );
};

export default TradesTable;
