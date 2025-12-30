import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProject } from '../../context/ProjectContext';
import {
    Map, Database, Clock, Play, Plus, Folder, FolderOpen, RefreshCw,
    Trash2, Pencil, Check, X, AlertCircle, LogOut, Shield, Zap, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const steps = [
    { path: '/app/mindset', name: '0. Mindset Agile', icon: RefreshCw },
    { path: '/app/vision', name: '1. Product vision', icon: Eye },
    { path: '/app/objectives', name: '2. Obiettivi', icon: Target },
    { path: '/app/kpi', name: '3. KPI e target', icon: Sliders },
    { path: '/app/team', name: '4. Team', icon: Users },
    { path: '/app/obeya', name: '5. Obeya', icon: LayoutDashboard },
    { path: '/app/backlog', name: '6. Backlog', icon: Database },
    { path: '/app/estimates', name: '7. Stime', icon: Clock },
    { path: '/app/roadmap', name: '8. Roadmap', icon: Map },
    { path: '/app/sprint', name: '9. Sprint', icon: Play },
];

const adminStep = { path: '/app/admin', name: 'Admin Panel', icon: Shield };

const AGILE_AI_DEMO_PROJECT = {
    name: 'Agile.AI (Questo Progetto)',
    vision: 'Rivoluzionare il Project Management rendendo l\'Agile Coaching accessibile a tutti tramite un assistente AI proattivo che guida i team passo dopo passo, eliminando la complessità metodologica.',
    visionFields: {
        targetAudience: "Team di sviluppo, Startup, PMI",
        problem: "I framework Agile sono complessi da adottare e i coach umani costosi.",
        solution: "Un AI Agent che agisce come Scrum Master e PO virtuale.",
        currentSolution: "Consulenti costosi o tool passivi (Jira/Trello) senza guida.",
        differentiation: "Guida sequenziale attiva e generazione automatica dei contenuti."
    },
    objectives: [
        { title: 'Lanciare MVP Funzionante', description: 'Rilasciare la versione 1.0 con le 9 fasi complete.' },
        { title: 'Validare il Flusso Sequenziale', description: 'Garantire che gli utenti non si perdano durante il setup.' },
        { title: 'Integrare Intelligenza Artificiale', description: 'Generare OKR, User Stories e Stime automaticamente.' }
    ],
    kpis: [
        { id: 1, name: 'Active Users (MAU)', target: '100', current: '12', unit: 'users' },
        { id: 2, name: 'Time to Setup', target: '< 10 min', current: '15 min', unit: 'min' },
        { id: 3, name: 'AI Generation Rate', target: '80%', current: '65%', unit: '%' }
    ],
    team: [
        { role: 'Product Owner', skills: 'Vision, Strategy, Roadmap', count: 1 },
        { role: 'AI Architect', skills: 'System Prompts, React, Supabase', count: 1 },
        { role: 'UX Designer', skills: 'Glassmorphism, Tailwind, Motion', count: 1 }
    ],
    obeya: {
        items: [
            { category: "Virtuale", item: "Repository GitHub (Metahodos01)", checked: true },
            { category: "Monitoraggio", item: "Vercel Analytics Dashboard", checked: true },
            { category: "Testing", item: "Playwright E2E Tests", checked: false },
            { category: "Strumenti", item: "Supabase Database & Auth", checked: true }
        ]
    },
    backlog: [
        {
            id: 1,
            title: "Core Framework",
            stories: [
                { id: 101, title: "Come utente, voglio un flusso guidato per non perdermi.", keyResult: "Riduzione drop-off del 50%", points: 13 },
                { id: 102, title: "Come PO, voglio che l'AI scriva le User Stories per me.", keyResult: "Tempo di scrittura -80%", points: 8 },
                { id: 103, title: "Come Scrum Master, voglio un timer per il Daily Standup.", keyResult: "Meeting entro 15 min", points: 3 }
            ]
        },
        {
            id: 2,
            title: "UI & Experience",
            stories: [
                { id: 201, title: "Come utente, voglio un'interfaccia 'Glass' moderna.", keyResult: "NPS > 50", points: 5 },
                { id: 202, title: "Come utente, voglio vedere il progresso del progetto nella Home.", keyResult: "Engagement +20%", points: 5 }
            ]
        }
    ],
    estimates: {
        101: 13, 102: 8, 103: 3,
        201: 5, 202: 5
    },
    roadmap: {
        mvpName: "Agile.AI v1.0 Launch",
        targetDate: "2025-12-31",
        devCount: 2,
        hoursPerDay: 6,
        sprintDurationWeeks: 2,
        selectedEpics: [1, 2],
        analysis: "Progetto fattibile entro Q1 2026."
    },
    sprints: [
        {
            id: 1,
            title: "Sprint 1 - Foundation",
            goal: "Implementare la struttura base e il contesto React",
            status: "completed",
            startDate: "2025-12-01",
            durationDays: 14,
            tasks: []
        },
        {
            id: 2,
            title: "Sprint 2 - AI Integration",
            goal: "Connettere le API OpenAI per generare contenuti",
            status: "active",
            startDate: "2025-12-15",
            durationDays: 14,
            tasks: [
                { id: "t1", title: "Setup OpenAI Service", status: "done", estimate: 3 },
                { id: "t2", title: "Prompt Engineering per Vision", status: "done", estimate: 5 },
                { id: "t3", title: "UI Integrazione Chat", status: "doing", estimate: 8 }
            ]
        }
    ]
};

import ReactDOM from 'react-dom';

// Save Confirmation Modal Component
const SaveConfirmModal = ({ projectName, onSave, onDiscard, onCancel }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans">
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
                        className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-500 text-white font-medium rounded-xl transition-colors shadow-lg shadow-green-900/20 cursor-pointer"
                    >
                        Salva e Crea Nuovo
                    </button>
                    <button
                        onClick={onDiscard}
                        className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-300 font-medium rounded-xl transition-colors border border-red-500/20 cursor-pointer"
                    >
                        Non Salvare (Elimina dati)
                    </button>
                    <button
                        onClick={onCancel}
                        className="w-full py-2.5 px-4 text-zinc-400 hover:text-white font-medium rounded-xl transition-colors cursor-pointer"
                    >
                        Annulla
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Demo Confirmation Modal
const DemoConfirmModal = ({ onConfirm, onCancel }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 shadow-2xl animate-fade-in z-[100000]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                        <Zap size={20} className="text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Caricare Demo?</h3>
                </div>

                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                    Questo creerà un nuovo progetto <strong>Agile.AI Case Study</strong> con dati precompilati.
                    Il progetto attuale verrà salvato se ha un nome.
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2.5 px-4 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl transition-colors cursor-pointer"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-900/20"
                    >
                        Carica Demo
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ projectName, onConfirm, onCancel }) => {
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />

            <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-80 shadow-2xl animate-fade-in z-[100000]">
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
                        className="flex-1 py-2.5 px-4 bg-zinc-700 hover:bg-zinc-600 text-white font-medium rounded-xl transition-colors cursor-pointer"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-medium rounded-xl transition-colors cursor-pointer"
                    >
                        Elimina
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

const Sidebar = () => {
    const { project, savedProjects, createNewProject, loadProject, deleteProject, updateProject, saveProject } = useProject();
    const { user, role, signOut, forceAdminRole } = useAuth();
    const navigate = useNavigate();



    // Modal states
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDemoModal, setShowDemoModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [showProjectList, setShowProjectList] = useState(false); // Dropdown toggler

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
            updateProject(AGILE_AI_DEMO_PROJECT);
            // Save to DB to persist and get an ID
            await saveProject(AGILE_AI_DEMO_PROJECT);
            // Navigate after save structure is ensured
            navigate('/mindset');
            setShowDemoModal(false);
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
                <SaveConfirmModal
                    projectName={project.name}
                    onSave={handleSaveAndCreate}
                    onDiscard={handleDiscardAndCreate}
                    onCancel={() => setShowSaveModal(false)}
                />
            )}

            {showDemoModal && (
                <DemoConfirmModal
                    onConfirm={handleLoadDemo}
                    onCancel={() => setShowDemoModal(false)}
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

            <aside className="fixed left-0 top-0 w-72 h-screen flex flex-col bg-slate-950/90 backdrop-blur-xl border-r border-white/5 z-[9999] shadow-2xl">
                {/* Logo Section */}
                <div className="p-6 border-b border-white/5 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <img
                            src="/logo-metahodos.png"
                            alt="MetaHodos"
                            className="w-12 h-12 object-contain"
                        />
                        <div>
                            <h1 className="text-lg font-bold text-white leading-tight">PROGETTOAGILE.AI <span className="text-[10px] text-green-400 font-mono">v2.5</span></h1>
                            <img
                                src="/signature-franz.png"
                                alt="by Franz"
                                className="h-5 object-contain mt-1 invert opacity-60"
                            />
                        </div>
                    </div>
                </div>

                {/* New Project Button */}
                <div className="px-3 py-4 border-b border-slate-800/50 flex-shrink-0 relative z-[10001]">
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
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors cursor-pointer active:scale-95 shadow-lg shadow-amber-900/20"
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
                    CARICA DEMO (Agile.AI)
                </button>
            </div>

            {/* PROJECT SELECTOR (Command Center) */}
            <div className="px-4 py-3 border-b border-white/5 bg-slate-900/50">
                <div
                    onClick={() => setShowProjectList(!showProjectList)}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 cursor-pointer transition-colors group"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 rounded bg-indigo-500/20 flex-shrink-0 flex items-center justify-center border border-indigo-500/30">
                            <FolderOpen size={16} className="text-indigo-400 group-hover:text-indigo-300" />
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Progetto Attivo</span>
                            <span className="text-sm font-bold text-indigo-100 truncate" title={project.name || 'Senza Nome'}>
                                {project.name || 'Nuovo Progetto'}
                            </span>
                        </div>
                    </div>
                    {showProjectList ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                </div>

                {/* Dropdown List */}
                {showProjectList && (
                    <div className="mt-2 space-y-1 animate-fade-in max-h-48 overflow-y-auto no-scrollbar bg-slate-950 p-2 rounded-lg border border-slate-800 shadow-xl">
                        <p className="text-[10px] text-slate-600 px-2 py-1 font-bold uppercase">Progetti Salvati ({savedProjects.length})</p>
                        {savedProjects.length === 0 && (
                            <p className="text-xs text-slate-500 px-2 py-1">Nessun progetto salvato.</p>
                        )}
                        {savedProjects.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2 rounded hover:bg-slate-800 group/item transition-colors">
                                <button
                                    onClick={() => { handleLoadProject(p.id); setShowProjectList(false); }}
                                    className="flex-1 text-left"
                                >
                                    <div className="text-xs font-bold text-slate-300 group-hover/item:text-white truncate max-w-[140px]" title={p.name}>
                                        {p.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                        {new Date(p.lastModified || Date.now()).toLocaleDateString()}
                                    </div>
                                </button>
                                <button
                                    onClick={(e) => handleDeleteClick(e, p)}
                                    className="p-1.5 rounded hover:bg-red-500/20 text-slate-600 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                                    title="Elimina progetto"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Saved Projects */}
            {savedProjects.length > 0 && (
                <div className="px-3 py-4 border-b border-slate-800/50 max-h-48 overflow-y-auto flex-shrink-0 z-50">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider px-2 mb-2">
                        Progetti salvati ({savedProjects.length})
                    </p>
                    <div className="space-y-1">
                        {savedProjects.map((p) => (
                            <div
                                key={p.id}
                                className={`group flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${project.id === p.id
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
            <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800/50 relative z-[10001]">
                <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-1">Progetto attuale</p>

                {editingName ? (
                    <div className="flex items-center gap-2 relative z-[10002]">
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onKeyDown={handleNameKeyDown}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-2 py-1 text-sm text-white focus:border-amber-500 focus:outline-none cursor-text"
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
                            className="p-1 hover:bg-slate-700 rounded transition-colors cursor-pointer"
                            title="Annulla"
                        >
                            <X size={16} className="text-slate-400" />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={startEditingName}>
                        <p className="text-sm font-medium text-white truncate flex-1">
                            {project.name || '(Senza nome)'}
                        </p>
                        <button
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-700 rounded transition-all"
                            title="Modifica nome"
                        >
                            <Pencil size={14} className="text-slate-400" />
                        </button>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto z-40">
                <NavLink
                    to="/app"
                    end
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${isActive
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                                    className="absolute inset-0 bg-amber-500/10 border border-amber-500/20 rounded-xl"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </>
                    )}
                </NavLink>



                <div className="px-4 py-3 mt-2">
                    <p className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Fasi del progetto</p>
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
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
                                                    : 'bg-amber-500/10 border border-amber-500/20'}`}
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
                                    : 'text-slate-400 hover:text-purple-300 hover:bg-slate-800/50'
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
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-500/20 ring-2 ring-white/10">
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
        </aside >
        </>
    );
};

export default Sidebar;
