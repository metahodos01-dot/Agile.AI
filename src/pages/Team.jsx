import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { generateAIResponseV2 } from '../services/aiService';
import { Sparkles, ArrowRight, UserPlus, Users, X, User, Target } from 'lucide-react';
import PhaseNavigation from '../components/common/PhaseNavigation';
import InstructionCard from '../components/common/InstructionCard';

const Team = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState(project.team || []);

    const handleSuggest = async () => {
        setLoading(true);
        const prompt = {
            vision: project.vision,
            problem: project.problem,
            industry: project.industry
        };
        try {
            const suggestedTeam = await generateAIResponseV2(prompt, 'team');
            if (Array.isArray(suggestedTeam)) {
                setTeam(suggestedTeam);
            }
        } catch (error) {
            console.error("Errore generazione team:", error);
        }
        setLoading(false);
    };

    const addMember = () => setTeam([...team, { role: '', skills: '', count: 1, rationale: '' }]);
    const updateMember = (index, field, value) => {
        const newTeam = [...team];
        newTeam[index][field] = value;
        setTeam(newTeam);
    };
    const removeMember = (index) => setTeam(team.filter((_, i) => i !== index));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Users size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 4 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Squadra Strategica</h1>
                    <p className="text-zinc-400 mt-2">Definisci i ruoli chiave per supportare la tua visione.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-indigo-400 text-xs font-medium">Assistito da AI</span>
                </div>
            </div>

            {/* Guidance */}
            <InstructionCard
                title="Il Team Cross-Funzionale"
                description="Un team Agile deve avere tutte le competenze necessarie per portare a termine il lavoro senza dipendenze esterne."
                tips={[
                    "Includi sempre un Product Owner (visione) e uno Scrum Master (processo).",
                    "Specifica il 'Razionale': perché questo ruolo è critico per la strategia?",
                    "Cerca competenze 'T-Shaped': specialisti in un'area ma capaci di aiutare in altre."
                ]}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <div className="flex justify-center mb-6">
                            <div className="bg-zinc-800 p-4 rounded-full">
                                <Users size={48} className="text-indigo-400" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-center text-white">Struttura del team</h3>
                        <p className="text-sm text-center text-zinc-400 mb-6">
                            L'AI analizza la tua vision e suggerisce i ruoli necessari (es. Data Scientist per progetti AI, Lean Coach per efficienza).
                        </p>
                        <button
                            onClick={handleSuggest}
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Analisi Vision...</span> : <><Sparkles size={16} /> Suggerisci Squadra</>}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-4">
                        {team.map((member, index) => (
                            <div key={index} className="glass-panel p-5 relative group transition-all hover:bg-zinc-800/40">
                                <div className="grid grid-cols-12 gap-4 items-start">

                                    {/* Row 1: Role & Count */}
                                    <div className="col-span-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <User size={14} className="text-indigo-400" />
                                            <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Ruolo</label>
                                        </div>
                                        <input
                                            value={member.role}
                                            onChange={(e) => updateMember(index, 'role', e.target.value)}
                                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-bold text-white placeholder-zinc-700"
                                            placeholder="Es. Product Owner"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Quantità</span>
                                        </div>
                                        <input
                                            type="number"
                                            min="1"
                                            value={member.count || 1}
                                            onChange={(e) => updateMember(index, 'count', parseInt(e.target.value))}
                                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-lg font-bold text-white placeholder-zinc-700"
                                        />
                                    </div>
                                    <div className="col-span-1 text-right">
                                        <button onClick={() => removeMember(index)} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all p-1">
                                            <X size={18} />
                                        </button>
                                    </div>

                                    {/* Row 2: Skills */}
                                    <div className="col-span-12 border-t border-zinc-700/50 pt-3 mt-1">
                                        <label className="text-xs text-zinc-500 font-semibold uppercase tracking-wider mb-1 block">Competenze Chiave (Hard & Soft Skills)</label>
                                        <input
                                            value={member.skills}
                                            onChange={(e) => updateMember(index, 'skills', e.target.value)}
                                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-zinc-300 text-sm placeholder-zinc-600"
                                            placeholder="Es. Analisi dati, Stakeholder management, Python..."
                                        />
                                    </div>

                                    {/* Row 3: Strategic Rationale */}
                                    <div className="col-span-12 border-t border-zinc-700/50 pt-3 mt-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Target size={12} className="text-emerald-500/80" />
                                            <label className="text-xs text-emerald-500/80 font-semibold uppercase tracking-wider">Razionale Strategico</label>
                                        </div>
                                        <textarea
                                            value={member.rationale || ''}
                                            onChange={(e) => updateMember(index, 'rationale', e.target.value)}
                                            className="w-full bg-transparent border-none p-0 focus:ring-0 text-zinc-400 text-sm placeholder-zinc-700 resize-none"
                                            placeholder="Perché questo ruolo è essenziale per il successo del progetto?"
                                            rows={2}
                                        />
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addMember}
                        className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-xl flex items-center justify-center gap-2 text-zinc-500 hover:text-indigo-400 hover:border-indigo-500/30 transition-all group"
                    >
                        <UserPlus size={18} className="group-hover:scale-110 transition-transform" /> Aggiungi Ruolo Strategico
                    </button>

                    {/* Phase Navigation */}
                    <PhaseNavigation
                        onSave={async () => {
                            updateProject({ team });
                            return true;
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Team;
