import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Users, ShieldCheck, CheckCircle, Cpu, Activity, Brain, Layers, BarChart, Flag } from 'lucide-react';

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
            <nav className="absolute top-0 left-0 w-full z-50 p-6 flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <img src="/metahodos-logo.jpg" alt="Metahodòs Logo" className="h-12 w-12 rounded-lg border border-white/10 shadow-lg" />
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white">AGILE.AI</span>
                        <span className="text-[10px] tracking-widest uppercase text-slate-400">by Metahodòs</span>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/turbine-bg.png"
                        alt="Abstract Tech Turbine"
                        className="w-full h-full object-cover opacity-60 blur-sm scale-105 animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-slate-950"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-8 animate-fade-in-up backdrop-blur-md">
                        <Zap size={16} />
                        <span className="text-sm font-bold tracking-wider uppercase">Motore AI Attivo: Posti Limitati</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
                        Mettiamo il <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">TURBO</span> <br />
                        ai tuoi progetti
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-4xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        La prima piattaforma completamente <span className="text-white font-bold">AI driven</span> per pilotare il tuo progetto agile in azienda senza rischi inutili.
                        <span className="block mt-4 text-blue-200 text-lg">
                            Rendiamo l’eccellenza strategica semplice, umana e immediata.
                        </span>
                    </p>

                    {/* --- Lead Magnet & Form --- */}
                    <div className="max-w-md mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl animate-fade-in-up delay-300 hover:border-amber-500/50 transition-colors">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
                                <div className="text-left mb-2">
                                    <h3 className="text-lg font-bold text-white">Accendi i Motori</h3>
                                    <p className="text-sm text-slate-400">Prova gratuita della suite completa per 7 giorni.</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="inserisci la tua email professionale..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all group"
                                >
                                    Inizia Ora
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-xs text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                                    <ShieldCheck size={12} /> Nessun rischio. Cancellazione immediata.
                                </p>
                            </form>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Contatto Stabilito!</h3>
                                <p className="text-slate-400">Ti stiamo preparando la cabina di pilotaggio.</p>
                            </div>
                        )}
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
                            Un percorso strutturato in tre stadi per trasformare la complessità in risultati concreti.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Stage 1: PERSONE */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-4 h-12 bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                                <h3 className="text-3xl font-bold text-white">Persone</h3>
                            </div>
                            <PhaseCard number="01" title="Mindset Alignment" desc="Creiamo una cultura condivisa e abbattiamo le resistenze al cambiamento." color="red" />
                            <PhaseCard number="02" title="Role Clarity" desc="Definiamo chi fa cosa, eliminando sovrapposizioni e colli di bottiglia." color="red" />
                            <PhaseCard number="03" title="Team Synergy" desc="Trasformiamo gruppi di individui in equipaggi ad alte prestazioni." color="red" />
                        </div>

                        {/* Stage 2: AGILITÀ */}
                        <div className="space-y-6 md:mt-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-4 h-12 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                                <h3 className="text-3xl font-bold text-white">Agilità</h3>
                            </div>
                            <PhaseCard number="04" title="Process Setup" desc="Installiamo la 'Sala Obeya' digitale per la massima trasparenza." color="amber" />
                            <PhaseCard number="05" title="Sprints & Rhythm" desc="Sincronizziamo i cicli di lavoro per consegne costanti e puntuali." color="amber" />
                            <PhaseCard number="06" title="Adaptive Feedback" desc="Analisi dei dati in tempo reale per correzioni di rotta immediate." color="amber" />
                        </div>

                        {/* Stage 3: RISULTATI */}
                        <div className="space-y-6 md:mt-24">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-4 h-12 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                                <h3 className="text-3xl font-bold text-white">Risultati</h3>
                            </div>
                            <PhaseCard number="07" title="Value Focus" desc="Concentriamo le risorse solo su ciò che genera vero valore business." color="green" />
                            <PhaseCard number="08" title="Metric Tracking" desc="Cruscotto KPI avanzato per misurare l'impatto reale delle azioni." color="green" />
                            <PhaseCard number="09" title="Strategic Impact" desc="Scaliamo i successi ottenuti per trasformare l'intera organizzazione." color="green" />
                        </div>
                    </div>

                </div>
            </section>

            {/* --- Vision & Mission Section --- */}
            <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden text-center md:text-left">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-green-500"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold mb-6">
                                <Target size={14} /> LA NOSTRA VISION
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                Risultati straordinari, <br />
                                <span className="text-indigo-400">senza ansia.</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Immaginiamo un mondo dove la complessità tecnologica e organizzativa — che si tratti di <strong className="text-white">AI, Agile o strategia pura</strong> — non sia più un ostacolo, ma uno strumento fluido.
                                <br /><br />
                                Il nostro obiettivo è rendere l’eccellenza strategica semplice, umana e immediata per chi ha la responsabilità di guidare il futuro.
                            </p>
                        </div>
                        <div className="p-10 rounded-3xl bg-slate-900 border border-slate-700 shadow-xl relative">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold mb-6">
                                <Flag size={14} /> LA NOSTRA MISSION
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Trasformiamo la complessità in risultati pratici.</h3>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                Stiamo al fianco dei leader, lavorando con loro e <em>come uno di loro</em>. Mettiamo a disposizione una <strong>'toolbox' infinita</strong> di esperienze concrete — maturate sul campo tra Agile, AI e sfide strategiche.
                            </p>
                            <p className="text-lg text-white font-medium border-l-4 border-amber-500 pl-4">
                                "Il nostro impegno è guidare il cambiamento abbattendo ogni barriera, agendo sempre da pari a pari."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA Footer --- */}
            <footer className="py-20 bg-slate-950 text-center border-t border-slate-900">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6 text-white">Pronto a mettere il Turbo?</h2>
                    <p className="text-xl text-slate-400 mb-8">
                        Non lasciare che il futuro ti aspetti. Prendi il controllo ora.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-amber-400 transition-colors shadow-2xl hover:shadow-amber-500/20"
                    >
                        Inizia il Viaggio
                    </button>
                </div>
            </footer>
        </div>
    );
};

const PhaseCard = ({ number, title, desc, color }) => (
    <div className={`p-6 bg-slate-900/40 rounded-xl border border-slate-800 hover:border-${color}-500/50 hover:bg-slate-900/60 transition-all group`}>
        <div className="flex justify-between items-start mb-4">
            <h4 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors">{title}</h4>
            <span className={`text-4xl font-black text-slate-800 group-hover:text-${color}-500/20 transition-colors`}>{number}</span>
        </div>
        <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{desc}</p>
    </div>
);

export default LandingPage;
