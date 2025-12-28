import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { ProjectProvider } from '../context/ProjectContext';
import { AuthProvider } from '../context/AuthContext';
import * as ProjectContextModule from '../context/ProjectContext';

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

const mockUser = { id: 'user-123', email: 'test@example.com' };
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: mockUser, signOut: vi.fn() }),
    AuthProvider: ({ children }) => <div>{children}</div>
}));

describe('Delete Project Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('opens delete modal and confirms deletion', async () => {
        // Mock the project context to have a loaded project so the delete button appears
        const mockDeleteProject = vi.fn();
        const mockProject = { id: '123', name: 'Test Project' };

        // We override the useProject hook for this specific test to ensure state is what we expect
        // This is better than relying on the Provider's internal state which is harder to control in integration
        vi.spyOn(ProjectContextModule, 'useProject').mockReturnValue({
            project: mockProject,
            savedProjects: [mockProject],
            loading: false,
            deleteProject: mockDeleteProject,
            createNewProject: vi.fn(),
            updateProject: vi.fn(),
            saveProject: vi.fn(),
            loadProject: vi.fn()
        });

        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        // Debug: Log the DOM to see if the button is there
        // screen.debug();

        // Find the button that triggers deletion. 
        // Based on typical UI, it's often an icon or text "Elimina"
        // Searching for the Trash icon button usually found by aria-label or role if good a11y, 
        // or just by finding the svg/button. 
        // Let's assume there is a button with "Elimina progetto" tooltip or similar if accessible,
        // or we find by something unique.

        // From context, we know there is a button calling setShowDeleteModal(true).
        // If we can't find it by text, we might need to add a data-testid to the Sidebar button in a real scenario.
        // But let's try to find it by text content if it exists, or role.

        // Let's assume we added a data-testid or text.
        // Since I can't easily modify Sidebar to add testid without risk, I'll search for the icon or text.
        // There is 'Elimina progetto' text in the modal, but not on the Sidebar button itself usually (just icon).
        // BUT, looking at the code, the DeleteConfirmModal shows "Elimina".

        // Let's try to find the button that contains the Trash icon.
        // This is brittle without test-ids. I will assume I can find it by some unique attribute or class in a real app.
        // For this test, I'll skip the click if I can't determine the selector, 
        // and instead test the Modal component logic directly if possible? No, we want integration.

        // Wait! In Sidebar.jsx viewed earlier:
        // <button onClick={() => setShowDeleteModal(true)} ... title="Elimina progetto">
        // If it has a title, we can find by title.

        const deleteButton = screen.getByTitle('Elimina progetto');
        fireEvent.click(deleteButton);

        // Now modal should be open
        expect(screen.getByText('Eliminare progetto?')).toBeInTheDocument();

        // Click "Elimina" in modal
        const confirmButton = screen.getByText('Elimina', { selector: 'button' });
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(mockDeleteProject).toHaveBeenCalledWith('123');
        });
    });
});
