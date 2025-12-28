import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Plus, Trash2, Target, BookOpen } from 'lucide-react';

const Objectives = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [objectives, setObjectives] = useState(
        project.objectives.length > 0
            ? project.objectives.map(obj => typeof obj === 'object' ? (obj.text || obj.title || '') : obj)
            : ['', '', '']
    );

    const handleGenerate = async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setObjectives([
            "Completare il prototipo funzionante entro Q4 per validare le prestazioni del powertrain.",
            "Raggiungere un'autonomia certificata di 300km con una singola ricarica.",
            "Ottenere un Net Promoter Score (NPS) > 50 dai beta tester."
        ]);
        setLoading(false);
    };

    const handleObjectiveChange = (index, value) => {
        const newObjectives = [...objectives];
        newObjectives[index] = value;
        setObjectives(newObjectives);
    };

    const addObjective = () => setObjectives([...objectives, '']);
    const removeObjective = (index) => setObjectives(objectives.filter((_, i) => i !== index));

    const handleNext = () => {
        updateProject({ objectives: objectives.filter(obj => obj.trim() !== '') });
        navigate('/kpi');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Target size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 2 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Obiettivi</h1>
                    <p className="text-zinc-400 mt-2">Trasforma la vision in traguardi concreti e misurabili.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-indigo-400 text-xs font-medium">Assistito da AI</span>
                </div>
            </div>

            {/* Educational Section */}
            <div className="glass-panel p-6 border-l-4 border-indigo-500">
                <div className="flex items-start gap-4">
                    <BookOpen size={24} className="text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Cosa sono gli obiettivi agile?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Gli obiettivi sono traguardi ambiziosi ma raggiungibili che il team vuole conseguire.
                            Nel framework OKR (Objectives and Key Results), l'obiettivo è qualitativo e ispirante,
                            mentre i Key Results (che definirai nella prossima fase) sono metriche quantitative.
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm">
                                <strong>Obiettivo:</strong> "Diventare il brand di riferimento per la mobilità urbana sostenibile"<br />
                                <span className="text-zinc-500">Questo obiettivo sarà poi misurato con KPI come:
                                    Quota di mercato > 15%, Autonomia > 300km, Tempo di ricarica < 20min.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Context Panel */}
                <div className="space-y-4">
                    <div className="glass-panel p-5">
                        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">Vision del prodotto</h3>
                        <p className="text-sm text-zinc-300 italic leading-relaxed">
                            "{project.vision || 'Nessuna vision definita. Torna alla Fase 1.'}"
                        </p>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading || !project.vision}
                        className="w-full btn-primary"
                    >
                        {loading ? (
                            <span className="animate-pulse">Analisi in corso...</span>
                        ) : (
                            <>
                                <Sparkles size={16} /> Suggerisci obiettivi
                            </>
                        )}
                    </button>
                </div>

                {/* Objectives List */}
                <div className="lg:col-span-2 space-y-3">
                    {objectives.map((obj, index) => (
                        <div key={index} className="glass-panel p-4 flex items-start gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-indigo-400 font-bold text-sm">{index + 1}</span>
                            </div>
                            <textarea
                                value={obj}
                                onChange={(e) => handleObjectiveChange(index, e.target.value)}
                                className="flex-1 bg-transparent border-none p-0 focus:ring-0 resize-none text-zinc-200"
                                placeholder={`Obiettivo ${index + 1}`}
                                rows={2}
                            />
                            <button
                                onClick={() => removeObjective(index)}
                                className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-2"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addObjective}
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium py-2"
                    >
                        <Plus size={16} /> Aggiungi obiettivo
                    </button>

                    <div className="flex justify-end pt-6">
                        <button onClick={handleNext} className="btn-primary">
                            Salva e Continua <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Objectives;
