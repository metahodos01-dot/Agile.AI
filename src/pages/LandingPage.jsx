import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Users, ShieldCheck, CheckCircle, Cpu, Activity, Brain, Layers, BarChart, Flag, FileText, Lock, Download } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Lead captured:", email);
        setSubmitted(true);
        setTimeout(() => {
            navigate('/register');
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-900">
            {/* --- Navbar / Branding --- */}
            <nav className="absolute top-0 left-0 w-full z-50 p-6 md:p-10 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
                        <img
                            src="/metahodos-logo.jpg"
                            alt="Metahodòs Logo"
                            className="relative h-20 w-20 md:h-24 md:w-24 rounded-2xl border-2 border-white/10 shadow-2xl transition-transform transform group-hover:scale-105"
                        />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white group-hover:text-blue-200 transition-colors">AGILE.AI</span>
                        <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-slate-400 font-bold">by Metahodòs</span>
                    </div>
                </div>
                <div className="hidden md:flex gap-4">
                    <button className="text-slate-400 hover:text-white font-medium transition-colors">Caso Studio</button>
                    <button className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors">Accedi</button>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-20">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/turbine-bg.png"
                        alt="Abstract Tech Turbine"
                        className="w-full h-full object-cover opacity-50 blur-sm scale-105 animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/80 to-slate-950"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">

                    {/* The Promise Badge */}
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 mb-10 animate-fade-in-up backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                        <Zap size={20} className="fill-amber-500 text-amber-500" />
                        <span className="text-sm md:text-base font-black tracking-wide uppercase">
                            La Promessa: Il Doppio nella Metà del Tempo
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-tight animate-fade-in-up delay-100 drop-shadow-2xl">
                        Mettiamo il <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">TURBO</span> <br />
                        ai tuoi progetti
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200 font-light">
                        La prima piattaforma dove l'<strong className="text-white font-bold">Intelligenza Artificiale ragiona</strong> su ogni fase del tuo progetto, guidata da un percorso definito da <strong className="text-white font-bold">Coach Agile ed Esperti Scrum certificati</strong>.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 animate-fade-in-up delay-300">
                        {/* --- Lead Magnet Form --- */}
                        <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-white/10 p-1 rounded-2xl shadow-2xl hover:border-amber-500/50 transition-all group-form">
                            {!submitted ? (
                                <form onSubmit={handleSubmit} className="flex p-2">
                                    <input
                                        type="email"
                                        placeholder="Email professionale..."
                                        className="flex-1 bg-transparent border-none px-4 text-white placeholder:text-slate-500 focus:outline-none"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
                                    >
                                        Inizia Ora <ArrowRight size={18} />
                                    </button>
                                </form>
                            ) : (
                                <div className="p-3 text-center flex items-center justify-center gap-3 text-green-400">
                                    <CheckCircle size={24} /> <span>Cabina di pilotaggio pronta!</span>
                                </div>
                            )}
                        </div>

                        <button className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors px-6 py-4 rounded-xl border border-white/5 hover:bg-white/5">
                            <FileText size={18} /> Leggi il Caso Studio
                        </button>
                    </div>

                    <div className="mt-8 flex justify-center gap-6 text-xs text-slate-500 animate-fade-in-up delay-500">
                        <span className="flex items-center gap-1"><Lock size={12} /> Privacy Dati Garantita al 100%</span>
                        <span className="flex items-center gap-1"><Download size={12} /> Esporta i risultati in qualsiasi momento</span>
                    </div>

                </div>
            </header>

            {/* --- The 9 Phases Section --- */}
            <section className="py-24 bg-slate-950 relative border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-slate-300 text-sm font-bold mb-6">
                            <Layers size={14} /> METODO METAHODÒS
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Le 9 Fasi del Successo Agile</h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            Un percorso strutturato dove l'AI potenzia ogni singolo passo, garantendo velocità e qualità.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Stage 1: PERSONE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-4 h-12 bg-red-500 rounded-full shadow-[0_0_25px_rgba(239,68,68,0.6)]"></div>
                                <h3 className="text-3xl font-bold text-white">Persone</h3>
                            </div>
                            <PhaseCard number="01" title="Mindset" desc="AI Culture Fit Analysis per allineare i valori del team." color="red" />
                            <PhaseCard number="02" title="Ruoli" desc="Definizione automatica delle responsabilità chiave." color="red" />
                            <PhaseCard number="03" title="Sinergia" desc="Team Building guidato dai dati comportamentali." color="red" />
                        </div>

                        {/* Stage 2: AGILITÀ */}
                        <div className="space-y-6 md:mt-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-4 h-12 bg-amber-500 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.6)]"></div>
                                <h3 className="text-3xl font-bold text-white">Agilità</h3>
                            </div>
                            <PhaseCard number="04" title="Processi" desc="Setup istantaneo della Sala Obeya Digitale." color="amber" />
                            <PhaseCard number="05" title="Ritmo" desc="Sprint Planning assistito dall'AI predittiva." color="amber" />
                            <PhaseCard number="06" title="Feedback" desc="Retrospettive intelligenti che suggeriscono miglioramenti." color="amber" />
                        </div>

                        {/* Stage 3: RISULTATI */}
                        <div className="space-y-6 md:mt-24">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-4 h-12 bg-green-500 rounded-full shadow-[0_0_25px_rgba(34,197,94,0.6)]"></div>
                                <h3 className="text-3xl font-bold text-white">Risultati</h3>
                            </div>
                            <PhaseCard number="07" title="Valore" desc="Prioritizzazione automatica basata sul ROI atteso." color="green" />
                            <PhaseCard number="08" title="Metriche" desc="KPI Dashboard in tempo reale senza configurazione." color="green" />
                            <PhaseCard number="09" title="Impatto" desc="Report export-ready per scalare il successo in azienda." color="green" />
                        </div>
                    </div>

                </div>
            </section>

            {/* --- Vision & Mission Section --- */}
            <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden text-center md:text-left">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-green-500 opacity-50"></div>

                {/* Decorative elements */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    <div className="grid md:grid-cols-2 gap-20 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold">
                                <Target size={14} /> LA NOSTRA VISION
                            </div>
                            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                                Risultati straordinari, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">senza l'ansia della complessità.</span>
                            </h2>
                            <p className="text-xl text-slate-300 leading-relaxed font-light">
                                Immaginiamo un mondo dove la tecnologia e l'organizzazione — che si tratti di <strong className="text-white font-bold">AI, Agile o strategia pura</strong> — siano strumenti fluidi e invisibili.
                                <br /><br />
                                Il nostro obiettivo è rendere l’eccellenza strategica semplice, umana e immediata per chi ha la responsabilità di guidare il futuro.
                            </p>

                            <div className="flex gap-4 pt-4">
                                <TrustBadge icon={ShieldCheck} text="Privacy First" />
                                <TrustBadge icon={Users} text="Esperti Certificati" />
                                <TrustBadge icon={Brain} text="AI Reasoning" />
                            </div>
                        </div>

                        <div className="p-10 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-slate-700/50 shadow-2xl relative group hover:border-amber-500/30 transition-colors">
                            <div className="absolute -top-6 -right-6 bg-amber-500 text-white w-20 h-20 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg rotate-12 group-hover:rotate-0 transition-transform">
                                2x
                            </div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold mb-6">
                                <Flag size={14} /> LA NOSTRA MISSION
                            </div>
                            <h3 className="text-3xl font-bold mb-6">Trasformiamo la complessità in risultati pratici.</h3>
                            <p className="text-lg text-slate-300 leading-relaxed mb-8">
                                Stiamo al fianco dei leader, lavorando con loro e <em>come uno di loro</em>. Mettiamo a disposizione una <strong>'toolbox' infinita</strong> di esperienze concrete — maturate sul campo tra Agile, AI e sfide strategiche.
                            </p>

                            <blockquote className="p-6 bg-slate-950 rounded-xl border-l-4 border-amber-500 italic text-slate-400">
                                "Il nostro impegno è guidare il cambiamento abbattendo ogni barriera, agendo sempre da pari a pari."
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA Footer --- */}
            <footer className="py-24 bg-slate-950 text-center border-t border-slate-900 relative">
                <div className="absolute inset-0 bg-[url('/turbine-bg.png')] opacity-5 bg-center bg-cover mix-blend-overlay"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <h2 className="text-5xl md:text-6xl font-black mb-8 text-white tracking-tight">Pronto al raddoppio?</h2>
                    <p className="text-2xl text-slate-400 mb-12 font-light">
                        Non lasciare che il futuro ti aspetti. Prendi il controllo con la sicurezza dei dati e la potenza dell'AI.
                    </p>
                    <div className="flex flex-col md:flex-row justify-center gap-6">
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="bg-white text-slate-900 px-10 py-5 rounded-full font-bold text-xl hover:bg-amber-400 hover:scale-105 transition-all shadow-2xl hover:shadow-amber-500/20"
                        >
                            Inizia il Viaggio
                        </button>
                        <button className="px-10 py-5 rounded-full font-bold text-xl border border-white/10 hover:bg-white/5 transition-all">
                            Parla con un Esperto
                        </button>
                    </div>
                    <p className="mt-12 text-slate-600 text-sm">© 2024 Metahodòs. All rights reserved. Agile.AI™ is a registered trademark.</p>
                </div>
            </footer>
        </div>
    );
};

const PhaseCard = ({ number, title, desc, color }) => (
    <div className={`p-6 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-${color}-500/50 hover:bg-slate-900/60 transition-all group cursor-default relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 w-20 h-20 bg-${color}-500/5 rounded-bl-full`}></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
            <h4 className="font-bold text-2xl text-white group-hover:text-white transition-colors">{title}</h4>
            <span className={`text-5xl font-black text-slate-800 group-hover:text-${color}-500/20 transition-colors`}>{number}</span>
        </div>
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Brain size={12} /> AI Powered
        </div>
        <p className="text-base text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">{desc}</p>
    </div>
);

const TrustBadge = ({ icon: Icon, text }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
        <Icon size={14} className="text-indigo-400" /> {text}
    </div>
);

export default LandingPage;
