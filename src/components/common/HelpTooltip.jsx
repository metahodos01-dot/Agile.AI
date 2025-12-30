import React, { useState } from 'react';
import { HelpCircle, Info } from 'lucide-react';

const HelpTooltip = ({ text, type = 'info', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={`relative inline-block ml-2 ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            <button
                type="button"
                className={`text-zinc-500 hover:text-indigo-400 transition-colors focus:outline-none`}
                onClick={() => setIsVisible(!isVisible)}
            >
                {type === 'info' ? <Info size={16} /> : <HelpCircle size={16} />}
            </button>

            {isVisible && (
                <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl -left-28 sm:left-1/2 sm:-translate-x-1/2 animate-fadeIn">
                    <div className="absolute -top-2 left-0 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 bg-zinc-900 border-t border-l border-zinc-700 transform rotate-45"></div>
                    <div className="relative z-10">
                        {text}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HelpTooltip;
