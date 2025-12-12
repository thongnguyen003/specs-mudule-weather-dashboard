import axios from 'axios';
import type { WeatherData, CitySuggestion, HourlyForecast, DailyForecast } from '../types/weather';


const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

export const searchLocations = async (query: string): Promise<CitySuggestion[]> => {
    if (!query || query.length < 2) return [];
    
    try {
        const response = await axios.get(`${GEO_URL}?q=${query}&limit=5&appid=${API_KEY}`);
        return response.data;
    } catch (error) {
        console.error("Error searching locations", error);
        return [];
    }
};

const mapIcon = (code: string) => {
    const map: Record<string, string> = {
        '01d': 'sunny', '01n': 'sunny',
        '02d': 'partlyCloudy', '02n': 'partly-cloudy',
        '03d': 'overcast', '03n': 'overcast',
        '04d': 'overcast', '04n': 'overcast',
        '09d': 'drizzle', '09n': 'drizzle',
        '10d': 'rain', '10n': 'rain',
        '11d': 'storm', '11n': 'storm',
        '13d': 'snow', '13n': 'snow',
        '50d': 'fog', '50n': 'fog',
    };
    return map[code] || 'sunny';
};

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  try {
    const [currentRes, forecastRes] = await Promise.all([
      axios.get(`${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`),
      axios.get(`${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`)
    ]);

    const current = currentRes.data;
    const list = forecastRes.data.list;
    const todayStr = new Date().toISOString().split('T')[0];

    // 1. Chuẩn hóa dữ liệu hiện tại (Today)
    const currentData: DailyForecast = {
        date: todayStr,
        dayName: new Date().toLocaleDateString('en-US', { weekday: 'long' }), // Tuesday
        temp: Math.round(current.main.temp),
        minTemp: Math.round(current.main.temp_min), // API current ko chính xác min/max ngày, nhưng tạm dùng
        maxTemp: Math.round(current.main.temp_max),
        condition: current.weather[0].main,
        icon: mapIcon(current.weather[0].icon),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        windSpeed: Math.round(current.wind.speed * 3.6),
        precipitation: current.rain ? (current.rain['1h'] || 0) : 0
    };

    // 2. Xử lý danh sách Hourly thô (giữ nguyên để filter sau này)
    const allForecasts: HourlyForecast[] = list.map((item: any) => ({
        dt_txt: item.dt_txt, // "2025-08-05 15:00:00"
        time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(item.main.temp),
        icon: mapIcon(item.weather[0].icon)
    }));

    // 3. Xử lý Daily (Gom nhóm và lấy mốc giữa trưa làm đại diện chi tiết)
    const dailyMap = new Map<string, DailyForecast>();

    list.forEach((item: any) => {
        const dateStr = item.dt_txt.split(' ')[0];
        // Chỉ lấy dự báo tương lai
        if (dateStr === todayStr) return;

        const temp = item.main.temp;
        const icon = mapIcon(item.weather[0].icon);

        if (!dailyMap.has(dateStr)) {
            // Khởi tạo ngày mới
            dailyMap.set(dateStr, {
                date: dateStr,
                dayName: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
                temp: Math.round(temp), // Temp đại diện
                minTemp: Math.round(temp),
                maxTemp: Math.round(temp),
                condition: item.weather[0].main,
                icon: icon,
                feelsLike: Math.round(item.main.feels_like),
                humidity: item.main.humidity,
                windSpeed: Math.round(item.wind.speed * 3.6),
                precipitation: item.rain ? (item.rain['3h'] || 0) : 0
            });
        } else {
            // Cập nhật Min/Max
            const curr = dailyMap.get(dateStr)!;
            curr.minTemp = Math.round(Math.min(curr.minTemp, temp));
            curr.maxTemp = Math.round(Math.max(curr.maxTemp, temp));
            
            // Ưu tiên lấy dữ liệu lúc 12:00 trưa để hiển thị chi tiết (Wind/Humidity) chính xác nhất cho ban ngày
            if (item.dt_txt.includes("12:00:00")) {
                curr.temp = Math.round(temp);
                curr.icon = icon;
                curr.feelsLike = Math.round(item.main.feels_like);
                curr.humidity = item.main.humidity;
                curr.windSpeed = Math.round(item.wind.speed * 3.6);
                curr.condition = item.weather[0].main;
            }
        }
    });

    // Gom dữ liệu Today vào đầu danh sách Daily để hiển thị ở list dưới
    // (Tuy nhiên thiết kế thường tách Today ra, ở đây ta cứ trả về danh sách 5 ngày tới)
    const daily = Array.from(dailyMap.values()).slice(0, 6);

    return {
        city: current.name,
        country: current.sys.country,
        current: currentData,
        daily,
        allForecasts
    };

  } catch (error: any) {
    throw new Error(error.response?.status === 404 ? 'NOT_FOUND' : 'API_ERROR');
  }
};