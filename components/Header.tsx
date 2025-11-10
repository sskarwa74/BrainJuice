
import React from 'react';
import { BuildingIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="flex items-center p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <BuildingIcon className="w-8 h-8 text-cyan-400" />
      <h1 className="ml-3 text-2xl font-bold tracking-tight text-gray-100">
        Lumir <span className="font-light text-gray-400">Real Estate Advisor</span>
      </h1>
    </header>
  );
};

export default Header;
