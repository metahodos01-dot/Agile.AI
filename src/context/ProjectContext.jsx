import React, { createContext, useContext, useState, useEffect } from 'react';

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
    const [project, setProject] = useState({ ...emptyProject });
    const [savedProjects, setSavedProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load projects from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('savedProjects');
        if (saved) {
            setSavedProjects(JSON.parse(saved));
        }
        const current = localStorage.getItem('currentProject');
        if (current) {
            setProject(JSON.parse(current));
        }
    }, []);

    // Update current project
    const updateProject = (updates) => {
        const newProject = {
            ...project,
            ...updates,
            id: project.id || Date.now().toString(),
            createdAt: project.createdAt || new Date().toISOString()
        };
        setProject(newProject);
        localStorage.setItem('currentProject', JSON.stringify(newProject));
    };

    // Save project to the list of saved projects
    const saveProject = () => {
        if (!project.name) return false;

        const projectToSave = {
            ...project,
            id: project.id || Date.now().toString(),
            completedAt: new Date().toISOString()
        };

        // Check if project already exists
        const existingIndex = savedProjects.findIndex(p => p.id === projectToSave.id);
        let newSavedProjects;

        if (existingIndex >= 0) {
            // Update existing
            newSavedProjects = [...savedProjects];
            newSavedProjects[existingIndex] = projectToSave;
        } else {
            // Add new
            newSavedProjects = [...savedProjects, projectToSave];
        }

        setSavedProjects(newSavedProjects);
        localStorage.setItem('savedProjects', JSON.stringify(newSavedProjects));
        return true;
    };

    // Create new project (saves current one first)
    const createNewProject = () => {
        // Save current project if it has a name
        if (project.name) {
            saveProject();
        }

        // Reset to empty project
        const newProject = {
            ...emptyProject,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        setProject(newProject);
        localStorage.setItem('currentProject', JSON.stringify(newProject));
    };

    // Load a saved project
    const loadProject = (projectId) => {
        // Save current project first
        if (project.name && project.id !== projectId) {
            saveProject();
        }

        const projectToLoad = savedProjects.find(p => p.id === projectId);
        if (projectToLoad) {
            setProject(projectToLoad);
            localStorage.setItem('currentProject', JSON.stringify(projectToLoad));
        }
    };

    // Delete a project
    const deleteProject = (projectId) => {
        const newSavedProjects = savedProjects.filter(p => p.id !== projectId);
        setSavedProjects(newSavedProjects);
        localStorage.setItem('savedProjects', JSON.stringify(newSavedProjects));

        // If deleting current project, reset
        if (project.id === projectId) {
            const newProject = { ...emptyProject, id: Date.now().toString() };
            setProject(newProject);
            localStorage.setItem('currentProject', JSON.stringify(newProject));
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
