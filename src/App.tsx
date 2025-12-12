import { useState, useEffect, useMemo } from 'react';
import { fetchWeatherData } from './services/weatherService';
import type { WeatherData, UnitType } from './types/weather';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeather } from './components/CurrentWeather';
import { DailyForecast } from './components/DailyForecast';
import { HourlyForecast } from './components/HourlyForecast';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { ErrorView } from './components/ErrorView';

function App() {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR' | 'NOT_FOUND'>('IDLE');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [unit, setUnit] = useState<UnitType>('metric');
  const [dateName, setDateName] = useState<string | null>(null); 
  // State lưu ngày đang được chọn (mặc định là null = Today)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
   useEffect(() => {
    if (weather) {
      setDateName(weather.current.dayName);
    }
  }, [weather]);

  const loadWeather = async (city: string) => {
    setStatus('LOADING');
    setSelectedDate(null); // Reset về Today khi search mới
    try {
      const data = await fetchWeatherData(city);
      setWeather(data);
      setStatus('SUCCESS');
    } catch (err: any) {
      setStatus(err.message === 'NOT_FOUND' ? 'NOT_FOUND' : 'ERROR');
    }
  };

  useEffect(() => { loadWeather('Berlin'); }, []);

  // --- Logic tính toán dữ liệu hiển thị (Computed Data) ---
  
  // 1. Dữ liệu hiển thị ở Main Card
  const displayWeather = useMemo(() => {
    if (!weather) return null;
    // Nếu chọn ngày khác -> Tìm trong mảng daily, Nếu không -> Lấy current
    if (selectedDate && selectedDate !== weather.current.date) {
        return weather.daily.find(d => d.date === selectedDate) || weather.current;
    }
    return weather.current;
  }, [weather, selectedDate]);

  // 2. Dữ liệu hiển thị ở Hourly Sidebar
  const displayHourly = useMemo(() => {
    if (!weather) return [];
    
    const targetDate = selectedDate || weather.current.date;
    
    // Lọc ra các mốc giờ thuộc ngày targetDate
    let hourly = weather.allForecasts.filter(h => h.dt_txt.startsWith(targetDate));

    // Fix: Nếu ngày hiện tại (Today) đã qua hết giờ (vd 11PM), API forecast ngày hôm nay sẽ rỗng
    // Lúc đó ta lấy 7 mốc tiếp theo bất kể ngày nào (như logic cũ)
    if (hourly.length === 0 && targetDate === weather.current.date) {
         // Lấy 7 mốc giờ tiếp theo từ bây giờ
         return weather.allForecasts.slice(0, 7);
    }

    return hourly;
  }, [weather, selectedDate]);


  return (
    <div className="min-h-screen bg-background text-text-main p-4 md:p-8 flex justify-center font-sans pb-10">
      <div className="w-full max-w-[1200px]">
        
        <Header unit={unit} onUnitChange={setUnit} />

        {(status === 'IDLE' || (status === 'SUCCESS' && weather)) && (
            <div className="text-center mb-6 animate-fade-in">
                <h1 className="text-2xl md:text-4xl font-bold mb-2">How's the sky looking today?</h1>
            </div>
        )}

        <div className="flex justify-center mb-6 md:mb-8">
            <SearchBar onSearch={loadWeather} isLoading={status === 'LOADING'} />
        </div>

        {status === 'LOADING' && <LoadingSkeleton />}
        
        {(status === 'ERROR' || status === 'NOT_FOUND') && (
            <ErrorView type={status} onRetry={() => loadWeather('Berlin')} />
        )}

        {status === 'SUCCESS' && weather && displayWeather && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                
                <div className="lg:col-span-2 space-y-6">
                    {/* Hiển thị dữ liệu được tính toán ở displayWeather */}
                    <CurrentWeather 
                        data={displayWeather} 
                        city={weather.city}
                        country={weather.country}
                        unit={unit} 
                    />
                    
                    {/* Danh sách ngày: Truyền selectedDate vào để highlight */}
                    <DailyForecast 
                        data={weather.daily} 
                        unit={unit} 
                        selectedDate={displayWeather.date}
                        onSelect={(date) => setSelectedDate(date)}
                    />
                </div>

                <div className="lg:col-span-1">
                    <HourlyForecast data={displayHourly} unit={unit} dateName={dateName} />
                </div>
            </div>
        )}

      </div>
    </div>
  );
}

export default App;