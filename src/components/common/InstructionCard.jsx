import React, { useState } from 'react';
import { Lightbulb, X, ChevronRight } from 'lucide-react';

const InstructionCard = ({ title, description, tips = [], onDismiss }) => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="mb-8 p-6 bg-gradient-to-r from-indigo-900/20 to-indigo-900/10 border border-indigo-500/20 rounded-2xl relative overflow-hidden animate-slideDown">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Lightbulb size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Lightbulb size={20} className="text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white">{title}</h3>
                    </div>

                    <button
                        onClick={() => {
                            setIsVisible(false);
                            if (onDismiss) onDismiss();
                        }}
                        className="text-zinc-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <p className="text-zinc-300 mb-4 max-w-3xl leading-relaxed">
                    {description}
                </p>

                {tips.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {tips.map((tip, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm text-zinc-400 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">
                                <ChevronRight size={14} className="text-indigo-500 mt-1 min-w-[14px]" />
                                <span>{tip}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstructionCard;
