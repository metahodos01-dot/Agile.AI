import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { generateAIResponseV2 } from '../services/aiService';
import { Sparkles, ArrowRight, Map, Calendar, Calculator, CheckCircle, AlertTriangle, Target, Briefcase } from 'lucide-react';

const Roadmap = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // MVP State
    const [mvpName, setMvpName] = useState(project.roadmap?.mvpName || 'MVP 1.0');
    const [targetDate, setTargetDate] = useState(project.roadmap?.targetDate || '');
    const [velocity, setVelocity] = useState(project.roadmap?.velocity || 20); // Story Points per sprint

    // Selection state: Set of selected Epic IDs
    const [selectedEpics, setSelectedEpics] = useState(new Set(project.roadmap?.selectedEpics || []));

    // AI Analysis Result
    const [analysis, setAnalysis] = useState(project.roadmap?.analysis || null);

    // Calculators
    const totalPoints = (project.backlog || []).reduce((acc, epic) => {
        if (!selectedEpics.has(epic.id)) return acc;
        // Sum points of stories in this Epic. 
        // Need to check project.estimates which is { storyId: points }
        const epicPoints = epic.stories.reduce((sum, story) => {
            return sum + (project.estimates?.[story.id] || 1); // Default 1 point if missing
        }, 0);
        return acc + epicPoints;
    }, 0);

    const toggleEpic = (epicId) => {
        const newSet = new Set(selectedEpics);
        if (newSet.has(epicId)) newSet.delete(epicId);
        else newSet.add(epicId);
        setSelectedEpics(newSet);
        // Reset analysis when scope changes
        setAnalysis(null);
    };

    const handleCalculate = async () => {
        if (!targetDate) {
            alert("Seleziona una data di rilascio target.");
            return;
        }
        setLoading(true);

        const prompt = {
            mvpName,
            targetDate,
            velocity,
            totalPoints,
            selectedScope: project.backlog.filter(e => selectedEpics.has(e.id)).map(e => e.title)
        };

        try {
            const result = await generateAIResponseV2(prompt, 'roadmap_mvp');
            setAnalysis(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        updateProject({
            roadmap: {
                mvpName,
                targetDate,
                velocity,
                selectedEpics: Array.from(selectedEpics),
                analysis
            }
        });
        navigate('/sprint');
    };

    if (!project.backlog || project.backlog.length === 0) {
        return (
            <div className="text-center pt-20">
                <h2 className="text-2xl font-bold text-white mb-4">Nessun backlog trovato</h2>
                <p className="mb-4 text-zinc-400">Prima definisci il Product Backlog.</p>
                <button onClick={() => navigate('/backlog')} className="btn-primary">Vai al Backlog</button>
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
                            <Map size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 8 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Roadmap MVP & Release</h1>
                    <p className="text-zinc-400 mt-2">Definisci l'MVP, seleziona le funzionalità e verifica la fattibilità con l'AI.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Configuration */}
                <div className="space-y-6">
                    {/* MVP Definition Card */}
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Target size={20} className="text-indigo-400" /> Definizione MVP
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Nome Versione</label>
                                <input
                                    value={mvpName}
                                    onChange={(e) => setMvpName(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    placeholder="Es. MVP 1.0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Data Rilascio Target</label>
                                <input
                                    type="date"
                                    value={targetDate}
                                    onChange={(e) => setTargetDate(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Velocity Stimata (Punti/Sprint)</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        value={velocity}
                                        onChange={(e) => setVelocity(Number(e.target.value))}
                                        className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <span className="text-xs text-zinc-500">pt / 2 settimane</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Analysis Card */}
                    <div className="glass-panel p-6 border-t-4 border-indigo-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Calculator size={64} />
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="text-indigo-400" /> Analisi Fattibilità
                        </h3>

                        {!analysis ? (
                            <div className="text-center py-6">
                                <p className="text-zinc-400 text-sm mb-4">Seleziona le Epic e lancia l'analisi.</p>
                                <button
                                    onClick={handleCalculate}
                                    disabled={loading || totalPoints === 0}
                                    className="w-full btn-primary flex items-center justify-center gap-2"
                                >
                                    {loading ? 'Analisi in corso...' : 'Calcola Piano'}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-fadeIn">
                                <div className={`p-4 rounded-lg flex items-start gap-3 ${analysis.achievable ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                                    {analysis.achievable ? <CheckCircle className="text-green-400 mt-1" /> : <AlertTriangle className="text-red-400 mt-1" />}
                                    <div>
                                        <p className={`font-bold ${analysis.achievable ? 'text-green-400' : 'text-red-400'}`}>
                                            {analysis.achievable ? 'Obiettivo Raggiungibile' : 'A Rischio'}
                                        </p>
                                        <p className="text-sm text-zinc-300 mt-1">
                                            Data stimata fine lavori: <span className="font-mono font-bold text-white">{new Date(analysis.projectedDate).toLocaleDateString()}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-zinc-800 p-3 rounded-lg text-center">
                                        <p className="text-xs text-zinc-400">Sprint Necessari</p>
                                        <p className="text-2xl font-bold text-white">{analysis.sprintsNeeded}</p>
                                    </div>
                                    <div className="bg-zinc-800 p-3 rounded-lg text-center">
                                        <p className="text-xs text-zinc-400">Settimane totali</p>
                                        <p className="text-2xl font-bold text-white">{analysis.sprintsNeeded * 2}</p>
                                    </div>
                                </div>

                                <div className="p-3 bg-zinc-800/50 rounded-lg">
                                    <p className="text-xs text-indigo-400 font-bold uppercase mb-1">AI Insight</p>
                                    <p className="text-sm text-zinc-300 leading-relaxed">
                                        {analysis.analysis}
                                    </p>
                                </div>

                                <button
                                    onClick={handleCalculate}
                                    className="w-full py-2 text-xs text-zinc-500 hover:text-white transition-colors border border-dashed border-zinc-700 rounded-lg"
                                >
                                    Ricalcola
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT COLUMN: Scope Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white">Scope MVP</h3>
                                <p className="text-sm text-zinc-400">Seleziona le Epic da includere nel rilascio.</p>
                            </div>
                            <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-zinc-700">
                                <span className="text-xs text-zinc-400 uppercase tracking-wider mr-2">Totale Punti</span>
                                <span className="text-xl font-bold text-white">{totalPoints}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {project.backlog.map(epic => {
                                const isSelected = selectedEpics.has(epic.id);
                                const epicPoints = epic.stories.reduce((sum, story) => sum + (project.estimates?.[story.id] || 1), 0);

                                return (
                                    <div
                                        key={epic.id}
                                        onClick={() => toggleEpic(epic.id)}
                                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${isSelected
                                                ? 'bg-indigo-500/10 border-indigo-500/50 hover:bg-indigo-500/20'
                                                : 'bg-zinc-800/30 border-zinc-700 hover:border-zinc-500'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-zinc-600 group-hover:border-zinc-400'
                                                }`}>
                                                {isSelected && <CheckCircle size={14} className="text-white" />}
                                            </div>
                                            <div>
                                                <h4 className={`font-medium ${isSelected ? 'text-white' : 'text-zinc-300'}`}>{epic.title}</h4>
                                                <p className="text-xs text-zinc-500">{epic.stories.length} User Stories incluse</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`font-bold ${isSelected ? 'text-indigo-400' : 'text-zinc-600'}`}>{epicPoints} pt</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button onClick={handleNext} className="btn-primary">
                            Salva e Vai allo Sprint <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
