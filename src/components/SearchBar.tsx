import React, { useState, useEffect, useRef } from 'react';
import { SystemIcons } from '../utils/imageMap';
import { searchLocations } from '../services/weatherService';
import type { CitySuggestion } from '../types/weather';

interface Props {
  onSearch: (city: string) => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false); // Loading state cho dropdown riêng
  const wrapperRef = useRef<HTMLDivElement>(null); // Để xử lý click outside

  // Xử lý Debounce Search (chờ 500ms sau khi gõ mới gọi API)
  useEffect(() => {
    const timer = setTimeout(async () => {
        if (input.trim().length >= 2) {
            setIsSearching(true);
            const results = await searchLocations(input);
            setSuggestions(results);
            setIsSearching(false);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, 500);

    return () => clearTimeout(timer);
  }, [input]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
        onSearch(input);
        setShowSuggestions(false);
    }
  };

  const handleSelectCity = (city: CitySuggestion) => {
      // Format: "London, GB" hoặc "London, US"
      const cityQuery = `${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`; // Có thể thêm state nếu cần
      setInput(city.name); // Hiển thị tên ngắn gọn trên input
      onSearch(city.name); // Gọi hàm search chính của App
      setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-[600px] relative z-50">
        <form onSubmit={handleSubmit} className="flex gap-3 w-full relative">
            <div className="relative flex-1 group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-60">
                    {isSearching ? (
                         // Loading Spinner nhỏ khi đang tìm gợi ý
                        <div className="w-5 h-5 border-2 border-text-secondary border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <img src={SystemIcons.search} className="w-5 h-5" alt="Search" />
                    )}
                </div>
                <input 
                    type="text" 
                    placeholder="Search for a place..." 
                    className="w-full bg-surface text-white pl-12 pr-4 py-3.5 rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-text-secondary border border-transparent focus:border-primary/30"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                    disabled={isLoading}
                />

                {/* --- DROPDOWN SUGGESTIONS --- */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in">
                        <ul>
                            {suggestions.map((city, index) => (
                                <li 
                                    key={`${city.lat}-${city.lon}-${index}`}
                                    onClick={() => handleSelectCity(city)}
                                    className="px-4 py-3 hover:bg-white/10 cursor-pointer flex justify-between items-center text-sm transition-colors border-b border-slate-700/50 last:border-0"
                                >
                                    <span className="text-white font-medium">
                                        {city.name}
                                        {city.state && <span className="text-text-secondary font-normal">, {city.state}</span>}
                                    </span>
                                    <span className="text-text-secondary text-xs bg-slate-700/50 px-2 py-1 rounded">
                                        {city.country}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            <button 
                type="submit" 
                disabled={isLoading}
                className="bg-primary hover:bg-blue-600 disabled:opacity-70 text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
            >
                {isLoading ? '...' : 'Search'}
            </button>
        </form>
    </div>
  );
};