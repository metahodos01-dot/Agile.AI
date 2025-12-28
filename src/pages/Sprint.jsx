import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import ExportButton from '../components/common/ExportButton';
import {
    Play, CheckSquare, Pause, RotateCcw, Save, CheckCircle, Target, BookOpen,
    TrendingUp, TrendingDown, Smile, Meh, Frown, BarChart3, Activity, Users,
    Calendar, Zap, Database, Plus, X
} from 'lucide-react';

// Gauge Component (Windshield Wiper Style)
const GaugeChart = ({ value, max, label, color, icon: Icon }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const angle = (percentage / 100) * 180 - 90; // -90 to 90 degrees

    return (
        <div className="text-center">
            <div className="relative w-40 h-24 mx-auto overflow-hidden">
                {/* Background arc */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60">
                    <path
                        d="M 10 55 A 40 40 0 0 1 90 55"
                        fill="none"
                        stroke="#27272a"
                        strokeWidth="8"
                        strokeLinecap="round"
                    />
                    {/* Colored arc based on percentage */}
                    <path
                        d="M 10 55 A 40 40 0 0 1 90 55"
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${percentage * 1.26} 126`}
                    />
                    {/* Needle */}
                    <g transform={`rotate(${angle}, 50, 55)`}>
                        <line x1="50" y1="55" x2="50" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <circle cx="50" cy="55" r="4" fill="white" />
                    </g>
                </svg>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
                <Icon size={16} className={`text-${color.replace('#', '')}`} style={{ color }} />
                <span className="text-white font-bold text-lg">{value}%</span>
            </div>
            <p className="text-zinc-500 text-xs mt-1">{label}</p>
        </div>
    );
};

// Mood Meter Component
const MoodMeter = ({ moods, onVote }) => {
    const moodOptions = [
        { emoji: '😊', label: 'Ottimo', value: 'great', color: '#22c55e' },
        { emoji: '🙂', label: 'Buono', value: 'good', color: '#84cc16' },
        { emoji: '😐', label: 'Neutro', value: 'neutral', color: '#eab308' },
        { emoji: '😕', label: 'Difficile', value: 'difficult', color: '#f97316' },
        { emoji: '😫', label: 'Critico', value: 'critical', color: '#ef4444' }
    ];

    const totalVotes = Object.values(moods).reduce((a, b) => a + b, 0) || 1;

    return (
        <div className="space-y-4">
            <h4 className="text-white font-semibold flex items-center gap-2">
                <Smile size={18} className="text-amber-400" /> Mood del Team
            </h4>
            <div className="flex justify-between gap-2">
                {moodOptions.map(mood => (
                    <button
                        key={mood.value}
                        onClick={() => onVote(mood.value)}
                        className="flex-1 text-center p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-all group"
                    >
                        <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">{mood.emoji}</div>
                        <div className="text-xs text-zinc-500">{mood.label}</div>
                        <div className="mt-2 h-1 bg-zinc-700 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{
                                    width: `${((moods[mood.value] || 0) / totalVotes) * 100}%`,
                                    backgroundColor: mood.color
                                }}
                            />
                        </div>
                        <div className="text-xs text-zinc-400 mt-1">{moods[mood.value] || 0}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Burndown/Burnup Chart Component
const BurnChart = ({ data, type, totalPoints }) => {
    const maxValue = Math.max(totalPoints, ...data.map(d => d.actual || 0));
    const chartHeight = 150;
    const chartWidth = 280;

    // Generate ideal line points
    const idealLine = data.map((_, i) => ({
        x: (i / (data.length - 1)) * chartWidth,
        y: type === 'burndown'
            ? (i / (data.length - 1)) * chartHeight
            : chartHeight - (i / (data.length - 1)) * chartHeight
    }));

    // Generate actual line points
    const actualLine = data.map((d, i) => ({
        x: (i / (data.length - 1)) * chartWidth,
        y: chartHeight - ((d.actual || 0) / maxValue) * chartHeight
    }));

    const idealPath = idealLine.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const actualPath = actualLine.filter(p => !isNaN(p.y)).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div>
            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                {type === 'burndown' ? <TrendingDown size={18} className="text-red-400" /> : <TrendingUp size={18} className="text-green-400" />}
                {type === 'burndown' ? 'Burndown Chart' : 'Burnup Chart'}
            </h4>
            <div className="bg-zinc-900/50 p-4 rounded-xl">
                <svg width={chartWidth} height={chartHeight} className="mx-auto">
                    {/* Grid lines */}
                    {[0, 25, 50, 75, 100].map(pct => (
                        <line
                            key={pct}
                            x1="0" y1={chartHeight - (pct / 100) * chartHeight}
                            x2={chartWidth} y2={chartHeight - (pct / 100) * chartHeight}
                            stroke="#3f3f46" strokeDasharray="4"
                        />
                    ))}
                    {/* Ideal line */}
                    <path d={idealPath} fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="6" opacity="0.5" />
                    {/* Actual line */}
                    <path d={actualPath} fill="none" stroke={type === 'burndown' ? '#ef4444' : '#22c55e'} strokeWidth="3" strokeLinecap="round" />
                    {/* Data points */}
                    {actualLine.filter(p => !isNaN(p.y)).map((p, i) => (
                        <circle key={i} cx={p.x} cy={p.y} r="4" fill={type === 'burndown' ? '#ef4444' : '#22c55e'} />
                    ))}
                </svg>
                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                    {data.map((d, i) => (
                        <span key={i}>{d.day}</span>
                    ))}
                </div>
                <div className="flex justify-center gap-6 mt-4 text-xs">
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-0.5 bg-indigo-500 opacity-50" style={{ borderTop: '2px dashed' }}></span>
                        Ideale
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-4 h-0.5 rounded" style={{ backgroundColor: type === 'burndown' ? '#ef4444' : '#22c55e' }}></span>
                        Attuale
                    </span>
                </div>
            </div>
        </div>
    );
};

// Historical KPI Card
const KpiCard = ({ title, value, change, icon: Icon, color }) => {
    const isPositive = change >= 0;
    return (
        <div className="bg-zinc-800/30 p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2">
                <Icon size={20} style={{ color }} />
                <span className={`text-xs flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(change)}%
                </span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-xs text-zinc-500">{title}</p>
        </div>
    );
};

