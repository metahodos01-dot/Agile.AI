import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Layers, FileText, Plus, ChevronDown, ChevronRight, Trash2, BookOpen, Target } from 'lucide-react';

const Backlog = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [backlog, setBacklog] = useState((project.backlog && project.backlog.length > 0) ? project.backlog : []);
    const [expandedEpics, setExpandedEpics] = useState({});

    const toggleEpic = (id) => setExpandedEpics(prev => ({ ...prev, [id]: !prev[id] }));

    const handleGenerate = () => {
        setLoading(true);
        setTimeout(() => {
            const newBacklog = [
                {
                    id: 1,
                    title: "Monitoraggio produzione in tempo reale",
                    stories: [
                        {
                            id: 101,
                            title: "Come responsabile di linea, voglio visualizzare l'OEE in tempo reale per identificare immediatamente le perdite di efficienza.",
                            keyResult: "Migliora visibilità → contribuisce al KR: 'Aumentare OEE all'85%'"
                        },
                        {
                            id: 102,
                            title: "Come operatore, voglio ricevere allarmi automatici quando una macchina si ferma per intervenire rapidamente.",
                            keyResult: "Riduce tempi di reazione → contribuisce al KR: 'Ridurre fermi non pianificati del 30%'"
                        },
                        {
                            id: 103,
                            title: "Come direttore di stabilimento, voglio vedere una dashboard con i KPI di tutte le linee per prendere decisioni basate sui dati.",
                            keyResult: "Supporta decision-making → contribuisce al KR: 'Migliorare efficienza complessiva'"
                        }
                    ]
                },
                {
                    id: 2,
                    title: "Controllo qualità integrato",
                    stories: [
                        {
                            id: 201,
                            title: "Come addetto qualità, voglio registrare i controlli su checklist digitali per eliminare la carta e ridurre errori.",
                            keyResult: "Digitalizzazione → contribuisce al KR: 'Implementare controllo qualità in-line al 100%'"
                        },
                        {
                            id: 202,
                            title: "Come quality manager, voglio analizzare i trend di difettosità per identificare le cause radice.",
                            keyResult: "Analisi preventiva → contribuisce al KR: 'Ridurre difetti a meno di 50 PPM'"
                        },
                        {
                            id: 203,
                            title: "Come operatore, voglio segnalare una non conformità con foto e descrizione per documentare il problema.",
                            keyResult: "Tracciabilità → contribuisce al KR: 'Tracciabilità completa dei lotti'"
                        }
                    ]
                },
                {
                    id: 3,
                    title: "Gestione manutenzione",
                    stories: [
                        {
                            id: 301,
                            title: "Come manutentore, voglio vedere il calendario delle manutenzioni preventive per pianificare gli interventi.",
                            keyResult: "Prevenzione guasti → contribuisce al KR: 'Ridurre fermi non pianificati del 30%'"
                        },
                        {
                            id: 302,
                            title: "Come responsabile manutenzione, voglio tracciare i ricambi utilizzati per ottimizzare il magazzino.",
                            keyResult: "Ottimizzazione scorte → contribuisce al KR: 'Ridurre costi operativi del 10%'"
                        },
                        {
                            id: 303,
                            title: "Come tecnico, voglio consultare lo storico degli interventi su ogni macchina per diagnosticare problemi ricorrenti.",
                            keyResult: "Knowledge base → contribuisce al KR: 'Aumentare MTBF a 200 ore'"
                        }
                    ]
                },
                {
                    id: 4,
                    title: "Tracciabilità e logistica interna",
                    stories: [
                        {
                            id: 401,
                            title: "Come addetto logistica, voglio scansionare i lotti in ingresso per registrarli automaticamente a sistema.",
                            keyResult: "Automazione → contribuisce al KR: 'Tracciabilità completa dei lotti'"
                        },
                        {
                            id: 402,
                            title: "Come responsabile magazzino, voglio visualizzare le giacenze in tempo reale per evitare rotture di stock.",
                            keyResult: "Visibilità scorte → contribuisce al KR: 'Ridurre scorte del 25%'"
                        },
                        {
                            id: 403,
                            title: "Come cliente, voglio tracciare la storia completa del prodotto dalla materia prima alla consegna.",
                            keyResult: "Compliance → contribuisce al KR: 'Certificazione di settore entro 6 mesi'"
                        }
                    ]
                }
            ];
            setBacklog(newBacklog);
            setExpandedEpics({ 1: true, 2: true, 3: true, 4: true });
            setLoading(false);
        }, 1500);
    };

    const addEpic = () => {
        const newId = Date.now();
        setBacklog([...backlog, { id: newId, title: "Nuova Epic", stories: [] }]);
        setExpandedEpics(prev => ({ ...prev, [newId]: true }));
    };

    const addStory = (epicId) => {
        setBacklog(backlog.map(epic =>
            epic.id === epicId
                ? { ...epic, stories: [...epic.stories, { id: Date.now(), title: "Come [ruolo], voglio [azione] per [beneficio]...", keyResult: "" }] }
                : epic
        ));
    };

    const updateStoryKeyResult = (epicId, storyId, keyResult) => {
        setBacklog(backlog.map(epic =>
            epic.id === epicId
                ? { ...epic, stories: epic.stories.map(s => s.id === storyId ? { ...s, keyResult } : s) }
                : epic
        ));
    };

    const updateEpicTitle = (id, title) => setBacklog(backlog.map(e => e.id === id ? { ...e, title } : e));

    const updateStoryTitle = (epicId, storyId, title) => {
        setBacklog(backlog.map(epic =>
            epic.id === epicId
                ? { ...epic, stories: epic.stories.map(s => s.id === storyId ? { ...s, title } : s) }
                : epic
        ));
    };

    const removeStory = (epicId, storyId) => {
        setBacklog(backlog.map(epic =>
            epic.id === epicId
                ? { ...epic, stories: epic.stories.filter(s => s.id !== storyId) }
                : epic
        ));
    };

    const removeEpic = (epicId) => {
        setBacklog(backlog.filter(epic => epic.id !== epicId));
        setExpandedEpics(prev => {
            const newState = { ...prev };
            delete newState[epicId];
            return newState;
        });
    };

    const handleNext = () => {
        updateProject({ backlog });
        navigate('/estimates');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Layers size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 6 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Product backlog</h1>
                    <p className="text-zinc-400 mt-2">Suddividi la vision in epic e user story.</p>
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
                        <h3 className="text-lg font-semibold text-white mb-2">Cos'è il product backlog?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            Il Product Backlog è la lista ordinata di tutto ciò che serve nel prodotto.
                            È composto da <strong>Epic</strong> (grandi funzionalità o aree di intervento) suddivise in <strong>User Story</strong>
                            (requisiti dal punto di vista dell'utente nel formato "Come [ruolo], voglio [azione] per [beneficio]").
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm">
                                <strong>Epic:</strong> "Sistema di Guida Intelligente"<br />
                                <strong>User Story 1:</strong> "Come <strong>pilota urbano</strong>, voglio selezionare la modalità 'Eco' per estendere l'autonomia del 20%."<br />
                                <strong>User Story 2:</strong> "Come <strong>meccanico</strong>, voglio accedere ai log della centralina via Bluetooth per diagnosi rapida."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <h3 className="text-lg font-semibold mb-4 text-center text-white">Generazione backlog</h3>
                        <p className="text-sm text-center text-zinc-400 mb-6">
                            Utilizziamo vision e obiettivi per generare automaticamente epic e user story.
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 mb-4"
                        >
                            {loading ? <span className="animate-pulse">Generazione...</span> : <><Sparkles size={16} /> Genera backlog</>}
                        </button>
                        <button onClick={addEpic} className="w-full glass-button flex items-center justify-center gap-2">
                            <Plus size={16} /> Aggiungi epic manualmente
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-4">
                    {backlog.length === 0 && (
                        <div className="glass-panel p-12 text-center text-zinc-500 border-dashed border-2 border-zinc-700">
                            <Layers size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Il tuo backlog è vuoto. Generane uno con l'AI o aggiungi elementi manualmente.</p>
                        </div>
                    )}

                    {backlog.map(epic => (
                        <div key={epic.id} className="glass-panel p-0 overflow-hidden">
                            <div
                                className="p-4 bg-zinc-800/50 flex items-center gap-3 cursor-pointer hover:bg-zinc-800/80 transition-colors group"
                                onClick={() => toggleEpic(epic.id)}
                            >
                                {expandedEpics[epic.id] ? <ChevronDown size={20} className="text-zinc-400" /> : <ChevronRight size={20} className="text-zinc-400" />}
                                <Layers size={20} className="text-indigo-400" />
                                <input
                                    value={epic.title}
                                    onChange={(e) => updateEpicTitle(epic.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-transparent border-none focus:ring-0 text-lg font-semibold text-white flex-1"
                                    placeholder="Titolo Epic"
                                />
                                <span className="text-xs bg-zinc-900 px-2 py-1 rounded text-zinc-400">
                                    {epic.stories.length} Storie
                                </span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeEpic(epic.id); }}
                                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-1"
                                    title="Elimina Epic"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {expandedEpics[epic.id] && (
                                <div className="p-4 bg-zinc-900/30 space-y-2 border-t border-zinc-800">
                                    {epic.stories.map(story => (
                                        <div key={story.id} className="p-3 rounded-lg hover:bg-white/5 group border border-transparent hover:border-zinc-700/50 transition-all">
                                            <div className="flex items-start gap-3">
                                                <FileText size={16} className="text-indigo-400 mt-1 flex-shrink-0" />
                                                <div className="flex-1 space-y-2">
                                                    <textarea
                                                        value={story.title}
                                                        onChange={(e) => updateStoryTitle(epic.id, story.id, e.target.value)}
                                                        className="bg-transparent border-none focus:ring-0 w-full text-sm text-zinc-300 resize-none"
                                                        rows={2}
                                                        placeholder="Come [ruolo], voglio [azione] per [beneficio]"
                                                    />
                                                    {/* Key Result Connection */}
                                                    <div className="flex items-start gap-2 mt-2 p-2 bg-emerald-500/5 rounded-lg border border-emerald-500/20">
                                                        <Target size={14} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <span className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Collegamento KR</span>
                                                            <input
                                                                value={story.keyResult || ''}
                                                                onChange={(e) => updateStoryKeyResult(epic.id, story.id, e.target.value)}
                                                                className="bg-transparent border-none focus:ring-0 w-full text-xs text-zinc-400 mt-1 p-0"
                                                                placeholder="Descrivi come questa story contribuisce ai Key Results..."
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onClick={() => removeStory(epic.id, story.id)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 flex-shrink-0">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addStory(epic.id)}
                                        className="flex items-center gap-2 text-xs text-zinc-500 hover:text-indigo-400 mt-2 ml-7"
                                    >
                                        <Plus size={14} /> Aggiungi user story
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

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

export default Backlog;
