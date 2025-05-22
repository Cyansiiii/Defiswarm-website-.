
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import PriceChart from '@/components/PriceChart';
import TradePanel from '@/components/TradePanel';
import ActivityLog from '@/components/ActivityLog';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // Start the simulation automatically when the page loads
    const startAutomatically = async () => {
      try {
        const status = api.isSimulationActive();
        
        if (!status.active) {
          const newStatus = api.startSimulation();
          
          if (newStatus.active) {
            toast({
              title: "Simulation Started",
              description: "DeFiSwarm is now actively monitoring ETH/USDT prices.",
            });
          }
        }
      } catch (error) {
        console.error("Failed to start simulation:", error);
      }
    };
    
    startAutomatically();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-defi-dark-blue">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        <section className="py-16 container mx-auto px-4" id="dashboard">
          <h2 className="text-3xl font-bold mb-2">ETH Trading Dashboard</h2>
          <p className="text-defi-gray mb-8">Real-time Ethereum monitoring and trading simulation</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PriceChart />
            </div>
            <div>
              <TradePanel />
            </div>
          </div>
          
          <div className="mt-6">
            <ActivityLog />
          </div>
        </section>
        
        <section className="py-16 bg-defi-blue/10">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">How DeFiSwarm Works</h2>
              <p className="text-defi-gray">
                Our intelligent system monitors Ethereum prices, analyzes market conditions, and provides trading signals through a three-step process.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -right-4 -top-4 bg-defi-bright-teal/10 h-24 w-24 rounded-full filter blur-xl group-hover:bg-defi-bright-teal/20 transition-colors"></div>
                <div className="relative z-10">
                  <div className="bg-defi-blue/40 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-defi-bright-teal font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Price Monitoring</h3>
                  <p className="text-defi-gray">
                    The system continuously tracks Ethereum's price movements across multiple exchanges for accurate market data.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -right-4 -top-4 bg-defi-bright-teal/10 h-24 w-24 rounded-full filter blur-xl group-hover:bg-defi-bright-teal/20 transition-colors"></div>
                <div className="relative z-10">
                  <div className="bg-defi-blue/40 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-defi-bright-teal font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Smart Analysis</h3>
                  <p className="text-defi-gray">
                    Advanced algorithms analyze price patterns, trading volumes, and market indicators to identify potential opportunities.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="bg-defi-blue/20 rounded-xl border border-defi-blue/30 p-6 backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute -right-4 -top-4 bg-defi-bright-teal/10 h-24 w-24 rounded-full filter blur-xl group-hover:bg-defi-bright-teal/20 transition-colors"></div>
                <div className="relative z-10">
                  <div className="bg-defi-blue/40 h-12 w-12 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-defi-bright-teal font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Decision Engine</h3>
                  <p className="text-defi-gray">
                    The system generates buy or sell recommendations based on current market conditions and historical performance.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-defi-gray mb-6">
                DeFiSwarm is for educational purposes only. No real trading is performed.
              </p>
              <button className="bg-defi-blue/30 hover:bg-defi-blue/50 transition-colors text-white font-medium px-6 py-3 rounded-md inline-flex items-center">
                Learn More About Our Technology
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
