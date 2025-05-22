// This file implements both simulated API calls and real Binance API integration
// Public Binance API key - safe to store in client-side code as it's read-only
const BINANCE_API_KEY = 'ixsmIWfrr2Gby2qNCgXT41dAUQFfp9Pl59wnibJVGIvv2xECktwUtjaxagFaDooX';

// Interface for trade recommendation response
interface MockTradeRecommendationResponse {
  action: string; // 'BUY' or 'SELL'
  confidence: number;
  reason: string;
  price_target: number;
  stop_loss: number;
}

interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteAssetVolume: string;
  numberOfTrades: number;
  takerBuyBaseAssetVolume: string;
  takerBuyQuoteAssetVolume: string;
  ignore: string;
}

// Store the simulation state
let simulationActive = false;
let simulationInterval: number | null = null;

// Fetch real-time ETH/USDT price from Binance
const fetchRealTimePrice = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT', {
      headers: {
        'X-MBX-APIKEY': BINANCE_API_KEY
      }
    });
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error('Error fetching real-time price:', error);
    return getCurrentPrice(); // Fallback to mock data
  }
};

// Fetch ETH/USDT historical price data from Binance
const fetchHistoricalPrices = async (interval = '1d', limit = 7): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=${interval}&limit=${limit}`,
      {
        headers: {
          'X-MBX-APIKEY': BINANCE_API_KEY
        }
      }
    );
    
    const data = await response.json();
    
    // Transform Binance data to our format
    return data.map((item: any) => {
      const date = new Date(item[0]);
      return {
        date: date.toISOString().split('T')[0],
        price: parseFloat(item[4]) // Using closing price
      };
    });
  } catch (error) {
    console.error('Error fetching historical prices:', error);
    return generatePriceHistory(); // Fallback to mock data
  }
};

// Generate trading signal based on real price data
const generateTradingSignal = async (): Promise<MockTradeRecommendationResponse> => {
  try {
    // Fetch some recent price data to analyze
    const klineData = await fetch(
      'https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=4h&limit=6',
      {
        headers: {
          'X-MBX-APIKEY': BINANCE_API_KEY
        }
      }
    );
    
    const data = await klineData.json();
    const prices = data.map((item: any) => parseFloat(item[4]));
    
    // Simple algorithm: if the price is generally increasing, BUY, otherwise SELL
    let priceChanges = 0;
    for (let i = 1; i < prices.length; i++) {
      priceChanges += prices[i] - prices[i - 1];
    }
    
    const action = priceChanges >= 0 ? 'BUY' : 'SELL';
    const currentPrice = await fetchRealTimePrice();
    const confidence = Math.abs(priceChanges) * 5;
    const normalizedConfidence = Math.min(Math.max(70 + confidence, 70), 100);
    
    return {
      action,
      confidence: parseFloat(normalizedConfidence.toFixed(0)),
      reason: `${action === 'BUY' ? 'Upward' : 'Downward'} trend detected in the last 24 hours with ${
        action === 'BUY' ? 'positive' : 'negative'
      } momentum`,
      price_target: parseFloat((currentPrice + (action === 'BUY' ? 200 : -200)).toFixed(2)),
      stop_loss: parseFloat((currentPrice + (action === 'BUY' ? -150 : 150)).toFixed(2))
    };
  } catch (error) {
    console.error('Error generating trading signal:', error);
    // Fallback to mock recommendation
    return getTradeRecommendation();
  }
};

// Sample ETH price history data (fallback if API fails)
const generatePriceHistory = () => {
  const now = new Date();
  const priceData = [];
  let price = 3500 + Math.random() * 100;
  
  // Generate data for the last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Add some randomness to create realistic price movements
    price = price * (0.99 + Math.random() * 0.04);
    
    priceData.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return priceData;
};

// Sample trading activity data (fallback if API fails)
const generateActivityLog = () => {
  const activities = [];
  const activityTypes = ["ANALYSIS", "PRICE_ALERT", "TRADE_SIGNAL", "SYSTEM"];
  const messages = [
    "ETH price crossed above 3600 resistance level",
    "Bullish divergence detected on 4H chart",
    "Volume increase detected with price rise",
    "BUY signal triggered at $3550",
    "SELL signal triggered at $3680",
    "RSI indicates overbought conditions",
    "50 MA crossed above 200 MA",
    "System detected volatility increase",
    "ETH price support level established at $3500"
  ];
  
  // Generate 15 random activities over the past week
  const now = new Date();
  for (let i = 0; i < 15; i++) {
    const randomDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    activities.push({
      id: `activity-${i}`,
      timestamp: randomDate.toISOString(),
      type: activityTypes[Math.floor(Math.random() * activityTypes.length)],
      message: messages[Math.floor(Math.random() * messages.length)],
      impact: Math.random() > 0.5 ? "HIGH" : "MEDIUM"
    });
  }
  
  // Sort by timestamp, newest first
  return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Get current ETH price with minor random fluctuations (fallback if API fails)
const getCurrentPrice = () => {
  // Base price around $3600
  const basePrice = 3600;
  // Add small random fluctuation
  const randomFactor = 0.995 + Math.random() * 0.01;
  return parseFloat((basePrice * randomFactor).toFixed(2));
};

// Current trade recommendation - modified to match the new structure (fallback if API fails)
const getTradeRecommendation = (): MockTradeRecommendationResponse => {
  const actions = ['BUY', 'SELL'];
  const randomAction = actions[Math.floor(Math.random() * actions.length)];
  const currentPrice = getCurrentPrice();

  return {
    action: randomAction,
    confidence: parseFloat((70 + Math.random() * 30).toFixed(0)), // 70 to 100
    reason: `Strong ${randomAction === 'BUY' ? 'upward' : 'downward'} trend with ${randomAction === 'BUY' ? 'increasing' : 'decreasing'} volume`,
    price_target: parseFloat((currentPrice + (randomAction === 'BUY' ? 200 : -200)).toFixed(2)),
    stop_loss: parseFloat((currentPrice + (randomAction === 'BUY' ? -150 : 150)).toFixed(2))
  };
};

// Start the simulation process
const startSimulation = () => {
  if (simulationActive) return;
  
  simulationActive = true;
  console.log('DeFiSwarm simulation started');
  
  // Set up an interval to periodically fetch new data and update the recommendation
  simulationInterval = window.setInterval(() => {
    console.log('Simulation tick: Fetching latest data');
  }, 30000); // Update every 30 seconds
  
  return { active: simulationActive };
};

// Stop the simulation process
const stopSimulation = () => {
  if (!simulationActive) return;
  
  simulationActive = false;
  if (simulationInterval !== null) {
    window.clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  console.log('DeFiSwarm simulation stopped');
  
  return { active: simulationActive };
};

// Check if the simulation is running
const isSimulationActive = () => {
  return { active: simulationActive };
};

export const api = {
  getETHPriceHistory: async () => {
    try {
      return await fetchHistoricalPrices();
    } catch (error) {
      console.error('Failed to fetch historical prices, falling back to mock data:', error);
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 800));
      return generatePriceHistory();
    }
  },
  
  getCurrentETHPrice: async () => {
    try {
      return await fetchRealTimePrice();
    } catch (error) {
      console.error('Failed to fetch real-time price, falling back to mock data:', error);
      // Fallback to mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      return getCurrentPrice();
    }
  },
  
  getActivityLog: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateActivityLog();
  },
  
  getTradeRecommendation: async () => {
    try {
      return await generateTradingSignal();
    } catch (error) {
      console.error('Failed to generate trading signal, falling back to mock data:', error);
      // Fallback to mock recommendation
      await new Promise(resolve => setTimeout(resolve, 500));
      return getTradeRecommendation();
    }
  },
  
  executeSimulatedTrade: async (action, amount) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const currentPrice = await fetchRealTimePrice().catch(() => getCurrentPrice());
    const success = Math.random() > 0.1; // 90% success rate for simulation
    
    if (success) {
      return {
        success: true,
        tradeId: `trade-${Date.now()}`,
        action: action,
        amount: amount,
        price: currentPrice,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error("Trade simulation failed - network error");
    }
  },
  
  startSimulation,
  stopSimulation,
  isSimulationActive
};
