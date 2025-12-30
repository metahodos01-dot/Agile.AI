import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

export const ProjectContext = createContext();

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

    // --- HELPERS ---
    const validateProjectStructure = (proj) => {
        if (!proj) return { ...emptyProject };
        const validated = { ...emptyProject, ...proj };
        if (!Array.isArray(validated.sprints)) validated.sprints = [];
        if (!Array.isArray(validated.team)) validated.team = [];
        if (!Array.isArray(validated.objectives)) validated.objectives = [];
        if (!Array.isArray(validated.kpis)) validated.kpis = [];
        if (!validated.sprint) validated.sprint = {};

        // Migration logic
        if (validated.sprints.length === 0 && validated.sprint && Object.keys(validated.sprint).length > 0) {
            console.log("Migrating legacy sprint to sprints array...");
            validated.sprints = [{ id: 1, title: 'Sprint 1', status: 'active', ...validated.sprint }];
        }
        return validated;
    };

    // --- EFFECTS ---

    // Auto-Save to LocalStorage
    useEffect(() => {
        if (!project.name || !user) return;
        const timeoutId = setTimeout(() => {
            const backupKey = `agile_autosave_${project.id || 'temp'}`;
            localStorage.setItem(backupKey, JSON.stringify(project));
            localStorage.setItem('currentProject', JSON.stringify(project));
        }, 2000);
        return () => clearTimeout(timeoutId);
    }, [project, user]);

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


    // Save project to Supabase with Hardened Persistence
    const saveProject = async (dataToSave = null) => {
        const projectCurrent = dataToSave || project;

        if (!projectCurrent.name) return false;
        if (!user) {
            console.error("[SaveProject] No user logged in.");
            return false;
        }

        setLoading(true);

        // 0. LOCAL BACKUP (Safety Net)
        try {
            const backupKey = `agile_backup_${projectCurrent.id || 'temp'}`;
            localStorage.setItem(backupKey, JSON.stringify(projectCurrent));
            console.log(`[SaveProject] Local safety backup created: ${backupKey}`);
        } catch (backupError) {
            console.warn("[SaveProject] Failed to create local backup:", backupError);
            // Continue anyway, this is non-blocking
        }

        const MAX_RETRIES = 3;
        let attempt = 0;
        let success = false;
        let lastError = null;

        while (attempt < MAX_RETRIES && !success) {
            attempt++;
            try {
                console.log(`[SaveProject] Attempt ${attempt}/${MAX_RETRIES}...`);

                // 1. Connection Check (Fast fail)
                const { error: pingError } = await supabase.from('profiles').select('id').limit(1);
                if (pingError) throw new Error(`Connection check failed: ${pingError.message}`);

                // Prepare Payload
                const projectData = { ...projectCurrent };
                delete projectData.id;
                delete projectData.name;
                delete projectData.createdAt; // kept in 'created_at' column usually

                const payload = {
                    name: projectCurrent.name,
                    data: projectData,
                    user_id: user.id
                };

                const isUUID = projectCurrent.id && projectCurrent.id.length > 20;

                // 2. Database Operation with Timeout
                const dbOperation = async () => {
                    if (isUUID) {
                        return await supabase
                            .from('projects')
                            .update({ ...payload, updated_at: new Date().toISOString() })
                            .eq('id', projectCurrent.id)
                            .select();
                    } else {
                        return await supabase
                            .from('projects')
                            .insert(payload)
                            .select();
                    }
                };

                const timeoutMs = 8000 + (attempt * 2000); // Backoff: 10s, 12s, 14s
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout salvataggio')), timeoutMs)
                );

                const { data, error } = await Promise.race([dbOperation(), timeoutPromise]);

                if (error) throw error;
                if (!data || data.length === 0) throw new Error("No data returned from save operation");

                // Success!
                success = true;
                console.log("[SaveProject] Save successful!");

                // Update local ID if it was a new project
                if (!isUUID && data[0].id) {
                    const newId = data[0].id;
                    updateProject({ id: newId });
                }

            } catch (err) {
                lastError = err;
                console.error(`[SaveProject] Attempt ${attempt} failed:`, err.message);

                if (attempt < MAX_RETRIES) {
                    // Wait before retry (exponential backoff: 500ms, 1000ms, 2000ms)
                    const waitTime = 500 * Math.pow(2, attempt - 1);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }
        }

        setLoading(false);

        if (!success) {
            console.error("[SaveProject] All save attempts failed.");
            alert(`Errore PROGETTO NON SALVATO dopo ${MAX_RETRIES} tentativi.\n\nIl tuo lavoro è al sicuro nella memoria locale, ma non è sul server.\n\nErrore: ${lastError?.message}`);
            return false;
        }

        return true;
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
            const validated = validateProjectStructure(projectToLoad);
            setProject(validated);
            localStorage.setItem('currentProject', JSON.stringify(validated));
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
