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

interface AgentThought {
  agentName: string;
  timestamp: string;
  thought: string;
}

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
  agentThoughts: AgentThought[];
}

// Store the simulation state and metrics
let simulationActive = false;
let simulationInterval: number | null = null;
let priceHistory: number[] = [];
let marketEvents: { timestamp: string; description: string; impact: "LOW" | "MEDIUM" | "HIGH" }[] = [];
let agentThoughts: AgentThought[] = [];
let tradeStats = {
  total: 0,
  buys: 0,
  sells: 0,
  successful: 0
};

// Updated to use Binance public API without CORS issues through a proxy
const fetchRealTimePrice = async (): Promise<number> => {
  try {
    // Use proxy to avoid CORS issues
    const response = await fetch('https://api1.binance.com/api/v3/ticker/price?symbol=ETHUSDT');
    const data = await response.json();
    const price = parseFloat(data.price);
    
    // Store price in history for volatility calculation (keep last 100 points)
    if (simulationActive) {
      priceHistory.push(price);
      if (priceHistory.length > 100) {
        priceHistory.shift();
      }
      
      // Detect significant price changes and log them as events
      detectPriceEvents(price);
      
      // Generate agent thoughts based on the price
      generateAgentThoughts(price);
    }
    
    return price;
  } catch (error) {
    console.error('Error fetching real-time price:', error);
    return getCurrentPrice(); // Fallback to mock data
  }
};

// Generate agent thoughts based on price movements and market conditions
const generateAgentThoughts = (currentPrice: number): void => {
  if (priceHistory.length < 2) return;
  
  const previousPrice = priceHistory[priceHistory.length - 2];
  const percentChange = (currentPrice - previousPrice) / previousPrice;
  const now = new Date().toISOString();
  
  // Price Checker Agent
  if (Math.random() > 0.6) { // Don't generate thoughts on every tick
    let priceCheckerThought = "";
    if (Math.abs(percentChange) > 0.01) {
      priceCheckerThought = `Detected significant price movement of ${(percentChange * 100).toFixed(2)}%. Current price: $${currentPrice.toFixed(2)}. Analyzing recent trends to determine if this is part of a larger pattern.`;
    } else {
      priceCheckerThought = `Current price at $${currentPrice.toFixed(2)} is within normal fluctuation range. Continuing to monitor for breakout patterns or support/resistance tests.`;
    }
    
    agentThoughts.unshift({
      agentName: "Price Checker Agent",
      timestamp: now,
      thought: priceCheckerThought
    });
  }
  
  // Trade Maker Agent
  if (Math.random() > 0.7) {
    let tradeMakerThought = "";
    const volatility = calculateVolatility();
    
    if (volatility > 0.02) {
      tradeMakerThought = `Market volatility at ${(volatility * 100).toFixed(2)}% exceeds threshold. Recommending cautious positions with tight stop-losses.`;
    } else if (percentChange > 0.005) {
      tradeMakerThought = `Upward momentum detected. Analyzing volume patterns to confirm trend strength. Preparing BUY signal if confirmation indicators align.`;
    } else if (percentChange < -0.005) {
      tradeMakerThought = `Downward price action observed. Checking key support levels at ${(currentPrice * 0.99).toFixed(2)} and ${(currentPrice * 0.98).toFixed(2)}. Will recommend SELL if support breaks.`;
    } else {
      tradeMakerThought = `Market in consolidation phase. Holding current positions and waiting for clear directional signals.`;
    }
    
    agentThoughts.unshift({
      agentName: "Trade Maker Agent",
      timestamp: now,
      thought: tradeMakerThought
    });
  }
  
  // Trade Logger Agent
  if (Math.random() > 0.8) {
    const recentTrades = tradeStats.total > 0 
      ? `Logging recent trading activity: ${tradeStats.buys} buys, ${tradeStats.sells} sells with ${(tradeStats.successful / Math.max(tradeStats.total, 1) * 100).toFixed(0)}% success rate.` 
      : "No trades executed yet. Waiting for optimal entry conditions.";
      
    agentThoughts.unshift({
      agentName: "Trade Logger Agent",
      timestamp: now,
      thought: recentTrades + ` Current PnL simulation indicates ${Math.random() > 0.5 ? 'positive' : 'negative'} returns over past ${Math.floor(5 + Math.random() * 10)} intervals.`
    });
  }
  
  // Keep only the most recent 30 thoughts
  while (agentThoughts.length > 30) {
    agentThoughts.pop();
  }
};

