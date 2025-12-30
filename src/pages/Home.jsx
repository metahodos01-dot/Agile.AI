import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Layers, Target, BarChart3, FileDown, Play, CheckCircle2 } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import ExportButton from '../components/common/ExportButton';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="group glass-panel p-6 hover:border-slate-700 cursor-pointer">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
);

const recommendNextStep = (project) => {
    if (!project || !project.name) return null;
    if (!project.targetAudience /* Proxies for Mindset/Vision started */) return { path: '/app/mindset', label: 'Mindset Agile', desc: 'Definisci il corretto approccio mentale.' };
    if (!project.vision) return { path: '/app/vision', label: 'Product Vision', desc: 'Descrivi la visione del tuo prodotto.' };
    if (!project.objectives || project.objectives.length === 0) return { path: '/app/objectives', label: 'Obiettivi (OKR)', desc: 'Imposta gli obiettivi di business.' };
    if (!project.kpis || project.kpis.length === 0) return { path: '/app/kpi', label: 'KPIs', desc: 'Scegli le metriche di successo.' };
    if (!project.team || project.team.length === 0) return { path: '/app/team', label: 'Team', desc: 'Definisci i membri della squadra.' };
    if (!project.backlog || project.backlog.length === 0) return { path: '/app/backlog', label: 'Backlog', desc: 'Inizia a scrivere le user stories.' };

    return { path: '/app/sprint', label: 'Sprint Planning', desc: 'Pianifica il tuo primo sprint.' };
};

const Home = () => {
    const { project, createNewProject } = useProject();
    const navigate = useNavigate();

    const handleStartNewProject = () => {
        createNewProject();
        navigate('/app/mindset');
    };

    const nextStep = recommendNextStep(project);

    return (
        <div className="space-y-16 py-4">
            {/* Hero Section */}
            <section className="space-y-8">
                <div className="flex items-center justify-between mb-8">
                    <img
                        src="/logo-metahodos.png"
                        alt="MetaHodos"
                        className="h-16 object-contain"
                    />
                    {project.name && <ExportButton />}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-amber-400 text-sm font-medium">Gestione Agile con l'AI</span>
                </div>

                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                        Trasforma il tuo Team
                        <br />
                        <span className="text-gradient">in una Squadra Agile</span>
                    </h1>
                    <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                        Dall'idea alla realizzazione in 9 passi. PROGETTOAGILE.AI ti guida attraverso
                        l'intero processo Scrum con il supporto dell'Intelligenza Artificiale.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    {!project.name ? (
                        <button onClick={handleStartNewProject} className="btn-primary text-base px-7 py-4 shadow-amber-900/20 shadow-2xl">
                            Inizia un nuovo progetto
                            <ArrowRight size={18} />
                        </button>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl">
                            {/* Recommended Action Card */}
                            <div className="flex-1 glass-panel p-1 border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Play size={100} fill="currentColor" />
                                </div>
                                <div className="p-5 flex items-start gap-4 relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/40 animate-pulse-slow">
                                        <Play size={24} className="text-white ml-1" fill="currentColor" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">Il tuo prossimo passo</h3>
                                        <p className="text-white font-bold text-lg leading-tight mb-1">{nextStep?.label}</p>
                                        <p className="text-slate-400 text-sm mb-4">{nextStep?.desc}</p>
                                        <button
                                            onClick={() => navigate(nextStep?.path)}
                                            className="px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-amber-50 transition-colors flex items-center gap-2"
                                        >
                                            Riprendi ora <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Alternative Action */}
                            <div className="flex items-center">
                                <button onClick={handleStartNewProject} className="text-slate-400 hover:text-white text-sm font-medium px-4 py-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2">
                                    <Zap size={14} /> O inizia un nuovo progetto
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { value: '9', label: 'Fasi guidate' },
                    { value: '100%', label: 'Assistito da AI' },
                    { value: '2x', label: 'Più veloce' },
                    { value: '∞', label: 'Progetti' },
                ].map((stat, i) => (
                    <div key={i} className="glass-panel p-5 text-center">
                        <p className="text-3xl font-bold text-gradient">{stat.value}</p>
                        <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Features Grid */}
            <section className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Tutto ciò di cui hai bisogno</h2>
                    <p className="text-slate-400">Dalla vision alla velocity, tutto in un unico posto.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FeatureCard
                        icon={Sparkles}
                        title="Generazione AI"
                        description="Genera vision di prodotto, obiettivi e user story con un solo click."
                        color="from-amber-500 to-orange-600"
                    />
                    <FeatureCard
                        icon={Layers}
                        title="Gestione backlog"
                        description="Organizza epiche e storie con suggerimenti intelligenti di prioritizzazione."
                        color="from-indigo-500 to-purple-600"
                    />
                    <FeatureCard
                        icon={Target}
                        title="Framework OKR"
                        description="Definisci obiettivi misurabili e key results allineati con la tua vision."
                        color="from-cyan-500 to-blue-600"
                    />
                    <FeatureCard
                        icon={BarChart3}
                        title="Pianificazione capacità"
                        description="Stima lo sforzo e pianifica i rilasci in base alla capacità del team."
                        color="from-emerald-500 to-teal-600"
                    />
                    <FeatureCard
                        icon={Zap}
                        title="Strumenti sprint"
                        description="Gestisci standup, review e retrospettive con facilitazione integrata."
                        color="from-amber-500 to-orange-600"
                    />
                    <FeatureCard
                        icon={Layers}
                        title="Obeya room"
                        description="Progetta la tua 'war room' fisica o virtuale per massima trasparenza."
                        color="from-rose-500 to-red-600"
                    />
                </div>
            </section>

            {/* Footer */}
            <section className="border-t border-slate-800 pt-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/logo-metahodos.png" alt="MetaHodos" className="h-10 object-contain" />
                        <div>
                            <p className="text-sm text-slate-400">Powered by <span className="text-white font-medium">MetaHodos</span></p>
                            <p className="text-xs text-slate-600">Persone • Agilità • Risultati</p>
                        </div>
                    </div>
                    <img
                        src="/signature-franz.png"
                        alt="Firma Franz"
                        className="h-10 object-contain opacity-60 invert"
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;
