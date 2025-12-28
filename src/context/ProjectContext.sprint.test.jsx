import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { ProjectProvider, useProject } from './ProjectContext';
import { AuthProvider } from './AuthContext';

// Mock Supabase
vi.mock('../services/supabaseClient', () => ({
    supabase: {
        from: () => ({
            select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
            insert: () => ({ select: () => Promise.resolve({ data: [{ id: '123' }], error: null }) }),
            update: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
            delete: () => ({ eq: () => Promise.resolve({ error: null }) })
        })
    }
}));

// Mock Auth
const mockUser = { id: 'user-123', email: 'test@example.com' };
vi.mock('./AuthContext', () => ({
    useAuth: () => ({ user: mockUser }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

const TestSprintComponent = () => {
    const { project, addSprint, updateSprint, deleteSprint } = useProject();
    return (
        <div>
            <div data-testid="sprint-count">{project.sprints?.length || 0}</div>
            <div data-testid="sprint-list">
                {(project.sprints || []).map(s => (
                    <div key={s.id} data-testid={`sprint-${s.id}`}>
                        {s.name} - {s.status}
                    </div>
                ))}
            </div>
            <button onClick={() => addSprint({ name: 'Sprint 2', status: 'planned' })}>Add Sprint</button>
            <button onClick={() => {
                const id = project.sprints[0].id;
                updateSprint(id, { status: 'active' });
            }}>Update First Sprint</button>
            <button onClick={() => {
                const id = project.sprints[0].id;
                deleteSprint(id);
            }}>Delete First Sprint</button>
        </div>
    );
};

describe('ProjectContext Sprint Logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('manages sprint lifecycle (add, update, delete)', async () => {
        await act(async () => {
            render(
                <AuthProvider>
                    <ProjectProvider>
                        <TestSprintComponent />
                    </ProjectProvider>
                </AuthProvider>
            );
        });

        // Initial state: 0 Sprints (Default empty project)
        expect(screen.getByTestId('sprint-count')).toHaveTextContent('0');

        // Add
        const addButton = screen.getByText('Add Sprint');
        await act(async () => {
            addButton.click();
        });
        expect(screen.getByTestId('sprint-count')).toHaveTextContent('1');

        // Update
        // We need a sprint to update. The added sprint has ID.
        // In this mock env, we might need to rely on the fact that addSprint updates state.

        // Wait, if we added a sprint, does it have an ID? 
        // addSprint logic: uses Date.now().

        const updateButton = screen.getByText('Update First Sprint');
        await act(async () => {
            updateButton.click();
        });
        expect(screen.getByTestId('sprint-count')).toHaveTextContent('1');

        // Delete
        const deleteButton = screen.getByText('Delete First Sprint');
        await act(async () => {
            deleteButton.click();
        });
        expect(screen.getByTestId('sprint-count')).toHaveTextContent('0');
    });
});
