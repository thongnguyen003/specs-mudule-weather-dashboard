import type { UnitType } from '../types/weather';

export const formatTemp = (temp: number, unit: UnitType): number => {
  return unit === 'metric' ? temp : Math.round(temp * 1.8 + 32);
};

export const formatSpeed = (speed: number, unit: UnitType): string => {
  return unit === 'metric' 
    ? `${speed} km/h` 
    : `${Math.round(speed * 0.621371)} mph`;
};