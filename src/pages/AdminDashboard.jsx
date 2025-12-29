import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Shield, Calendar, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const [pingStatus, setPingStatus] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, projectsRes] = await Promise.all([
                supabase.from('profiles').select('*').order('created_at', { ascending: false }),
                supabase.from('projects').select('*, profiles(email)').order('created_at', { ascending: false })
            ]);

            if (usersRes.error) throw usersRes.error;
            if (projectsRes.error) throw projectsRes.error;

            setUsers(usersRes.data || []);
            setProjects(projectsRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePingTest = async () => {
        setPingStatus('testing');
        const start = Date.now();
        try {
            const { error } = await supabase.from('profiles').select('id').limit(1);
            if (error) throw error;
            const ms = Date.now() - start;
            setPingStatus(`OK (${ms}ms)`);
        } catch (err) {
            setPingStatus(`ERROR: ${err.message}`);
        }
    };

    const handlePingTest = async () => {
        setPingStatus('testing');
        const start = Date.now();
        try {
            const { error } = await supabase.from('profiles').select('count').limit(1).single();
            const ms = Date.now() - start;
            if (error) throw error;
            setPingStatus(`OK (${ms}ms)`);
        } catch (e) {
            setPingStatus(`ERROR: ${e.message}`);
        }
    };

    const handleLoadProject = (rawProject) => {
        if (!confirm(`Vuoi caricare il progetto "${rawProject.name}"? Sostituirà quello attuale.`)) return;

        try {
            // Map DB structure to App structure (Same logic as ProjectContext)
            let sprints = rawProject.data?.sprints || [];
            // Migration legacy check
            if (sprints.length === 0 && rawProject.data?.sprint && Object.keys(rawProject.data.sprint).length > 0) {
                sprints = [{ id: 1, title: 'Sprint 1', status: 'active', ...rawProject.data.sprint }];
            }

            const appProject = {
                ...rawProject.data,
                id: rawProject.id,
                name: rawProject.name,
                sprints: sprints,
                createdAt: rawProject.created_at,
                updatedAt: rawProject.updated_at
            };

            console.log("Admin: Force loading project:", appProject);
            localStorage.setItem('currentProject', JSON.stringify(appProject));
            // Force reload to pick up new state
            window.location.reload();
        } catch (err) {
            console.error("Error loading project:", err);
            alert("Errore nel caricamento del progetto: " + err.message);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    Admin Dashboard
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                    Gestisci gli utenti e monitora la piattaforma.
                </p>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Totale Utenti</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{users.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Admin</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                                {users.filter(u => u.role === 'admin').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-800 p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Nuovi questo mese</p>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                                {users.filter(u => new Date(u.created_at) > new Date(new Date().setDate(1))).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Diagnostics */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Shield className="text-emerald-500" />
                    Diagnostica Sistema
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-800 rounded-xl">
                        <p className="text-zinc-400 text-sm mb-1">Stato Supabase</p>
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                            <span className="text-white font-mono">{loading ? 'Verifica in corso...' : 'Connesso'}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-zinc-800 rounded-xl">
                        <p className="text-zinc-400 text-sm mb-1">Test Scrittura</p>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={handlePingTest}
                                disabled={pingStatus === 'testing'}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors w-full text-center"
                            >
                                {pingStatus === 'testing' ? 'Testing...' : 'Esegui Ping Test'}
                            </button>
                            {pingStatus && pingStatus !== 'testing' && (
                                <p className={`text-xs p-2 rounded ${pingStatus.startsWith('ERROR') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                    {pingStatus}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* User List */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Utenti Registrati</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cerca utente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Data Iscrizione</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                                            Caricamento utenti...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                            {user.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-700 dark:text-zinc-300'
                                                }`}>
                                                {user.role || 'user'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-zinc-500">
                                        Nessun utente trovato.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Projects List */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 overflow-hidden mt-8">
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-700">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Tutti i Progetti nel DB</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 font-medium">
                            <tr>
                                <th className="px-6 py-4">Nome Progetto</th>
                                <th className="px-6 py-4">Proprietario</th>
                                <th className="px-6 py-4">Creato il</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-700">
                            {projects.map((project) => (
                                <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-white">
                                        {project.name}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                        {project.profiles?.email || project.user_id}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                                        {new Date(project.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 text-xs font-mono">
                                        {project.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleLoadProject(project)}
                                            className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-xs rounded transition-colors"
                                        >
                                            Carica
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-zinc-500">
                                        Nessun progetto trovato nel database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
