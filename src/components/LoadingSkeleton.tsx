import React from 'react';
import { SystemIcons } from '../utils/imageMap';

export const LoadingSkeleton: React.FC = () => (
  <div className="w-full mt-4 animate-pulse">
    <div className="h-[300px] bg-surface rounded-3xl mb-6 flex flex-col items-center justify-center">
        <img src={SystemIcons.loading} className="w-12 h-12 animate-spin opacity-50" alt="Loading" />
        <span className="text-text-secondary mt-4 text-sm">Loading weather data...</span>
    </div>
    <div className="grid grid-cols-4 gap-4 mb-6">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-surface rounded-2xl"></div>)}
    </div>
    <div className="flex flex-col lg:flex-row gap-6">
       <div className="flex-1 grid grid-cols-3 md:grid-cols-6 gap-2">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-32 bg-surface rounded-2xl"></div>)}
       </div>
       <div className="w-full lg:w-1/3 h-96 bg-surface rounded-3xl"></div>
    </div>
  </div>
);