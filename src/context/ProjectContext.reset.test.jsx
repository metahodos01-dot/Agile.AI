
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ProjectProvider, useProject } from './ProjectContext';
import { AuthProvider } from './AuthContext';

// Mock Supabase to avoid network calls
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        from: () => ({
            select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
            insert: () => ({ select: () => Promise.resolve({ data: [{ id: '123', name: 'Saved' }], error: null }) }),
            update: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
            delete: () => ({ eq: () => Promise.resolve({ error: null }) })
        })
    }
}));

// Mock Auth
const mockUser = { id: 'user-reset-test', email: 'reset@example.com' };
vi.mock('./AuthContext', () => ({
    useAuth: () => ({ user: mockUser }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Test Component exposing createNewProject
const ResetTestComponent = () => {
    const { project, updateProject, createNewProject } = useProject();
    return (
        <div>
            <div data-testid="project-name">{project.name || 'EMPTY'}</div>
            <button onClick={() => updateProject({ name: 'Dirty Project' })}>Dirty it</button>
            <button onClick={() => createNewProject()}>Reset it</button>
        </div>
    );
};

describe('ProjectContext Reset', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('createNewProject should reset project state to empty', async () => {
        await act(async () => {
            render(
                <AuthProvider>
                    <ProjectProvider>
                        <ResetTestComponent />
                    </ProjectProvider>
                </AuthProvider>
            );
        });

        // 1. Verify initial state
        expect(screen.getByTestId('project-name')).toHaveTextContent('EMPTY');

        // 2. Dirty the state
        await act(async () => {
            screen.getByText('Dirty it').click();
        });
        expect(screen.getByTestId('project-name')).toHaveTextContent('Dirty Project');

        // 3. Reset the state
        await act(async () => {
            screen.getByText('Reset it').click();
        });

        // 4. Verify reset
        expect(screen.getByTestId('project-name')).toHaveTextContent('EMPTY');
    });
});