// Kanban Column Component
const KanbanColumn = ({ title, status, tasks, onMove, onAdd, color }) => (
    <div className="flex flex-col h-full bg-zinc-900/50 rounded-xl p-4 border border-zinc-800/50 min-h-[400px]">
        <div className={`flex items-center justify-between mb-4 pb-3 border-b border-zinc-800 ${color}`}>
            <h4 className="font-bold">{title}</h4>
            <span className="bg-zinc-800 text-xs px-2 py-0.5 rounded-full text-zinc-400">{tasks.length}</span>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
            {tasks.map(task => (
                <div key={task.id} className="bg-zinc-800 p-3 rounded-lg border border-zinc-700 hover:border-indigo-500/50 transition-all group relative">
                    <p className="text-sm text-zinc-200 mb-1">{task.title}</p>
                    {task.assignee && (
                        <div className="flex items-center gap-1.5 mt-2">
                            <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold">
                                {task.assignee.charAt(0)}
                            </div>
                            <span className="text-xs text-zinc-500">{task.assignee}</span>
                        </div>
                    )}

                    {/* Move Actions */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity bg-zinc-900/90 rounded-md p-0.5">
                        {status !== 'todo' && (
                            <button onClick={() => onMove(task.id, 'prev')} className="p-1 hover:text-white text-zinc-400" title="Sposta indietro">
                                <TrendingDown className="rotate-90" size={14} />
                            </button>
                        )}
                        {status !== 'done' && (
                            <button onClick={() => onMove(task.id, 'next')} className="p-1 hover:text-white text-zinc-400" title="Sposta avanti">
                                <TrendingUp className="rotate-90" size={14} />
                            </button>
                        )}
                        <button onClick={() => onMove(task.id, 'delete')} className="p-1 hover:text-red-400 text-zinc-400" title="Elimina">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            ))}
            {tasks.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-600 text-xs">
                    Nessun task
                </div>
            )}
        </div>
        {status === 'todo' && (
            <button
                onClick={onAdd}
                className="mt-3 w-full py-2 border border-dashed border-zinc-700 text-zinc-500 hover:text-white hover:border-zinc-500 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
            >
                <Plus size={14} /> Aggiungi Task
            </button>
        )}
    </div>
);

