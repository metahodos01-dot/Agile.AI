import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Layers, Target, BarChart3, FileDown } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import ExportButton from '../components/common/ExportButton';

const FeatureCard = ({ icon: Icon, title, description, color }) => (
    <div className="group glass-panel p-6 hover:border-zinc-700 cursor-pointer">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} className="text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
    </div>
);

const Home = () => {
    const { project } = useProject();

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

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-indigo-400 text-sm font-medium">Gestione Agile con l'AI</span>
                </div>

                <div className="max-w-3xl">
                    <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-6">
                        Trasforma il tuo Team
                        <br />
                        <span className="text-gradient">in una Squadra Agile</span>
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed max-w-2xl">
                        Dall'idea alla realizzazione in 9 passi. PROGETTOAGILE.AI ti guida attraverso
                        l'intero processo Scrum con il supporto dell'Intelligenza Artificiale.
                    </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                    <Link to="/mindset" className="btn-primary text-base px-7 py-4">
                        Inizia un nuovo progetto
                        <ArrowRight size={18} />
                    </Link>
                    <button className="glass-button px-6 py-4">
                        <span className="text-zinc-300">Scopri di più</span>
                    </button>
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
                        <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
                    </div>
                ))}
            </section>

            {/* Features Grid */}
            <section className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Tutto ciò di cui hai bisogno</h2>
                    <p className="text-zinc-400">Dalla vision alla velocity, tutto in un unico posto.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FeatureCard
                        icon={Sparkles}
                        title="Generazione AI"
                        description="Genera vision di prodotto, obiettivi e user story con un solo click."
                        color="from-indigo-500 to-purple-600"
                    />
                    <FeatureCard
                        icon={Layers}
                        title="Gestione backlog"
                        description="Organizza epiche e storie con suggerimenti intelligenti di prioritizzazione."
                        color="from-purple-500 to-pink-600"
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
            <section className="border-t border-zinc-800 pt-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/logo-metahodos.png" alt="MetaHodos" className="h-10 object-contain" />
                        <div>
                            <p className="text-sm text-zinc-400">Powered by <span className="text-white font-medium">MetaHodos</span></p>
                            <p className="text-xs text-zinc-600">Persone • Agilità • Risultati</p>
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
