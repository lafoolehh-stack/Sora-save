import React from 'react';
import { Download, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-slate-900/80 border-b border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Download className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            SaveSora
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">How to Download</a>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Features</a>
          <a href="#" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">FAQ</a>
          <button className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-all border border-slate-700">
            Install App
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-slate-300 hover:text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-slate-900 border-b border-slate-800 p-4 flex flex-col space-y-4 shadow-2xl animate-fade-in">
          <a href="#" className="text-slate-300 hover:text-white py-2">How to Download</a>
          <a href="#" className="text-slate-300 hover:text-white py-2">Features</a>
          <a href="#" className="text-slate-300 hover:text-white py-2">FAQ</a>
        </div>
      )}
    </header>
  );
};

export default Header;
