import React from 'react';
import { SystemIcons } from '../utils/imageMap';

interface Props {
    type: 'ERROR' | 'NOT_FOUND';
    onRetry: () => void;
}

export const ErrorView: React.FC<Props> = ({ type, onRetry }) => {
    if (type === 'NOT_FOUND') {
        return (
            <div className="mt-20 flex flex-col items-center text-center animate-fade-in">
                <span className="text-lg font-semibold text-white">No search result found!</span>
            </div>
        );
    }
    
    return (
        <div className="mt-20 flex flex-col items-center text-center animate-fade-in">
            <img src={SystemIcons.error} className="w-24 h-24 mb-6 opacity-90" alt="Error" />
            <h3 className="text-2xl font-bold mb-2 text-white">Something went wrong</h3>
            <p className="text-text-secondary mb-6 max-w-sm">
                We couldn't connect to the server (API error). Please try again in a few moments.
            </p>
            <button onClick={onRetry} className="bg-surface hover:bg-slate-700 px-6 py-3 rounded-xl flex items-center gap-2 text-white transition-all border border-slate-700">
                <img src={SystemIcons.retry} className="w-5 h-5" alt="Retry" /> Retry
            </button>
        </div>
    );
};