
import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowUpRight, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

// Update the TradeRecommendation interface to accept string action type
interface TradeRecommendation {
  action: string; // Changed from 'BUY' | 'SELL' to string to match API
  confidence: number;
  reason: string;
  price_target?: number; // Added optional for backward compatibility
  priceTarget?: number; // Added optional for backward compatibility
  stop_loss?: number; // Added optional for backward compatibility
  stopLoss?: number; // Added optional for backward compatibility
}

const TradePanel: React.FC = () => {
  const [recommendation, setRecommendation] = useState<TradeRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState<string>('1');
  const [isExecuting, setIsExecuting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    const fetchRecommendation = async () => {
      setIsLoading(true);
      try {
        const data = await api.getTradeRecommendation();
        // Transform the data to match our component's expected format
        const transformedData: TradeRecommendation = {
          action: data.action,
          confidence: data.confidence,
          reason: data.reason,
          priceTarget: data.price_target || 0,
          stopLoss: data.stop_loss || 0
        };
        setRecommendation(transformedData);
      } catch (error) {
        console.error('Failed to fetch trade recommendation:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendation();
  }, []);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleExecuteTrade = async () => {
    if (!recommendation || isExecuting || !amount || parseFloat(amount) <= 0) return;
    
    setIsExecuting(true);
    try {
      const result = await api.executeSimulatedTrade(recommendation.action, parseFloat(amount));
      setShowSuccess(true);
      toast({
        title: "Trade Executed Successfully",
        description: `Simulated ${result.action} of ${result.amount} ETH at $${result.price}`,
      });
      
      // Reset success animation after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to execute trade:', error);
      toast({
        title: "Trade Execution Failed",
        description: "Could not complete the simulated trade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };
  
  return (
    <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm">
      <h2 className="text-xl font-bold mb-6">Trade Simulator</h2>
      
      {isLoading ? (
        <div className="h-48 flex items-center justify-center">
          <div className="animate-pulse text-defi-gray">Loading recommendation...</div>
        </div>
      ) : recommendation ? (
        <>
          <div className={`mb-6 p-4 rounded-lg border ${
            recommendation.action === 'BUY' 
              ? 'bg-defi-green/10 border-defi-green/30' 
              : 'bg-defi-red/10 border-defi-red/30'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-defi-gray text-sm">AI Recommendation</div>
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                recommendation.action === 'BUY' ? 'bg-defi-green text-white' : 'bg-defi-red text-white'
              }`}>
                {recommendation.action}
              </div>
            </div>
            
            <p className="text-white mb-4">{recommendation.reason}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-defi-gray text-xs mb-1">Price Target</p>
                <p className="text-white font-medium">${(recommendation.priceTarget || recommendation.price_target || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-defi-gray text-xs mb-1">Stop Loss</p>
                <p className="text-white font-medium">${(recommendation.stopLoss || recommendation.stop_loss || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="trade-amount" className="block text-defi-gray text-sm mb-2">
              Amount to Trade (ETH)
            </label>
            <div className="relative">
              <input
                id="trade-amount"
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="w-full bg-defi-blue/30 border border-defi-blue/60 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defi-bright-teal/50"
                placeholder="1.0"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-defi-gray">ETH</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-6">
            <AlertCircle className="h-4 w-4 text-defi-gray" />
            <p className="text-xs text-defi-gray">
              This is a simulation. No real transactions will be executed.
            </p>
          </div>
          
          <button
            onClick={handleExecuteTrade}
            disabled={isExecuting || !amount || parseFloat(amount) <= 0}
            className={`w-full rounded-lg py-3 px-4 text-white font-medium flex items-center justify-center transition-all ${
              isExecuting 
                ? 'bg-defi-blue/50 cursor-not-allowed' 
                : showSuccess
                  ? 'bg-defi-green'
                  : recommendation.action === 'BUY'
                    ? 'bg-defi-green hover:bg-defi-green/90'
                    : 'bg-defi-red hover:bg-defi-red/90'
            }`}
          >
            {isExecuting ? (
              <>
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : showSuccess ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Trade Executed!
              </>
            ) : (
              <>
                <ArrowUpRight className="h-5 w-5 mr-2" />
                Execute {recommendation.action} Trade
              </>
            )}
          </button>
        </>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center">
          <AlertCircle className="h-8 w-8 text-defi-gray mb-2" />
          <p className="text-defi-gray">Unable to load recommendation</p>
          <button className="mt-4 text-defi-bright-teal text-sm underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default TradePanel;
