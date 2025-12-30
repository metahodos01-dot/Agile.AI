import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Layout, CheckCircle2, Circle, BookOpen, Plus, Trash2, Edit3, Upload, Camera, Wand2 } from 'lucide-react';
import PhaseNavigation from '../components/common/PhaseNavigation';

const Obeya = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [setupItems, setSetupItems] = useState(project.obeya?.items || []);

    // Nano Banana AI State
    const [aiImage, setAiImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showAiResult, setShowAiResult] = useState(false);

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Simulate upload and processing
        const reader = new FileReader();
        reader.onload = (event) => {
            setAiImage(event.target.result); // Preview of uploaded image
            setIsGenerating(true);

            // Simulate AI Processing "Nano Banana"
            setTimeout(() => {
                setIsGenerating(false);
                setShowAiResult(true);
            }, 3000);
        };
        reader.readAsDataURL(file);
    };

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
                                Nell'Obeya della <strong>Moto Elettrica</strong>: <strong>Prototipo fisico</strong> al centro, paratia con <strong>mappe motore stampate</strong>,
                                <strong>grafici di autonomia</strong> batteria in tempo reale, e <strong>Kanban Board</strong> fisica per il tracciamento dei componenti meccanici ed elettronici.
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

                    {/* Nano Banana AI Designer */}
                    <div className="glass-panel p-6 border-t-4 border-yellow-400 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                            <Sparkles size={100} />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <Wand2 className="text-yellow-400 animate-pulse" size={24} />
                            <h3 className="text-lg font-bold text-white">Nano Banana AI</h3>
                        </div>
                        <p className="text-sm text-zinc-400 mb-6">
                            Carica una foto della tua stanza. Nano Banana la trasformerà in una Obeya Room perfetta usando l'AI.
                        </p>

                        {!showAiResult ? (
                            <div className="relative group cursor-pointer border-2 border-dashed border-zinc-700 hover:border-yellow-400 rounded-xl p-8 transition-all bg-zinc-800/30 hover:bg-zinc-800/60 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={handlePhotoUpload}
                                    disabled={isGenerating}
                                />
                                {isGenerating ? (
                                    <div className="flex flex-col items-center animate-pulse">
                                        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                                        <p className="text-yellow-400 font-bold">Nano Banana sta pensando...</p>
                                        <p className="text-xs text-zinc-500 mt-2">Analisi spazi e generazione...</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <Camera size={32} className="text-zinc-500 group-hover:text-yellow-400 mb-2 transition-colors" />
                                        <p className="text-zinc-300 font-medium group-hover:text-white">Carica foto ambiente</p>
                                        <p className="text-xs text-zinc-500 mt-1">JPG, PNG max 5MB</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <div className="relative rounded-xl overflow-hidden border border-yellow-400/30 shadow-2xl shadow-yellow-500/10 group">
                                    <img src="/obeya-concept.png" alt="Generated Obeya" className="w-full h-auto transform group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                        <p className="text-yellow-400 font-bold flex items-center gap-2">
                                            <Sparkles size={14} /> Obeya Concept Generato
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setShowAiResult(false); setAiImage(null); }}
                                    className="w-full py-2 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-700"
                                >
                                    Carica un'altra foto
                                </button>
                            </div>
                        )}
                    </div>
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

                    {/* Phase Navigation */}
                    <PhaseNavigation
                        onSave={async () => {
                            updateProject({ obeya: { items: setupItems } });
                            return true;
                        }}
                    />
                </div>
            </div>
        </div >
    );
};

export default Obeya;
