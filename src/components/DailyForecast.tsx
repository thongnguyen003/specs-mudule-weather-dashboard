import React from 'react';
import type { DailyForecast as DailyType, UnitType } from '../types/weather';
import { formatTemp } from '../utils/formatters';
import {  getWeatherIcon } from '../utils/imageMap';

interface Props {
  data: DailyType[];
  unit: UnitType;
  selectedDate: string; // Ngày đang được chọn
  onSelect: (date: string) => void; // Hàm xử lý khi click
}

export const DailyForecast: React.FC<Props> = ({ data, unit, selectedDate, onSelect }) => {
  return (
    <div>
        <h3 className="font-semibold text-text-secondary uppercase text-xs tracking-wider mb-4">Daily Forecast</h3>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {data.map((day, idx) => {
                const isSelected = day.date === selectedDate;
                return (
                    <div 
                        key={idx} 
                        onClick={() => onSelect(day.date)}
                        className={`
                            p-3 md:p-4 rounded-2xl flex flex-col items-center gap-2 md:gap-3 transition-all cursor-pointer border
                            ${isSelected 
                                ? 'bg-surface border-primary shadow-lg scale-105' // Active State
                                : 'bg-surface border-transparent hover:bg-surface/80 hover:scale-105' // Normal State
                            }
                        `}
                    >
                        <span className="text-sm font-medium text-text-secondary">{day.dayName}</span>
                        <img src={getWeatherIcon(day.icon)} className="w-8 h-8 md:w-10 md:h-10 object-contain" alt="icon" />
                        <div className="text-sm md:text-base font-bold text-white">
                            {formatTemp(day.maxTemp, unit)}° 
                            <span className="text-text-secondary font-medium text-xs md:text-sm ml-1 opacity-60">
                                {formatTemp(day.minTemp, unit)}°
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};