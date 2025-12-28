import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import ExportButton from '../components/common/ExportButton';
import {
    Play, CheckSquare, Pause, RotateCcw, Save, CheckCircle, Target, BookOpen,
    TrendingUp, TrendingDown, Smile, Meh, Frown, BarChart3, Activity, Users,
    Calendar, Zap, Database
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

const Sprint = () => {
    const { project, updateProject, saveProject } = useProject();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('kpis');
    const [saved, setSaved] = useState(false);

    // Sprint Data State
    const [sprintData, setSprintData] = useState({
        capacity: 75,
        performance: 82,
        velocity: 34,
        moods: { great: 3, good: 5, neutral: 2, difficult: 1, critical: 0 },
        burndownData: [
            { day: 'Lun', actual: 40 },
            { day: 'Mar', actual: 35 },
            { day: 'Mer', actual: 28 },
            { day: 'Gio', actual: 22 },
            { day: 'Ven', actual: 15 },
            { day: 'Lun', actual: 10 },
            { day: 'Mar', actual: 5 },
            { day: 'Mer', actual: null },
            { day: 'Gio', actual: null },
            { day: 'Ven', actual: null }
        ],
        burnupData: [
            { day: 'Lun', actual: 0 },
            { day: 'Mar', actual: 5 },
            { day: 'Mer', actual: 12 },
            { day: 'Gio', actual: 18 },
            { day: 'Ven', actual: 25 },
            { day: 'Lun', actual: 30 },
            { day: 'Mar', actual: 35 },
            { day: 'Mer', actual: null },
            { day: 'Gio', actual: null },
            { day: 'Ven', actual: null }
        ],
        historicalKpis: [
            { sprint: 'Sprint 1', velocity: 28, capacity: 70, performance: 75 },
            { sprint: 'Sprint 2', velocity: 32, capacity: 72, performance: 78 },
            { sprint: 'Sprint 3', velocity: 34, capacity: 75, performance: 82 }
        ]
    });

    // Daily Standup Timer
    const [timer, setTimer] = useState(900);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning && timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timer]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    // Retro Board State
    const [retroItems, setRetroItems] = useState({
        start: ['', ''],
        stop: ['', ''],
        continue: ['', '']
    });

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
        // Optimize: Update local context first without waiting for server response
        // to prevent UI freezing, but await actual save for the success state
        updateProject({ sprint: { ...retroItems, kpis: sprintData } });

        try {
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
                    <h1 className="text-3xl font-bold text-white">Sprint e KPI</h1>
                    <p className="text-zinc-400 mt-2">Monitora le performance del team con metriche Scrum.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                    <Database size={14} className="text-green-400" />
                    <span className="text-green-400 text-xs font-medium">Dati Sincronizzati</span>
                </div>
            </div>

            {/* Educational Section */}
            <div className="glass-panel p-6 border-l-4 border-green-500">
                <div className="flex items-start gap-4">
                    <BookOpen size={24} className="text-green-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">KPI scrum</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                            I KPI scrum aiutano a misurare la salute del team: <strong>Velocity</strong> (punti completati per Sprint),
                            <strong>Capacity</strong> (% di disponibilità effettiva), <strong>Burndown</strong> (lavoro rimanente),
                            <strong>Burnup</strong> (lavoro completato), e <strong>Team Mood</strong> (benessere del team).
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4 mt-4">
                            <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm">
                                Nello <strong>Sprint Review</strong> della <strong>Moto Elettrica Future</strong>, il team non mostra slide, ma <strong>porta la moto in cortile</strong>
                                e fa provare la nuova mappatura "Sport" agli stakeholder.<br />
                                <strong>Feedback immediato:</strong> "L'accelerazione è troppo brusca". <br />
                                <strong>Azione per il prossimo sprint:</strong> "Ammorbidire curva di coppia".
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl w-fit">
                {[
                    { id: 'kpis', label: '📊 KPI Dashboard' },
                    { id: 'daily', label: '⏱️ Daily Standup' },
                    { id: 'review', label: '✅ Sprint review' },
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

            <div className="glass-panel p-8 min-h-[500px]">
                {activeTab === 'kpis' && (
                    <div className="space-y-8">
                        {/* Top KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <KpiCard title="Velocity (Story Points)" value={sprintData.velocity} change={6} icon={Zap} color="#22c55e" />
                            <KpiCard title="Capacity Utilizzata" value={`${sprintData.capacity}%`} change={3} icon={Users} color="#6366f1" />
                            <KpiCard title="Performance" value={`${sprintData.performance}%`} change={4} icon={Activity} color="#f59e0b" />
                            <KpiCard title="Sprint Corrente" value="Sprint 3" change={0} icon={Calendar} color="#8b5cf6" />
                        </div>

                        {/* Gauges */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <GaugeChart
                                    value={sprintData.capacity}
                                    max={100}
                                    label="Capacity del Team"
                                    color="#6366f1"
                                    icon={Users}
                                />
                            </div>
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <GaugeChart
                                    value={sprintData.performance}
                                    max={100}
                                    label="Performance Sprint"
                                    color="#22c55e"
                                    icon={Activity}
                                />
                            </div>
                        </div>

                        {/* Mood Meter */}
                        <div className="bg-zinc-800/30 p-6 rounded-2xl">
                            <MoodMeter moods={sprintData.moods} onVote={handleMoodVote} />
                        </div>

                        {/* Burn Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <BurnChart data={sprintData.burndownData} type="burndown" totalPoints={40} />
                            </div>
                            <div className="bg-zinc-800/30 p-6 rounded-2xl">
                                <BurnChart data={sprintData.burnupData} type="burnup" totalPoints={40} />
                            </div>
                        </div>

                        {/* Historical Data */}
                        <div className="bg-zinc-800/30 p-6 rounded-2xl">
                            <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <BarChart3 size={18} className="text-purple-400" /> Storico sprint (Business Intelligence)
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-zinc-700">
                                            <th className="text-left py-3 px-4 text-zinc-400">Sprint</th>
                                            <th className="text-center py-3 px-4 text-zinc-400">Velocity</th>
                                            <th className="text-center py-3 px-4 text-zinc-400">Capacity</th>
                                            <th className="text-center py-3 px-4 text-zinc-400">Performance</th>
                                            <th className="text-center py-3 px-4 text-zinc-400">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sprintData.historicalKpis.map((kpi, i) => (
                                            <tr key={i} className="border-b border-zinc-800">
                                                <td className="py-3 px-4 text-white font-medium">{kpi.sprint}</td>
                                                <td className="py-3 px-4 text-center text-zinc-300">{kpi.velocity} pts</td>
                                                <td className="py-3 px-4 text-center text-zinc-300">{kpi.capacity}%</td>
                                                <td className="py-3 px-4 text-center text-zinc-300">{kpi.performance}%</td>
                                                <td className="py-3 px-4 text-center">
                                                    {i > 0 && kpi.velocity > sprintData.historicalKpis[i - 1].velocity ? (
                                                        <TrendingUp size={16} className="text-green-400 mx-auto" />
                                                    ) : i > 0 ? (
                                                        <TrendingDown size={16} className="text-red-400 mx-auto" />
                                                    ) : (
                                                        <span className="text-zinc-600">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'daily' && (
                    <div className="flex flex-col items-center justify-center space-y-8 py-8">
                        <div className="text-7xl font-mono font-bold tracking-widest text-white">
                            {formatTime(timer)}
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className={`p-5 rounded-2xl transition-all ${isRunning
                                    ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                                    : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                    }`}
                            >
                                {isRunning ? <Pause size={36} /> : <Play size={36} />}
                            </button>
                            <button
                                onClick={() => { setIsRunning(false); setTimer(900); }}
                                className="p-5 rounded-2xl bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-all"
                            >
                                <RotateCcw size={36} />
                            </button>
                        </div>
                        <div className="text-center max-w-md">
                            <p className="text-zinc-300 italic mb-2">"Cosa ho fatto ieri? Cosa farò oggi? Ci sono blocchi?"</p>
                            <p className="text-xs uppercase tracking-wider font-bold text-zinc-600">Le 3 Domande del Daily Standup</p>
                        </div>
                    </div>
                )}

                {activeTab === 'review' && (
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <CheckSquare className="text-indigo-400" /> Checklist Sprint review
                        </h3>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-500/5 p-5 rounded-2xl border border-green-500/20">
                                <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2">
                                    <Play size={18} /> Iniziare a Fare
                                </h4>
                                <div className="space-y-2">
                                    {retroItems.start.map((val, i) => (
                                        <input
                                            key={i}
                                            value={val}
                                            onChange={(e) => handleRetroChange('start', i, e.target.value)}
                                            className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                            placeholder="Cosa dovremmo iniziare..."
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-red-500/5 p-5 rounded-2xl border border-red-500/20">
                                <h4 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                                    <Pause size={18} /> Smettere di Fare
                                </h4>
                                <div className="space-y-2">
                                    {retroItems.stop.map((val, i) => (
                                        <input
                                            key={i}
                                            value={val}
                                            onChange={(e) => handleRetroChange('stop', i, e.target.value)}
                                            className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                            placeholder="Cosa dovremmo smettere..."
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="bg-blue-500/5 p-5 rounded-2xl border border-blue-500/20">
                                <h4 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
                                    <RotateCcw size={18} /> Continuare a Fare
                                </h4>
                                <div className="space-y-2">
                                    {retroItems.continue.map((val, i) => (
                                        <input
                                            key={i}
                                            value={val}
                                            onChange={(e) => handleRetroChange('continue', i, e.target.value)}
                                            className="w-full bg-zinc-900/50 rounded-lg p-3 text-sm"
                                            placeholder="Cosa dovremmo continuare..."
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Save Project Button */}
            <div className="flex justify-center gap-4 pt-4">
                <button
                    key={saved ? "saved-state" : isSaving ? "saving-state" : "idle-state"}
                    onClick={handleSaveProject}
                    disabled={!project.name || isSaving}
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all ${saved
                        ? 'bg-green-600 text-white'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/25'
                        } ${isSaving ? 'opacity-75 cursor-wait' : ''}`}
                >
                    {saved ? (
                        <div className="flex items-center gap-2">
                            <CheckCircle size={24} /> <span>Dati Salvati!</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {isSaving ? <Activity className="animate-spin" size={24} /> : <Save size={24} />}
                            <span>{isSaving ? 'Salvataggio...' : 'Salva Sprint e KPI'}</span>
                        </div>
                    )}
                </button>

                {project.name && <ExportButton />}
            </div>

            {/* Export Section */}
            {project.name && (
                <div className="glass-panel p-6 mt-8 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-2">📄 Esporta la documentazione completa</h3>
                            <p className="text-zinc-400 text-sm">
                                Hai completato tutte le fasi! Esporta il tuo progetto completo su Google Docs
                                o scaricalo in altri formati per condividerlo con il team e gli stakeholder.
                            </p>
                        </div>
                        <div className="ml-6">
                            <ExportButton />
                        </div>
                    </div>
                </div>
            )}

            {!project.name && (
                <p className="text-center text-zinc-500 text-sm">
                    Per salvare il progetto, devi prima definire un nome nella Fase 1 (Product Vision).
                </p>
            )}
        </div>
    );
};

export default Sprint;
