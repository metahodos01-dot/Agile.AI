import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import ExportButton from '../components/common/ExportButton';
import {
    Play, CheckSquare, Pause, RotateCcw, Save, CheckCircle, Target, BookOpen,
    TrendingUp, TrendingDown, Smile, Meh, Frown, BarChart3, Activity, Users,
    Calendar, Zap, Database, Plus, X, Calculator, AlertTriangle, Lock
} from 'lucide-react';

// --- Helper Components ---

const KpiCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="glass-panel p-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
            <Icon size={48} color={color} />
        </div>
        <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-lg bg-zinc-800/50`} style={{ backgroundColor: `${color}20` }}>
                <Icon size={20} color={color} />
            </div>
            <h3 className="text-zinc-400 font-medium text-sm">{title}</h3>
        </div>
        <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{value}</span>
            {change !== 0 && (
                <span className={`text-xs font-medium flex items-center ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {change > 0 ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                    {Math.abs(change)}%
                </span>
            )}
        </div>
    </div>
);

const MoodMeter = ({ moods = {}, onVote }) => (
    <div className="flex flex-col items-center">
        <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-4">Team Mood</h3>
        <div className="flex gap-6">
            {[
                { icon: Smile, label: 'Positivo', color: 'text-green-400', key: 'happy' },
                { icon: Meh, label: 'Neutro', color: 'text-yellow-400', key: 'neutral' },
                { icon: Frown, label: 'Negativo', color: 'text-red-400', key: 'sad' }
            ].map(({ icon: Icon, label, color, key }) => (
                <button
                    key={key}
                    onClick={() => onVote(key)}
                    className="flex flex-col items-center gap-2 group transition-transform hover:scale-110"
                >
                    <div className={`p-4 rounded-full bg-zinc-800/50 border border-zinc-700 group-hover:bg-zinc-800 ${color}`}>
                        <Icon size={32} />
                    </div>
                    <span className="text-xs text-zinc-500 font-medium">{label} ({moods[key] || 0})</span>
                </button>
            ))}
        </div>
    </div>
);

const BurnChart = ({ data, type }) => (
    <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-700 rounded-xl bg-zinc-800/20">
        <BarChart3 size={32} className="text-zinc-600 mb-2" />
        <p className="text-zinc-500 text-sm">Grafico {type === 'burndown' ? 'Burndown' : 'Burnup'} ({data?.length || 0} aggiornamenti)</p>
        <p className="text-xs text-zinc-600 mt-1">Dati storici verranno visualizzati qui</p>
    </div>
);

const KanbanColumn = ({ title, status, tasks, onMove, onAdd, color }) => (
    <div className="flex flex-col h-full bg-zinc-900/30 rounded-xl border border-zinc-800/50">
        <div className={`p-4 border-b border-zinc-800/50 flex justify-between items-center ${color}`}>
            <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">{tasks.length}</span>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px]">
            {tasks.map(task => (
                <div key={task.id} className="p-3 bg-zinc-800/80 rounded-lg border border-zinc-700/50 hover:border-indigo-500/50 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-zinc-200 line-clamp-2">{task.title}</span>
                        <button onClick={() => onMove(task.id, 'delete')} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400"><X size={14} /></button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-zinc-500 flex items-center gap-1"><Users size={12} /> {task.assignee || 'Team'}</div>
                        <div className="flex gap-1">
                            {status !== 'todo' && <button onClick={() => onMove(task.id, 'prev')} className="p-1 hover:bg-zinc-700 rounded"><RotateCcw size={12} /></button>}
                            {status !== 'done' && <button onClick={() => onMove(task.id, 'next')} className="p-1 hover:bg-zinc-700 rounded"><Play size={12} /></button>}
                        </div>
                    </div>
                </div>
            ))}
            {onAdd && (
                <button onClick={onAdd} className="w-full py-2 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-500 text-sm hover:border-zinc-700 hover:text-zinc-400 transition-colors flex items-center justify-center gap-2">
                    <Plus size={16} /> Aggiungi Task
                </button>
            )}
        </div>
    </div>
);


