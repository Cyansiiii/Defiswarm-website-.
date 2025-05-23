
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LineChart, BookOpen, Home } from 'lucide-react';

const NavigationMenu: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-defi-blue/30 rounded-xl border border-defi-blue/30 p-4 mb-6 backdrop-blur-sm">
      <nav className="flex flex-wrap gap-2">
        <Link 
          to="/" 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isActive('/') 
              ? 'bg-defi-bright-teal text-white' 
              : 'bg-defi-blue/40 text-white/90 hover:bg-defi-blue/60'
          }`}
        >
          <Home size={18} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          to="/trades" 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isActive('/trades') 
              ? 'bg-defi-bright-teal text-white' 
              : 'bg-defi-blue/40 text-white/90 hover:bg-defi-blue/60'
          }`}
        >
          <BookOpen size={18} />
          <span>Trades</span>
        </Link>
        
        <Link 
          to="/analytics" 
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isActive('/analytics') 
              ? 'bg-defi-bright-teal text-white' 
              : 'bg-defi-blue/40 text-white/90 hover:bg-defi-blue/60'
          }`}
        >
          <LineChart size={18} />
          <span>Analytics</span>
        </Link>
      </nav>
    </div>
  );
};

export default NavigationMenu;
