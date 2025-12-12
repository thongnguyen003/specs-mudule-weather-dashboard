import React, { useState } from 'react';
import type { UnitType } from '../types/weather';
import { SystemIcons } from '../utils/imageMap';

interface Props {
  unit: UnitType;
  onUnitChange: (unit: UnitType) => void;
}

export const Header: React.FC<Props> = ({ unit, onUnitChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (u: UnitType) => {
    onUnitChange(u);
    setIsOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <img src={SystemIcons.logo} className="h-8 md:h-10" alt="Weather Now" />
      
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-surface hover:bg-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors border border-transparent hover:border-slate-600 text-white"
        >
          <img src={SystemIcons.units} className="w-6 h-6" alt="Settings" />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
            <div className="px-4 py-3 text-xs text-text-secondary uppercase font-bold tracking-wider">Switch to Imperial</div>
            <button onClick={() => handleSelect('metric')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex justify-between items-center text-white">
              <span>Celsius (°C)</span>
              {unit === 'metric' && <img src={SystemIcons.checkmark} className="w-4 h-4" alt="Selected" />}
            </button>
            <button onClick={() => handleSelect('imperial')} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm flex justify-between items-center text-white">
              <span>Fahrenheit (°F)</span>
              {unit === 'imperial' && <img src={SystemIcons.checkmark} className="w-4 h-4" alt="Selected" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};