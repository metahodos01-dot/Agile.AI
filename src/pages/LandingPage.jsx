import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plane, ShieldCheck, Clock, Users, CheckCircle, AlertTriangle } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here we would typically send to Supabase or a mailing list
        console.log("Lead captured:", email);
        setSubmitted(true);
        setTimeout(() => {
            navigate('/register'); // Or wherever appropriate
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans overflow-x-hidden selection:bg-amber-500 selection:text-slate-900">
            {/* --- Hero Section --- */}
            <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/obeya-concept.png"
                        alt="Cockpit View"
                        className="w-full h-full object-cover opacity-40 blur-sm scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/50 to-slate-900"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-8 animate-fade-in-up backdrop-blur-md">
                        <AlertTriangle size={16} />
                        <span className="text-sm font-bold tracking-wider uppercase">Accesso Limitato: Solo 4 Posti Rimasti questo mese</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
                        Pilota il tuo Business verso <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Prestazioni Eccellenti</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        La prima piattaforma che applica i protocolli dell'aviazione militare (CRM) alla gestione aziendale.
                        <span className="block mt-2 text-white font-semibold">Prendi i comandi. Evita lo stallo. Raggiungi la destinazione.</span>
                    </p>

                    {/* --- Lead Magnet & Form --- */}
                    <div className="max-w-md mx-auto bg-white/5 backdrop-blur-lg border border-white/10 p-2 rounded-2xl shadow-2xl animate-fade-in-up delay-300 hover:border-indigo-500/50 transition-colors">
                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
                                <div className="text-left mb-2">
                                    <h3 className="text-lg font-bold text-white">Richiedi la Prova di Volo Gratuita</h3>
                                    <p className="text-sm text-slate-400">Accesso completo alla "Cabina di Pilotaggio" digitale per 7 giorni.</p>
                                </div>
                                <div className="relative">
                                    <input
                                        type="email"
                                        placeholder="inserisci la tua email professionale..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all group"
                                >
                                    Decolla Ora
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-xs text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                                    <ShieldCheck size={12} /> Nessuna carta di credito richiesta.
                                </p>
                            </form>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={32} className="text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Richiesta Ricevuta!</h3>
                                <p className="text-slate-400">Un nostro Flight Instructor ti contatterà a breve.</p>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* --- Social Proof / Scarcity Banner --- */}
            <div className="border-y border-white/5 bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xl font-bold flex items-center gap-2"><Plane className="text-indigo-400" /> AERO-TECH</span>
                    <span className="text-xl font-bold flex items-center gap-2"><Users className="text-indigo-400" /> PILOT ACADEMY</span>
                    <span className="text-xl font-bold flex items-center gap-2"><Clock className="text-indigo-400" /> TIMELESS WATCHES</span>
                    <span className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-indigo-400" /> SECURE SYSTEMS</span>
                </div>
            </div>

            {/* --- Features Grid --- */}
            <section className="py-24 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Strumentazione di Bordo Avanzata</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">Non volare alla cieca. Agile.AI ti fornisce la telemetria completa per prendere decisioni strategiche in tempo reale.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Clock}
                            title="Roadmap di Volo"
                            desc="Pianifica le tue rotte strategiche con precisione millimetrica. Prevedi turbolenze e gestisci il carburante (budget) in anticipo."
                        />
                        <FeatureCard
                            icon={Users}
                            title="Equipaggio Sincronizzato"
                            desc="Elimina i silos. Il protocollo CRM assicura che ogni membro dell'equipaggio comunichi in modo chiaro e standardizzato."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Scatola Nera AI"
                            desc="Analisi post-sprint automatizzata. L'IA identifica le cause radice dei problemi e suggerisce correzioni di rotta immediate."
                        />
                    </div>
                </div>
            </section>

            {/* --- CTA Footer --- */}
            <footer className="py-20 bg-gradient-to-br from-indigo-900 to-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10 max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6">Il gate sta per chiudere.</h2>
                    <p className="text-xl text-indigo-200 mb-8">
                        Accettiamo solo 10 nuovi equipaggi questo trimestre per garantire la massima qualità del supporto. Assicurati il tuo posto ora.
                    </p>
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-2xl hover:shadow-indigo-500/20"
                    >
                        Inizia il Check-in Gratuito
                    </button>
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group cursor-default">
        <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon size={32} className="text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
