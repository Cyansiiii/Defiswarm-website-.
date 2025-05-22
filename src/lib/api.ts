// This is a simulation of API calls to the DeFiSwarm backend
// In a real implementation, these would call actual API endpoints

// Interface for trade recommendation response
interface MockTradeRecommendationResponse {
  action: string; // 'BUY' or 'SELL'
  confidence: number;
  reason: string;
  price_target: number;
  stop_loss: number;
}

// Sample ETH price history data
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

// Sample trading activity data
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

// Get current ETH price with minor random fluctuations
const getCurrentPrice = () => {
  // Base price around $3600
  const basePrice = 3600;
  // Add small random fluctuation
  const randomFactor = 0.995 + Math.random() * 0.01;
  return parseFloat((basePrice * randomFactor).toFixed(2));
};

// Current trade recommendation - modified to match the new structure
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

export const api = {
  getETHPriceHistory: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return generatePriceHistory();
  },
  
  getCurrentETHPrice: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return getCurrentPrice();
  },
  
  getActivityLog: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 600));
    return generateActivityLog();
  },
  
  getTradeRecommendation: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getTradeRecommendation();
  },
  
  executeSimulatedTrade: async (action, amount) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const currentPrice = getCurrentPrice();
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
  }
};
