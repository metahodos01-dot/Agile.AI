import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../context/ProjectContext';
import {
    Target, Eye, LayoutDashboard, Sliders, Users,
    Map, Database, Clock, Play, Plus, Folder, FolderOpen, RefreshCw,
    Trash2, Pencil, Check, X, AlertCircle, LogOut, Shield, Zap
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

const adminStep = { path: '/admin', name: 'Admin Panel', icon: Shield };

const MOTO_DEMO_PROJECT = {
    name: 'Moto Elettrica Future',
    vision: 'Creare la moto elettrica più avanzata e sostenibile del mondo, combinando prestazioni elevate con un design italiano iconico e zero emissioni.',
    objectives: [
        'Raggiungere 300km di autonomia (WLTP)',
        'Ricarica 0-80% in 15 minuti',
        'Design premiato al Red Dot Award'
    ],
    kpis: [
        { id: 1, name: 'Autonomia', target: '300 km', current: '250', unit: 'km' },
        { id: 2, name: 'Peso', target: '180 kg', current: '195', unit: 'kg' }
    ],
    team: [
        { role: 'Product Owner', skills: 'Vision, Stakeholder Mgmt', count: 1 },
        { role: 'Scrum Master', skills: 'Agile Coaching, Facilitazione', count: 1 },
        { role: 'Team Engineering', skills: 'Mechanical & Electrical Eng', count: 3 },
        { role: 'Battery Specialist', skills: 'Chemistry, Thermal Mgmt', count: 1 },
        { role: 'UX/UI Designer', skills: 'Dashboard, App Interface', count: 1 }
    ],
    obeya: {
        items: [
            { category: "Layout Fisico", item: "Open space con 8 postazioni e area demo", checked: true },
            { category: "Radiatori Informativi", item: "Vision e Roadmap stampate 2m x 1m", checked: true },
            { category: "Attrezzature", item: "Kanban Board fisica con swimlanes", checked: true },
            { category: "Monitoraggio", item: "Monitor 55'' per Dashboard Telemetria", checked: true },
            { category: "Regole", item: "Daily Standup alle 09:30 tassativo", checked: true }
        ]
    },
    backlog: [
        {
            id: 1,
            title: "Sistema Batteria & Powertrain",
            stories: [
                { id: 101, title: "Come utente, voglio ricaricare l'80% in 15 minuti per ridurre le soste.", keyResult: "Contribuisce a: Ricarica rapida < 20 min", points: 13 },
                { id: 102, title: "Come ingegnere, voglio monitorare la temperatura delle celle per sicurezza.", keyResult: "Contribuisce a: Zero incidenti termici", points: 8 },
                { id: 103, title: "Come pilota, voglio mappature motore Eco/Sport per gestire l'autonomia.", keyResult: "Contribuisce a: Autonomia 300km", points: 5 }
            ]
        },
        {
            id: 2,
            title: "Esperienza Digitale & App",
            stories: [
                { id: 201, title: "Come pilota, voglio vedere l'autonomia residua sul dashboard.", keyResult: "Contribuisce a: UX Score > 4.5/5", points: 3 },
                { id: 202, title: "Come utente, voglio localizzare la moto tramite app.", keyResult: "Contribuisce a: Sicurezza percepita", points: 5 },
                { id: 203, title: "Come manutentore, voglio diagnosi remota via cloud.", keyResult: "Contribuisce a: Riduzione costi assistenza", points: 8 }
            ]
        }
    ],
    estimates: {
        101: 13, 102: 8, 103: 5,
        201: 3, 202: 5, 203: 8
    },
    roadmap: {
        releases: ['Prototipo Alpha', 'Beta Test', 'Lancio Commerciale', 'V2.0 OTA'],
        assignments: {
            1: 'Prototipo Alpha', // Batteria & Powertrain -> Alpha
            2: 'Beta Test' // Esperienza Digitale -> Beta
        }
    },
    sprint: {
        start: ["Test su strada ogni venerdì", "Pair programming su firmware BMS"],
        stop: ["Meeting senza agenda", "Interruzioni durante focus time"],
        continue: ["Daily standup puntuali", "Code review rigorosa"],
        kpis: {
            capacity: 85,
            performance: 92,
            velocity: 42,
            moods: { great: 4, good: 2, neutral: 1, difficult: 0, critical: 0 },
            burndownData: [
                { day: 'Lun', actual: 42 }, { day: 'Mar', actual: 38 }, { day: 'Mer', actual: 25 },
                { day: 'Gio', actual: 12 }, { day: 'Ven', actual: 0 }
            ],
            burnupData: [
                { day: 'Lun', actual: 0 }, { day: 'Mar', actual: 5 }, { day: 'Mer', actual: 17 },
                { day: 'Gio', actual: 30 }, { day: 'Ven', actual: 42 }
            ],
            historicalKpis: [
                { sprint: 'Sprint 1', velocity: 30, capacity: 70, performance: 80 },
                { sprint: 'Sprint 2', velocity: 35, capacity: 75, performance: 85 },
                { sprint: 'Sprint 3', velocity: 42, capacity: 85, performance: 92 }
            ]
        }
    }
};

// Save Confirmation Modal Component
const SaveConfirmModal = ({ projectName, onSave, onDiscard, onCancel }) => (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />

        {/* Modal */}
        <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 shadow-2xl animate-fade-in z-[100000]">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertCircle size={20} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Progetto in corso</h3>
            </div>

            <p className="text-zinc-400 text-sm mb-2">
                Stai lavorando su:
            </p>
            <p className="text-white font-medium mb-6 px-3 py-2 bg-zinc-800 rounded-lg truncate">
                {projectName}
            </p>

            <div className="space-y-3">
                <button
                    onClick={onSave}
                    className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-green-900/20"
                >
                    Salva e Crea Nuovo
                </button>
                <button
                    onClick={onDiscard}
                    className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-medium rounded-xl transition-colors border border-red-500/20"
                >
                    Non Salvare (Elimina dati)
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
    const { user, role, signOut, forceAdminRole } = useAuth();
    const navigate = useNavigate();



    // Modal states
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    // Edit name state
    const [editingName, setEditingName] = useState(false);
    const [tempName, setTempName] = useState('');

    // Handle new project with confirmation
    const handleNewProject = () => {
        console.log("Sidebar: handleNewProject clicked");
        if (project.name) {
            setShowSaveModal(true);
        } else {
            createNewProject();
            navigate('/mindset');
        }
    };

    // Confirm save and create new
    const handleSaveAndCreate = async () => {
        await saveProject();
        createNewProject();
        setShowSaveModal(false);
        navigate('/mindset');
    };

    const handleLoadDemo = async () => {
        console.log("Loading Demo Project...");
        try {
            await createNewProject();
            // Update local state immediately for UI responsiveness
            updateProject(MOTO_DEMO_PROJECT);
            // Save to DB to persist and get an ID
            await saveProject(MOTO_DEMO_PROJECT);
            // Navigate after save structure is ensured
            navigate('/mindset');
        } catch (e) {
            console.error("Demo Load Error:", e);
            alert("Errore nel caricamento della demo");
        }
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
            {/* Modals - Portal-like behavior with very high Z-index */}
            {showSaveModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center">
                    <SaveConfirmModal
                        projectName={project.name}
                        onSave={handleSaveAndCreate}
                        onDiscard={handleDiscardAndCreate}
                        onCancel={() => setShowSaveModal(false)}
                    />
                </div>
            )}

            {showDeleteModal && projectToDelete && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center">
                    <DeleteConfirmModal
                        projectName={projectToDelete.name}
                        onConfirm={confirmDelete}
                        onCancel={() => {
                            setShowDeleteModal(false);
                            setProjectToDelete(null);
                        }}
                    />
                </div>
            )}

            <aside className="fixed left-0 top-0 w-72 h-screen flex flex-col bg-zinc-950/90 backdrop-blur-xl border-r border-white/5 z-[9999] shadow-2xl">
                {/* Logo Section */}
                <div className="p-6 border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <img
                            src="/logo-metahodos.png"
                            alt="MetaHodos"
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">PROGETTOAGILE.AI <span className="text-[10px] text-green-400 font-mono">v2.0</span></h1>
                            <img
                                src="/signature-franz.png"
                                alt="by Franz"
                                className="h-5 object-contain mt-1 invert opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* New Project Button */}
                <div className="px-3 py-4 border-b border-zinc-800/50 flex-shrink-0 relative z-[10001]">
                    <button
                        onClick={(e) => {
                            try {
                                console.log("New Project Clicked");
                                e.stopPropagation();
                                handleNewProject();
                            } catch (err) {
                                console.error("New Project Error:", err);
                                alert("Errore: " + err.message);
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors cursor-pointer active:scale-95 shadow-lg shadow-indigo-900/20"
                    >
                        <Plus size={18} />
                        Nuovo Progetto
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("HARD RESET: Questo cancellerà brutalmente la memoria locale e ricaricherà la pagina. Usare solo se bloccati.")) {
                                console.log("HARD RESET TRIGGERED");
                                localStorage.removeItem('currentProject');
                                localStorage.removeItem('sb-access-token'); // Optional: clear auth if needed, but maybe too aggressive. Let's just clear project.
                                // Actually, let's clear project specifically.
                                window.location.reload();
                            }
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 text-xs font-bold rounded-lg transition-colors border border-red-500/20 cursor-pointer active:scale-95"
                    >
                        <AlertCircle size={14} />
                        HARD RESET (Sblocca tutto)
                    </button>
                </div>

                {/* Saved Projects */}
                {savedProjects.length > 0 && (
                    <div className="px-3 py-4 border-b border-zinc-800/50 max-h-48 overflow-y-auto flex-shrink-0 z-50">
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
                <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800/50 relative z-[10001]">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-1">Progetto attuale</p>

                    {editingName ? (
                        <div className="flex items-center gap-2 relative z-[10002]">
                            <input
                                type="text"
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={handleNameKeyDown}
                                onClick={(e) => e.stopPropagation()}
                                className="flex-1 bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-sm text-white focus:border-indigo-500 focus:outline-none cursor-text"
                                placeholder="Nome progetto..."
                                autoFocus
                            />
                            <button
                                onClick={(e) => { e.stopPropagation(); saveName(); }}
                                className="p-1 hover:bg-green-500/20 rounded transition-colors cursor-pointer"
                                title="Salva"
                            >
                                <Check size={16} className="text-green-400" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); cancelEditingName(); }}
                                className="p-1 hover:bg-zinc-700 rounded transition-colors cursor-pointer"
                                title="Annulla"
                            >
                                <X size={16} className="text-zinc-400" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={startEditingName}>
                            <p className="text-sm font-medium text-white truncate flex-1">
                                {project.name || '(Senza nome)'}
                            </p>
                            <button
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-zinc-700 rounded transition-all"
                                title="Modifica nome"
                            >
                                <Pencil size={14} className="text-zinc-400" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto z-40">
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

                        {/* Admin Panel Link */}
                        {role === 'admin' && (
                            <NavLink
                                to={adminStep.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 mt-2 group relative overflow-hidden ${isActive
                                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                        : 'text-zinc-400 hover:text-purple-300 hover:bg-zinc-800/50'
                                    }`
                                }
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <adminStep.icon size={17} className="flex-shrink-0 relative z-10" />
                                <span className="font-medium text-sm truncate relative z-10">{adminStep.name}</span>
                            </NavLink>
                        )}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-white/5 bg-black/20 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 ring-2 ring-white/10">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate mb-1">{user?.email?.split('@')[0] || 'User'}</p>

                            {/* DEV: Admin Trigger */}
                            {role !== 'admin' && (
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        forceAdminRole();
                                    }}
                                    className="mb-2 w-full flex items-center justify-center gap-2 px-2 py-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/20 uppercase tracking-wider"
                                >
                                    <Shield size={10} />
                                    Dev: Set Admin
                                </button>
                            )}

                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    console.log("FORCE LOGOUT: Sequence Start");

                                    // 1. Force redirect safety trigger
                                    setTimeout(() => {
                                        console.log("FORCE LOGOUT: Timeout Fallback Triggered");
                                        localStorage.clear();
                                        sessionStorage.clear();
                                        window.location.href = '/login';
                                    }, 1500);

                                    // 2. Try Supabase signOut
                                    try {
                                        await signOut();
                                        console.log("FORCE LOGOUT: Supabase success");
                                    } catch (err) {
                                        console.error("FORCE LOGOUT: Supabase failed", err);
                                    }

                                    // 3. Clean up and go
                                    console.log("FORCE LOGOUT: Main Redirect");
                                    localStorage.clear();
                                    sessionStorage.clear();
                                    window.location.href = '/login';
                                }}
                                className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all w-full justify-center border border-red-500/10 hover:border-red-500/30 cursor-pointer active:scale-95"
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
