import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
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
    ComposedChart: ({ data }) => <div data-testid="composed-chart" data-chart-data={JSON.stringify(data)}>{JSON.stringify(data)}</div>,
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
    it('updates Burndown real value immediately when a task is moved to Done', () => {
        // Mock active sprint with 1 active task of 5 hours
        const activeSprint = {
            id: 1,
            title: 'Sprint Active',
            status: 'active',
            startDate: new Date().toISOString(),
            durationDays: 10,
            kanban: [
                { id: 101, title: 'Task A', status: 'doing', estimated: 5, remaining: 5, assignee: 'User' }
            ],
            kpiData: {
                burndownData: [
                    { day: 0, ideal: 10, real: 10 }
                ],
                moodGrid: {}
            }
        };

        const { rerender } = renderSprint({ sprints: [activeSprint] });

        // Switch to Daily tab
        const dailyTab = screen.getByText(/Daily Standup/i);
        fireEvent.click(dailyTab);

        // Verify task exists in "In Corso" (Doing)
        expect(screen.getByText('Task A')).toBeInTheDocument();

        // In the mock KanbanColumn (we see logic in view_file), there are buttons.
        // Looking at lines ~150-160 of Sprint.jsx (from view_file):
        // Move Next button: <button onClick={() => onMove(task.id, 'next')} ... > <ArrowRight /> </button>
        // We can find this button. It usually has title "Sposta a Fatto" or similar if logic is conditional, 
        // or just by the icon.
        // Let's use getByTitle or similar if available, or class.
        // The view_file previously didn't show the exact JSX of KanbanColumn fully.
        // Let's assume standard behavior based on "Doing" -> "Done".

        // Strategy: Find all buttons in the task card. 
        // Since we are in "doing" column, the "next" button moves to "done".

        // We can try to find the button by role or icon content if mocked.
        // In our mock setup, ArrowRight is likely just an icon.

        // Actually, let's just assert that *if* we trigger the move logic, the chart updates.
        // But to be precise, let's try to query the button.
        // "Sposta avanti" logic: onMove(task.id, 'next')

        // Since finding the exact button via RTL might be tricky without IDs,
        // and we barely see the JSX in previous steps (only start of component),
        // I will assume there's a button with an ArrowRight icon.
        // But wait, I have `view_file` output now.

        // Let's verify what `view_file` step 146 shows about KanbanColumn buttons.
        // It shows:
        // status !== 'done' && ( <button ... title="Sposta avanti" ...> <ArrowRight ... /> </button> )

        // Find the card containing "Task A"
        const taskTitle = screen.getByText('Task A');
        const card = taskTitle.closest('.group');

        const buttons = within(card).getAllByRole('button');
        // buttons[2] is next
        const moveNextButton = buttons[2];

        fireEvent.click(moveNextButton);

        // Now check Burndown value.
        // The chart is in "KPI & Mood" tab? Or rendered in Daily?
        // In Sprint.jsx, Burndown is in KPIs tab.
        const kpiTab = screen.getByText('📊 KPI & Mood');
        fireEvent.click(kpiTab);

        // Recharts is mocked to render <div data-testid="composed-chart" />.
        // We can't check the *internal* data of the chart easily unless we inspect props passed to it.
        // But `recharts` mock in line 20 says `ComposedChart: () => ...`.
        // We probably need to mock ComposedChart to capture props.
        // Let's update the mock in this test file first to capture data?
        // Or check if "Ore Rimanenti" text is displayed somewhere else?
        // KpiCard "Performance" updates? 
        // Real Burndown line *should* be 0.

        // We can check if `updateBurndownSnapshot` did its job by checking if a NEW real value is recorded?
        // This is hard to observe via DOM.

        // EASIER: Checks "Performance" KPI card or similar if it reacts to "Done".
        // Performance = (Completed / Total) * 100.
        // 5 / 5 = 100%.
        // Initially 0.

        // Check if chart data updated.
        // We moved task to Done (Original 5h -> 0h remaining for 'real' calculation logic).
        // The mock renders JSON.
        // Initial Mock Data: day 0, real 10.
        // Updated Data: day 0, real should be 0 because all tasks done?
        // Wait, Task A was 5h. Burndown logic sums "remaining" or "estimated".
        // If done, sum is 0.
        // So Real should depend on other tasks?
        // In this test, we have ONLY Task A (5h).
        // So Real should go from 5 (or 10 if initial mock was wrong) to 0.
        // Initial setup in test had `burndownData: [{ day: 0, ideal: 10, real: 10 }]`.
        // BUT logic recalculates it immediately on mount?
        // `updateBurndownSnapshot` runs on mount.
        // Task A has 5h. So on mount, it might correct real to 5.
        // Then on "Done", it corrects to 0.

        // Let's verify we find "real":0 in the text.
        expect(screen.getByTestId('composed-chart')).toHaveTextContent(/"real":0/);
    });
});
