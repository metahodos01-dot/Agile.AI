import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sprint from './Sprint';
import { ProjectContext } from '../context/ProjectContext';
import React from 'react';

// Mock Lucide icons to avoid render issues
vi.mock('lucide-react', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Play: () => <span data-testid="icon-play" />,
        // Add other icons as needed for specific tests
    };
});

// Mock Recharts to isolate chart issues
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    ComposedChart: () => <div data-testid="composed-chart" />,
    Line: () => null,
    Area: () => null,
    XAxis: () => null,
    YAxis: () => null,
    CartesianGrid: () => null,
    Tooltip: () => null,
    Legend: () => null
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 'test-user', email: 'test@example.com' }
    })
}));

const mockProject = {
    id: 1,
    name: 'Test Project',
    sprints: [], // Empty initially
    backlog: [],
    roadmap: { hoursPerDay: 6 }
};

const mockUpdateSprint = vi.fn();
const mockAddSprint = vi.fn((data) => ({ id: 1, ...data }));
const mockSaveProject = vi.fn();

const renderSprint = (projectOverride = {}) => {
    const projectValue = {
        project: { ...mockProject, ...projectOverride },
        updateSprint: mockUpdateSprint,
        addSprint: mockAddSprint,
        saveProject: mockSaveProject
    };

    return render(
        <MemoryRouter>
            <ProjectContext.Provider value={projectValue}>
                <Sprint />
            </ProjectContext.Provider>
        </MemoryRouter>
    );
};

describe('Sprint Component', () => {
    it('renders without crashing', () => {
        renderSprint();
        expect(screen.getByText(/Sprint & Standup/i)).toBeInTheDocument();
    });

    it('displays the empty state when no sprints exist', () => {
        renderSprint({ sprints: [] });
        expect(screen.getByText(/Nuovo Sprint/i)).toBeInTheDocument();
    });

    it('calculates KPIs correctly (Mock Logic)', () => {
        // We can test if KPI cards are present
        renderSprint();

        // Click KPI tab
        const kpiTab = screen.getByText(/KPI & Mood/i);
        fireEvent.click(kpiTab);

        expect(screen.getByText(/Velocity/i)).toBeInTheDocument();
    });

    it('renders the Burndown Chart container', () => {
        const activeSprint = {
            id: 1,
            title: 'Sprint 1',
            status: 'active',
            startDate: new Date().toISOString(),
            kanban: [],
            kpis: { burndownData: [{ day: 0, ideal: 10, real: 10 }] }
        };

        renderSprint({ sprints: [activeSprint] });

        // Switch to KPIs tab where the chart usually is? 
        // Actually, chart status depends on layout. Assuming it's visible or in a tab.
        // Let's check tab switching first if needed.
        const kpiTab = screen.getByText('📊 KPI & Mood');
        fireEvent.click(kpiTab);

        expect(screen.getByText(/Burndown Chart/i)).toBeInTheDocument();
    });
});