// Gauge Component (Windshield Wiper Style)
const GaugeChart = ({ value, max, label, color, icon: Icon }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

    return (
        <div className="text-center">
            <div className="relative w-40 h-24 mx-auto overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
                    <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 10 55 A 40 40 0 0 1 90 55" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${percentage * 1.26} 126`} />
                    <g transform={`rotate(${angle}, 50, 55)`}>
                        <line x1="50" y1="55" x2="50" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="50" cy="55" r="4" fill="white" />
                    </g>
                </svg>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
                <Icon size={16} className={`text-${color.replace('#', '')}`} style={{ color }} />
                <span className="text-white font-bold text-lg">{value.toFixed(0)}%</span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">{label}</p>
        </div>
    );
};

// ... MoodMeter, BurnChart, KpiCard, KanbanColumn ...
// (I will assume they are present. To avoid deleting them, I must include them or skip the lines. 
// Since I am replacing from line 1 to 300+, I should include them strictly if I want to keep them.
// Actually, it's safer to keep them. I'll paste them back in condensed form to save tokens, or effectively just replace the Sprint component part if I can target it.)
// Strategy: I will target the imports and the Sprint component definition, skipping the helper components in the middle if possible.
// But `replace_file_content` works on line ranges.
// Lines 11-236 are helper components. I should probably NOT replace them. 
// I will target 238-654 to replace the `Sprint` component logic.
// But I need to update imports at line 1.
// Let's do imports first (Lines 1-9).
// Then the main component (Lines 238+).

// RE-STRATEGIZING:
// 1. Update Imports (Lines 1-9) to include Calculate, AlertTriangle, Lock.
// 2. Update Sprint Component Logic (Lines 238-654).

