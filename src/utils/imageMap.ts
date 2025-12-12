// Import System Icons
import logo from '../assets/images/logo.svg';
import iconSearch from '../assets/images/icon-search.svg';
import iconUnits from '../assets/images/icon-units.svg';
import iconLoading from '../assets/images/icon-loading.svg';
import iconError from '../assets/images/icon-error.svg';
import iconRetry from '../assets/images/icon-retry.svg';
import iconCheckmark from '../assets/images/icon-checkmark.svg';
import iconDropdown from '../assets/images/icon-dropdown.svg';

// Import Weather Backgrounds
import bgLarge from '../assets/images/bg-today-large.svg';
import bgSmall from '../assets/images/bg-today-small.svg'; // Dùng nếu muốn responsive mobile

// Import Weather Icons
import sunny from '../assets/images/icon-sunny.webp';
import rain from '../assets/images/icon-rain.webp';
import storm from '../assets/images/icon-storm.webp';
import snow from '../assets/images/icon-snow.webp';
import drizzle from '../assets/images/icon-drizzle.webp';
import fog from '../assets/images/icon-fog.webp';
import overcast from '../assets/images/icon-overcast.webp';
import partlyCloudy from '../assets/images/icon-partly-cloudy.webp';

// Export system icons để dùng ở các component khác
export const SystemIcons = {
    logo,
    search: iconSearch,
    units: iconUnits,
    loading: iconLoading,
    error: iconError,
    retry: iconRetry,
    checkmark: iconCheckmark,
    dropdown: iconDropdown,
    bgLarge,
    bgSmall
};

// Hàm lấy icon thời tiết dựa trên condition (match với Mock Data/API)
export const getWeatherIcon = (condition: string): string => {
    const c = condition.toLowerCase();
    
    // Logic khớp với return của hàm mapIcon bên service
    if (c === 'storm') return storm;
    if (c === 'snow') return snow;
    if (c === 'drizzle') return drizzle;
    if (c === 'rain') return rain;
    if (c === 'fog') return fog;
    if (c === 'overcast') return overcast;
    if (c === 'partlyCloudy') return partlyCloudy;
    if (c === 'sunny') return sunny;
    
    // Fallback cho các trường hợp khác
    if (c.includes('cloud')) return partlyCloudy;
    return sunny; 
};