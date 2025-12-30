
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Save, CheckCircle } from 'lucide-react';
import { getNextStep } from '../../utils/navigationSteps';

const PhaseNavigation = ({ onSave, isSaving = false, customNextPath = null, className = '', children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Auto-detect next step if not provided
    const nextStep = customNextPath ? null : getNextStep(location.pathname);

    const handleSaveAndContinue = async () => {
        if (onSave) {
            const success = await onSave();
            if (success === false) return; // Stop if save returned false explicitly
        }

        // Navigate
        if (customNextPath) {
            navigate(customNextPath);
        } else if (nextStep) {
            navigate(nextStep.path);
        } else {
            // Fallback or end of flow
            navigate('/app');
        }
    };

    return (
        <div className={`mt-12 pt-6 border-t border-slate-800 flex items-center justify-between ${className}`}>
            <button
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all font-medium"
            >
                <Save size={18} />
                {isSaving ? 'Salvataggio...' : 'Salva (senza uscire)'}
            </button>

            {children}

            <button
                onClick={handleSaveAndContinue}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2 px-8 py-4 text-lg shadow-xl shadow-amber-900/20 hover:scale-105 active:scale-95 transition-all"
            >
                <span className="font-bold">Salva e Continua</span>
                {nextStep ? (
                    <span className="text-amber-200 text-sm font-normal ml-1 opacity-80">
                        verso {nextStep.name}
                    </span>
                ) : (
                    <span className="text-amber-200 text-sm font-normal ml-1 opacity-80">
                        (Torna alla Dashboard)
                    </span>
                )}
                <ArrowRight size={20} className="ml-1" />
            </button>
        </div>
    );
};

export default PhaseNavigation;
