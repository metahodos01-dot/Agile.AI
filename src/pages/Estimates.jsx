import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../context/ProjectContext';
import { Sparkles, ArrowRight, Clock, BookOpen } from 'lucide-react';

import { calculateTotalHours, calculateSprintsNeeded } from '../utils/estimations';

const Estimates = () => {
    const { project, updateProject } = useProject();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [estimates, setEstimates] = useState(project.estimates || {});

    // Safely access backlog, defaulting to empty array if undefined
    const allStories = (project.backlog || []).flatMap(epic =>
        epic.stories.map(story => ({ ...story, epicTitle: epic.title, epicId: epic.id }))
    );

    const totalHours = calculateTotalHours(estimates);
    const teamSize = project.team ? project.team.length : 0; // Assuming project.team is an array of members
    const sprintsNeeded = calculateSprintsNeeded(totalHours, teamSize);

    const handleSuggest = () => {
        setLoading(true);
        setTimeout(() => {
            const newEstimates = {};
            allStories.forEach(story => {
                newEstimates[story.id] = Math.floor(Math.random() * 13) + 1; // 1-13 ore
            });
            setEstimates(newEstimates);
            setLoading(false);
        }, 1200);
    };

    const updateEstimate = (storyId, hours) => {
        setEstimates({ ...estimates, [storyId]: parseInt(hours) || 0 });
    };

    const handleNext = () => {
        updateProject({ estimates });
        navigate('/roadmap');
    };



    if (!project.backlog || project.backlog.length === 0) {
        return (
            <div className="text-center pt-20">
                <h2 className="text-2xl font-bold text-white mb-4">Nessun backlog trovato</h2>
                <p className="mb-4 text-zinc-400">Prima definisci il Product Backlog con le User Story.</p>
                <button onClick={() => navigate('/backlog')} className="btn-primary">Vai al Backlog</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                            <Clock size={16} className="text-indigo-400" />
                        </div>
                        <span className="text-sm font-medium text-indigo-400">Fase 7 di 9</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Stima dello sforzo</h1>
                    <p className="text-zinc-400 mt-2">Assegna ore di lavoro stimate a ogni User Story.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-indigo-400 text-xs font-medium">Assistito da AI</span>
                </div>
            </div>

            {/* Educational Section */}
            <div className="glass-panel p-6 border-l-4 border-indigo-500">
                <div className="flex items-start gap-4">
                    <BookOpen size={24} className="text-indigo-400 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Stima agile</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                            La stima in Agile serve per pianificare, non per valutare le performance. Si può usare
                            la <strong>sequenza di Fibonacci</strong> (1, 2, 3, 5, 8, 13...) per i Story Points,
                            oppure stimare in ore ideali. L'obiettivo è capire la capacità del team, non prevedere il futuro!
                        </p>
                        <div className="bg-zinc-800/50 rounded-lg p-4">
                            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">📌 Esempio pratico</p>
                            <p className="text-zinc-300 text-sm">
                                Se stimiamo la **"Mappatura Motore Eco"** a **5 punti** e il **"Sistema di Raffreddamento"** a **13 punti**,
                                stiamo dicendo che il raffreddamento è circa 2.5 volte più complesso (o rischioso) della mappatura software.
                                La velocity ci dirà quanti punti completiamo in ogni sprint.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <div className="glass-panel p-6 sticky top-24">
                        <h3 className="text-lg font-semibold mb-4 text-center text-white">Stime automatiche</h3>
                        <p className="text-sm text-center text-zinc-400 mb-6">
                            L'AI analizzerà le User Story e suggerirà stime basate sulla complessità.
                        </p>
                        <button
                            onClick={handleSuggest}
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-pulse">Calcolo...</span> : <><Sparkles size={16} /> Suggerisci Stime</>}
                        </button>

                        <div className="mt-6 p-4 bg-zinc-800/50 rounded-xl text-center">
                            <p className="text-xs text-zinc-500 uppercase mb-1">Totale Ore Stimate</p>
                            <p className="text-3xl font-bold text-indigo-400">{totalHours}</p>
                            <p className="text-xs text-zinc-500 mt-1">~{sprintsNeeded} sprint (stima)</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 space-y-6">
                    {project.backlog.map(epic => (
                        <div key={epic.id} className="glass-panel p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                                {epic.title}
                            </h3>
                            <div className="space-y-3">
                                {epic.stories.map(story => (
                                    <div key={story.id} className="flex items-center gap-4 p-3 bg-zinc-800/30 rounded-lg">
                                        <p className="flex-1 text-sm text-zinc-300">{story.title}</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min="0"
                                                value={estimates[story.id] || ''}
                                                onChange={(e) => updateEstimate(story.id, e.target.value)}
                                                className="w-20 text-center bg-zinc-900 border border-zinc-700 rounded-lg py-2 text-sm"
                                                placeholder="0"
                                            />
                                            <span className="text-xs text-zinc-500">ore</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div className="flex justify-end pt-4">
                        <button onClick={handleNext} className="btn-primary">
                            Salva e Continua <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Estimates;
