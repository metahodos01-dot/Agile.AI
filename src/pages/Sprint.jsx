import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { generateAIResponseV2 } from '../services/aiService';
import ExportButton from '../components/common/ExportButton';
import {
    Play, CheckSquare, Pause, RotateCcw, Save, CheckCircle, Target, BookOpen,
    TrendingUp, TrendingDown, Smile, Meh, Frown, BarChart3, Activity, Users,
    Calendar, Zap, Database, Plus, X, Calculator, AlertTriangle, Lock, Sparkles, Clock, Layers, ArrowRight
} from 'lucide-react';
import BurndownChart from '../components/charts/BurndownChart';
import PhaseNavigation from '../components/common/PhaseNavigation';

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

const MoodMatrix = ({ moodGrid = {}, members = [], onVote, currentDay = 1 }) => {
    // Helper to get mood for a cell
    const getMood = (memberIndex, day) => moodGrid[`${memberIndex}_${day}`];

    // Cycle mood: null -> happy -> neutral -> sad -> null
    const cycleMood = (memberIndex, day) => {
        const current = getMood(memberIndex, day);
        let next = 'happy';
        if (current === 'happy') next = 'neutral';
        else if (current === 'neutral') next = 'sad';
        else if (current === 'sad') next = null;

        onVote(memberIndex, day, next);
    };

    const icons = { happy: Smile, neutral: Meh, sad: Frown };
    const colors = { happy: 'text-green-400', neutral: 'text-yellow-400', sad: 'text-red-400' };

    return (
        <div className="flex flex-col">
            <h3 className="text-zinc-400 text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2">
                <Smile size={16} /> Mood Matrix (10 Days)
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr>
                            <th className="p-2 text-xs text-zinc-500 font-medium border-b border-zinc-700">Team Member</th>
                            {[...Array(10)].map((_, i) => (
                                <th key={i} className={`p-2 text-xs text-center border-b border-zinc-700 ${i + 1 === currentDay ? 'text-indigo-400 font-bold bg-indigo-500/10' : 'text-zinc-600'}`}>
                                    G{i + 1}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, mIdx) => (
                            <tr key={mIdx} className="border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors">
                                <td className="p-2 text-xs text-zinc-300 font-medium truncate max-w-[100px]">{member.name || `Member ${mIdx + 1}`}</td>
                                {[...Array(10)].map((_, dIdx) => {
                                    const day = dIdx + 1;
                                    const mood = getMood(mIdx, day);
                                    const Icon = mood ? icons[mood] : Plus;

                                    return (
                                        <td key={dIdx} className="p-1 text-center">
                                            <button
                                                onClick={() => cycleMood(mIdx, day)}
                                                className={`p-1.5 rounded-md transition-all ${mood
                                                    ? 'bg-zinc-800 ' + colors[mood]
                                                    : 'text-zinc-700 hover:text-zinc-500 hover:bg-zinc-800'}`}
                                            >
                                                <Icon size={14} className={!mood ? "opacity-20" : ""} />
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                        {members.length === 0 && (
                            <tr>
                                <td colSpan="11" className="p-4 text-center text-xs text-zinc-500">
                                    Definisci i membri del team nel tab Planning per abilitare la matrice.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};



// Placeholder removed


const KanbanColumn = ({ title, status, tasks, onMove, onAdd, color, getStoryTitle }) => (
    <div className="flex flex-col h-full bg-zinc-900/30 rounded-xl border border-zinc-800/50">
        <div className={`p-4 border-b border-zinc-800/50 flex justify-between items-center ${color}`}>
            <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
            <span className="text-xs bg-zinc-800 px-2 py-1 rounded-full text-zinc-400">{tasks.length}</span>
        </div>
        <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px]">
            {tasks.map(task => (
                <div key={task.id} className="p-3 bg-zinc-800/80 rounded-lg border border-zinc-700/50 hover:border-indigo-500/50 transition-all group">
                    <div className="flex flex-col items-start mb-2">
                        {task.storyId && getStoryTitle && (
                            <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1 flex items-center gap-1 w-full">
                                <BookOpen size={10} />
                                <span className="truncate" title={getStoryTitle(task.storyId)}>
                                    {getStoryTitle(task.storyId) || 'Story Sconosciuta'}
                                </span>
                            </div>
                        )}
                        <span className="text-sm font-medium text-zinc-200 line-clamp-4 hover:line-clamp-none transition-all">{task.title}</span>
                        <button onClick={() => onMove(task.id, 'delete')} className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400"><X size={14} /></button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                        <div className="text-xs text-zinc-500 flex items-center gap-1"><Users size={12} /> {task.assignee || 'Team'}</div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-indigo-400 font-bold">{task.estimated || 0}h</span>
                            <div className="flex gap-1">
                                {status !== 'todo' && <button onClick={() => onMove(task.id, 'prev')} className="p-1 hover:bg-zinc-700 rounded"><RotateCcw size={12} /></button>}
                                {status !== 'done' && <button onClick={() => onMove(task.id, 'next')} className="p-1 hover:bg-zinc-700 rounded"><Play size={12} /></button>}
                            </div>
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
                <span className="text-white font-bold text-lg">{value ? value.toFixed(0) : 0}%</span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">{label}</p>
        </div>
    );
};

// Countdown Component
const SprintCountdown = ({ endDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(endDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                g: Math.floor(difference / (1000 * 60 * 60 * 24)),
                h: Math.floor((difference / (1000 * 60 * 60)) % 24),
                m: Math.floor((difference / 1000 / 60) % 60),
                s: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = null; // Expired
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (!timeLeft) {
        return <span className="text-red-400 font-bold">Sprint Terminato</span>;
    }

    return (
        <div className="flex items-center gap-1 font-mono text-sm">
            <span className="bg-zinc-800 px-1 rounded">{timeLeft.g}g</span>:
            <span className="bg-zinc-800 px-1 rounded">{timeLeft.h}h</span>:
            <span className="bg-zinc-800 px-1 rounded">{timeLeft.m}m</span>:
            <span className="bg-zinc-800 px-1 rounded">{timeLeft.s}s</span>
        </div>
    );
};

// --- Main Component ---
const Sprint = () => {
    const { project, updateSprint, addSprint, saveProject } = useProject();
    // const navigate = useNavigate();

    // Tab State
    const [activeTab, setActiveTab] = useState('planning'); // Default to planning logic
    const [activeSprintId, setActiveSprintId] = useState(1);
    const [saved, setSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

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
            console.log("Sprint Effect Sync. ActiveSprint ID:", activeSprint.id, "Tasks:", activeSprint.kanban?.length);
            setKanbanTasks(activeSprint.kanban || []);
            setCalendarEvents(activeSprint.calendar || []);
            setSprintNotes(activeSprint.notes || '');
            setKpiData(activeSprint.kpis || {
                velocity: 0, capacity: 0, performance: 0,
                moods: {}, moodGrid: {}, burndownData: [], burnupData: [],
                alerts: []
            });
            setRetroItems({
                start: activeSprint.start || ['', ''],
                stop: activeSprint.stop || ['', ''],
                continue: activeSprint.continue || ['', '']
            });

            // --- INSIGHT ENGINE (Strategic Alert System) ---
            const checkForAlerts = (currentKpis, currentTasks) => {
                const alerts = [];

                // 1. Burndown Stall Check
                const bd = currentKpis.burndownData || [];
                if (bd.length >= 2) {
                    const last = bd[bd.length - 1];
                    const prev = bd[bd.length - 2];
                    if (last.real === prev.real && last.ideal < prev.ideal && last.real > 0) {
                        alerts.push({
                            id: 'stall',
                            type: 'warning',
                            title: 'Stallo Execution',
                            desc: 'Burndown piatta da 24h. Blocco tecnico o stima errata?',
                            suggestion: 'Analizzare ticket "Doing" bloccati.'
                        });
                    }
                }

                // 2. Mood Check (Low Morale)
                const moods = Object.values(currentKpis.moodGrid || {});
                const sadCount = moods.filter(m => m === 'sad').length;
                if (moods.length > 0 && (sadCount / moods.length) > 0.3) {
                    alerts.push({
                        id: 'mood',
                        type: 'danger',
                        title: 'Calo Morale',
                        desc: '> 30% di feedback negativi. Rischio burnout?',
                        suggestion: 'Discutere carico di lavoro.'
                    });
                }

                // 3. Velocity/Performance Risk
                // Simple check: if day > 7 and performance < 50%
                if (activeSprint.status === 'active' && activeSprint.startDate) {
                    const start = new Date(activeSprint.startDate);
                    const now = new Date();
                    const dayDiff = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
                    if (dayDiff > 7 && (currentKpis.performance || 0) < 50) {
                        alerts.push({
                            id: 'risk',
                            type: 'danger',
                            title: 'Rischio Delivery',
                            desc: 'Siamo al giorno ' + dayDiff + ' con performance < 50%.',
                            suggestion: 'Rimuovere scope non essenziale (Descoping).'
                        });
                    }
                }

                return alerts;
            };

            // Run check immediately on load (without causing loop loops - only set if diff)
            // Ideally we run this when data changes. For now we initialize default.

            // --- CAPACITY INIT ---
            // If sprint has saved capacity, use it.
            // If NOT, we try to initialize from roadmap defaults if available, or just empty.
            if (activeSprint.capacity && activeSprint.capacity.members?.length > 0) {
                setCapacity(activeSprint.capacity);
            } else {
                // Try to init from Roadmap Defaults
                const roadmap = project.roadmap || {};
                const defaultHours = roadmap.hoursPerDay || 6;
                const defaultRoles = ['Frontend Dev', 'Backend Dev', 'QA Specialist'];
                const members = [];

                // If roadmap has devCount, create mock members
                const devCount = roadmap.devCount || 2;
                for (let i = 0; i < devCount; i++) {
                    members.push({ name: `Dev ${i + 1}`, hours: defaultHours, days: 10, total: defaultHours * 10 });
                }

                const total = members.reduce((sum, m) => sum + m.total, 0);
                setCapacity({ members, total });
            }

            // Set tab based on status
            if (activeSprint.status === 'completed') setActiveTab('retro');
        }
    }, [activeSprintId, project.sprints, project.roadmap]); // Re-run when ID or project data updates

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

    // --- Derived Planning Data (Moved Up for Initialization) ---
    // Calculate estimated hours only for tasks IN THE SPRINT (todo/doing/done), not backlog
    const sprintTasks = kanbanTasks.filter(t => t.status !== 'backlog');
    const totalEstimatedHours = sprintTasks.reduce((acc, t) => acc + (Number(t.estimated) || 0), 0);
    const totalCapacity = capacity.total || 0;
    const isOverCapacity = totalEstimatedHours > totalCapacity;

    // --- Helper Functions ---

    const generateInsights = (currentKpis) => {
        const alerts = [];

        // 1. Burndown Stall Check
        const bd = currentKpis.burndownData || [];
        if (bd.length >= 2) {
            const last = bd[bd.length - 1];
            const prev = bd[bd.length - 2];
            if (last.real === prev.real && last.ideal < prev.ideal && last.real > 0) {
                alerts.push({
                    id: 'stall',
                    type: 'warning',
                    title: 'Stallo Execution',
                    desc: 'Burndown piatta da 24h. Blocco tecnico o stima errata?',
                    suggestion: 'Analizzare ticket "Doing" bloccati.'
                });
            }
        }

        // 2. Mood Check (Low Morale)
        const moods = Object.values(currentKpis.moodGrid || {});
        const sadCount = moods.filter(m => m === 'sad').length;
        if (moods.length > 0 && (sadCount / moods.length) > 0.3) {
            alerts.push({
                id: 'mood',
                type: 'danger',
                title: 'Calo Morale',
                desc: '> 30% di feedback negativi. Rischio burnout?',
                suggestion: 'Discutere carico di lavoro.'
            });
        }

        // 3. Velocity/Performance Risk
        if (activeSprint.status === 'active' && activeSprint.startDate) {
            const start = new Date(activeSprint.startDate);
            const now = new Date();
            const dayDiff = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
            if (dayDiff > 7 && (currentKpis.performance || 0) < 50) {
                alerts.push({
                    id: 'risk',
                    type: 'danger',
                    title: 'Rischio Delivery',
                    desc: 'Siamo al giorno ' + dayDiff + ' con performance < 50%.',
                    suggestion: 'Considerare Descoping.'
                });
            }
        }
        return alerts;
    };

    const getStoryTitle = (storyId) => {
        if (!storyId) return null;
        for (const epic of (project.backlog || [])) {
            const found = epic.stories?.find(s => s.id === storyId);
            if (found) return found.title;
        }
        return null;
    };

    const handleStartSprint = async () => {
        if (!confirm("Sei sicuro di voler avviare ufficialmente lo Sprint? Il conteggio dei giorni inizierà da oggi.")) return;

        const duration = capacity.members?.[0]?.days || 10;
        const now = new Date().toISOString();
        const totalEstimated = kanbanTasks.filter(t => t.status !== 'backlog').reduce((sum, t) => sum + (Number(t.estimated) || 0), 0);

        // Initialize Burndown Data with Day 0
        const initialBurndown = [{
            day: 0,
            date: new Date(now).toLocaleDateString(),
            ideal: totalEstimated,
            real: totalEstimated
        }];

        // 1. Optimistic Update - Update context immediately
        const payload = {
            status: 'active',
            startDate: now,
            durationDays: duration,
            kpis: { ...kpiData, burndownData: initialBurndown }
        };

        // This updates the global ProjectContext, which triggers a re-render of this component
        handleSaveLocal(payload);

        // 2. Persist to DB in background
        setIsSaving(true);
        try {
            await saveProject();
            // setSaved(true); // Optional: show success checkmark
        } catch (error) {
            console.error("Failed to save sprint start", error);
            alert("Attenzione: Lo sprint è attivo localmente, ma il salvataggio su server è fallito. Riprova a salvare manualmente.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCompleteSprint = async () => {
        if (!confirm("Sei sicuro di voler terminare lo sprint? Assicurati di aver completato la Review e la Retrospettiva.")) return;
        const payload = {
            status: 'completed',
            endDate: new Date().toISOString()
        };
        handleSaveLocal(payload);

        setIsSaving(true);
        try {
            await saveProject();
        } catch (error) {
            alert("Errore salvataggio chiusura sprint.");
        } finally {
            setIsSaving(false);
        }
    };

    // Calculate Ideal Burn rate
    const totalEstimatedInitial = kpiData.burndownData?.[0]?.ideal || totalEstimatedHours; // Use snapshot or current
    const sprintDuration = activeSprint.durationDays || 10;
    const idealPerDay = totalEstimatedInitial / sprintDuration;

    // Helper to update daily snapshot (Call this when needed, e.g. on page load if new day, or manual trigger)
    const updateBurndownSnapshot = () => {
        if (activeSprint.status !== 'active' || !activeSprint.startDate) return;

        const start = new Date(activeSprint.startDate);
        const now = new Date();
        const diffTime = Math.abs(now - start);
        const dayDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        // Note: dayDiff might be 1 on the first day if we round up, let's normalize to 0-based index or 1-based day. 
        // Standard: Day 0 = Start. Day 1 = After 24h.

        // Simpler: Current Day based on calendar date difference
        const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // Check if we already have an entry for this dayIndex
        const existingData = kpiData.burndownData || [];
        const hasToday = existingData.some(d => d.day === dayIndex);

        if (!hasToday) {
            // Calculate remaining (Real)
            const currentRemaining = kanbanTasks.filter(t => t.status !== 'backlog').reduce((sum, t) => sum + (Number(t.remaining) || Number(t.estimated) || 0), 0);
            // Logic: Subtract DONE tasks? Or sum Remaining field? 
            // Implementing "Sum of Remaining work". If 'remaining' isn't tracked, use estimated for todo/doing and 0 for done.
            // Refined Real Calc:
            const realRemaining = kanbanTasks
                .filter(t => t.status !== 'backlog')
                .reduce((sum, t) => {
                    if (t.status === 'done') return sum + 0;
                    return sum + (Number(t.remaining) || Number(t.estimated) || 0); // Assuming remaining tracks work left.
                }, 0);

            const idealRemaining = Math.max(0, totalEstimatedInitial - (idealPerDay * dayIndex));

            const newEntry = {
                day: dayIndex,
                date: new Date().toLocaleDateString(),
                ideal: Number(idealRemaining.toFixed(1)),
                real: Number(realRemaining.toFixed(1))
            };

            const newData = [...existingData, newEntry].sort((a, b) => a.day - b.day);

            const newData = [...existingData, newEntry].sort((a, b) => a.day - b.day);

            setKpiData(prev => {
                const nextKpis = { ...prev, burndownData: newData };
                nextKpis.alerts = generateInsights(nextKpis);
                return nextKpis;
            });

            // We should auto-save this update to context/db
            const alerts = generateInsights({ ...kpiData, burndownData: newData });
            handleSaveLocal({ kpis: { ...kpiData, burndownData: newData, alerts } });
        }
    };

    // Check for daily snapshot on load/mount if active
    useEffect(() => {
        if (activeSprint.status === 'active') {
            updateBurndownSnapshot();
        }
    }, [activeSprint.id, activeSprint.status]); // Check on load


    const getDaysRemaining = () => {
        if (activeSprint.status !== 'active' || !activeSprint.startDate) return null;
        const start = new Date(activeSprint.startDate);
        const duration = activeSprint.durationDays || 10;
        const end = new Date(start);
        end.setDate(end.getDate() + duration);

        const now = new Date();
        const diffTime = end - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Clamp to 0 if negative
        return diffDays > 0 ? diffDays : 0;
    };


    // --- Handlers ---

    const handleCreateSprint = () => {
        const newSprint = addSprint({ status: 'planned' });
        setActiveSprintId(newSprint.id);
        setActiveTab('planning');
    };

    const handleSaveLocal = (overrides = {}) => {
        // Update context immediately with current state or overrides
        const payload = {
            id: activeSprintId,
            status: overrides.status || activeSprint.status || 'planned',
            startDate: overrides.startDate || activeSprint.startDate,
            durationDays: overrides.durationDays || activeSprint.durationDays,
            kanban: overrides.kanban || kanbanTasks,
            calendar: overrides.calendar || calendarEvents,
            notes: overrides.notes || sprintNotes,
            kpis: overrides.kpis || kpiData,
            start: overrides.start || retroItems.start,
            stop: overrides.stop || retroItems.stop,
            continue: overrides.continue || retroItems.continue,
            capacity: overrides.capacity || capacity
        };

        // UPSERT LOGIC: Check if sprint exists in context
        // If we are strictly on ID 1 (default) and it's missing, addSprint will handle it.
        const exists = project.sprints?.some(s => s.id === activeSprintId);

        if (exists) {
            updateSprint(activeSprintId, payload);
        } else {
            // New Sprint or Default Sprint 1 initialization
            // Note: addSprint assigns ID based on length + 1. 
            // If activeSprintId is 1, and we have 0 sprints, it becomes 1.
            addSprint(payload);
        }
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
            } else {
                throw new Error("Salvataggio fallito. Controlla la console.");
            }
        } catch (error) {
            console.error("Save failed", error);
            alert("Errore durante il salvataggio del progetto. Controlla la connessione e riprova.");
        } finally {
            setIsSaving(false);
        }
    };

    // --- Specific Tab Handlers ---

    // Planning: Capacity
    const updateMemberCapacity = (index, field, value) => {
        const newMembers = [...(capacity.members || [])];
        if (!newMembers[index]) newMembers[index] = { name: '', hours: 0, days: 10, total: 0 };

        newMembers[index][field] = value;
        // Recalc Member Total
        newMembers[index].total = Number(newMembers[index].hours || 0) * Number(newMembers[index].days || 0);

        // Recalc Sprint Total
        const total = newMembers.reduce((sum, m) => sum + m.total, 0);
        setCapacity({ members: newMembers, total });

        // Auto-save local capacity changes debounced preferably, but here we just update local state
        // handleSaveLocal(); // We can trigger this on blur or distinct save button
    };

    const addMemberRow = () => {
        const defaultHours = project.roadmap?.hoursPerDay || 6;
        setCapacity(prev => {
            const newMembers = [...(prev.members || []), { name: 'Nuovo Membro', hours: defaultHours, days: 10, total: defaultHours * 10 }];
            const total = newMembers.reduce((sum, m) => sum + m.total, 0);
            return { members: newMembers, total };
        });
    };

    const removeMemberRow = (index) => {
        setCapacity(prev => {
            const newMembers = [...prev.members];
            newMembers.splice(index, 1);
            const total = newMembers.reduce((sum, m) => sum + m.total, 0);
            return { members: newMembers, total };
        });
    };

    // Kanban & Others
    const moveTask = (taskId, direction) => {
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

    const handleMoodVote = (memberIndex, day, mood) => {
        setKpiData(prev => {
            const newGrid = { ...prev.moodGrid };
            if (mood === null) delete newGrid[`${memberIndex}_${day}`];
            else newGrid[`${memberIndex}_${day}`] = mood;

            // Recalculate simple counts for compatibility or summary
            const counts = Object.values(newGrid).reduce((acc, m) => {
                acc[m] = (acc[m] || 0) + 1;
                return acc;
            }, {});

            const newState = {
                ...prev,
                moodGrid: newGrid,
                moods: counts
            };

            // Live Insight Generation
            newState.alerts = generateInsights(newState);

            return newState;
        });
    };



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
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-zinc-400">Gestisci il lavoro quotidiano, traccia i progressi e collabora con il team.</p>
                        {activeSprint.status === 'active' && activeSprint.startDate && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">
                                <Clock size={14} className="animate-pulse" />
                                <span className="text-xs font-bold uppercase mr-1">SCADENZA:</span>
                                <SprintCountdown endDate={new Date(new Date(activeSprint.startDate).getTime() + (activeSprint.durationDays || 10) * 86400000)} />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                        <Database size={14} className="text-green-400" />
                        <span className="text-green-400 text-xs font-medium">Auto-Sync Attivo</span>
                    </div>
                    {activeSprint.status === 'planned' && (
                        <button
                            onClick={handleStartSprint}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg border border-indigo-500 shadow-lg shadow-indigo-500/20 transition-all"
                        >
                            <Play size={14} fill="currentColor" /> AVVIA SPRINT
                        </button>
                    )}
                    {activeSprint.status === 'active' && (
                        <button
                            onClick={handleCompleteSprint}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-red-400 text-xs font-bold rounded-lg border border-red-500/30 transition-all"
                        >
                            <CheckCircle size={14} /> TERMINA SPRINT
                        </button>
                    )}
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
                        {/* LEFT: Operational Backlog (Pool) */}
                        <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-700/50 flex flex-col h-[600px]">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Layers className="text-indigo-400" size={20} /> Backlog Operativo
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            const title = prompt("Nuovo Task Operativo:");
                                            const hours = prompt("Stima Ore:", "2");
                                            if (title) {
                                                const newTask = {
                                                    id: Date.now(),
                                                    title,
                                                    status: 'backlog',
                                                    assignee: 'Team',
                                                    estimated: Number(hours) || 0,
                                                    remaining: Number(hours) || 0
                                                };
                                                setKanbanTasks(prev => {
                                                    const updated = [...prev, newTask];
                                                    // Save immediately with the new list
                                                    handleSaveLocal({ kanban: updated });
                                                    return updated;
                                                });
                                            }
                                        }}
                                        className="p-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded-lg transition-colors"
                                        title="Aggiungi Manualmente"
                                    >
                                        <Plus size={16} />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (isGenerating) return;
                                            setIsGenerating(true);
                                            try {
                                                console.log("Starting AI Generation...");
                                                // Generate tasks from Stories
                                                const rawBacklog = project.backlog || [];
                                                console.log("Raw Backlog:", rawBacklog);

                                                const allStories = rawBacklog.flatMap(e => e.stories || []);
                                                console.log("All Stories Extracted:", allStories);

                                                if (allStories.length === 0) {
                                                    alert("Nessuna storia trovata nel backlog. Crea prima le user stories.");
                                                    return;
                                                }

                                                const prompt = { stories: allStories };
                                                console.log("Sending prompt to AI:", prompt);

                                                const generated = await generateAIResponseV2(prompt, 'sprint_planning');
                                                console.log("AI Response Received:", generated);

                                                if (Array.isArray(generated) && generated.length > 0) {
                                                    const newTasks = [...kanbanTasks, ...generated];
                                                    // Ensure uniqueness by ID
                                                    const uniqueTasks = Array.from(new Map(newTasks.map(item => [item.id, item])).values());
                                                    console.log("Setting Kanban Tasks (Refactored). Previous:", kanbanTasks.length, "New Total:", uniqueTasks.length);

                                                    // Save immediately (Global Source of Truth)
                                                    handleSaveLocal({ kanban: uniqueTasks });
                                                    // Update Local State (Immediate UI Feedback)
                                                    setKanbanTasks(uniqueTasks);

                                                    alert(`Generati ${generated.length} task con successo!`);
                                                } else {
                                                    console.warn("AI returned empty or invalid tasks. Result:", generated);
                                                    alert(`L'AI ha risposto ma non ha generato task. Controlla la console. Risultato: ${JSON.stringify(generated)}`);
                                                }
                                            } catch (err) {
                                                console.error("AI Gen Failed Exception:", err);
                                                alert("Errore CRITICO durante la generazione AI: " + err.message);
                                            } finally {
                                                setIsGenerating(false);
                                            }
                                        }}
                                        disabled={isGenerating}
                                        className={`text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1 transition-all ${isGenerating
                                            ? 'bg-indigo-500/10 border-indigo-500/10 text-indigo-400/50 cursor-wait'
                                            : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30'
                                            }`}
                                    >
                                        <Sparkles size={12} className={isGenerating ? "animate-spin" : ""} />
                                        {isGenerating ? 'Generazione...' : 'Genera Task AI'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                {kanbanTasks.filter(t => t.status === 'backlog').length === 0 && (
                                    <p className="text-zinc-500 text-sm text-center py-10">
                                        Nessun task nel backlog operativo.<br />Generali con l'AI o aggiungili manualmente.
                                    </p>
                                )}
                                {kanbanTasks.filter(t => t.status === 'backlog').map(task => (
                                    <div key={task.id} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 flex justify-between items-center group">
                                        <div className="flex-1">
                                            {task.storyId && (
                                                <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1 flex items-center gap-1">
                                                    <BookOpen size={10} />
                                                    <span className="truncate max-w-[200px]" title={getStoryTitle(task.storyId)}>
                                                        {getStoryTitle(task.storyId) || 'Story Sconosciuta'}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-sm text-zinc-200 font-medium whitespace-pre-wrap">{task.title}</p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-xs text-zinc-500">{task.assignee}</p>
                                                {task.estimated > 0 && (
                                                    <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                                                        {task.estimated}h
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Move to Todo
                                                setKanbanTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'todo' } : t));
                                            }}
                                            className="p-2 bg-green-500/10 text-green-400 rounded hover:bg-green-500/20"
                                            title="Sposta dopo nella Kanban"
                                        >
                                            <ArrowRight size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Sprint To Do & Capacity */}
                        <div className="flex flex-col h-[600px] space-y-4">
                            {/* Capacity Planning Widget */}
                            <div className="bg-zinc-800/30 p-4 rounded-xl border border-zinc-700/50">
                                <h3 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
                                    <span>Pianificazione Capacità</span>
                                    <span className={`text-xs px-2 py-1 rounded ${totalEstimatedHours > capacity.total ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                                        {totalEstimatedHours}h Utilizzate / {capacity.total}h Disponibili
                                    </span>
                                </h3>

                                <div className="space-y-2 max-h-[120px] overflow-y-auto mb-3 pr-1">
                                    {capacity.members?.map((member, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs">
                                            <input
                                                value={member.name}
                                                onChange={(e) => updateMemberCapacity(idx, 'name', e.target.value)}
                                                className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 flex-1 text-zinc-300"
                                                placeholder="Nome"
                                            />
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    value={member.hours}
                                                    onChange={(e) => updateMemberCapacity(idx, 'hours', Number(e.target.value))}
                                                    className="w-12 bg-zinc-900 border border-zinc-700 rounded px-1 py-1 text-center text-zinc-300"
                                                    title="Ore al giorno"
                                                />
                                                <span className="text-zinc-600">h/gg</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    value={member.days || 10}
                                                    onChange={(e) => updateMemberCapacity(idx, 'days', Number(e.target.value))}
                                                    className="w-12 bg-zinc-900 border border-zinc-700 rounded px-1 py-1 text-center text-zinc-300"
                                                    title="Giorni Sprint"
                                                />
                                                <span className="text-zinc-600">gg</span>
                                            </div>
                                            <span className="w-10 text-right font-mono font-bold text-indigo-400">{member.total}h</span>
                                            <button onClick={() => removeMemberRow(idx)} className="text-zinc-600 hover:text-red-400"><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={addMemberRow} className="w-full text-xs text-zinc-500 hover:text-zinc-300 border border-dashed border-zinc-700 rounded py-1">
                                    + Aggiungi Membro
                                </button>

                                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden mt-3">
                                    <div
                                        className={`h-full transition-all ${isOverCapacity ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${Math.min((totalEstimatedHours / (capacity.total || 1)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            {/* To Do List */}
                            <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase px-2 mb-1">Sprint Tasks (To Do)</h4>
                                {kanbanTasks.filter(t => t.status === 'todo').length === 0 && (
                                    <p className="text-zinc-500 text-sm text-center py-10">
                                        Trascina qui i task dal Backlog Operativo.
                                    </p>
                                )}
                                {kanbanTasks.filter(t => t.status === 'todo').map(task => (
                                    <div key={task.id} className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 flex justify-between items-center">
                                        <div className="flex-1">
                                            <p className="text-sm text-zinc-200 font-medium">{task.title}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded">{task.assignee}</span>
                                                <div className="flex items-center gap-1 text-xs text-indigo-400">
                                                    <Clock size={10} />
                                                    <input
                                                        type="number"
                                                        className="bg-transparent w-8 text-center border-b border-indigo-500/30 outline-none"
                                                        value={task.estimated}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            setKanbanTasks(prev => prev.map(t => t.id === task.id ? { ...t, estimated: val, remaining: val } : t));
                                                        }}
                                                    /> h
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                // Move back to Backlog
                                                setKanbanTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'backlog' } : t));
                                            }}
                                            className="p-1 text-zinc-500 hover:text-red-400"
                                            title="Rimuovi da Sprint"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
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
                                    getStoryTitle={getStoryTitle}
                                />
                                <KanbanColumn
                                    title="In Corso"
                                    status="doing"
                                    tasks={kanbanTasks.filter(t => t.status === 'doing')}
                                    onMove={activeSprint.status === 'completed' ? () => { } : moveTask}
                                    color="border-l-4 border-l-blue-500 text-blue-400"
                                    getStoryTitle={getStoryTitle}
                                />
                                <KanbanColumn
                                    title="Fatto"
                                    status="done"
                                    tasks={kanbanTasks.filter(t => t.status === 'done')}
                                    onMove={activeSprint.status === 'completed' ? () => { } : moveTask}
                                    color="border-l-4 border-l-green-500 text-green-400"
                                    getStoryTitle={getStoryTitle}
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
                            <MoodMatrix
                                moodGrid={kpiData.moodGrid}
                                members={capacity.members}
                                currentDay={getDaysRemaining() ? (activeSprint.durationDays - getDaysRemaining() + 1) : 1}
                                onVote={handleMoodVote}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/30 p-6 rounded-2xl col-span-2">
                                <BurndownChart
                                    data={kpiData.burndownData}
                                    idealHours={totalEstimatedInitial}
                                    totalDays={activeSprint.durationDays || 10}
                                />
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
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* LEFT SIDEBAR: Strategic Insights */}
                        <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-700/50">
                            <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2">
                                <Sparkles size={16} /> Strategic Insights
                            </h3>
                            <div className="space-y-3">
                                {(!kpiData.alerts || kpiData.alerts.length === 0) && (
                                    <p className="text-xs text-zinc-500 italic">Nessuna anomalia rilevata. Lo sprint è andato liscio!</p>
                                )}
                                {(kpiData.alerts || []).map((alert, idx) => (
                                    <div key={idx} className={`p-3 rounded-lg border flex flex-col gap-2 ${alert.type === 'danger' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle size={14} className={alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'} />
                                            <span className={`text-xs font-bold ${alert.type === 'danger' ? 'text-red-400' : 'text-amber-400'}`}>{alert.title}</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-300">{alert.desc}</p>
                                        <div className="pt-2 border-t border-zinc-700/30 flex justify-between gap-1">
                                            <button
                                                onClick={() => setRetroItems(prev => ({ ...prev, stop: [...prev.stop, alert.suggestion] }))}
                                                className="text-[9px] px-2 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 flex-1"
                                            >
                                                + Stop
                                            </button>
                                            <button
                                                onClick={() => setRetroItems(prev => ({ ...prev, start: [...prev.start, alert.suggestion] }))}
                                                className="text-[9px] px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30 flex-1"
                                            >
                                                + Start
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Retro Content */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/20">
                                    <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2"><Play size={18} /> Iniziare a Fare</h4>
                                    <div className="space-y-2">
                                        {retroItems.start.map((val, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    value={val}
                                                    onChange={(e) => handleRetroChange('start', i, e.target.value)}
                                                    className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                                    placeholder="..."
                                                    disabled={activeSprint.status === 'completed'}
                                                />
                                                <button onClick={() => {
                                                    const nav = [...retroItems.start];
                                                    nav.splice(i, 1);
                                                    setRetroItems({ ...retroItems, start: nav });
                                                }} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setRetroItems({ ...retroItems, start: [...retroItems.start, ''] })} className="text-xs text-green-500/50 hover:text-green-400">+ Aggiungi</button>
                                    </div>
                                </div>
                                <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/20">
                                    <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2"><Pause size={18} /> Smettere di Fare</h4>
                                    <div className="space-y-2">
                                        {retroItems.stop.map((val, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    value={val}
                                                    onChange={(e) => handleRetroChange('stop', i, e.target.value)}
                                                    className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                                    placeholder="..."
                                                    disabled={activeSprint.status === 'completed'}
                                                />
                                                <button onClick={() => {
                                                    const nav = [...retroItems.stop];
                                                    nav.splice(i, 1);
                                                    setRetroItems({ ...retroItems, stop: nav });
                                                }} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setRetroItems({ ...retroItems, stop: [...retroItems.stop, ''] })} className="text-xs text-red-500/50 hover:text-red-400">+ Aggiungi</button>
                                    </div>
                                </div>
                                <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20">
                                    <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><RotateCcw size={18} /> Continuare a Fare</h4>
                                    <div className="space-y-2">
                                        {retroItems.continue.map((val, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    value={val}
                                                    onChange={(e) => handleRetroChange('continue', i, e.target.value)}
                                                    className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                                    placeholder="..."
                                                    disabled={activeSprint.status === 'completed'}
                                                />
                                                <button onClick={() => {
                                                    const nav = [...retroItems.continue];
                                                    nav.splice(i, 1);
                                                    setRetroItems({ ...retroItems, continue: nav });
                                                }} className="text-zinc-600 hover:text-red-400"><X size={14} /></button>
                                            </div>
                                        ))}
                                        <button onClick={() => setRetroItems({ ...retroItems, continue: [...retroItems.continue, ''] })} className="text-xs text-blue-500/50 hover:text-blue-400">+ Aggiungi</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Projects & Exports */}
            <PhaseNavigation
                onSave={async () => {
                    await handleSaveAndPersist();
                    return false; // Don't auto-navigate on "Save (stay)" button, wait, PhaseNavigation logic handles the "Save (stay)" button purely as trigger?
                }}
                // Wait, PhaseNavigation "Save (stay)" button calls onSave(); navigate is NOT called.
                // "Save & Continue" button calls handleSaveAndContinue which calls onSave() then navigates.
                // So if I return true, Save&Continue navigates. If I return false, it aborts?
                // PhaseNavigation code: if (success === false) return;
                // So I should return true for navigation to happen on "Save & Continue".
                // But for "Save (stay)", the navigation logic is skipped inside PhaseNavigation?
                // No, PhaseNavigation "Save (stay)" button just calls onClick={onSave}. It does NOT call handleSaveAndContinue.
                // So onSave return value matters only for handleSaveAndContinue.
                // Perfect.
                isSaving={isSaving}
            >
                {project.name && <ExportButton project={project} />}
            </PhaseNavigation>
            {/* Auto-save Indicator */}
            <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800 shadow-lg">
                <div className={`w-2 h-2 rounded-full ${saved ? 'bg-green-500' : 'bg-zinc-600'}`} />
                <span className="text-xs text-zinc-500">{saved ? 'Salvato' : 'Modifiche non salvate'}</span>
            </div>
        </div>
    );
};

export default Sprint;
