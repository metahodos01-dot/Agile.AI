import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, CheckCircle, Loader, Shield } from 'lucide-react';

const Register = () => {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Le password non coincidono");
            return;
        }

        if (password.length < 6) {
            setError("La password deve essere di almeno 6 caratteri");
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp({ email, password });
            if (error) throw error;
            navigate('/login', { state: { message: "Registrazione avvenuta con successo! Accedi." } });
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-gray-900 to-black relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[100px]" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]" />

            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-500/30">
                        <UserPlus className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Registrati</h1>
                    <p className="text-gray-400">Crea il tuo profilo Agile.AI</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm backdrop-blur-sm animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-gray-300 text-sm ml-1">Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-pink-400 transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-black/60 focus:ring-1 focus:ring-pink-500 transition-all"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-300 text-sm ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-pink-400 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-black/60 focus:ring-1 focus:ring-pink-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-gray-300 text-sm ml-1">Conferma Password</label>
                        <div className="relative group">
                            <Shield className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-pink-400 transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-pink-500/50 focus:bg-black/60 focus:ring-1 focus:ring-pink-500 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-900/40 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group mt-4 disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? (
                            <span key="loading"><Loader className="animate-spin" size={20} /></span>
                        ) : (
                            <span key="action" className="flex items-center gap-2">
                                Crea Account <CheckCircle size={20} />
                            </span>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-gray-400 text-sm">
                        Hai già un account?{' '}
                        <Link to="/login" className="text-pink-400 hover:text-pink-300 font-medium hover:underline transition-colors">
                            Accedi qui
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
