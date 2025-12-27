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
    sprint: {},
    createdAt: null,
    completedAt: null
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

            const projects = data.map(row => ({
                ...row.data,
                id: row.id, // Use Supabase UUID
                name: row.name,
                createdAt: row.created_at,
                updatedAt: row.updated_at
            }));

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
            setProject(JSON.parse(current));
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

    // Save project to Supabase
    const saveProject = async () => {
        if (!project.name) return false;
        if (!user) return false;

        setLoading(true);
        try {
            const projectData = { ...project };
            delete projectData.id;
            delete projectData.name;
            delete projectData.createdAt;

            const payload = {
                name: project.name,
                data: projectData,
                user_id: user.id
            };

            let data, error;

            // Check if it's a UUID (existing Supabase project) or a temp/new ID
            const isUUID = project.id && project.id.length > 20;

            if (isUUID) {
                // Update
                ({ data, error } = await supabase
                    .from('projects')
                    .update({
                        ...payload,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', project.id)
                    .select());
            } else {
                // Insert
                ({ data, error } = await supabase
                    .from('projects')
                    .insert(payload)
                    .select());
            }

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
        // Save current if has name
        if (project.name) {
            await saveProject();
        }

        const newProject = {
            ...emptyProject
        };
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
            loading
        }}>
            {children}
        </ProjectContext.Provider>
    );
};