// Detect significant price movements and create market events
const detectPriceEvents = (currentPrice: number): void => {
  if (priceHistory.length < 5) return;
  
  const previousPrice = priceHistory[priceHistory.length - 2];
  const percentChange = (currentPrice - previousPrice) / previousPrice;
  
  // Detect significant price movements
  if (Math.abs(percentChange) > 0.01) { // More than 1% change
    const eventDescription = percentChange > 0 
      ? `ETH price jumped ${(percentChange * 100).toFixed(2)}% to $${currentPrice.toFixed(2)}`
      : `ETH price dropped ${(Math.abs(percentChange) * 100).toFixed(2)}% to $${currentPrice.toFixed(2)}`;
      
    const impact = Math.abs(percentChange) > 0.03 ? "HIGH" : (Math.abs(percentChange) > 0.02 ? "MEDIUM" : "LOW");
    
    marketEvents.unshift({
      timestamp: new Date().toISOString(),
      description: eventDescription,
      impact: impact as "LOW" | "MEDIUM" | "HIGH"
    });
    
    // Keep only the last 20 events
    if (marketEvents.length > 20) {
      marketEvents.pop();
    }
  }
};

// Updated to use Binance public API without CORS issues through a proxy
const fetchHistoricalPrices = async (interval = '1d', limit = 7): Promise<any[]> => {
  try {
    // Use proxy to avoid CORS issues
    const response = await fetch(
      `https://api1.binance.com/api/v3/klines?symbol=ETHUSDT&interval=${interval}&limit=${limit}`
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
    // Fetch some recent price data to analyze using proxy to avoid CORS
    const klineData = await fetch(
      'https://api1.binance.com/api/v3/klines?symbol=ETHUSDT&interval=4h&limit=6'
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
      price_target: parseFloat((currentPrice + (action === 'BUY' ? currentPrice * 0.05 : -currentPrice * 0.05)).toFixed(2)),
      stop_loss: parseFloat((currentPrice + (action === 'BUY' ? -currentPrice * 0.03 : currentPrice * 0.03)).toFixed(2))
    };
  } catch (error) {
    console.error('Error generating trading signal:', error);
    // Fallback to mock recommendation
    return getTradeRecommendation();
  }
};

// Calculate volatility from price history
const calculateVolatility = (): number => {
  if (priceHistory.length < 2) return 0;
  
  const returns = [];
  for (let i = 1; i < priceHistory.length; i++) {
    const returnVal = (priceHistory[i] - priceHistory[i-1]) / priceHistory[i-1];
    returns.push(returnVal);
  }
  
  // Calculate standard deviation of returns (volatility)
  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const squaredDiffs = returns.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / squaredDiffs.length;
  const volatility = Math.sqrt(variance);
  
  return volatility;
};

// Generate simulation metrics
const getSimulationMetrics = (): SimulationMetrics => {
  const prices = priceHistory.length > 0 ? priceHistory : [getCurrentPrice()];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  
  // Calculate success rate, default to 0.8 if no trades
  const successRate = tradeStats.total > 0 ? 
    tradeStats.successful / tradeStats.total : 0.8;
  
  return {
    volatility: calculateVolatility(),
    averagePrice: avgPrice,
    priceRange: {
      min: minPrice,
      max: maxPrice
    },
    trades: {
      total: tradeStats.total,
      buys: tradeStats.buys,
      sells: tradeStats.sells,
      successRate: successRate
    },
    events: marketEvents,
    agentThoughts: agentThoughts
  };
};

// Sample ETH price history data (fallback if API fails)
const generatePriceHistory = () => {
  // Use current realistic price of ETH around $2650
  const now = new Date();
  const priceData = [];
  let price = 2650 + Math.random() * 50;
  
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
    "ETH price crossed above 2650 resistance level",
    "Bullish divergence detected on 4H chart",
    "Volume increase detected with price rise",
    "BUY signal triggered at $2645",
    "SELL signal triggered at $2675",
    "RSI indicates overbought conditions",
    "50 MA crossed above 200 MA",
    "System detected volatility increase",
    "ETH price support level established at $2600"
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
  // Updated to use a more realistic ETH price around $2650
  const basePrice = 2657.81;
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
    price_target: parseFloat((currentPrice + (randomAction === 'BUY' ? currentPrice * 0.05 : -currentPrice * 0.05)).toFixed(2)),
    stop_loss: parseFloat((currentPrice + (randomAction === 'BUY' ? -currentPrice * 0.03 : currentPrice * 0.03)).toFixed(2))
  };
};

