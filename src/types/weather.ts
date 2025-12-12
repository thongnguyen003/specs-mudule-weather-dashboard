export interface WeatherData {
  city: string;
  country: string;
  // Dữ liệu hiện tại (Today)
  current: DailyForecast; 
  // Danh sách dự báo tóm tắt từng ngày
  daily: DailyForecast[];
  // Dữ liệu thô 5 ngày / 3 giờ (để lọc hourly cho từng ngày)
  allForecasts: HourlyForecast[]; 
}

// Gộp chung cấu trúc để dùng cho cả Today và Future Days
export interface DailyForecast {
  date: string;      // YYYY-MM-DD
  dayName: string;   // Monday, Tuesday...
  temp: number;
  minTemp: number;
  maxTemp: number;
  condition: string;
  icon: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}
// Thêm vào file hiện có
export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface HourlyForecast {
  dt_txt: string; // Giữ nguyên timestamp để lọc ngày
  time: string;
  temp: number;
  icon: string;
}

export type UnitType = 'metric' | 'imperial';