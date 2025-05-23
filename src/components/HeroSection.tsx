
import React, { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, Shield, Database } from 'lucide-react';
import { api } from '@/lib/api';

interface TradeRecommendation {
  action: string;
  confidence: number;
  reason: string;
  price_target: number;
  stop_loss: number;
}

const HeroSection: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<{value: number, percentage: number, isPositive: boolean}>({
    value: 0, 
    percentage: 0, 
    isPositive: true
  });
  const [recommendation, setRecommendation] = useState<TradeRecommendation>({
    action: 'BUY',
    confidence: 87,
    reason: '',
    price_target: 3800,
    stop_loss: 3450
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch real-time ETH price
        const price = await api.getCurrentETHPrice();
        setCurrentPrice(price);
        
        // Fetch historical price data to calculate 24h change
        const historyData = await api.getETHPriceHistory();
        if (historyData && historyData.length >= 2) {
          const yesterday = historyData[historyData.length - 2].price;
          const today = historyData[historyData.length - 1].price;
          const change = today - yesterday;
          const changePercentage = (change / yesterday) * 100;
          
          setPriceChange({
            value: Math.abs(change),
            percentage: Math.abs(changePercentage),
            isPositive: change >= 0
          });
        }
        
        // Fetch trade recommendation
        const tradeRec = await api.getTradeRecommendation();
        setRecommendation(tradeRec);
      } catch (error) {
        console.error('Failed to fetch data for hero section:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-16 bg-grid-pattern grid-bg">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-defi-dark-blue/80 to-defi-dark-blue"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-block px-3 py-1 text-sm text-defi-bright-teal bg-defi-bright-teal/10 rounded-full border border-defi-bright-teal/20 mb-4">
                Smart Trading Simulation
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                Smarter <span className="text-gradient">Crypto Trading</span> with AI Analysis
              </h1>
              <p className="text-lg md:text-xl text-defi-gray mb-6">
                DeFiSwarm monitors Ethereum prices in real-time, makes trading decisions based on market signals, and records all activities with precision.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#dashboard" className="bg-gradient-to-r from-defi-teal to-defi-bright-teal hover:opacity-90 transition-opacity text-white font-medium px-6 py-3 rounded-md flex items-center justify-center">
                Start Simulation
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <a href="#learn-more" className="bg-defi-blue/30 hover:bg-defi-blue/50 transition-colors text-white font-medium px-6 py-3 rounded-md flex items-center justify-center">
                Learn More
              </a>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
              <div className="bg-defi-blue/20 border border-defi-blue/30 rounded-lg p-4">
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-defi-bright-teal mr-2" />
                  <p className="text-sm text-white">Real-time monitoring</p>
                </div>
              </div>
              <div className="bg-defi-blue/20 border border-defi-blue/30 rounded-lg p-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-defi-bright-teal mr-2" />
                  <p className="text-sm text-white">Secure simulation</p>
                </div>
              </div>
              <div className="bg-defi-blue/20 border border-defi-blue/30 rounded-lg p-4 col-span-2 md:col-span-1">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-defi-bright-teal mr-2" />
                  <p className="text-sm text-white">Detailed analytics</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative flex justify-center">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-defi-teal/20 to-defi-bright-teal/20 rounded-full filter blur-[100px]"></div>
            
            {/* Main illustration/animation container */}
            <div className="relative bg-defi-blue/30 rounded-2xl border border-defi-blue/50 backdrop-blur-sm p-6 w-full max-w-md glow-border">
              <div className="rounded-lg bg-defi-blue/40 p-4 border border-defi-blue/60 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-defi-gray text-sm">ETH Simulation Status</span>
                  <span className="text-white text-xs px-2 py-1 bg-defi-green rounded-full">ACTIVE</span>
                </div>
                
                {/* Animated graphs */}
                <div className="space-y-4">
                  <div className="h-24 relative overflow-hidden rounded-md">
                    <div className="absolute inset-0 flex items-end">
                      {/* Simulated bar chart */}
                      {Array.from({ length: 24 }).map((_, i) => {
                        const height = 15 + Math.random() * 60;
                        const delay = i * 0.1;
                        return (
                          <div 
                            key={i} 
                            className="w-full bg-defi-teal/70 mx-0.5 rounded-t-sm animate-float"
                            style={{ 
                              height: `${height}%`, 
                              animationDelay: `${delay}s`,
                              opacity: 0.6 + Math.random() * 0.4
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-defi-gray">
                    <span>24h Change:</span>
                    {isLoading ? (
                      <span className="text-white animate-pulse">Loading...</span>
                    ) : (
                      <span className={priceChange.isPositive ? "text-defi-green" : "text-defi-red"}>
                        {priceChange.isPositive ? "+" : "-"}{priceChange.percentage.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg bg-defi-blue/40 p-4 border border-defi-blue/60">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-defi-gray text-sm">Latest Recommendation</span>
                  {isLoading ? (
                    <span className="text-xs px-2 py-1 bg-defi-blue rounded-full text-white animate-pulse">
                      Loading...
                    </span>
                  ) : (
                    <span className={`text-xs px-2 py-1 ${recommendation.action === 'BUY' ? 'bg-defi-green' : 'bg-defi-red'} rounded-full text-white`}>
                      {recommendation.action}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-defi-gray text-xs">Confidence</span>
                    {isLoading ? (
                      <span className="text-white text-xs animate-pulse">Loading...</span>
                    ) : (
                      <span className="text-white text-xs font-medium">{recommendation.confidence}%</span>
                    )}
                  </div>
                  
                  <div className="w-full bg-defi-blue/50 rounded-full h-1.5">
                    {isLoading ? (
                      <div className="bg-gradient-to-r from-defi-teal to-defi-bright-teal h-1.5 rounded-full animate-pulse" 
                           style={{ width: '50%' }}></div>
                    ) : (
                      <div className="bg-gradient-to-r from-defi-teal to-defi-bright-teal h-1.5 rounded-full" 
                           style={{ width: `${recommendation.confidence}%` }}></div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-defi-blue/30 p-2 rounded border border-defi-blue/40">
                      <div className="text-xs text-defi-gray">Target</div>
                      {isLoading ? (
                        <div className="text-sm text-white font-medium animate-pulse">Loading...</div>
                      ) : (
                        <div className="text-sm text-white font-medium">
                          {formatPrice(recommendation.price_target)}
                        </div>
                      )}
                    </div>
                    <div className="bg-defi-blue/30 p-2 rounded border border-defi-blue/40">
                      <div className="text-xs text-defi-gray">Stop Loss</div>
                      {isLoading ? (
                        <div className="text-sm text-white font-medium animate-pulse">Loading...</div>
                      ) : (
                        <div className="text-sm text-white font-medium">
                          {formatPrice(recommendation.stop_loss)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating data points */}
              <div className="absolute -top-4 -right-4 h-12 w-12 rounded-full bg-defi-bright-teal/20 backdrop-blur-sm flex items-center justify-center border border-defi-bright-teal/30 animate-float" style={{ animationDelay: '1s' }}>
                <TrendingUp className="h-5 w-5 text-defi-bright-teal" />
              </div>
              
              <div className="absolute -bottom-3 -left-3 h-10 w-10 rounded-full bg-defi-light-blue/30 backdrop-blur-sm flex items-center justify-center border border-defi-light-blue/40 animate-float" style={{ animationDelay: '2.5s' }}>
                <Database className="h-4 w-4 text-defi-bright-teal" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