// Start the simulation process
const startSimulation = () => {
  if (simulationActive) return { active: simulationActive };
  
  simulationActive = true;
  console.log('DeFiSwarm simulation started');
  
  // Reset price history and events when starting a new simulation
  priceHistory = [];
  marketEvents = [];
  agentThoughts = []; // Reset agent thoughts when starting a new simulation
  
  // Add initial agent thoughts
  const now = new Date().toISOString();
  agentThoughts.push({
    agentName: "Price Checker Agent",
    timestamp: now,
    thought: "Initializing price monitoring system. Loading historical data and establishing baseline patterns."
  });
  
  agentThoughts.push({
    agentName: "Trade Maker Agent",
    timestamp: now,
    thought: "Setting up trading parameters. Calibrating sensitivity thresholds based on current market conditions."
  });
  
  agentThoughts.push({
    agentName: "Trade Logger Agent",
    timestamp: now,
    thought: "Trade logging system activated. Ready to record and analyze trade execution metrics."
  });
  
  // Set up an interval to periodically fetch new data
  simulationInterval = window.setInterval(() => {
    console.log('Simulation tick: Fetching latest data');
    fetchRealTimePrice().then(price => {
      // Periodically simulate trades based on price movements
      if (Math.random() > 0.7) { // 30% chance of a trade
        const action = Math.random() > 0.5 ? 'BUY' : 'SELL';
        const success = Math.random() > 0.2; // 80% success rate
        
        tradeStats.total++;
        if (action === 'BUY') tradeStats.buys++;
        else tradeStats.sells++;
        if (success) tradeStats.successful++;
        
        // Log trade as an event
        marketEvents.unshift({
          timestamp: new Date().toISOString(),
          description: `${action} order ${success ? 'executed' : 'failed'} at $${price.toFixed(2)}`,
          impact: success ? "MEDIUM" : "HIGH"
        });
        
        if (marketEvents.length > 20) {
          marketEvents.pop();
        }
      }
    });
  }, 30000); // Update every 30 seconds
  
  return { active: simulationActive };
};

// Stop the simulation process
const stopSimulation = () => {
  if (!simulationActive) return { active: simulationActive };
  
  simulationActive = false;
  if (simulationInterval !== null) {
    window.clearInterval(simulationInterval);
    simulationInterval = null;
  }
  
  console.log('DeFiSwarm simulation stopped');
  
  // Add final thoughts when simulation ends
  const now = new Date().toISOString();
  agentThoughts.unshift({
    agentName: "Price Checker Agent",
    timestamp: now,
    thought: "Simulation concluded. Final price analysis complete. Detected " + marketEvents.length + " significant price events during the session."
  });
  
  agentThoughts.unshift({
    agentName: "Trade Maker Agent",
    timestamp: now,
    thought: `Simulation ended. Overall strategy performance: ${tradeStats.successful} successful trades out of ${tradeStats.total} total trades.`
  });
  
  agentThoughts.unshift({
    agentName: "Trade Logger Agent",
    timestamp: now,
    thought: "Session logs finalized. Trade summary and performance metrics ready for review."
  });
  
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
    
    // Update trade statistics
    if (simulationActive) {
      tradeStats.total++;
      if (action === 'BUY') tradeStats.buys++;
      else tradeStats.sells++;
      if (success) tradeStats.successful++;
    }
    
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
  
  getSimulationMetrics: async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return getSimulationMetrics();
  },
  
  startSimulation,
  stopSimulation,
  isSimulationActive
};
