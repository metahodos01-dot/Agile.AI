import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Loader } from 'lucide-react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Verify session
        const initAuth = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (mounted) {
                    const session = data?.session;
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    } else {
                        setLoading(false);
                    }
                }
            } catch (error) {
                console.error("Auth Init Error:", error);
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (mounted) {
                setUser(session?.user ?? null);
                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setRole(null);
                    setLoading(false);
                }
            }
        });

        // Safety timeout to prevent infinite white screen
        const timeout = setTimeout(() => {
            if (mounted && loading) {
                console.warn("Auth timeout reached, forcing render");
                setLoading(false);
            }
        }, 3000);

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const fetchProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) throw error;
            setRole(data?.role || 'user');
        } catch (error) {
            console.error('Error fetching profile:', error);
            setRole('user');
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        try {
            setUser(null);
            setRole(null);
            await supabase.auth.signOut();
        } catch (error) {
            console.error("SignOut Error", error);
        }
    };

    const signIn = async (data) => {
        try {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout connessione: Verifica la tua internet o le chiavi Supabase')), 10000)
            );

            const result = await Promise.race([
                supabase.auth.signInWithPassword(data),
                timeoutPromise
            ]);

            return result;
        } catch (error) {
            return { data: null, error };
        }
    };

    const value = {
        signUp: (data) => supabase.auth.signUp(data),
        signIn,
        signOut,
        user,
        role,
        isAdmin: role === 'admin',
        loading
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader className="animate-spin text-indigo-500" size={40} />
                    <p className="text-gray-400 text-sm">Caricamento Agile.AI...</p>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
