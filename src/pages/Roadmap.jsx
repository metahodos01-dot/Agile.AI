import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Map, BookOpen, Calendar, Plus, Trash2, GripVertical } from 'lucide-react';

const Roadmap = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Initialize releases with backward compatibility for string arrays
    const [releases, setReleases] = useState(() => {
        const existing = project.roadmap?.releases;
        if (!existing) {
            const today = new Date();
            return [
                { name: 'Pilota', date: new Date(today.setMonth(today.getMonth() + 1)).toISOString().split('T')[0] },
                { name: 'Linea 1', date: new Date(today.setMonth(today.getMonth() + 2)).toISOString().split('T')[0] },
                { name: 'Tutte le linee', date: new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0] },
                { name: 'Futuro', date: '' }
            ];
        }
        // Migrate legacy string array to objects
        return existing.map(r => typeof r === 'string' ? { name: r, date: '' } : r);
    });

    const [assignments, setAssignments] = useState(project.roadmap?.assignments || {});

    const handleAutoAssign = () => {
        setLoading(true);
        setTimeout(() => {
            const newAssignments = {};
            project.backlog.forEach((epic, index) => {
                if (index === 0) newAssignments[epic.id] = releases[0]?.name || 'MVP';
                else if (index === 1) newAssignments[epic.id] = releases[1]?.name || 'Versione 1.0';
                else newAssignments[epic.id] = releases[2]?.name || 'Versione 2.0';
            });
            setAssignments(newAssignments);
            setLoading(false);
        }, 1200);
    };

    const assignEpic = (epicId, releaseName) => {
        setAssignments({ ...assignments, [epicId]: releaseName });
    };

    const addRelease = () => {
        const newReleaseName = `Release ${releases.length + 1}`;
        setReleases([...releases, { name: newReleaseName, date: '' }]);
    };

    const updateRelease = (index, field, value) => {
        const newReleases = [...releases];
        const oldName = newReleases[index].name;

        newReleases[index] = { ...newReleases[index], [field]: value };
        setReleases(newReleases);

        // If name changed, update assignments
        if (field === 'name') {
            const newAssignments = { ...assignments };
            Object.keys(newAssignments).forEach(key => {
                if (newAssignments[key] === oldName) {
                    newAssignments[key] = value;
                }
            });
            setAssignments(newAssignments);
        }
    };

    const removeRelease = (index) => {
        const releaseName = releases[index].name;
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
                    <h1 className="text-3xl font-bold text-white">Roadmap e release planning</h1>
                    <p className="text-zinc-400 mt-2">Organizza le Epic in rilasci pianificati con una timeline definita.</p>
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
                                <strong>Alpha:</strong> Prototipo marciante (Telaio + Motore base) - Test in pista chiusa.<br />
                                <strong>Beta:</strong> Integrazione software completo + carene definitive - Test su strada.<br />
                                <strong>Launch Version:</strong> Omologazione stradale + Produzione di serie.
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
                        <div className="space-y-3">
                            {releases.map((release, index) => (
                                <div key={index} className="p-3 bg-zinc-800/30 rounded-lg group space-y-2">
                                    <div className="flex items-center gap-2">
                                        <GripVertical size={14} className="text-zinc-600" />
                                        <input
                                            value={release.name}
                                            onChange={(e) => updateRelease(index, 'name', e.target.value)}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-zinc-300 p-0 font-medium"
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
                                    <div className="flex items-center gap-2 pl-6">
                                        <Calendar size={12} className="text-zinc-500" />
                                        <input
                                            type="date"
                                            value={release.date}
                                            onChange={(e) => updateRelease(index, 'date', e.target.value)}
                                            className="bg-transparent border-none focus:ring-0 text-xs text-zinc-400 p-0 w-full"
                                        />
                                    </div>
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
                            {releases.slice(0, 4).map((release, i) => (
                                <div key={i} className="text-center">
                                    <div className="flex flex-col items-center justify-center gap-1 mb-2">
                                        <span className="text-sm font-bold text-indigo-400">{release.name}</span>
                                        {release.date && (
                                            <span className="text-xs text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded-full border border-white/5">
                                                {new Date(release.date).toLocaleDateString('it-IT')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="h-1 bg-indigo-500/30 rounded relative">
                                        <div className="absolute -top-1 left-1/2 w-3 h-3 bg-indigo-500 rounded-full border-2 border-zinc-900 transform -translate-x-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {project.backlog.map(epic => (
                                <div key={epic.id} className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl hover:bg-zinc-800/50 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{epic.title}</p>
                                        <p className="text-xs text-zinc-500">{epic.stories.length} storie</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-zinc-500">Assegna a:</span>
                                        <select
                                            value={assignments[epic.id] || ''}
                                            onChange={(e) => assignEpic(epic.id, e.target.value)}
                                            className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-sm min-w-[150px]"
                                        >
                                            <option value="">-- Seleziona --</option>
                                            {releases.map((r, i) => <option key={i} value={r.name}>{r.name}</option>)}
                                        </select>
                                    </div>
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