const Sprint = () => {
    const { project, updateProject, saveProject } = useProject();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('kpis');
    const [saved, setSaved] = useState(false);

    // Initial State Loading
    const [sprintData, setSprintData] = useState(() => project.sprint?.kpis || {
        capacity: 75,
        performance: 82,
        velocity: 34,
        moods: { great: 3, good: 5, neutral: 2, difficult: 1, critical: 0 },
        burndownData: [
            { day: 'Lun', actual: 40 }, { day: 'Mar', actual: 35 }, { day: 'Mer', actual: 28 },
            { day: 'Gio', actual: 22 }, { day: 'Ven', actual: 15 }, { day: 'Lun', actual: 10 },
            { day: 'Mar', actual: 5 }, { day: 'Mer', actual: null }, { day: 'Gio', actual: null }, { day: 'Ven', actual: null }
        ],
        burnupData: [
            { day: 'Lun', actual: 0 }, { day: 'Mar', actual: 5 }, { day: 'Mer', actual: 12 },
            { day: 'Gio', actual: 18 }, { day: 'Ven', actual: 25 }, { day: 'Lun', actual: 30 },
            { day: 'Mar', actual: 35 }, { day: 'Mer', actual: null }, { day: 'Gio', actual: null }, { day: 'Ven', actual: null }
        ],
        historicalKpis: [
            { sprint: 'Sprint 1', velocity: 28, capacity: 70, performance: 75 },
            { sprint: 'Sprint 2', velocity: 32, capacity: 72, performance: 78 },
            { sprint: 'Sprint 3', velocity: 34, capacity: 75, performance: 82 }
        ]
    });

    // Kanban State
    const [kanbanTasks, setKanbanTasks] = useState(() => project.sprint?.kanban || [
        { id: 1, title: 'Analisi requisiti user story #1', status: 'todo', assignee: 'Marco' },
        { id: 2, title: 'Setup ambiente di sviluppo', status: 'doing', assignee: 'Laura' },
        { id: 3, title: 'Design database schema', status: 'done', assignee: 'Giulia' }
    ]);

    // Calendar State
    const [calendarEvents, setCalendarEvents] = useState(() => project.sprint?.calendar || [
        { id: 1, title: 'Daily Standup', date: '09:30', type: 'recurring' },
        { id: 2, title: 'Sprint Review', date: 'Ven 15:00', type: 'once' }
    ]);
    const [newEvent, setNewEvent] = useState('');

    // Notes State
    const [sprintNotes, setSprintNotes] = useState(() => project.sprint?.notes || '');

    // Retro Board State
    const [retroItems, setRetroItems] = useState(() => ({
        start: project.sprint?.start || ['', ''],
        stop: project.sprint?.stop || ['', ''],
        continue: project.sprint?.continue || ['', '']
    }));

    // Daily Timer
    const [timer, setTimer] = useState(900);
    const [isRunning, setIsRunning] = useState(false);

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

    // Kanban Logic
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
        const title = prompt("Inserisci il titolo del task:");
        if (title) {
            setKanbanTasks([...kanbanTasks, {
                id: Date.now(),
                title,
                status: 'todo',
                assignee: 'Team'
            }]);
        }
    };

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
    }
    const removeEvent = (id) => setCalendarEvents(calendarEvents.filter(e => e.id !== id));

    const handleRetroChange = (type, index, value) => {
        const newItems = { ...retroItems };
        newItems[type][index] = value;
        setRetroItems(newItems);
    };

    const handleMoodVote = (mood) => {
        setSprintData(prev => ({
            ...prev,
            moods: { ...prev.moods, [mood]: (prev.moods[mood] || 0) + 1 }
        }));
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProject = async () => {
        setIsSaving(true);
        const sprintPayload = {
            ...retroItems,
            kpis: sprintData,
            kanban: kanbanTasks,
            calendar: calendarEvents,
            notes: sprintNotes
        };

        updateProject({ sprint: sprintPayload });

        try {
            const success = await saveProject({ ...project, sprint: sprintPayload });
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

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl w-fit">
                {[
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
                                    onMove={moveTask}
                                    onAdd={addTask}
                                    color="border-l-4 border-l-zinc-500 text-zinc-300"
                                />
                                <KanbanColumn
                                    title="In Corso"
                                    status="doing"
                                    tasks={kanbanTasks.filter(t => t.status === 'doing')}
                                    onMove={moveTask}
                                    color="border-l-4 border-l-blue-500 text-blue-400"
                                />
                                <KanbanColumn
                                    title="Fatto"
                                    status="done"
                                    tasks={kanbanTasks.filter(t => t.status === 'done')}
                                    onMove={moveTask}
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
                            <KpiCard title="Velocity (Story Points)" value={sprintData.velocity} change={6} icon={Zap} color="#22c55e" />
                            <KpiCard title="Capacity Utilizzata" value={`${sprintData.capacity}%`} change={3} icon={Users} color="#6366f1" />
                            <KpiCard title="Performance" value={`${sprintData.performance}%`} change={4} icon={Activity} color="#f59e0b" />
                            <KpiCard title="Sprint Corrente" value="Sprint 3" change={0} icon={Calendar} color="#8b5cf6" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <GaugeChart value={sprintData.capacity} max={100} label="Capacity del Team" color="#6366f1" icon={Users} />
                            </div>
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <GaugeChart value={sprintData.performance} max={100} label="Performance Sprint" color="#22c55e" icon={Activity} />
                            </div>
                        </div>
                        <div className="bg-zinc-800/30 p-6 rounded-2xl">
                            <MoodMeter moods={sprintData.moods} onVote={handleMoodVote} />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <BurnChart data={sprintData.burndownData} type="burndown" totalPoints={40} />
                            </div>
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <BurnChart data={sprintData.burnupData} type="burnup" totalPoints={40} />
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
                                        <input key={i} value={val} onChange={(e) => handleRetroChange('start', i, e.target.value)} className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm" placeholder="..." />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/20">
                                <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2"><Pause size={18} /> Smettere di Fare</h4>
                                <div className="space-y-2">
                                    {retroItems.stop.map((val, i) => (
                                        <input key={i} value={val} onChange={(e) => handleRetroChange('stop', i, e.target.value)} className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm" placeholder="..." />
                                    ))}
                                </div>
                            </div>
                            <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20">
                                <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2"><RotateCcw size={18} /> Continuare a Fare</h4>
                                <div className="space-y-2">
                                    {retroItems.continue.map((val, i) => (
                                        <input key={i} value={val} onChange={(e) => handleRetroChange('continue', i, e.target.value)} className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm" placeholder="..." />
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
                    onClick={handleSaveProject}
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
