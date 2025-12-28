import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ProjectProvider, useProject } from './ProjectContext';
import { AuthProvider } from './AuthContext';

// Mock Supabase
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        from: () => ({
            select: () => ({ order: () => ({ data: [], error: null }) }),
            insert: () => ({ select: () => ({ data: [{ id: '123', name: 'Test' }], error: null }) }),
            update: () => ({ select: () => ({ data: [], error: null }) }),
            delete: () => ({ eq: () => ({ error: null }) })
        })
    }
}));

// Mock Auth
const mockUser = { id: 'user-123', email: 'test@example.com' };
vi.mock('./AuthContext', () => ({
    useAuth: () => ({ user: mockUser }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

// Test Component
const TestComponent = () => {
    const { project, updateProject, deleteProject } = useProject();
    return (
        <div>
            <div data-testid="project-name">{project.name}</div>
            <button onClick={() => updateProject({ name: 'Updated Name' })}>Update</button>
            <button onClick={() => deleteProject('123')}>Delete</button>
        </div>
    );
};

describe('ProjectContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('provides default project state', () => {
        render(
            <AuthProvider>
                <ProjectProvider>
                    <TestComponent />
                </ProjectProvider>
            </AuthProvider>
        );
        expect(screen.getByTestId('project-name')).toHaveTextContent('');
    });

    it('updates project state', async () => {
        render(
            <AuthProvider>
                <ProjectProvider>
                    <TestComponent />
                </ProjectProvider>
            </AuthProvider>
        );

        const button = screen.getByText('Update');
        await act(async () => {
            button.click();
        });

        expect(screen.getByTestId('project-name')).toHaveTextContent('Updated Name');
    });
});
