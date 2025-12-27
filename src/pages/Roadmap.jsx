import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Map, BookOpen, Calendar, Plus, Trash2, GripVertical } from 'lucide-react';

const Roadmap = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [releases, setReleases] = useState(
        project.roadmap?.releases || ['Pilota', 'Linea 1', 'Tutte le linee', 'Futuro']
    );
    const [assignments, setAssignments] = useState(project.roadmap?.assignments || {});

    const handleAutoAssign = () => {
        setLoading(true);
        setTimeout(() => {
            const newAssignments = {};
            project.backlog.forEach((epic, index) => {
                if (index === 0) newAssignments[epic.id] = releases[0] || 'MVP';
                else if (index === 1) newAssignments[epic.id] = releases[1] || 'Versione 1.0';
                else newAssignments[epic.id] = releases[2] || 'Versione 2.0';
            });
            setAssignments(newAssignments);
            setLoading(false);
        }, 1200);
    };

    const assignEpic = (epicId, release) => {
        setAssignments({ ...assignments, [epicId]: release });
    };

    const addRelease = () => {
        const newReleaseName = `Release ${releases.length + 1}`;
        setReleases([...releases, newReleaseName]);
    };

    const updateRelease = (index, value) => {
        const oldName = releases[index];
        const newReleases = [...releases];
        newReleases[index] = value;
        setReleases(newReleases);

        // Update assignments that used the old name
        const newAssignments = { ...assignments };
        Object.keys(newAssignments).forEach(key => {
            if (newAssignments[key] === oldName) {
                newAssignments[key] = value;
            }
        });
        setAssignments(newAssignments);
    };

    const removeRelease = (index) => {
        const releaseName = releases[index];
        setReleases(releases.filter((_, i) => i !== index));

        // Clear assignments for removed release
        const newAssignments = { ...assignments };
        Object.keys(newAssignments).forEach(key => {
            if (newAssignments[key] === releaseName) {
                delete newAssignments[key];
            }
        });
        setAssignments(newAssignments);
    };

    const handleNext = () => {
        updateProject({ roadmap: { releases, assignments } });
        navigate('/sprint');
    };

    if (project.backlog.length === 0) {
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
                    <h1 className="text-3xl font-bold text-white">Roadmap e release planning</h1>
                    <p className="text-zinc-400 mt-2">Organizza le Epic in rilasci pianificati.</p>
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
                        <h3 className="text-lg font-semibold text-white mb-2">Release planning</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Il Release planning organizza le funzionalità (Epic) in rilasci successivi.
                            Si parte dall'<strong>MVP</strong> (Minimum Viable Product) con le funzionalità essenziali,
                            poi si pianificano versioni successive con feature aggiuntive.
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm">
                                <strong>Pilota:</strong> Monitoraggio OEE su una linea (validare la soluzione)<br />
                                <strong>Linea 1:</strong> Deploy completo + manutenzione predittiva<br />
                                <strong>Tutte le linee:</strong> Estensione a tutto lo stabilimento + integrazione ERP
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6">
                        <h3 className="text-lg font-semibold mb-4 text-center text-white">Pianificazione AI</h3>
                        <p className="text-sm text-center text-zinc-400 mb-6">
                            L'AI assegnerà automaticamente le Epic ai rilasci basandosi su priorità e dipendenze.
                        </p>
                        <button
                            onClick={handleAutoAssign}
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Pianificazione...</span> : <><Sparkles size={16} /> Pianifica Automaticamente</>}
                        </button>
                    </div>

                    {/* Release Manager */}
                    <div className="glass-panel p-6">
                        <h3 className="text-sm font-semibold mb-4 text-zinc-400 uppercase tracking-wide">Gestione release</h3>
                        <div className="space-y-2">
                            {releases.map((release, index) => (
                                <div key={index} className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg group">
                                    <GripVertical size={14} className="text-zinc-600" />
                                    <input
                                        value={release}
                                        onChange={(e) => updateRelease(index, e.target.value)}
                                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-zinc-300 p-0"
                                        placeholder="Nome release"
                                    />
                                    <button
                                        onClick={() => removeRelease(index)}
                                        className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all"
                                        title="Rimuovi release"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addRelease}
                            className="w-full mt-4 flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm py-2"
                        >
                            <Plus size={14} /> Aggiungi Release
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3">
                    <div className="glass-panel p-6">
                        <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `repeat(${Math.min(releases.length, 4)}, 1fr)` }}>
                            {releases.slice(0, 4).map(release => (
                                <div key={release} className="text-center">
                                    <div className="flex items-center justify-center gap-2 text-sm font-semibold text-indigo-400 mb-2">
                                        <Calendar size={14} />
                                        {release}
                                    </div>
                                    <div className="h-1 bg-indigo-500/30 rounded"></div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {project.backlog.map(epic => (
                                <div key={epic.id} className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl">
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{epic.title}</p>
                                        <p className="text-xs text-zinc-500">{epic.stories.length} storie</p>
                                    </div>
                                    <select
                                        value={assignments[epic.id] || ''}
                                        onChange={(e) => assignEpic(epic.id, e.target.value)}
                                        className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
                                    >
                                        <option value="">Seleziona Release</option>
                                        {releases.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end pt-8">
                        <button onClick={handleNext} className="btn-primary">
                            Salva e Continua <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;

