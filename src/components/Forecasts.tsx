import React from 'react';
import type { DailyForecast, HourlyForecast, UnitType } from '../types/weather';
import { getWeatherIcon } from '../utils/imageMap'; // Dùng hàm map icon

const convertTemp = (temp: number, unit: UnitType) => unit === 'metric' ? temp : Math.round(temp * 1.8 + 32);

export const HourlyWidget: React.FC<{ data: HourlyForecast[], unit: UnitType }> = ({ data, unit }) => (
  <div className="bg-surface rounded-3xl p-6 h-full flex flex-col">
    <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-text-secondary uppercase text-xs tracking-wider">Hourly Forecast</h3>
    </div>
    <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
      {data.map((item, idx) => (
        <div key={idx} className="flex justify-between items-center p-3 rounded-xl hover:bg-black/20 transition-colors group">
          <span className="w-16 text-sm font-medium text-gray-300 group-hover:text-white">{item.time}</span>
          
          <img 
            src={getWeatherIcon(item.icon)} // Map string -> image path
            alt={item.icon} 
            className="w-10 h-10 object-contain"
          />
          
          <span className="w-12 text-right font-semibold text-lg">{convertTemp(item.temp, unit)}°</span>
        </div>
      ))}
    </div>
  </div>
);

export const DailyWidget: React.FC<{ data: DailyForecast[], unit: UnitType }> = ({ data, unit }) => (
  <div className="mt-6">
    <h3 className="font-semibold text-text-secondary uppercase text-xs tracking-wider mb-4">Daily Forecast</h3>
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {data.map((item, idx) => (
        <div key={idx} className="bg-surface p-4 rounded-2xl flex flex-col items-center gap-3 hover:bg-surface/80 transition-colors cursor-pointer">
            <span className="text-sm font-medium text-text-secondary">{item.date}</span>
            <img 
                src={getWeatherIcon(item.condition)} 
                alt={item.condition} 
                className="w-12 h-12 object-contain"
            />
            <div className="text-base font-bold">
                {convertTemp(item.maxTemp, unit)}° 
                <span className="text-text-secondary font-medium text-sm ml-1 opacity-60">{convertTemp(item.minTemp, unit)}°</span>
            </div>
        </div>
      ))}
    </div>
  </div>
);