
import React from 'react';

const Header: React.FC = () => {
  return (
    <nav className="bg-slate-900 border-b border-slate-700 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-slate-100 tracking-tight">
              Maturity Assessment
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">Accueil</a>
            <a href="#" className="text-slate-300 hover:text-white hover:bg-slate-800 px-3 py-2 rounded-md text-sm font-medium transition-colors">Modèles</a>
            <a href="#" className="bg-blue-700 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
              Connexion
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
