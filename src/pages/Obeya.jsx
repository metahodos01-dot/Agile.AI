import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Layout, CheckCircle2, Circle, BookOpen, Plus, Trash2, Edit3 } from 'lucide-react';

const Obeya = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [setupItems, setSetupItems] = useState(project.obeya.items || []);

    const handleGenerate = () => {
        setLoading(true);
        setTimeout(() => {
            const teamSize = project.team.reduce((acc, curr) => acc + curr.count, 0) || 5;
            const suggestions = [
                { category: "Layout Fisico", item: `Spazio aperto con ${teamSize + 2} postazioni`, checked: false },
                { category: "Layout Fisico", item: "Area dedicata per il Daily Standup", checked: false },
                { category: "Attrezzature", item: "Kanban Board grande (fisica o schermo digitale)", checked: false },
                { category: "Attrezzature", item: "Monitor per Burndown/Burnup Chart", checked: false },
                { category: "Radiatori Informativi", item: "Vision e Roadmap visibili a parete", checked: false },
                { category: "Radiatori Informativi", item: "Team Norms e Definition of Done", checked: false },
                { category: "Materiali", item: "Post-it, pennarelli, lavagne bianche", checked: false },
            ];
            setSetupItems(suggestions);
            setLoading(false);
        }, 1200);
    };

    const toggleItem = (index) => {
        const newItems = [...setupItems];
        newItems[index].checked = !newItems[index].checked;
        setSetupItems(newItems);
    };

    const addItem = () => {
        setSetupItems([...setupItems, { category: "Personalizzato", item: "Nuovo elemento", checked: false }]);
    };

    const updateItem = (index, field, value) => {
        const newItems = [...setupItems];
        newItems[index][field] = value;
        setSetupItems(newItems);
    };

    const removeItem = (index) => {
        setSetupItems(setupItems.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        updateProject({ obeya: { items: setupItems } });
        navigate('/backlog');
    };

    const progress = setupItems.length > 0
        ? Math.round((setupItems.filter(i => i.checked).length / setupItems.length) * 100)
        : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Layout size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 5 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Obeya room</h1>
                    <p className="text-zinc-400 mt-2">Progetta la tua "War Room" per massima trasparenza e collaborazione.</p>
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
                        <h3 className="text-lg font-semibold text-white mb-2">Cos'è l'Obeya room?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            "Obeya" è una parola giapponese che significa "grande stanza". È uno spazio fisico (o virtuale)
                            dove tutte le informazioni chiave del progetto sono visibili a colpo d'occhio.
                            Include board Kanban, grafici di avanzamento, vision e metriche chiave.
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm">
                                Una Obeya tipica include: <strong>Kanban Board</strong> centrale con le colonne To Do/In Progress/Done,
                                <strong>Burndown Chart</strong> aggiornato quotidianamente, <strong>Vision Statement</strong> stampato in grande,
                                e uno <strong>spazio per i Post-it</strong> delle retrospettive.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-panel p-6">
                        <div className="flex justify-center mb-6">
                            <Layout size={48} className="text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2 text-center text-white">Configurazione stanza</h3>
                        <p className="text-sm text-center text-zinc-400 mb-6">
                            Analizziamo la dimensione del team e le esigenze del progetto per generare il setup ottimale.
                        </p>
                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Progettazione...</span> : <><Sparkles size={16} /> Suggerisci Setup</>}
                        </button>
                    </div>

                    {setupItems.length > 0 && (
                        <div className="glass-panel p-6">
                            <h3 className="text-sm font-semibold mb-4 text-zinc-400 uppercase">Progresso Setup</h3>
                            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                            <p className="text-right text-xs mt-2 text-zinc-400">{progress}% Completato</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    <div className="glass-panel p-0 overflow-hidden">
                        <div className="p-6 bg-zinc-800/50 border-b border-zinc-700/50">
                            <h3 className="font-semibold text-white">Checklist obeya</h3>
                        </div>
                        {setupItems.length === 0 ? (
                            <div className="p-12 text-center text-zinc-500">
                                <p>Clicca "Suggerisci Setup" per generare la tua checklist.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-zinc-800">
                                {setupItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group ${item.checked ? 'opacity-50' : ''}`}
                                    >
                                        <div
                                            className={`cursor-pointer ${item.checked ? 'text-green-500' : 'text-zinc-600'}`}
                                            onClick={() => toggleItem(index)}
                                        >
                                            {item.checked ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                value={item.item}
                                                onChange={(e) => updateItem(index, 'item', e.target.value)}
                                                className={`w-full bg-transparent border-none focus:ring-0 font-medium p-0 ${item.checked ? 'line-through text-zinc-500' : 'text-zinc-200'}`}
                                                placeholder="Descrizione elemento"
                                            />
                                            <input
                                                value={item.category}
                                                onChange={(e) => updateItem(index, 'category', e.target.value)}
                                                className="w-full bg-transparent border-none focus:ring-0 text-xs text-zinc-500 p-0 mt-1"
                                                placeholder="Categoria"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeItem(index)}
                                            className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 transition-all p-1"
                                            title="Elimina elemento"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={addItem}
                                    className="w-full p-4 flex items-center justify-center gap-2 text-indigo-400 hover:text-indigo-300 hover:bg-white/5 transition-colors"
                                >
                                    <Plus size={16} /> Aggiungi Elemento
                                </button>
                            </div>
                        )}
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

export default Obeya;
