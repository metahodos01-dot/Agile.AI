import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Target, Users, ShieldCheck, CheckCircle, Cpu, Activity, Brain } from 'lucide-react';

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
            {/* --- Hero Section --- */}
            <header className="relative w-full h-screen flex items-center justify-center overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/turbine-bg.png"
                        alt="Abstract Tech Turbine"
                        className="w-full h-full object-cover opacity-60 blur-sm scale-105 animate-pulse-slow"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/60 to-slate-950"></div>
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-8 animate-fade-in-up backdrop-blur-md">
                        <Zap size={16} />
                        <span className="text-sm font-bold tracking-wider uppercase">Motore AI Attivo: Posti Limitati</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up delay-100">
                        Metti il <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">TURBO</span> <br />
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

            {/* --- Vision & Mission Section --- */}
            <section className="py-24 bg-slate-950 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-amber-500/5 blur-3xl"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">

                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold mb-6">
                                <Target size={14} /> VISION
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                                Risultati straordinari, <br />
                                <span className="text-indigo-400">senza ansia.</span>
                            </h2>
                            <p className="text-xl text-slate-400 leading-relaxed">
                                Immagino un mondo dove la complessità tecnologica e organizzativa — che si tratti di <strong className="text-white">AI, Agile o strategia pura</strong> — non sia più un ostacolo, ma uno strumento fluido.
                                <br /><br />
                                Il mio obiettivo è rendere l’eccellenza strategica semplice, umana e immediata per chi ha la responsabilità di guidare il futuro.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FeatureBox icon={Brain} title="AI Fluidity" desc="Tecnologia invisibile" />
                            <FeatureBox icon={Users} title="Human Core" desc="Leadership empatica" />
                            <FeatureBox icon={Zap} title="Speed" desc="Risultati immediati" />
                            <FeatureBox icon={Activity} title="Agile" desc="Adattamento continuo" />
                        </div>
                    </div>

                    <div className="p-10 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 text-center md:text-left flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-bold mb-6">
                                <Cpu size={14} /> MISSION
                            </div>
                            <h3 className="text-3xl font-bold mb-4">Trasformo la complessità in risultati pratici.</h3>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                Sto al fianco dei leader, lavorando con loro e <em>come uno di loro</em>. Metto a disposizione una <strong>'toolbox' infinita</strong> di esperienze concrete — maturate sul campo tra Agile, AI e sfide strategiche.
                            </p>
                            <p className="text-lg text-white font-medium">
                                "Il mio impegno è guidare il cambiamento abbattendo ogni barriera, agendo sempre da pari a pari."
                            </p>
                        </div>
                        <div className="w-full md:w-1/3 flex justify-center">
                            {/* Abstract 'Turbo' representation */}
                            <div className="w-40 h-40 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full blur-2xl opacity-20 absolute"></div>
                            <div className="relative bg-slate-900 p-6 rounded-2xl border border-slate-700 shadow-2xl">
                                <div className="text-5xl">🛠️</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* --- CTA Footer --- */}
            <footer className="py-20 bg-slate-900 text-center border-t border-slate-800">
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

const FeatureBox = ({ icon: Icon, title, desc }) => (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-indigo-500/30 transition-all text-center md:text-left">
        <Icon className="text-indigo-400 mb-3 mx-auto md:mx-0" size={28} />
        <h4 className="font-bold text-white mb-1">{title}</h4>
        <p className="text-sm text-slate-500">{desc}</p>
    </div>
);

export default LandingPage;
