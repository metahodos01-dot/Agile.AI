import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProject = () => useContext(ProjectContext);

const emptyProject = {
    id: null,
    name: '',
    vision: '',
    objectives: [],
    kpis: [],
    team: [],
    obeya: {},
    backlog: [],
    estimates: {},
    roadmap: [],
    sprint: {}, // Deprecated, kept for backward compatibility/migration
    sprints: [], // New multi-sprint array
    createdAt: null,
    completedAt: null,
    // Context fields for AI
    targetAudience: '',
    problem: '',
    currentSolution: '',
    differentiation: ''
};

export const ProjectProvider = ({ children }) => {
    const { user } = useAuth();
    const [project, setProject] = useState({ ...emptyProject });
    const [savedProjects, setSavedProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch projects from Supabase
    const fetchProjects = async () => {
        if (!user) {
            setSavedProjects([]);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;

            const projects = data.map(row => {
                // MIGRATION LOGIC: If 'sprint' exists but 'sprints' is empty, migrate it.
                let sprints = row.data.sprints || [];
                if (sprints.length === 0 && row.data.sprint && Object.keys(row.data.sprint).length > 0) {
                    sprints = [{
                        id: 1,
                        title: 'Sprint 1',
                        status: 'active', // active, completed, planned
                        ...row.data.sprint
                    }];
                }

                return {
                    ...row.data,
                    id: row.id, // Use Supabase UUID
                    name: row.name,
                    sprints: sprints, // Ensure sprints array is populated
                    createdAt: row.created_at,
                    updatedAt: row.updated_at
                };
            });

            setSavedProjects(projects);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load projects when user changes
    useEffect(() => {
        if (user) fetchProjects();

        // Recover current project from local storage if needed
        const current = localStorage.getItem('currentProject');
        if (current) {
            const loaded = JSON.parse(current);
            // Ensure sprints array exists on load from local storage
            if (!loaded.sprints && loaded.sprint) {
                loaded.sprints = [{ id: 1, title: 'Sprint 1', status: 'active', ...loaded.sprint }];
            }
            if (!loaded.sprints) loaded.sprints = [];
            setProject(loaded);
        }
    }, [user]);

    // Update current project state locally
    const updateProject = (updates) => {
        const newProject = {
            ...project,
            ...updates,
        };
        setProject(newProject);
        localStorage.setItem('currentProject', JSON.stringify(newProject));
    };

    // Sprint Management Helpers
    const addSprint = (newSprintData) => {
        const nextId = (project.sprints?.length || 0) + 1;
        const newSprint = {
            id: nextId,
            title: `Sprint ${nextId}`,
            status: 'planned',
            goals: [],
            capacity: { total: 0, members: [] }, // New structure for capacity
            tasks: [],
            ...newSprintData
        };
        const updatedSprints = [...(project.sprints || []), newSprint];
        updateProject({ sprints: updatedSprints });
        return newSprint;
    };

    const updateSprint = (sprintId, updates) => {
        const updatedSprints = (project.sprints || []).map(s =>
            s.id === sprintId ? { ...s, ...updates } : s
        );
        updateProject({ sprints: updatedSprints });
    };

    const deleteSprint = (sprintId) => {
        const updatedSprints = (project.sprints || []).filter(s => s.id !== sprintId);
        updateProject({ sprints: updatedSprints });
    };


    // Save project to Supabase
    const saveProject = async (dataToSave = null) => {
        const projectCurrent = dataToSave || project;

        if (!projectCurrent.name) return false;
        if (!user) return false;

        setLoading(true);
        try {
            // 1. Connection Check
            // CONNECTION CHECK: Use limit(1) instead of single() to avoid "0 rows" errors if profile is missing
            const { data: pingData, error: pingError } = await supabase.from('profiles').select('id').limit(1);

            if (pingError) {
                console.error("[SaveProject] Connection/Auth Check Failed:", pingError);
                throw new Error("Errore di connessione al database. Riprova.");
            }
            console.log("[SaveProject] Connection OK. Rows found:", pingData?.length || 0);

            const projectData = { ...projectCurrent };
            delete projectData.id;
            delete projectData.name;
            delete projectData.createdAt;

            const payload = {
                name: projectCurrent.name,
                data: projectData,
                user_id: user.id
            };

            // let data, error; // Removed to avoid conflict

            // Check if it's a UUID (existing Supabase project) or a temp/new ID
            const isUUID = projectCurrent.id && projectCurrent.id.length > 20;

            console.log(`[SaveProject] Starting save. ID: ${projectCurrent.id}, isUUID: ${isUUID}, User: ${user.id}`);
            console.log(`[SaveProject] Payload size: ${JSON.stringify(payload).length} characters`);

            const dbOperation = async () => {
                let d, e;
                if (isUUID) {
                    ({ data: d, error: e } = await supabase
                        .from('projects')
                        .update({ ...payload, updated_at: new Date().toISOString() })
                        .eq('id', projectCurrent.id)
                        .select());
                } else {
                    ({ data: d, error: e } = await supabase
                        .from('projects')
                        .insert(payload)
                        .select());
                }
                return { data: d, error: e };
            };

            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout salvataggio: server non risponde')), 8000)
            );

            const { data, error } = await Promise.race([dbOperation(), timeoutPromise]);

            if (error) throw error;

            if (data && data[0]) {
                const savedProject = {
                    ...data[0].data,
                    id: data[0].id,
                    name: data[0].name,
                    createdAt: data[0].created_at,
                    updatedAt: data[0].updated_at
                };

                setProject(savedProject);
                localStorage.setItem('currentProject', JSON.stringify(savedProject));
                await fetchProjects(); // Refresh list
                return true;
            }
        } catch (error) {
            console.error('Error saving project:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Create new project
    const createNewProject = async () => {
        console.log("Context: Creating new project. Current:", project.name);
        // Save current if has name
        if (project.name) {
            console.log("Context: Saving current project before creating new...");
            await saveProject();
        }

        const newProject = JSON.parse(JSON.stringify(emptyProject));
        console.log("Context: Setting new project state:", newProject);
        setProject(newProject);
        localStorage.removeItem('currentProject');
    };

    // Load a saved project
    const loadProject = async (projectId) => {
        if (project.name && project.id !== projectId) {
            await saveProject();
        }

        const projectToLoad = savedProjects.find(p => p.id === projectId);
        if (projectToLoad) {
            setProject(projectToLoad);
            localStorage.setItem('currentProject', JSON.stringify(projectToLoad));
        }
    };

    // Delete a project
    const deleteProject = async (projectId) => {
        try {
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectId);

            if (error) throw error;

            await fetchProjects();

            if (project.id === projectId) {
                const newProject = { ...emptyProject };
                setProject(newProject);
                localStorage.removeItem('currentProject');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    return (
        <ProjectContext.Provider value={{
            project,
            updateProject,
            saveProject,
            createNewProject,
            loadProject,
            deleteProject,
            savedProjects,
            loading,
            addSprint,
            updateSprint,
            deleteSprint
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