// Step 1: Logic
const Sprint = () => {
    const { project, updateSprint, addSprint, saveProject } = useProject();
    const navigate = useNavigate();

    // Tab State
    const [activeTab, setActiveTab] = useState('planning'); // Default to planning logic
    const [activeSprintId, setActiveSprintId] = useState(1);
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Derived Active Sprint
    const activeSprint = project.sprints?.find(s => s.id === activeSprintId) ||
        (project.sprint && Object.keys(project.sprint).length ? { id: 1, ...project.sprint } : null) ||
        // Fallback for empty state or first load
        project.sprints?.[0] || { id: 1, title: 'Sprint 1', status: 'planned' };

    // --- Local State for Editing (Sync with Active Sprint) ---
    // We initialize state when activeSprint changes

    // Planning Data
    const [capacity, setCapacity] = useState({ total: 0, members: [] });

    // Execution Data
    const [kanbanTasks, setKanbanTasks] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [sprintNotes, setSprintNotes] = useState('');
    const [kpiData, setKpiData] = useState({});
    const [retroItems, setRetroItems] = useState({ start: [], stop: [], continue: [] });

    // Daily Timer
    const [timer, setTimer] = useState(900);
    const [isRunning, setIsRunning] = useState(false);

    // Sync Effect: Load data when Active Sprint changes
    useEffect(() => {
        if (activeSprint) {
            setKanbanTasks(activeSprint.kanban || []);
            setCalendarEvents(activeSprint.calendar || []);
            setSprintNotes(activeSprint.notes || '');
            setKpiData(activeSprint.kpis || {
                velocity: 0, capacity: 0, performance: 0,
                moods: {}, burndownData: [], burnupData: []
            });
            setRetroItems({
                start: activeSprint.start || ['', ''],
                stop: activeSprint.stop || ['', ''],
                continue: activeSprint.continue || ['', '']
            });
            setCapacity(activeSprint.capacity || { total: 0, members: [] });

            // Set tab based on status?
            if (activeSprint.status === 'completed') setActiveTab('retro');
        }
    }, [activeSprintId, project.sprints]); // Re-run when ID or project data updates

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isRunning && timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // --- Handlers ---

    const handleCreateSprint = () => {
        const newSprint = addSprint({ status: 'planned' });
        setActiveSprintId(newSprint.id);
        setActiveTab('planning');
    };

    const handleSaveLocal = () => {
        // Update context immediately
        const payload = {
            id: activeSprintId,
            status: activeSprint.status, // Preserve status
            kanban: kanbanTasks,
            calendar: calendarEvents,
            notes: sprintNotes,
            kpis: kpiData,
            start: retroItems.start,
            stop: retroItems.stop,
            continue: retroItems.continue,
            capacity: capacity
        };
        updateSprint(activeSprintId, payload);
    };

    const handleSaveAndPersist = async () => {
        handleSaveLocal(); // Ensure context is updated first
        setIsSaving(true);
        try {
            // We save the WHOLE project, context updates already merged the sprint data
            const success = await saveProject();
            if (success) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    // --- Specific Tab Handlers ---

    // Planning: Capacity
    const updateMemberCapacity = (index, field, value) => {
        const newMembers = [...(capacity.members || [])];
        if (!newMembers[index]) newMembers[index] = { name: '', hours: 0, focus: 0 };
        newMembers[index][field] = value;

        // Recalc Total
        const total = newMembers.reduce((sum, m) => sum + (Number(m.hours || 0) * (Number(m.focus || 0) / 100)), 0);
        setCapacity({ members: newMembers, total: Math.round(total) });
    };

    const addMemberRow = () => {
        setCapacity(prev => ({ ...prev, members: [...(prev.members || []), { name: '', hours: 0, focus: 80 }] }));
    };

    // Kanban & Others
    // ... (Use existing handlers but update local state which then syncs via handleSaveLocal) ...
    const moveTask = (taskId, direction) => {
        // ... existing logic ...
        if (direction === 'delete') {
            setKanbanTasks(prev => prev.filter(t => t.id !== taskId));
            return;
        }

        const stages = ['todo', 'doing', 'done'];
        setKanbanTasks(prev => prev.map(task => {
            if (task.id === taskId) {
                const currentIndex = stages.indexOf(task.status);
                const nextIndex = direction === 'next'
                    ? Math.min(currentIndex + 1, stages.length - 1)
                    : Math.max(currentIndex - 1, 0);
                return { ...task, status: stages[nextIndex] };
            }
            return task;
        }));
    };

    // ... (Other handlers: addTask, addCalendarEvent, removeEvent, handleRetroChange, handleMoodVote) ...
    // To save token space, I will re-implement them or just reference "existing logic" if I wasn't replacing the whole block.
    // Since I am replacing the block, I MUST provide the implementation.

    const addTask = () => {
        const title = prompt("Inserisci titolo task:");
        const hours = prompt("Stima ore (opzionale):", "0");
        if (title) {
            setKanbanTasks([...kanbanTasks, {
                id: Date.now(),
                title,
                status: 'todo',
                assignee: 'Team',
                estimated: Number(hours) || 0,
                remaining: Number(hours) || 0
            }]);
        }
    };

    const [newEvent, setNewEvent] = useState('');

    const addCalendarEvent = (e) => {
        e.preventDefault();
        if (!newEvent.trim()) return;
        setCalendarEvents([...calendarEvents, {
            id: Date.now(),
            title: newEvent,
            date: 'TBD',
            type: 'once'
        }]);
        setNewEvent('');
    };

    const removeEvent = (id) => setCalendarEvents(calendarEvents.filter(e => e.id !== id));

    const handleRetroChange = (type, index, value) => {
        const newItems = { ...retroItems };
        newItems[type][index] = value;
        setRetroItems(newItems);
    };

    const handleMoodVote = (mood) => {
        setKpiData(prev => ({
            ...prev,
            moods: { ...prev.moods, [mood]: (prev.moods[mood] || 0) + 1 }
        }));
    };

    // Derived Planning Data
    const totalEstimatedHours = kanbanTasks.reduce((acc, t) => acc + (Number(t.estimated) || 0), 0);
    const totalCapacity = capacity.total || 0;
    const isOverCapacity = totalEstimatedHours > totalCapacity;

    if (!activeSprint) return null;


    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                            <Target size={16} className="text-green-400" />
                        </div>
                        <span className="text-sm font-medium text-green-400">Fase 9 di 9 - Sprint Dashboard</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Sprint & Standup</h1>
                    <p className="text-zinc-400 mt-2">Gestisci il lavoro quotidiano, traccia i progressi e collabora con il team.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <Database size={14} className="text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Auto-Sync Attivo</span>
                </div>
            </div>

            {/* Sprint Selector */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
                {(project.sprints || []).map(sprint => (
                    <button
                        key={sprint.id}
                        onClick={() => setActiveSprintId(sprint.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all whitespace-nowrap ${activeSprintId === sprint.id
                            ? 'bg-zinc-800 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                            }`}
                    >
                        <span className="font-bold">{sprint.title || `Sprint ${sprint.id}`}</span>
                        {sprint.status === 'completed' && <Lock size={14} className="text-zinc-500" />}
                        {sprint.status === 'active' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />}
                    </button>
                ))}
                <button
                    onClick={handleCreateSprint}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all whitespace-nowrap"
                >
                    <Plus size={16} /> Nuovo Sprint
                </button>
            </div>

            {/* Phase Tabs */}
            <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl w-fit">
                {[
                    { id: 'planning', label: '📅 Pianificazione' },
                    { id: 'daily', label: '⏱️ Daily Standup' },
                    { id: 'kpis', label: '📊 KPI & Mood' },
                    { id: 'review', label: '✅ Sprint Review' },
                    { id: 'retro', label: '🔄 Retrospettiva' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="glass-panel p-6 min-h-[600px]">
                {/* PLANNING TAB */}
                {activeTab === 'planning' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                        {/* Capacity Planning */}
                        <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/50">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Users className="text-indigo-400" size={20} /> Capacità del Team
                                </h3>
                                <div className="text-right">
                                    <p className="text-xs text-zinc-400">Totale Ore Disponibili</p>
                                    <p className="text-2xl font-mono font-bold text-indigo-400">{capacity.total}h</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                {(capacity.members || []).map((member, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <input
                                            placeholder="Nome Membro"
                                            className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-2 text-sm text-zinc-200 flex-1"
                                            value={member.name}
                                            onChange={(e) => updateMemberCapacity(idx, 'name', e.target.value)}
                                            disabled={activeSprint.status === 'completed'}
                                        />
                                        <div className="flex items-center gap-2 w-24">
                                            <input
                                                type="number"
                                                placeholder="Ore"
                                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2 text-sm text-center text-zinc-200"
                                                value={member.hours}
                                                onChange={(e) => updateMemberCapacity(idx, 'hours', Number(e.target.value))}
                                                disabled={activeSprint.status === 'completed'}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2 w-24">
                                            <input
                                                type="number"
                                                placeholder="Focus %"
                                                className="w-full bg-zinc-900/50 border border-zinc-700 rounded-lg p-2 text-sm text-center text-zinc-200"
                                                value={member.focus}
                                                onChange={(e) => updateMemberCapacity(idx, 'focus', Number(e.target.value))}
                                                disabled={activeSprint.status === 'completed'}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {activeSprint.status !== 'completed' && (
                                    <button onClick={addMemberRow} className="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                                        <Plus size={14} /> Aggiungi Membro
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Task Estimation Check */}
                        <div className="space-y-6">
                            <div className={`p-6 rounded-2xl border ${isOverCapacity ? 'bg-red-500/10 border-red-500/30' : 'bg-green-500/10 border-green-500/30'}`}>
                                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                                    {isOverCapacity ? <AlertTriangle className="text-red-400" /> : <CheckCircle className="text-green-400" />}
                                    Verifica Pianificazione
                                </h3>
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-sm text-zinc-400">Ore Stimate (Tasks)</p>
                                        <p className={`text-2xl font-bold ${isOverCapacity ? 'text-red-400' : 'text-green-400'}`}>{totalEstimatedHours}h</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-zinc-400">Vs Capacità</p>
                                        <p className="text-lg font-medium text-zinc-300">{capacity.total}h</p>
                                    </div>
                                </div>
                                <div className="h-4 bg-zinc-900 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${isOverCapacity ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min((totalEstimatedHours / (capacity.total || 1)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="bg-zinc-800/30 p-6 rounded-2xl border border-zinc-700/50">
                                <h3 className="text-lg font-bold text-white mb-4">Gestione Rapida</h3>
                                <button
                                    onClick={() => setActiveTab('daily')}
                                    className="w-full py-3 bg-zinc-700 hover:bg-zinc-600 rounded-xl text-white font-medium flex items-center justify-center gap-2"
                                >
                                    <BookOpen size={18} /> Aggiungi Task in Board
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* DAILY STANDUP TAB */}
                {activeTab === 'daily' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                        {/* Left Column: Timer & Calendar */}
                        <div className="space-y-6">
                            {/* Timer Card */}
                            <div className="bg-zinc-800/30 p-5 rounded-xl text-center border border-zinc-700/50">
                                <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-4">Standup Timer</h3>
                                <div className="text-5xl font-mono font-bold text-white mb-4 tracking-wider">
                                    {formatTime(timer)}
                                </div>
                                <div className="flex justify-center gap-3">
                                    <button
                                        onClick={() => setIsRunning(!isRunning)}
                                        className={`p-3 rounded-lg transition-all ${isRunning ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}
                                    >
                                        {isRunning ? <Pause size={24} /> : <Play size={24} />}
                                    </button>
                                    <button onClick={() => { setIsRunning(false); setTimer(900); }} className="p-3 rounded-lg bg-zinc-700/50 text-zinc-300">
                                        <RotateCcw size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Calendar Section */}
                            <div className="bg-zinc-800/30 p-5 rounded-xl border border-zinc-700/50 flex-1">
                                <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Calendar size={16} /> Calendario Sprint
                                </h3>
                                <form onSubmit={addCalendarEvent} className="flex gap-2 mb-4">
                                    <input
                                        type="text"
                                        value={newEvent}
                                        onChange={(e) => setNewEvent(e.target.value)}
                                        placeholder="Aggiungi evento..."
                                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                    <button type="submit" className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30">
                                        <Plus size={18} />
                                    </button>
                                </form>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                                    {calendarEvents.map(event => (
                                        <div key={event.id} className="flex items-center justify-between p-2 bg-zinc-900/50 rounded-lg border border-zinc-800/50">
                                            <div>
                                                <p className="text-sm font-medium text-zinc-200">{event.title}</p>
                                                <p className="text-xs text-zinc-500">{event.date}</p>
                                            </div>
                                            <button onClick={() => removeEvent(event.id)} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                                        </div>
                                    ))}
                                    {calendarEvents.length === 0 && <p className="text-xs text-zinc-600 text-center py-2">Nessun evento</p>}
                                </div>
                            </div>

                            {/* Notes Section */}
                            <div className="bg-zinc-800/30 p-5 rounded-xl border border-zinc-700/50">
                                <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-2">Note del Giorno</h3>
                                <textarea
                                    value={sprintNotes}
                                    onChange={(e) => setSprintNotes(e.target.value)}
                                    className="w-full h-32 bg-zinc-900/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-300 focus:ring-1 focus:ring-indigo-500 resize-none outline-none"
                                    placeholder="Annotazioni veloci, impediment..."
                                />
                            </div>
                        </div>

                        {/* Right Column: Kanban */}
                        <div className="lg:col-span-2 bg-zinc-800/10 rounded-2xl p-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                                <KanbanColumn
                                    title="Da Fare"
                                    status="todo"
                                    tasks={kanbanTasks.filter(t => t.status === 'todo')}
                                    onMove={activeSprint.status === 'completed' ? () => { } : moveTask}
                                    onAdd={activeSprint.status === 'completed' ? null : addTask}
                                    color="border-l-4 border-l-zinc-500 text-zinc-300"
                                />
                                <KanbanColumn
                                    title="In Corso"
                                    status="doing"
                                    tasks={kanbanTasks.filter(t => t.status === 'doing')}
                                    onMove={activeSprint.status === 'completed' ? () => { } : moveTask}
                                    color="border-l-4 border-l-blue-500 text-blue-400"
                                />
                                <KanbanColumn
                                    title="Fatto"
                                    status="done"
                                    tasks={kanbanTasks.filter(t => t.status === 'done')}
                                    onMove={activeSprint.status === 'completed' ? () => { } : moveTask}
                                    color="border-l-4 border-l-green-500 text-green-400"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'kpis' && (
                    <div className="space-y-8">
                        {/* KPI Content Unchanged */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <KpiCard title="Velocity (Story Points)" value={kpiData.velocity} change={6} icon={Zap} color="#22c55e" />
                            <KpiCard title="Capacity Utilizzata" value={`${kpiData.capacity}%`} change={3} icon={Users} color="#6366f1" />
                            <KpiCard title="Performance" value={`${kpiData.performance}%`} change={4} icon={Activity} color="#f59e0b" />
                            <KpiCard title="Sprint Corrente" value="Sprint 3" change={0} icon={Calendar} color="#8b5cf6" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <GaugeChart value={kpiData.capacity} max={100} label="Capacity del Team" color="#6366f1" icon={Users} />
                            </div>
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <GaugeChart value={kpiData.performance} max={100} label="Performance Sprint" color="#22c55e" icon={Activity} />
                            </div>
                        </div>
                        <div className="bg-zinc-800/30 p-6 rounded-2xl">
                            <MoodMeter moods={kpiData.moods} onVote={handleMoodVote} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <BurnChart data={kpiData.burndownData} type="burndown" totalPoints={40} />
                            </div>
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <BurnChart data={kpiData.burnupData} type="burnup" totalPoints={40} />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'review' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="text-indigo-400" /> Checklist Sprint review
                        </h3>
                        {/* Review Content Unchanged */}
                        <div className="space-y-3">
                            {[
                                'Dimostrare le User Story "Done" agli stakeholder',
                                'Raccogliere feedback dagli stakeholder e dagli utenti finali',
                                'Discutere eventuali cambiamenti al Product Backlog'
                            ].map((item, i) => (
                                <label key={i} className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors">
                                    <input type="checkbox" className="w-5 h-5 rounded border-zinc-600 bg-zinc-700 text-indigo-500 focus:ring-indigo-500" />
                                    <span className="text-zinc-200">{item}</span>
                                </label>
                            ))
                            }
                        </div>
                    </div>
                )}

                {activeTab === 'retro' && (
                    <div className="space-y-6">
                        {/* Retro Content Unchanged */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/20">
                                <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2"><Play size={18} /> Iniziare a Fare</h4>
                                <div className="space-y-2">
                                    {retroItems.start.map((val, i) => (
                                        <input
                                            key={i}
                                            value={val}
                                            onChange={(e) => handleRetroChange('start', i, e.target.value)}
                                            className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                            placeholder="..."
                                            disabled={activeSprint.status === 'completed'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/20">
                                <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2"><Pause size={18} /> Smettere di Fare</h4>
                                <div className="space-y-2">
                                    {retroItems.stop.map((val, i) => (
                                        <input
                                            key={i}
                                            value={val}
                                            onChange={(e) => handleRetroChange('stop', i, e.target.value)}
                                            className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                            placeholder="..."
                                            disabled={activeSprint.status === 'completed'}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20">
                                <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><RotateCcw size={18} /> Continuare a Fare</h4>
                                <div className="space-y-2">
                                    {retroItems.continue.map((val, i) => (
                                        <input
                                            key={i}
                                            value={val}
                                            onChange={(e) => handleRetroChange('continue', i, e.target.value)}
                                            className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                            placeholder="..."
                                            disabled={activeSprint.status === 'completed'}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Projects & Exports */}
            <div className="flex justify-center gap-4 pt-4">
                <button
                    onClick={handleSaveAndPersist}
                    disabled={!project.name || isSaving}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${saved
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25'
                        } ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
                >
                    {saved ? (
                        <div className="flex items-center gap-2"><CheckCircle size={24} /> <span>Dati Salvati!</span></div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {isSaving ? <Activity className="animate-spin" size={24} /> : <Save size={24} />}
                            <span>{isSaving ? 'Salvataggio...' : 'Salva Sprint e KPI'}</span>
                        </div>
                    )}
                </button>
                {project.name && <ExportButton />}
            </div>
            {/* Footer Info */}
            {project.name && (
                <div className="glass-panel p-6 mt-8 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">📄 Esporta la documentazione completa</h3>
                            <p className="text-zinc-400 text-sm">Hai completato tutte le fasi! Esporta il tuo progetto completo.</p>
                        </div>
                        <div className="ml-6"><ExportButton /></div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Sprint;
