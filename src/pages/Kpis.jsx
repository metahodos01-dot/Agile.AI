import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, Plus, Trash2, Sliders } from 'lucide-react';
import PhaseNavigation from '../components/common/PhaseNavigation';
import InstructionCard from '../components/common/InstructionCard';
import { generateAIResponseV2 } from '../services/aiService';

const Kpis = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [kpis, setKpis] = useState(project.kpis || {});

    const handleGenerate = async (objectiveIndex) => {
        setLoading(true);
        try {
            const objective = project.objectives[objectiveIndex];
            const objectiveText = typeof objective === 'object' ? (objective.text || objective.title || objective.name) : objective;

            console.log("Generazione KPI per:", objectiveText);

            const generatedKpis = await generateAIResponseV2({ objective: objectiveText }, 'kpi');

            const newKpis = { ...kpis };
            if (!newKpis[objectiveIndex]) newKpis[objectiveIndex] = [];

            if (Array.isArray(generatedKpis)) {
                newKpis[objectiveIndex].push(...generatedKpis);
            }

            setKpis(newKpis);
        } catch (error) {
            console.error("Errore generazione KPI:", error);
        } finally {
            setLoading(false);
        }
    };

    const addKpi = (objectiveIndex) => {
        const newKpis = { ...kpis };
        if (!newKpis[objectiveIndex]) newKpis[objectiveIndex] = [];
        newKpis[objectiveIndex].push({ name: '', target: '', rationale: '' });
        setKpis(newKpis);
    };

    const updateKpi = (objectiveIndex, kpiIndex, field, value) => {
        const newKpis = { ...kpis };
        newKpis[objectiveIndex][kpiIndex][field] = value;
        setKpis(newKpis);
    };

    const removeKpi = (objectiveIndex, kpiIndex) => {
        const newKpis = { ...kpis };
        newKpis[objectiveIndex] = newKpis[objectiveIndex].filter((_, i) => i !== kpiIndex);
        setKpis(newKpis);
    };

    const handleNext = () => {
        updateProject({ kpis });
        navigate('/team');
    };

    if (!project.objectives || project.objectives.length === 0) {
        return (
            <div className="text-center pt-20">
                <h2 className="text-2xl font-bold text-white mb-4">Nessun obiettivo trovato</h2>
                <p className="mb-4 text-zinc-400">Prima definisci gli obiettivi.</p>
                <button onClick={() => navigate('/objectives')} className="btn-primary">Vai agli obiettivi</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Sliders size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 3 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">KPI e target</h1>
                    <p className="text-zinc-400 mt-2">Definisci metriche misurabili per ogni obiettivo.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-indigo-400 text-xs font-medium">Assistito da AI</span>
                </div>
            </div>

            <InstructionCard
                title="Come definire i KPI"
                description="I KPI (Key Performance Indicators) sono metriche quantitative che misurano il progresso verso un obiettivo."
                tips={[
                    "Assicurati che siano SMART (Specifici, Misurabili, Raggiungibili, Rilevanti, Temporizzati).",
                    "Esempio: Invece di 'Migliorare la qualità', usa 'Ridurre i bug critici del 20% entro Q3'.",
                    "Usa l'AI per suggerirti metriche standard di mercato."
                ]}
            />

            {/* KPIs per Objective */}
            <div className="space-y-6">
                {project.objectives.map((obj, index) => (
                    <div key={index} className="glass-panel p-6">
                        <div className="flex items-start justify-between mb-6 pb-4 border-b border-zinc-800">
                            <div>
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Obiettivo {index + 1}</span>
                                <h3 className="text-lg font-medium text-white mt-1">{typeof obj === 'object' ? (obj.text || obj.title || obj.name || JSON.stringify(obj)) : obj}</h3>
                            </div>
                            <button
                                onClick={() => handleGenerate(index)}
                                disabled={loading}
                                className="text-xs flex items-center gap-1 text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full"
                            >
                                <Sparkles size={12} /> Suggerisci KPI
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-12 gap-4 text-xs text-zinc-500 uppercase font-semibold px-2">
                                <div className="col-span-4">Indicatore (KPI)</div>
                                <div className="col-span-3">Target</div>
                                <div className="col-span-4">Razionale Strategico</div>
                                <div className="col-span-1"></div>
                            </div>

                            {Array.isArray(kpis[index]) && kpis[index].map((kpi, kIndex) => (
                                <div key={kIndex} className="grid grid-cols-12 gap-4 items-start bg-zinc-800/30 p-3 rounded-lg group hover:bg-zinc-800/50 transition-colors">
                                    <div className="col-span-4">
                                        <input
                                            value={kpi.name}
                                            onChange={(e) => updateKpi(index, kIndex, 'name', e.target.value)}
                                            placeholder="es. NPS"
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium text-white placeholder-zinc-600"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            value={kpi.target}
                                            onChange={(e) => updateKpi(index, kIndex, 'target', e.target.value)}
                                            placeholder="es. > 70"
                                            className="w-full bg-zinc-900/50 rounded px-2 py-1.5 border border-zinc-700 text-sm focus:border-indigo-500 text-indigo-300"
                                        />
                                    </div>
                                    <div className="col-span-4">
                                        <textarea
                                            value={kpi.rationale || ''}
                                            onChange={(e) => updateKpi(index, kIndex, 'rationale', e.target.value)}
                                            placeholder="Perché questo KPI è importante..."
                                            rows={2}
                                            className="w-full bg-transparent border-none focus:ring-0 p-0 text-xs text-zinc-400 leading-relaxed resize-none placeholder-zinc-700"
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-end pt-1">
                                        <button onClick={() => removeKpi(index, kIndex)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => addKpi(index)}
                                className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 mt-4 px-2"
                            >
                                <Plus size={14} /> Aggiungi KPI
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phase Navigation */}
            <PhaseNavigation
                onSave={async () => {
                    updateProject({ kpis });
                    return true;
                }}
            />
        </div>
    );
};

export default Kpis;
