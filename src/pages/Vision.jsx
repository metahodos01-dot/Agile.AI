
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { generateAIResponseV2 } from '../services/aiService';
import { Sparkles, ArrowRight, Lightbulb, BookOpen } from 'lucide-react';
import PhaseNavigation from '../components/common/PhaseNavigation';
import InstructionCard from '../components/common/InstructionCard';
import HelpTooltip from '../components/common/HelpTooltip';

const Vision = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Initial state from project context or defaults
    const [visionInput, setVisionInput] = useState({
        targetAudience: project.targetAudience || '',
        problem: project.problem || '',
        currentSolution: project.currentSolution || '',
        differentiation: project.differentiation || ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'projectName') {
            updateProject({ name: value });
        } else {
            setVisionInput({ ...visionInput, [name]: value });
        }
    };

    const handleGenerate = async () => {
        setLoading(true);
        // Prompt construction
        const prompt = {
            projectName: project.name,
            ...visionInput
        };

        try {
            const generatedVision = await generateAIResponseV2(prompt, 'vision');
            // Update only the vision field in the project, keeping the inputs
            updateProject({
                vision: generatedVision,
                // Also save the inputs so they persist
                ...visionInput
            });
        } catch (error) {
            console.error("Error generating vision:", error);
        }
        setLoading(false);
    };

    const handleNext = () => {
        // Ensure manual edits to inputs are also saved if they skipped generate
        updateProject({
            targetAudience: visionInput.targetAudience,
            problem: visionInput.problem,
            currentSolution: visionInput.currentSolution,
            differentiation: visionInput.differentiation
        });
        navigate('/objectives');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Lightbulb size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 1 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Product vision</h1>
                    <p className="text-zinc-400 mt-2">Definisci la proposta di valore del tuo prodotto o servizio.</p>
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
                        <h3 className="text-lg font-semibold text-white mb-2">Cos'è la product vision?</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            La Product Vision è una dichiarazione sintetica che descrive lo scopo ultimo del prodotto.
                            Risponde alle domande: "Per chi è?", "Che problema risolve?" e "Perché è diverso dalla concorrenza?".
                            È la stella polare che guida tutte le decisioni del team.
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm italic">
                                "Per i <strong>motociclisti urbani ed ecologici</strong> che <strong>cercano prestazioni emozionanti senza inquinare</strong>,
                                <strong>Moto Elettrica Future</strong> è una <strong>moto sportiva a zero emissioni</strong> che
                                <strong>offre un'accelerazione istantanea e un'autonomia di 300km</strong>. A differenza delle moto elettriche attuali,
                                il nostro prodotto <strong>utilizza batterie a stato solido e un'AI predittiva per la gestione dell'energia</strong>."
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <InstructionCard
                title="Definisci la Visione del Prodotto"
                description="La Product Vision è la 'Stella Polare' del tuo progetto. Descrive il futuro che vuoi creare e perché è importante. Una buona visione ispira il team e guida le decisioni strategiche."
                tips={[
                    "Disegna il 'Chi' (Target) e il 'Cosa' (Problema) prima del 'Come' (Soluzione).",
                    "Usa l'AI per generare bozze creative se hai il blocco dello scrittore.",
                    "Sii conciso: una visione chiara si ricorda facilmente."
                ]}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Input Panel */}
                <div className="glass-panel p-6 space-y-5">
                    <h2 className="text-lg font-semibold text-white">Dettagli del progetto</h2>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-300">Nome del prodotto/servizio</label>
                        <input
                            type="text"
                            name="projectName"
                            value={project.name || ''}
                            onChange={handleInputChange}
                            placeholder="es. TaskFlow Pro"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-300 flex items-center">
                            Target di riferimento
                            <HelpTooltip text="A chi è rivolto il prodotto? Sii specifico (es. 'Manager di PMI' invece di 'Aziende')." />
                        </label>
                        <input
                            type="text"
                            name="targetAudience"
                            value={visionInput.targetAudience}
                            onChange={handleInputChange}
                            placeholder="es. Team di sviluppo software"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-300 flex items-center">
                            Problema da Risolvere
                            <HelpTooltip text="Quale dolore o bisogno stai risolvendo? Perché i clienti dovrebbero pagare per questo?" />
                        </label>
                        <textarea
                            name="problem"
                            value={visionInput.problem}
                            onChange={handleInputChange}
                            className="h-28 resize-none"
                            placeholder="Descrivi il problema principale che il tuo prodotto risolve..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-300">Come il Cliente Risolve Oggi il Problema</label>
                        <textarea
                            name="currentSolution"
                            value={visionInput.currentSolution}
                            onChange={handleInputChange}
                            className="h-24 resize-none"
                            placeholder="es. Usano Excel, fogli cartacei, strumenti non integrati, processi manuali..."
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-300">Come Ci Differenziamo dalle Soluzioni Esistenti</label>
                        <textarea
                            name="differentiation"
                            value={visionInput.differentiation}
                            onChange={handleInputChange}
                            className="h-24 resize-none"
                            placeholder="es. Interfaccia più semplice, integrazione AI, costo inferiore, funzionalità uniche..."
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full btn-primary"
                    >
                        {loading ? (
                            <span className="animate-pulse">Generazione in corso...</span>
                        ) : (
                            <>
                                <Sparkles size={16} />
                                Genera Vision con AI
                            </>
                        )}
                    </button>
                </div>

                {/* Output Panel */}
                <div className="glass-panel p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Vision statement</h2>
                        <span className="text-xs text-zinc-500">Template Agile</span>
                    </div>

                    <textarea
                        value={project.vision}
                        onChange={(e) => updateProject({ vision: e.target.value })}
                        className="flex-1 min-h-[280px] resize-none bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm leading-relaxed focus:border-indigo-500 focus:ring-0"
                        placeholder="La tua vision generata dall'AI apparirà qui. Puoi anche scriverla manualmente..."
                    />

                </div>
            </div>

            {/* Phase Navigation */}
            <PhaseNavigation
                onSave={async () => {
                    updateProject({
                        targetAudience: visionInput.targetAudience,
                        problem: visionInput.problem,
                        currentSolution: visionInput.currentSolution,
                        differentiation: visionInput.differentiation,
                        // Vision is already updated via textarea onChange, but ensure input fields are saved too
                    });
                    // Optional: trigger a real save to server
                    // await saveProject();
                    return true;
                }}
            />
        </div>
    );
};

export default Vision;
