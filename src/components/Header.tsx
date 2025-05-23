
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, TrendingUp, Bell } from 'lucide-react';
import { api } from '@/lib/api';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const price = await api.getCurrentETHPrice();
        setCurrentPrice(price);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch ETH price:', error);
        setIsLoading(false);
      }
    };

    fetchPrice();
    
    // Update price every 15 seconds
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-defi-dark-blue/80 backdrop-blur-md border-b border-defi-blue/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-defi-teal to-defi-bright-teal flex items-center justify-center mr-2 animate-pulse-glow">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">DeFiSwarm</span>
              </Link>
            </div>
          </div>

          {/* ETH Price Indicator (Desktop) */}
          <div className="hidden md:flex items-center">
            <div className="bg-defi-blue/30 rounded-lg px-4 py-2 flex items-center">
              <span className="text-defi-gray mr-2">ETH</span>
              {isLoading ? (
                <div className="h-5 w-24 bg-defi-blue/30 rounded animate-pulse"></div>
              ) : (
                <span className="font-mono font-bold text-white">${currentPrice?.toLocaleString()}</span>
              )}
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-defi-gray hover:text-white transition-colors">Dashboard</Link>
            <Link to="/trades" className="text-defi-gray hover:text-white transition-colors">Trades</Link>
            <Link to="/analytics" className="text-defi-gray hover:text-white transition-colors">Analytics</Link>
            <a href="#about" className="text-defi-gray hover:text-white transition-colors">About</a>
          </div>

          {/* CTA Button & Notifications (Desktop) */}
          <div className="hidden md:flex items-center">
            <button className="rounded-full w-8 h-8 flex items-center justify-center bg-defi-blue/30 hover:bg-defi-blue/50 transition-colors mr-4">
              <Bell className="h-4 w-4 text-defi-gray" />
            </button>
            <button className="bg-gradient-to-r from-defi-teal to-defi-bright-teal hover:opacity-90 transition-opacity text-white font-medium px-4 py-2 rounded-md">
              Start Simulation
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-400 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-defi-blue border-b border-defi-blue/30`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-defi-light-blue/20">
            Dashboard
          </Link>
          <Link to="/trades" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-defi-light-blue/20">
            Trades
          </Link>
          <Link to="/analytics" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-defi-light-blue/20">
            Analytics
          </Link>
          <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-defi-light-blue/20">
            About
          </a>
          
          <div className="pt-4 pb-2">
            {/* ETH Price (Mobile) */}
            <div className="px-3 py-2">
              <div className="bg-defi-blue/30 rounded-lg px-4 py-2 flex items-center justify-center">
                <span className="text-defi-gray mr-2">ETH</span>
                {isLoading ? (
                  <div className="h-5 w-24 bg-defi-blue/40 rounded animate-pulse"></div>
                ) : (
                  <span className="font-mono font-bold text-white">${currentPrice?.toLocaleString()}</span>
                )}
              </div>
            </div>
            
            {/* CTA Button (Mobile) */}
            <div className="px-3 py-2">
              <button className="w-full bg-gradient-to-r from-defi-teal to-defi-bright-teal hover:opacity-90 transition-opacity text-white font-medium px-4 py-2 rounded-md">
                Start Simulation
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
