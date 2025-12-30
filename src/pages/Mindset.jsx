import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { ArrowRight, RefreshCw, GitBranch, Users, Zap, MessageCircle, CheckCircle, XCircle, ArrowDown } from 'lucide-react';
import PhaseNavigation from '../components/common/PhaseNavigation';

const Mindset = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState({
        teamExperience: project.mindsetFeedback?.teamExperience || '',
        currentChallenges: project.mindsetFeedback?.currentChallenges || '',
        expectations: project.mindsetFeedback?.expectations || '',
        readyForChange: project.mindsetFeedback?.readyForChange || null
    });

    const handleNext = () => {
        updateProject({ mindsetFeedback: feedback });
        navigate('/vision');
    };

    const isComplete = feedback.teamExperience && feedback.currentChallenges && feedback.readyForChange !== null;

    return (
        <div className="space-y-10 py-4">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
                    <RefreshCw size={14} className="text-indigo-400" />
                    <span className="text-indigo-400 text-sm font-medium">Prima di Iniziare</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                    Il Mindset <span className="text-gradient">Agile</span>
                </h1>
                <p className="text-lg text-zinc-400">
                    Prima di costruire il tuo progetto, è fondamentale capire la differenza di mentalità
                    tra l'approccio tradizionale e quello Agile.
                </p>
            </div>

            {/* Comparison Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Waterfall */}
                <div className="glass-panel p-6 border-l-4 border-red-500/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                            <ArrowDown size={20} className="text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Waterfall (Tradizionale)</h2>
                            <p className="text-sm text-red-400">Approccio sequenziale e rigido</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: XCircle, text: "Pianificazione completa all'inizio", detail: "Tutto definito prima di iniziare" },
                            { icon: XCircle, text: "Fasi sequenziali", detail: "Analisi → Design → Sviluppo → Test" },
                            { icon: XCircle, text: "Feedback solo alla fine", detail: "Il cliente vede il prodotto a progetto concluso" },
                            { icon: XCircle, text: "Resistenza al cambiamento", detail: "Modifiche costose e difficili" },
                            { icon: XCircle, text: "Consegna unica finale", detail: "Tutto o niente alla fine" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-red-500/5 rounded-lg">
                                <item.icon size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-zinc-200 font-medium">{item.text}</p>
                                    <p className="text-xs text-zinc-500">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual Flow */}
                    <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl">
                        <p className="text-xs text-zinc-500 uppercase mb-3 text-center">Flusso Waterfall</p>
                        <div className="flex items-center justify-between text-xs">
                            {['Requisiti', 'Design', 'Sviluppo', 'Test', 'Rilascio'].map((phase, i) => (
                                <React.Fragment key={i}>
                                    <div className="text-center">
                                        <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center mb-1">
                                            <span className="text-red-400 font-bold">{i + 1}</span>
                                        </div>
                                        <span className="text-zinc-500">{phase}</span>
                                    </div>
                                    {i < 4 && <ArrowRight size={16} className="text-zinc-700" />}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Agile */}
                <div className="glass-panel p-6 border-l-4 border-green-500/50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                            <RefreshCw size={20} className="text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Agile (Iterativo)</h2>
                            <p className="text-sm text-green-400">Approccio flessibile e adattivo</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {[
                            { icon: CheckCircle, text: "Pianificazione progressiva", detail: "Si pianifica a breve termine (Sprint)" },
                            { icon: CheckCircle, text: "Iterazioni continue", detail: "Cicli di 2-4 settimane con valore tangibile" },
                            { icon: CheckCircle, text: "Feedback costante", detail: "Demo frequenti e adattamento continuo" },
                            { icon: CheckCircle, text: "Abbraccia il cambiamento", detail: "Rispondere al cambiamento > seguire un piano" },
                            { icon: CheckCircle, text: "Consegne incrementali", detail: "Valore consegnato ad ogni Sprint" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 bg-green-500/5 rounded-lg">
                                <item.icon size={18} className="text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-zinc-200 font-medium">{item.text}</p>
                                    <p className="text-xs text-zinc-500">{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual Flow */}
                    <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl">
                        <p className="text-xs text-zinc-500 uppercase mb-3 text-center">Flusso Agile</p>
                        <div className="flex items-center justify-center">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="2" strokeDasharray="8 4" opacity="0.3" />
                                    <path d="M 50 10 A 40 40 0 1 1 49.9 10" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round">
                                        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
                                    </path>
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <RefreshCw size={24} className="text-green-400 mx-auto mb-1" />
                                        <span className="text-xs text-zinc-400">Sprint<br />Continui</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrum Framework Section */}
            <div className="glass-panel p-8 border-l-4 border-purple-500">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-3">Il Framework Scrum</h2>
                    <p className="text-zinc-400 max-w-2xl mx-auto">
                        Scrum è il framework Agile più diffuso. Nasce nel 1995 da Ken Schwaber e Jeff Sutherland
                        per gestire progetti complessi dove i requisiti cambiano frequentemente.
                    </p>
                </div>

                {/* Animated Scrum Diagram */}
                <div className="mb-10">
                    <div className="relative mx-auto" style={{ width: '100%', maxWidth: '700px', height: '450px' }}>
                        <svg viewBox="0 0 700 450" className="w-full h-full">
                            {/* Definitions for gradients and animations */}
                            <defs>
                                <linearGradient id="sprintGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                                <linearGradient id="backlogGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#22c55e" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Background circle track */}
                            <circle cx="350" cy="225" r="150" fill="none" stroke="#27272a" strokeWidth="40" />

                            {/* Animated Sprint Circle */}
                            <circle
                                cx="350" cy="225" r="150"
                                fill="none"
                                stroke="url(#sprintGradient)"
                                strokeWidth="40"
                                strokeDasharray="235 707"
                                strokeLinecap="round"
                                filter="url(#glow)"
                            >
                                <animateTransform
                                    attributeName="transform"
                                    type="rotate"
                                    from="0 350 225"
                                    to="360 350 225"
                                    dur="8s"
                                    repeatCount="indefinite"
                                />
                            </circle>

                            {/* Center Sprint Text */}
                            <text x="350" y="210" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">SPRINT</text>
                            <text x="350" y="235" textAnchor="middle" fill="#a1a1aa" fontSize="14">2-4 Settimane</text>
                            <text x="350" y="255" textAnchor="middle" fill="#6366f1" fontSize="12">
                                <tspan>🔄</tspan>
                            </text>

                            {/* Product Backlog (Left) */}
                            <g transform="translate(50, 175)">
                                <rect x="0" y="0" width="100" height="100" rx="12" fill="#22c55e" fillOpacity="0.1" stroke="#22c55e" strokeWidth="2" />
                                <text x="50" y="30" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">PRODUCT</text>
                                <text x="50" y="45" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="bold">BACKLOG</text>
                                <text x="50" y="65" textAnchor="middle" fill="#86efac" fontSize="20">📚</text>
                                <text x="50" y="85" textAnchor="middle" fill="#a1a1aa" fontSize="9">Prioritizzato</text>
                                {/* Animated items moving */}
                                <rect x="20" y="50" width="60" height="6" rx="2" fill="#22c55e" opacity="0.5">
                                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
                                </rect>
                            </g>

                            {/* Arrow from Backlog to Sprint */}
                            <path d="M 160 225 L 190 225" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,3" markerEnd="url(#arrowGreen)">
                                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
                            </path>
                            <defs>
                                <marker id="arrowGreen" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#22c55e" />
                                </marker>
                            </defs>

                            {/* Increment (Right) */}
                            <g transform="translate(550, 175)">
                                <rect x="0" y="0" width="100" height="100" rx="12" fill="#f59e0b" fillOpacity="0.1" stroke="#f59e0b" strokeWidth="2" />
                                <text x="50" y="30" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">INCREMENTO</text>
                                <text x="50" y="50" textAnchor="middle" fill="#fcd34d" fontSize="20">📦</text>
                                <text x="50" y="70" textAnchor="middle" fill="#a1a1aa" fontSize="9">"Done"</text>
                                <text x="50" y="85" textAnchor="middle" fill="#a1a1aa" fontSize="9">Potenzialmente</text>
                                <text x="50" y="97" textAnchor="middle" fill="#a1a1aa" fontSize="9">Rilasciabile</text>
                            </g>

                            {/* Arrow from Sprint to Increment */}
                            <path d="M 510 225 L 540 225" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,3" markerEnd="url(#arrowOrange)">
                                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
                            </path>
                            <defs>
                                <marker id="arrowOrange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                                </marker>
                            </defs>

                            {/* Ceremonies around the sprint */}
                            {/* Sprint Planning (Top) */}
                            <g transform="translate(290, 30)">
                                <rect x="0" y="0" width="120" height="50" rx="8" fill="#6366f1" fillOpacity="0.15" stroke="#6366f1" strokeWidth="1.5" />
                                <text x="60" y="22" textAnchor="middle" fill="#818cf8" fontSize="10" fontWeight="bold">📋 PLANNING</text>
                                <text x="60" y="38" textAnchor="middle" fill="#a1a1aa" fontSize="9">Cosa + Come</text>
                                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                            </g>

                            {/* Daily Scrum (Top Right) */}
                            <g transform="translate(480, 80)">
                                <rect x="0" y="0" width="100" height="50" rx="8" fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="1.5" />
                                <text x="50" y="22" textAnchor="middle" fill="#86efac" fontSize="10" fontWeight="bold">☀️ DAILY</text>
                                <text x="50" y="38" textAnchor="middle" fill="#a1a1aa" fontSize="9">15 min/giorno</text>
                                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="0.5s" />
                            </g>

                            {/* Sprint Review (Bottom Right) */}
                            <g transform="translate(480, 330)">
                                <rect x="0" y="0" width="100" height="50" rx="8" fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="1.5" />
                                <text x="50" y="22" textAnchor="middle" fill="#fcd34d" fontSize="10" fontWeight="bold">🎬 REVIEW</text>
                                <text x="50" y="38" textAnchor="middle" fill="#a1a1aa" fontSize="9">Demo + Feedback</text>
                                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="1s" />
                            </g>

                            {/* Retrospective (Bottom Left) */}
                            <g transform="translate(120, 330)">
                                <rect x="0" y="0" width="100" height="50" rx="8" fill="#ec4899" fillOpacity="0.15" stroke="#ec4899" strokeWidth="1.5" />
                                <text x="50" y="22" textAnchor="middle" fill="#f9a8d4" fontSize="10" fontWeight="bold">🔄 RETRO</text>
                                <text x="50" y="38" textAnchor="middle" fill="#a1a1aa" fontSize="9">Miglioramento</text>
                                <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" begin="1.5s" />
                            </g>

                            {/* Roles at bottom */}
                            <g transform="translate(170, 410)">
                                <rect x="0" y="0" width="90" height="35" rx="8" fill="#6366f1" fillOpacity="0.2" />
                                <text x="45" y="15" textAnchor="middle" fill="#818cf8" fontSize="9" fontWeight="bold">👔 PO</text>
                                <text x="45" y="28" textAnchor="middle" fill="#a1a1aa" fontSize="8">Product Owner</text>
                            </g>
                            <g transform="translate(270, 410)">
                                <rect x="0" y="0" width="90" height="35" rx="8" fill="#22c55e" fillOpacity="0.2" />
                                <text x="45" y="15" textAnchor="middle" fill="#86efac" fontSize="9" fontWeight="bold">🛡️ SM</text>
                                <text x="45" y="28" textAnchor="middle" fill="#a1a1aa" fontSize="8">Scrum Master</text>
                            </g>
                            <g transform="translate(370, 410)">
                                <rect x="0" y="0" width="90" height="35" rx="8" fill="#f59e0b" fillOpacity="0.2" />
                                <text x="45" y="15" textAnchor="middle" fill="#fcd34d" fontSize="9" fontWeight="bold">👥 DEV</text>
                                <text x="45" y="28" textAnchor="middle" fill="#a1a1aa" fontSize="8">Dev Team</text>
                            </g>

                            {/* Sprint Backlog label inside circle */}
                            <text x="350" y="280" textAnchor="middle" fill="#a1a1aa" fontSize="10">Sprint Backlog 📝</text>
                        </svg>
                    </div>
                    <p className="text-center text-zinc-500 text-xs mt-4">
                        ↑ Diagramma animato del ciclo Scrum: il backlog entra, lo sprint trasforma, l'incremento esce
                    </p>
                </div>

                {/* Why Scrum Exists */}
                <div className="bg-purple-500/5 p-6 rounded-xl border border-purple-500/20 mb-8">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">🤔 Perché Esiste Scrum?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-zinc-900/50 p-4 rounded-lg">
                            <p className="text-white font-medium mb-1">Complessità Ingestibile</p>
                            <p className="text-zinc-400">I progetti tradizionali fallivano perché non potevano prevedere tutti i requisiti all'inizio.</p>
                        </div>
                        <div className="bg-zinc-900/50 p-4 rounded-lg">
                            <p className="text-white font-medium mb-1">Mercati Volatili</p>
                            <p className="text-zinc-400">Quando un piano di 18 mesi era pronto, il mercato era già cambiato.</p>
                        </div>
                        <div className="bg-zinc-900/50 p-4 rounded-lg">
                            <p className="text-white font-medium mb-1">Feedback Tardivo</p>
                            <p className="text-zinc-400">I clienti vedevano il prodotto solo alla fine, quando i costi di modifica erano altissimi.</p>
                        </div>
                    </div>
                </div>

                {/* Empirical Process */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">🔬 Il Processo Empirico</h3>
                    <p className="text-zinc-400 text-sm mb-4">
                        Scrum si basa su un approccio <strong className="text-white">empirico</strong>:
                        le decisioni si prendono in base all'osservazione dei fatti, non alle previsioni.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-5 bg-blue-500/5 rounded-xl border border-blue-500/20">
                            <div className="text-3xl mb-2">👁️</div>
                            <h4 className="text-blue-400 font-bold mb-1">Trasparenza</h4>
                            <p className="text-xs text-zinc-400">Tutti vedono cosa sta succedendo. Niente è nascosto.</p>
                        </div>
                        <div className="text-center p-5 bg-green-500/5 rounded-xl border border-green-500/20">
                            <div className="text-3xl mb-2">🔍</div>
                            <h4 className="text-green-400 font-bold mb-1">Ispezione</h4>
                            <p className="text-xs text-zinc-400">Si controlla regolarmente il progresso e i risultati.</p>
                        </div>
                        <div className="text-center p-5 bg-amber-500/5 rounded-xl border border-amber-500/20">
                            <div className="text-3xl mb-2">🔄</div>
                            <h4 className="text-amber-400 font-bold mb-1">Adattamento</h4>
                            <p className="text-xs text-zinc-400">Si corregge la rotta in base a ciò che si osserva.</p>
                        </div>
                    </div>
                </div>

                {/* Scrum Values */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">💎 I 5 Valori di Scrum</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {[
                            { emoji: "🎯", name: "Impegno", desc: "Il team si impegna a raggiungere gli obiettivi" },
                            { emoji: "🦁", name: "Coraggio", desc: "Affrontare problemi difficili e dire la verità" },
                            { emoji: "🔭", name: "Focus", desc: "Concentrarsi sul lavoro dello Sprint" },
                            { emoji: "🤝", name: "Apertura", desc: "Trasparenza su lavoro e sfide" },
                            { emoji: "🙏", name: "Rispetto", desc: "Rispetto reciproco tra membri del team" }
                        ].map((v, i) => (
                            <div key={i} className="text-center p-4 bg-zinc-800/30 rounded-xl">
                                <div className="text-2xl mb-2">{v.emoji}</div>
                                <p className="text-white font-medium text-sm">{v.name}</p>
                                <p className="text-xs text-zinc-500 mt-1">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Roles Table */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">👥 I Ruoli di Scrum</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-zinc-700">
                                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Ruolo</th>
                                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">Responsabilità</th>
                                    <th className="text-left py-3 px-4 text-zinc-400 font-medium">NON è...</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-zinc-800">
                                    <td className="py-4 px-4">
                                        <span className="text-indigo-400 font-bold">Product Owner</span>
                                    </td>
                                    <td className="py-4 px-4 text-zinc-300">
                                        Massimizza il valore del prodotto. Gestisce e prioritizza il Product Backlog. È la voce del cliente.
                                    </td>
                                    <td className="py-4 px-4 text-zinc-500 italic">
                                        Un project manager. Non assegna task al team.
                                    </td>
                                </tr>
                                <tr className="border-b border-zinc-800">
                                    <td className="py-4 px-4">
                                        <span className="text-green-400 font-bold">Scrum Master</span>
                                    </td>
                                    <td className="py-4 px-4 text-zinc-300">
                                        Facilita il processo Scrum. Rimuove impedimenti. Aiuta il team a migliorare.
                                    </td>
                                    <td className="py-4 px-4 text-zinc-500 italic">
                                        Un capo. Non dà ordini ma serve il team.
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4">
                                        <span className="text-amber-400 font-bold">Development Team</span>
                                    </td>
                                    <td className="py-4 px-4 text-zinc-300">
                                        Realizza l'incremento di prodotto. Auto-organizzato. Cross-funzionale (3-9 persone).
                                    </td>
                                    <td className="py-4 px-4 text-zinc-500 italic">
                                        Un gruppo di esecutori. Decidono come fare il lavoro.
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sprint */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">🏃 Lo Sprint</h3>
                    <div className="bg-zinc-800/30 p-6 rounded-xl">
                        <p className="text-zinc-300 mb-4">
                            Lo <strong className="text-white">Sprint</strong> è il cuore di Scrum: un periodo di tempo fisso
                            (tipicamente 2 settimane) durante il quale si crea un incremento di prodotto "Done".
                        </p>
                        <div className="flex items-center gap-4 flex-wrap text-sm">
                            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full">⏱️ Durata fissa (1-4 settimane)</span>
                            <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full">🎯 Obiettivo chiaro</span>
                            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full">📦 Risultato tangibile</span>
                            <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full">🚫 No cambi di scope</span>
                        </div>
                    </div>
                </div>

                {/* Ceremonies */}
                <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4">📅 Le Cerimonie Scrum</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { name: "Sprint Planning", time: "8h max/Sprint", desc: "Si decide COSA fare nello Sprint e COME farlo", color: "indigo" },
                            { name: "Daily Scrum", time: "15 min/giorno", desc: "Sincronizzazione quotidiana: cosa ho fatto, cosa farò, blocchi", color: "green" },
                            { name: "Sprint Review", time: "4h max/Sprint", desc: "Demo del lavoro fatto agli stakeholder, raccolta feedback", color: "amber" },
                            { name: "Sprint Retrospective", time: "3h max/Sprint", desc: "Il team riflette su come migliorare il proprio processo", color: "purple" }
                        ].map((c, i) => (
                            <div key={i} className={`p-4 bg-${c.color}-500/5 rounded-xl border border-${c.color}-500/20`}>
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className={`text-${c.color}-400 font-bold`}>{c.name}</h4>
                                    <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{c.time}</span>
                                </div>
                                <p className="text-sm text-zinc-400">{c.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Artifacts */}
                <div>
                    <h3 className="text-xl font-bold text-white mb-4">📋 Gli Artefatti Scrum</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 bg-zinc-800/30 rounded-xl">
                            <div className="text-2xl mb-2">📚</div>
                            <h4 className="text-white font-bold mb-2">Product Backlog</h4>
                            <p className="text-sm text-zinc-400">Lista ordinata di tutto ciò che serve nel prodotto. Gestito dal PO. Sempre in evoluzione.</p>
                        </div>
                        <div className="p-5 bg-zinc-800/30 rounded-xl">
                            <div className="text-2xl mb-2">📝</div>
                            <h4 className="text-white font-bold mb-2">Sprint Backlog</h4>
                            <p className="text-sm text-zinc-400">Sottinsieme del Product Backlog scelto per lo Sprint + piano per consegnarlo.</p>
                        </div>
                        <div className="p-5 bg-zinc-800/30 rounded-xl">
                            <div className="text-2xl mb-2">📦</div>
                            <h4 className="text-white font-bold mb-2">Incremento</h4>
                            <p className="text-sm text-zinc-400">La somma di tutti gli elementi completati durante lo Sprint. Deve essere "Done" e utilizzabile.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Changes */}
            <div className="glass-panel p-8">
                <h2 className="text-2xl font-bold text-white text-center mb-8">
                    I 4 Cambiamenti Chiave nel Modo di Lavorare
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Users, title: "Team Auto-Organizzati", desc: "Il team decide come lavorare, non un manager esterno", color: "indigo" },
                        { icon: MessageCircle, title: "Comunicazione Continua", desc: "Daily standup, retrospettive, collaborazione costante", color: "purple" },
                        { icon: Zap, title: "Progresso Dimostrabile", desc: "Mostrare avanzamento tangibile ad ogni iterazione", color: "amber" },
                        { icon: GitBranch, title: "Adattabilità", desc: "Accogliere i cambiamenti come opportunità, non problemi", color: "cyan" }
                    ].map((item, i) => (
                        <div key={i} className={`text-center p-6 rounded-2xl bg-${item.color}-500/5 border border-${item.color}-500/20`}>
                            <div className={`w-14 h-14 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                                <item.icon size={28} className={`text-${item.color}-400`} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-zinc-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Important Nuance Section */}
            <div className="glass-panel p-8 border-l-4 border-cyan-500">
                <h2 className="text-2xl font-bold text-white mb-4">
                    ⚠️ Una Precisazione Importante: Il "Valore" Non È Sempre Software
                </h2>
                <p className="text-zinc-400 mb-6">
                    Agile è nato nel mondo del software, dove è facile rilasciare qualcosa di "funzionante" ogni 2 settimane.
                    Ma cosa succede se stai costruendo un <strong className="text-white">prodotto fisico</strong>, un <strong className="text-white">hardware</strong>,
                    o un <strong className="text-white">servizio complesso</strong>?
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-green-500/5 p-5 rounded-xl border border-green-500/20">
                        <h3 className="text-green-400 font-bold mb-3">✅ Se PUOI rilasciare incrementi</h3>
                        <p className="text-sm text-zinc-400 mb-3">Software, app, siti web, servizi digitali</p>
                        <ul className="text-sm text-zinc-300 space-y-2">
                            <li>• Rilascia funzionalità complete ogni Sprint</li>
                            <li>• Raccogli feedback dagli utenti reali</li>
                            <li>• Itera rapidamente in base ai dati</li>
                        </ul>
                    </div>

                    <div className="bg-amber-500/5 p-5 rounded-xl border border-amber-500/20">
                        <h3 className="text-amber-400 font-bold mb-3">⚙️ Se NON PUOI rilasciare incrementi</h3>
                        <p className="text-sm text-zinc-400 mb-3">Hardware, prodotti fisici, costruzioni, eventi</p>
                        <ul className="text-sm text-zinc-300 space-y-2">
                            <li>• Mostra <strong>prototipi validati</strong> o mockup</li>
                            <li>• Presenta <strong>componenti testati</strong> singolarmente</li>
                            <li>• Condividi <strong>documentazione verificata</strong></li>
                            <li>• Fai <strong>demo di progressi misurabili</strong></li>
                        </ul>
                    </div>
                </div>

                <div className="bg-zinc-800/50 p-5 rounded-xl">
                    <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wider mb-3">📌 Esempi Pratici per Settore</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-white font-medium mb-1">🔧 Hardware/Elettronica</p>
                            <p className="text-zinc-400">Sprint 1: Schema validato. Sprint 2: PCB prototipo. Sprint 3: Involucro 3D testato.</p>
                        </div>
                        <div>
                            <p className="text-white font-medium mb-1">🏗️ Costruzioni/Architettura</p>
                            <p className="text-zinc-400">Sprint 1: Concept approvato. Sprint 2: Modello 3D. Sprint 3: Permessi ottenuti.</p>
                        </div>
                        <div>
                            <p className="text-white font-medium mb-1">🎪 Eventi/Formazione</p>
                            <p className="text-zinc-400">Sprint 1: Contenuti draft. Sprint 2: Materiali validati. Sprint 3: Pilota con gruppo test.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                    <p className="text-indigo-300 text-sm">
                        <strong>💡 La chiave:</strong> L'obiettivo non è "rilasciare software" ma <strong>ridurre il rischio</strong> validando
                        ipotesi frequentemente. Ogni Sprint deve produrre qualcosa che puoi <strong>mostrare</strong> e su cui puoi
                        <strong> raccogliere feedback</strong> – anche se non è il prodotto finale.
                    </p>
                </div>
            </div>
            {/* Feedback Section */}
            <div className="glass-panel p-8 border-l-4 border-amber-500">
                <h2 className="text-2xl font-bold text-white mb-2">Il Tuo Punto di Partenza</h2>
                <p className="text-zinc-400 mb-8">
                    Aiutaci a capire la tua situazione attuale. Useremo queste informazioni per personalizzare
                    i suggerimenti nelle fasi successive.
                </p>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Qual è l'esperienza del tuo team con metodologie Agile?
                        </label>
                        <select
                            value={feedback.teamExperience}
                            onChange={(e) => setFeedback({ ...feedback, teamExperience: e.target.value })}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3"
                        >
                            <option value="">Seleziona...</option>
                            <option value="none">Nessuna esperienza (primo approccio)</option>
                            <option value="basic">Base (conosciamo i concetti)</option>
                            <option value="intermediate">Intermedia (abbiamo usato Scrum/Kanban)</option>
                            <option value="advanced">Avanzata (usiamo Agile da anni)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Quali sono le sfide principali che affrontate oggi?
                        </label>
                        <textarea
                            value={feedback.currentChallenges}
                            onChange={(e) => setFeedback({ ...feedback, currentChallenges: e.target.value })}
                            className="w-full h-24 resize-none"
                            placeholder="Es: Ritardi nelle consegne, poca comunicazione, requisiti che cambiano spesso..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">
                            Cosa vi aspettate da questo percorso Agile?
                        </label>
                        <textarea
                            value={feedback.expectations}
                            onChange={(e) => setFeedback({ ...feedback, expectations: e.target.value })}
                            className="w-full h-24 resize-none"
                            placeholder="Es: Consegne più rapide, maggiore trasparenza, team più motivato..."
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-zinc-300">
                            Il team è pronto ad abbracciare il cambiamento?
                        </label>
                        <div className="flex gap-4">
                            {[
                                { value: 'yes', label: 'Sì, siamo pronti!', color: 'green' },
                                { value: 'partial', label: 'Parzialmente', color: 'amber' },
                                { value: 'no', label: 'Abbiamo resistenze', color: 'red' }
                            ].map(option => (
                                <button
                                    key={option.value}
                                    onClick={() => setFeedback({ ...feedback, readyForChange: option.value })}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${feedback.readyForChange === option.value
                                        ? `border-${option.color}-500 bg-${option.color}-500/10`
                                        : 'border-zinc-700 hover:border-zinc-600'
                                        }`}
                                >
                                    <span className={`font-medium ${feedback.readyForChange === option.value ? `text-${option.color}-400` : 'text-zinc-300'}`}>
                                        {option.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Phase Navigation */}
            <PhaseNavigation
                onSave={async () => {
                    updateProject({ mindsetFeedback: feedback });
                    // Optional: trigger a real save to server
                    // await saveProject();
                    return true;
                }}
                isSaving={false}
                className={!isComplete ? "opacity-50 pointer-events-none grayscale" : ""}
            />

            {!isComplete && (
                <p className="text-center text-slate-500 text-sm mt-4">
                    Completa tutte le domande per continuare
                </p>
            )}
        </div>
    );
};

export default Mindset;
