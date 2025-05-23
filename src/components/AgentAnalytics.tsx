
import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Brain, TrendingUp, BarChart2, History } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AgentThought {
  agentName: string;
  timestamp: string;
  thought: string;
}

interface AgentDecision {
  agentName: string;
  timestamp: string;
  decision: string;
  confidence: number;
  reasoning: string;
}

const AgentAnalytics: React.FC = () => {
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [decisions, setDecisions] = useState<AgentDecision[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("decisions");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const metrics = await api.getSimulationMetrics();
        
        // Get agent thoughts from simulation metrics
        setThoughts(metrics.agentThoughts || []);
        
        // Generate decisions based on agent thoughts
        const generatedDecisions: AgentDecision[] = [];
        
        if (metrics.agentThoughts && metrics.agentThoughts.length > 0) {
          metrics.agentThoughts.forEach(thought => {
            // Only create decisions for selected thoughts (not all thoughts lead to decisions)
            if (thought.thought.includes('BUY') || thought.thought.includes('SELL') || 
                thought.thought.includes('momentum') || thought.thought.includes('trend')) {
              
              let decision = "";
              let confidence = 0;
              
              if (thought.agentName === "Trade Maker Agent") {
                if (thought.thought.includes('BUY')) {
                  decision = "BUY";
                  confidence = 70 + Math.floor(Math.random() * 30);
                } else if (thought.thought.includes('SELL')) {
                  decision = "SELL";
                  confidence = 70 + Math.floor(Math.random() * 30);
                } else {
                  decision = "HOLD";
                  confidence = 50 + Math.floor(Math.random() * 50);
                }
                
                generatedDecisions.push({
                  agentName: thought.agentName,
                  timestamp: thought.timestamp,
                  decision,
                  confidence,
                  reasoning: thought.thought
                });
              }
            }
          });
        }
        
        // Sort decisions by timestamp (newest first)
        generatedDecisions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setDecisions(generatedDecisions);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);

  const getAgentColor = (agentName: string) => {
    switch (agentName) {
      case 'Price Checker Agent':
        return 'text-blue-400';
      case 'Trade Maker Agent':
        return 'text-green-400';
      case 'Trade Logger Agent':
        return 'text-purple-400';
      default:
        return 'text-defi-bright-teal';
    }
  };
  
  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'BUY':
        return 'bg-defi-green text-white';
      case 'SELL':
        return 'bg-defi-red text-white';
      default:
        return 'bg-defi-blue/50 text-white';
    }
  };

  return (
    <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Agent Analytics</h2>
      </div>
      
      <Tabs defaultValue="decisions" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="decisions">Trading Decisions</TabsTrigger>
          <TabsTrigger value="thoughts">Agent Thinking</TabsTrigger>
        </TabsList>
        
        <TabsContent value="decisions">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-defi-bright-teal" />
            <h3 className="font-semibold">Agent Trading Decisions</h3>
          </div>
          
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-pulse text-defi-gray">Loading agent decisions...</div>
            </div>
          ) : decisions.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {decisions.map((decision, index) => (
                <div key={index} className="bg-defi-blue/40 p-4 rounded-lg border border-defi-blue/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className={`font-medium ${getAgentColor(decision.agentName)}`}>{decision.agentName}</span>
                    <span className="text-xs text-defi-gray">{new Date(decision.timestamp).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDecisionColor(decision.decision)}`}>
                      {decision.decision}
                    </span>
                    <div className="text-xs text-defi-gray">
                      Confidence: <span className="text-white">{decision.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-defi-blue/30 rounded-full h-1.5 mb-3">
                    <div className="bg-gradient-to-r from-defi-teal to-defi-bright-teal h-1.5 rounded-full" 
                         style={{ width: `${decision.confidence}%` }}></div>
                  </div>
                  
                  <div className="mt-2 text-sm text-white/90">
                    <p>{decision.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-defi-gray py-8">
              No agent decisions recorded yet
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="thoughts">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-defi-bright-teal" />
            <h3 className="font-semibold">Agent Thought Processes</h3>
          </div>
          
          {isLoading ? (
            <div className="h-48 flex items-center justify-center">
              <div className="animate-pulse text-defi-gray">Loading agent thoughts...</div>
            </div>
          ) : thoughts.length > 0 ? (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {thoughts.map((thought, index) => (
                <div 
                  key={index} 
                  className="bg-defi-blue/30 rounded-lg p-3 border border-defi-blue/30"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`font-medium ${getAgentColor(thought.agentName)}`}>
                      {thought.agentName}
                    </span>
                    <span className="text-xs text-defi-gray">
                      {new Date(thought.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-white/90">{thought.thought}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-defi-gray py-8">
              No agent activity recorded yet
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 rounded-lg bg-defi-blue/40 flex items-center gap-2">
              <div className="h-3 w-3 bg-blue-400 rounded-full"></div>
              <span className="text-xs">Price Checker</span>
            </div>
            <div className="p-3 rounded-lg bg-defi-blue/40 flex items-center gap-2">
              <div className="h-3 w-3 bg-green-400 rounded-full"></div>
              <span className="text-xs">Trade Maker</span>
            </div>
            <div className="p-3 rounded-lg bg-defi-blue/40 flex items-center gap-2">
              <div className="h-3 w-3 bg-purple-400 rounded-full"></div>
              <span className="text-xs">Trade Logger</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentAnalytics;
