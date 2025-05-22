
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart 
} from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '@/lib/api';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="text-white text-sm font-medium">{`Date: ${label}`}</p>
        <p className="text-defi-bright-teal text-lg font-mono">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }

  return null;
};

const PriceChart: React.FC = () => {
  const [priceData, setPriceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  
  useEffect(() => {
    const fetchPriceData = async () => {
      setIsLoading(true);
      try {
        const data = await api.getETHPriceHistory();
        setPriceData(data);
      } catch (error) {
        console.error('Failed to fetch price data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPriceData();
  }, [timeRange]);
  
  // Calculate price change
  const calculatePriceChange = () => {
    if (priceData.length < 2) return { value: 0, percentage: 0, isPositive: true };
    
    const firstPrice = priceData[0].price;
    const lastPrice = priceData[priceData.length - 1].price;
    const change = lastPrice - firstPrice;
    const percentage = (change / firstPrice) * 100;
    
    return {
      value: Math.abs(change),
      percentage: Math.abs(percentage),
      isPositive: change >= 0
    };
  };
  
  const priceChange = calculatePriceChange();
  
  return (
    <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">ETH Price Chart</h2>
        <div className="flex space-x-2">
          <button 
            className={`px-3 py-1 rounded-md text-sm ${timeRange === '24h' ? 'bg-defi-blue text-white' : 'bg-defi-blue/30 text-defi-gray'}`}
            onClick={() => setTimeRange('24h')}
          >
            24H
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${timeRange === '7d' ? 'bg-defi-blue text-white' : 'bg-defi-blue/30 text-defi-gray'}`}
            onClick={() => setTimeRange('7d')}
          >
            7D
          </button>
          <button 
            className={`px-3 py-1 rounded-md text-sm ${timeRange === '30d' ? 'bg-defi-blue text-white' : 'bg-defi-blue/30 text-defi-gray'}`}
            onClick={() => setTimeRange('30d')}
          >
            30D
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold mr-2">
            ${priceData.length > 0 ? priceData[priceData.length - 1].price.toLocaleString() : '0'}
          </span>
          <div className={`flex items-center text-sm ${priceChange.isPositive ? 'text-defi-green' : 'text-defi-red'}`}>
            {priceChange.isPositive ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
            ${priceChange.value.toFixed(2)} ({priceChange.percentage.toFixed(2)}%)
          </div>
        </div>
        <p className="text-defi-gray text-sm">Last 7 days</p>
      </div>
      
      {isLoading ? (
        <div className="h-64 bg-defi-blue/20 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-defi-gray">Loading chart data...</div>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={priceData}
              margin={{ top: 10, right: 5, left: 5, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#05C7B5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#05C7B5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A96B8', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#8A96B8', fontSize: 12 }}
                domain={['dataMin - 100', 'dataMax + 100']}
                tickFormatter={(value) => `$${value}`}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#162761" vertical={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#00E2FF" 
                strokeWidth={2}
                fill="url(#colorPrice)" 
                activeDot={{ r: 6, stroke: '#05C7B5', strokeWidth: 2, fill: '#162761' }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-defi-blue/30 rounded-lg p-3">
          <p className="text-defi-gray text-xs mb-1">24h Volume</p>
          <p className="text-white font-medium">$1.87B</p>
        </div>
        <div className="bg-defi-blue/30 rounded-lg p-3">
          <p className="text-defi-gray text-xs mb-1">Market Cap</p>
          <p className="text-white font-medium">$432.8B</p>
        </div>
        <div className="bg-defi-blue/30 rounded-lg p-3">
          <p className="text-defi-gray text-xs mb-1">Circulating</p>
          <p className="text-white font-medium">120.3M ETH</p>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
