import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../context/ProjectContext';
import {
    Target, Eye, LayoutDashboard, Sliders, Users,
    Map, Database, Clock, Play, Plus, Folder, FolderOpen, RefreshCw,
    Trash2, Pencil, Check, X, AlertCircle, LogOut, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const steps = [
    { path: '/mindset', name: '0. Mindset Agile', icon: RefreshCw },
    { path: '/vision', name: '1. Product vision', icon: Eye },
    { path: '/objectives', name: '2. Obiettivi', icon: Target },
    { path: '/kpi', name: '3. KPI e target', icon: Sliders },
    { path: '/team', name: '4. Team', icon: Users },
    { path: '/obeya', name: '5. Obeya', icon: LayoutDashboard },
    { path: '/backlog', name: '6. Backlog', icon: Database },
    { path: '/estimates', name: '7. Stime', icon: Clock },
    { path: '/roadmap', name: '8. Roadmap', icon: Map },
    { path: '/sprint', name: '9. Sprint', icon: Play },
];

// Save Confirmation Modal Component
const SaveConfirmModal = ({ projectName, onSave, onDiscard, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

        {/* Modal */}
        <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertCircle size={20} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Salvare il progetto?</h3>
            </div>

            <p className="text-zinc-400 text-sm mb-2">
                Hai un progetto in corso:
            </p>
            <p className="text-white font-medium mb-6 px-3 py-2 bg-zinc-800 rounded-lg truncate">
                {projectName}
            </p>

            <div className="space-y-2">
                <button
                    onClick={onSave}
                    className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors"
                >
                    Salva e Crea Nuovo
                </button>
                <button
                    onClick={onDiscard}
                    className="w-full py-2.5 px-4 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl transition-colors"
                >
                    Non Salvare
                </button>
                <button
                    onClick={onCancel}
                    className="w-full py-2.5 px-4 text-zinc-400 hover:text-white font-medium rounded-xl transition-colors"
                >
                    Annulla
                </button>
            </div>
        </div>
    </div>
);

// Delete Confirmation Modal
const DeleteConfirmModal = ({ projectName, onConfirm, onCancel }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

        <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <Trash2 size={20} className="text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Eliminare progetto?</h3>
            </div>

            <p className="text-zinc-400 text-sm mb-2">
                Stai per eliminare:
            </p>
            <p className="text-white font-medium mb-6 px-3 py-2 bg-zinc-800 rounded-lg truncate">
                {projectName}
            </p>

            <div className="flex gap-2">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2.5 px-4 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl transition-colors"
                >
                    Annulla
                </button>
                <button
                    onClick={onConfirm}
                    className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors"
                >
                    Elimina
                </button>
            </div>
        </div>
    </div>
);

const Sidebar = () => {
    const { project, savedProjects, createNewProject, loadProject, deleteProject, updateProject, saveProject } = useProject();
    const { user, role, signOut } = useAuth();
    const navigate = useNavigate();

    // Handle Logout
    const handleLogout = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        console.log("Sidebar: handleLogout called");
        try {
            const result = await signOut();
            console.log("Sidebar: signOut result:", result);
            // Use hard redirect to ensure complete state reset
            window.location.href = '/login';
        } catch (error) {
            console.error("Sidebar: Logout failed:", error);
            // Still redirect even on error
            window.location.href = '/login';
        }
    };

    // Modal states
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Edit name state
    const [editingName, setEditingName] = useState(false);
    const [tempName, setTempName] = useState('');

    // Handle new project with confirmation
    const handleNewProject = () => {
        if (project.name) {
            setShowSaveModal(true);
        } else {
            createNewProject();
            navigate('/mindset');
        }
    };

    // Confirm save and create new
    const handleSaveAndCreate = () => {
        saveProject();
        createNewProject();
        setShowSaveModal(false);
        navigate('/mindset');
    };

    // Discard and create new
    const handleDiscardAndCreate = () => {
        createNewProject();
        setShowSaveModal(false);
        navigate('/mindset');
    };

    const handleLoadProject = (projectId) => {
        loadProject(projectId);
        navigate('/');
    };

    // Delete handlers
    const handleDeleteClick = (e, proj) => {
        e.stopPropagation();
        setProjectToDelete(proj);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (projectToDelete) {
            deleteProject(projectToDelete.id);
        }
        setShowDeleteModal(false);
        setProjectToDelete(null);
    };

    // Name editing handlers
    const startEditingName = () => {
        setTempName(project.name);
        setEditingName(true);
    };

    const saveName = () => {
        if (tempName.trim()) {
            updateProject({ name: tempName.trim() });
        }
        setEditingName(false);
    };

    const cancelEditingName = () => {
        setEditingName(false);
        setTempName('');
    };

    const handleNameKeyDown = (e) => {
        if (e.key === 'Enter') {
            saveName();
        } else if (e.key === 'Escape') {
            cancelEditingName();
        }
    };

    return (
        <>
            {/* Modals */}
            {showSaveModal && (
                <SaveConfirmModal
                    projectName={project.name}
                    onSave={handleSaveAndCreate}
                    onDiscard={handleDiscardAndCreate}
                    onCancel={() => setShowSaveModal(false)}
                />
            )}

            {showDeleteModal && projectToDelete && (
                <DeleteConfirmModal
                    projectName={projectToDelete.name}
                    onConfirm={confirmDelete}
                    onCancel={() => {
                        setShowDeleteModal(false);
                        setProjectToDelete(null);
                    }}
                />
            )}

            <aside className="w-72 h-screen fixed left-0 top-0 flex flex-col bg-zinc-950/80 backdrop-blur-xl border-r border-white/5 z-50">
                {/* Logo Section */}
                <div className="p-6 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <img
                            src="/logo-metahodos.png"
                            alt="MetaHodos"
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">PROGETTOAGILE.AI</h1>
                            <img
                                src="/signature-franz.png"
                                alt="by Franz"
                                className="h-5 object-contain mt-1 invert opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* New Project Button */}
                <div className="px-3 py-4 border-b border-zinc-800/50">
                    <button
                        onClick={handleNewProject}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors"
                    >
                        <Plus size={18} />
                        Nuovo Progetto
                    </button>
                </div>

                {/* Saved Projects */}
                {savedProjects.length > 0 && (
                    <div className="px-3 py-4 border-b border-zinc-800/50 max-h-48 overflow-y-auto">
                        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider px-2 mb-2">
                            Progetti salvati ({savedProjects.length})
                        </p>
                        <div className="space-y-1">
                            {savedProjects.map((p) => (
                                <div
                                    key={p.id}
                                    className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${project.id === p.id
                                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                                        }`}
                                    onClick={() => handleLoadProject(p.id)}
                                >
                                    {project.id === p.id ? <FolderOpen size={16} /> : <Folder size={16} />}
                                    <span className="text-sm font-medium truncate flex-1">{p.name}</span>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, p)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                                        title="Elimina progetto"
                                    >
                                        <Trash2 size={14} className="text-red-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Current Project Info - Editable */}
                <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/50">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Progetto attuale</p>

                    {editingName ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={handleNameKeyDown}
                                className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none"
                                placeholder="Nome progetto..."
                                autoFocus
                            />
                            <button
                                onClick={saveName}
                                className="p-1 hover:bg-green-500/20 rounded transition-colors"
                                title="Salva"
                            >
                                <Check size={16} className="text-green-400" />
                            </button>
                            <button
                                onClick={cancelEditingName}
                                className="p-1 hover:bg-zinc-700 rounded transition-colors"
                                title="Annulla"
                            >
                                <X size={16} className="text-zinc-400" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group">
                            <p className="text-sm font-medium text-white truncate flex-1">
                                {project.name || '(Senza nome)'}
                            </p>
                            <button
                                onClick={startEditingName}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded transition-all"
                                title="Modifica nome"
                            >
                                <Pencil size={14} className="text-zinc-400" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <LayoutDashboard size={18} />
                                <span className="font-medium relative z-10">Dashboard</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeNav"
                                        className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>

                    {role === 'admin' && (
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive
                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                                }`
                            }
                        >
                            <Shield size={18} />
                            <span className="font-medium">Admin Panel</span>
                        </NavLink>
                    )}

                    <div className="px-4 py-3 mt-2">
                        <p className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider">Fasi del progetto</p>
                    </div>

                    <div className="space-y-0.5">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isIntro = index === 0;
                            return (
                                <NavLink
                                    key={step.path}
                                    to={step.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive
                                            ? isIntro
                                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon size={17} className="flex-shrink-0" />
                                            <span className="font-medium text-sm truncate relative z-10">{step.name}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeNav"
                                                    className={`absolute inset-0 rounded-xl ${isIntro
                                                        ? 'bg-amber-500/10 border border-amber-500/20'
                                                        : 'bg-indigo-500/10 border border-indigo-500/20'}`}
                                                    initial={false}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-white/10">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate mb-1">{user?.email?.split('@')[0] || 'User'}</p>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all w-full justify-center border border-red-500/10 hover:border-red-500/30"
                            >
                                <LogOut size={12} />
                                Disconnetti
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
