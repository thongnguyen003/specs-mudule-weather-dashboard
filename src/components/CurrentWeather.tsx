import React from 'react';
import type { DailyForecast, UnitType } from '../types/weather'; // Import đúng type
import { SystemIcons, getWeatherIcon } from '../utils/imageMap';
import { formatTemp, formatSpeed } from '../utils/formatters';

interface Props {
  data: DailyForecast; // Đổi type thành DailyForecast
  city: string;        // Nhận thêm props city
  country: string;     // Nhận thêm props country
  unit: UnitType;
}

export const CurrentWeather: React.FC<Props> = ({ data, city, country, unit }) => {
  // Format ngày hiển thị đẹp hơn
  const displayDate = new Date(data.date).toLocaleDateString('en-US', { 
    weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' 
  });

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="relative rounded-[32px] overflow-hidden p-6 md:p-8 min-h-[280px] md:min-h-[320px] flex items-center shadow-2xl text-white transition-all duration-500">
         <img src={SystemIcons.bgLarge} className="absolute inset-0 w-full h-full object-cover z-0" alt="bg" />
         
         <div className="relative z-10 flex justify-between items-center w-full px-1 md:px-2 animate-fade-in">
             <div>
                 <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{city}, {country}</h2>
                 <p className="text-gray-200 text-sm mb-6 md:mb-10">{displayDate}</p>
                 <div className="text-6xl md:text-[90px] font-bold leading-none tracking-tighter">
                     {formatTemp(data.temp, unit)}°
                 </div>
             </div>
             <img 
                src={getWeatherIcon(data.icon)} // Icon đã được map sẵn ở service
                className="w-32 h-32 md:w-48 md:h-48 drop-shadow-2xl filter object-contain" 
                alt="Weather Icon" 
             />
         </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
           <StatBox label="Feels Like" value={`${formatTemp(data.feelsLike, unit)}°`} />
           <StatBox label="Humidity" value={`${data.humidity}%`} />
           <StatBox label="Wind" value={formatSpeed(data.windSpeed, unit)} />
           <StatBox label="Precipitation" value={`${data.precipitation} mm`} />
      </div>
    </div>
  );
};

const StatBox = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-surface p-4 md:p-5 rounded-2xl md:rounded-3xl flex flex-col justify-between h-28 md:h-32">
        <span className="text-sm font-medium text-text-secondary">{label}</span>
        <span className="text-xl md:text-2xl font-bold text-white">{value}</span>
    </div>
);