
import React from 'react';
import { TrendingUp, Github, Twitter, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-defi-dark-blue border-t border-defi-blue/30 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 rounded-md bg-gradient-to-br from-defi-teal to-defi-bright-teal flex items-center justify-center mr-2">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">DeFiSwarm</span>
            </div>
            <p className="text-defi-gray text-sm mb-4">
              Advanced Ethereum trading simulation powered by real-time market analysis.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/Cyansiiii/DeFiSwarm-Simulation.git"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-defi-gray hover:text-white transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#twitter"
                className="text-defi-gray hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-3">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-defi-gray hover:text-white text-sm transition-colors">Features</a>
              </li>
              <li>
                <a href="#dashboard" className="text-defi-gray hover:text-white text-sm transition-colors">Dashboard</a>
              </li>
              <li>
                <a href="#analytics" className="text-defi-gray hover:text-white text-sm transition-colors">Analytics</a>
              </li>
              <li>
                <a href="#simulation" className="text-defi-gray hover:text-white text-sm transition-colors">Simulation</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#docs" className="text-defi-gray hover:text-white text-sm transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#github" className="text-defi-gray hover:text-white text-sm transition-colors">GitHub</a>
              </li>
              <li>
                <a href="#api" className="text-defi-gray hover:text-white text-sm transition-colors">API</a>
              </li>
              <li>
                <a href="#faq" className="text-defi-gray hover:text-white text-sm transition-colors">FAQ</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-3">Updates</h3>
            <p className="text-defi-gray text-sm mb-4">
              Subscribe to stay updated with the latest DeFiSwarm developments.
            </p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-defi-blue/30 border border-defi-blue/60 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-defi-bright-teal/50"
              />
              <button className="absolute right-1 top-1 bg-defi-teal hover:bg-defi-bright-teal transition-colors rounded-md p-1.5">
                <ArrowRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-defi-blue/30 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-defi-gray text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} DeFiSwarm. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#terms" className="text-defi-gray hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#privacy" className="text-defi-gray hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
