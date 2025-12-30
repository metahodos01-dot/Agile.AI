import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { generateAIResponseV2 } from '../services/aiService';
import { Sparkles, ArrowRight, Plus, Trash2, Target, BookOpen } from 'lucide-react';
import PhaseNavigation from '../components/common/PhaseNavigation';
import InstructionCard from '../components/common/InstructionCard';

const Objectives = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [objectives, setObjectives] = useState(
        project.objectives.length > 0
            ? project.objectives.map(obj => typeof obj === 'object' ? obj : { text: obj, rationale: '' })
            : [{ text: '', rationale: '' }, { text: '', rationale: '' }, { text: '', rationale: '' }]
    );

    const handleGenerate = async () => {
        setLoading(true);
        // Construct prompt from saved project context
        const prompt = {
            projectName: project.name,
            targetAudience: project.targetAudience,
            problem: project.problem,
            vision: project.vision
        };

        try {
            const generatedObjectives = await generateAIResponseV2(prompt, 'objectives');
            // Ensure we get an array (aiService now returns array for objectives)
            if (Array.isArray(generatedObjectives)) {
                setObjectives(generatedObjectives);
            }
        } catch (error) {
            console.error("Error generating objectives:", error);
        }
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
            <InstructionCard
                title="Cosa sono gli Obiettivi Agile?"
                description="Gli obiettivi (OKR) definiscono il 'Dove vogliamo andare'. Devono essere ambiziosi, qualitativi e limitati nel tempo. L'obiettivo è la direzione, i KPI (fase successiva) sono il tachimetro."
                tips={[
                    "Esempio: 'Diventare il brand #1 per la mobilità sostenibile' (non 'Vendere 1000 unità').",
                    "Focalizzati sull'impatto, non sulla lista della spesa.",
                    "Limitati a 3-5 obiettivi principali."
                ]}
            />

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
                <div className="lg:col-span-2 space-y-4">
                    {objectives.map((obj, index) => {
                        const objectiveText = typeof obj === 'object' ? obj.text : obj;
                        const rationaleText = typeof obj === 'object' ? obj.rationale : '';

                        return (
                            <div key={index} className="glass-panel p-5 group transition-all hover:bg-zinc-800/40 relative">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                                        <span className="text-indigo-400 font-bold text-sm">{index + 1}</span>
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1 block">Obiettivo Strategico</label>
                                            <textarea
                                                value={objectiveText}
                                                onChange={(e) => {
                                                    const newObjs = [...objectives];
                                                    newObjs[index] = { text: e.target.value, rationale: rationaleText };
                                                    setObjectives(newObjs);
                                                }}
                                                className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none text-zinc-200 text-lg font-medium leading-normal placeholder-zinc-700"
                                                placeholder={`Es. Diventare leader di mercato...`}
                                                rows={2}
                                            />
                                        </div>

                                        <div className="pt-3 border-t border-zinc-700/50">
                                            <label className="text-xs text-emerald-500/80 font-semibold uppercase tracking-wider mb-1 block flex items-center gap-1">
                                                <Target size={12} /> Razionale di Business
                                            </label>
                                            <textarea
                                                value={rationaleText}
                                                onChange={(e) => {
                                                    const newObjs = [...objectives];
                                                    newObjs[index] = { text: objectiveText, rationale: e.target.value };
                                                    setObjectives(newObjs);
                                                }}
                                                className="w-full bg-transparent border-none p-0 focus:ring-0 resize-none text-zinc-400 text-sm placeholder-zinc-700"
                                                placeholder="Perché questo obiettivo è vitale? Es. Impatto diretto su revenue..."
                                                rows={1}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => removeObjective(index)}
                                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-2 absolute top-4 right-4"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={() => setObjectives([...objectives, { text: '', rationale: '' }])}
                        className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors text-sm font-medium py-2 px-2"
                    >
                        <Plus size={16} /> Aggiungi obiettivo
                    </button>
                </div>

                {/* Phase Navigation */}
                <PhaseNavigation
                    onSave={async () => {
                        updateProject({ objectives: objectives.filter(obj => obj.trim() !== '') });
                        return true;
                    }}
                />
            </div>
        </div>
    );
};

export default Objectives;
