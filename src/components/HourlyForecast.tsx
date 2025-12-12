import React from 'react';
import type { HourlyForecast as HourlyType, UnitType } from '../types/weather';
import { SystemIcons, getWeatherIcon } from '../utils/imageMap';
import { formatTemp } from '../utils/formatters';

interface Props {
  data: HourlyType[];
  unit: UnitType;
  dateName: string | null;
}

export const HourlyForecast: React.FC<Props> = ({ data, unit, dateName }) => {
  return (
    // Mobile: min-h-fit (co giãn theo nội dung), Desktop: min-h-[500px]
    <div className="bg-surface rounded-[32px] p-5 md:p-6 h-full flex flex-col min-h-fit md:min-h-[500px]">
        <div className="flex justify-between items-center mb-4 md:mb-6">
             <h3 className="font-semibold text-text-secondary uppercase text-xs tracking-wider">Hourly Forecast</h3>
             <div className="bg-background/50 px-3 py-1 rounded-lg text-xs font-medium text-text-secondary">{dateName}</div>
        </div>
        
        {/* Custom scrollbar class giúp đẹp hơn trên desktop */}
        <div className="flex-1 space-y-1 overflow-y-auto pr-1 custom-scrollbar">
            {data.map((hour, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 md:p-4 rounded-xl hover:bg-black/20 transition-colors group cursor-default">
                    <span className="w-16 text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{hour.time}</span>
                    <img src={getWeatherIcon(hour.icon)} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="icon" />
                    <span className="w-12 text-right font-bold text-base md:text-lg text-white">{formatTemp(hour.temp, unit)}°</span>
                </div>
            ))}
        </div>
    </div>
  );
};