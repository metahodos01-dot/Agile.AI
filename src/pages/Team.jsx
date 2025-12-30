import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, UserPlus, Users, X, BookOpen } from 'lucide-react';
import PhaseNavigation from '../components/common/PhaseNavigation';

const Team = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState(project.team || []);

    const handleSuggest = () => {
        setLoading(true);
        setTimeout(() => {
            setTeam([
                { role: "Product Owner", skills: "Conoscenza processi produttivi, stakeholder management", count: 1 },
                { role: "Scrum Master", skills: "Facilitazione, coaching, rimozione impedimenti", count: 1 },
                { role: "Ingegnere di processo", skills: "Lean manufacturing, analisi flussi, ottimizzazione", count: 2 },
                { role: "Tecnico automazione", skills: "PLC, SCADA, integrazione sistemi", count: 2 },
                { role: "Specialista qualità", skills: "SPC, controllo qualità, normative ISO", count: 1 }
            ]);
            setLoading(false);
        }, 1200);
    };

    const addMember = () => setTeam([...team, { role: '', skills: '', count: 1 }]);
    const updateMember = (index, field, value) => {
        const newTeam = [...team];
        newTeam[index][field] = value;
        setTeam(newTeam);
    };
    const removeMember = (index) => setTeam(team.filter((_, i) => i !== index));

    const handleNext = () => {
        updateProject({ team });
        navigate('/obeya');
    };

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
                    <h1 className="text-3xl font-bold text-white">Composizione del team</h1>
                    <p className="text-zinc-400 mt-2">Definisci i ruoli e le competenze del tuo team Scrum.</p>
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
                        <h3 className="text-lg font-semibold text-white mb-2">Il team Scrum</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Un team Scrum è cross-funzionale e auto-organizzato. Include tipicamente:
                            un <strong>Product Owner</strong> (responsabile del backlog), uno <strong>Scrum Master</strong>
                            (facilitatore del processo) e il <strong>Development Team</strong> (3-9 persone con competenze diverse).
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm">
                                Per il progetto **Moto Elettrica Future**, il team ideale include:<br />
                                <strong>1 PO</strong> (Vision & Mercato) + <strong>1 SM</strong> (Agile Coach) +
                                <strong>3 Ingegneri</strong> (Meccanici/Elettrici) + <strong>1 Esperto Batterie</strong> + <strong>1 UX Designer</strong> (Dashboard).
                            </p>
                        </div>
                    </div>
                </div>
            </div>

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
                            Basandoci sul tuo progetto, ti suggeriamo una composizione cross-funzionale.
                        </p>
                        <button
                            onClick={handleSuggest}
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Analisi...</span> : <><Sparkles size={16} /> Suggerisci Struttura</>}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4">
                    <div className="glass-panel p-6">
                        <div className="space-y-4">
                            {team.map((member, index) => (
                                <div key={index} className="grid grid-cols-12 gap-4 items-center bg-zinc-800/50 p-4 rounded-xl">
                                    <div className="col-span-4">
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Ruolo</label>
                                        <input
                                            value={member.role}
                                            onChange={(e) => updateMember(index, 'role', e.target.value)}
                                            className="w-full bg-transparent border-b border-zinc-700 focus:border-indigo-500 py-1"
                                            placeholder="es. Ingegnere di processo"
                                        />
                                    </div>
                                    <div className="col-span-5">
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">Competenze Richieste</label>
                                        <input
                                            value={member.skills}
                                            onChange={(e) => updateMember(index, 'skills', e.target.value)}
                                            className="w-full bg-transparent border-b border-zinc-700 focus:border-indigo-500 py-1"
                                            placeholder="es. Lean, PLC, SCADA"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="text-xs text-zinc-500 uppercase mb-1 block">N°</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={member.count}
                                            onChange={(e) => updateMember(index, 'count', parseInt(e.target.value))}
                                            className="w-full bg-transparent border-b border-zinc-700 focus:border-indigo-500 py-1"
                                        />
                                    </div>
                                    <div className="col-span-1 pt-4 text-center">
                                        <button onClick={() => removeMember(index)} className="text-zinc-500 hover:text-red-400">
                                            <X size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addMember}
                            className="mt-6 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <UserPlus size={18} /> Aggiungi Ruolo
                        </button>
                    </div>

                    {/* Phase Navigation */}
                    <PhaseNavigation
                        onSave={async () => {
                            updateProject({ team });
                            return true;
                        }}
                    />
                </div>
            </div>
        </div >
    );
};

export default Team;
