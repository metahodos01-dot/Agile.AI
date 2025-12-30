
import {
    Brain,
    Target,
    Route,
    Users,
    LayoutDashboard,
    ListTodo,
    Clock,
    Calendar,
    Zap,
    Lightbulb,
    BarChart3
} from 'lucide-react';

export const APP_STEPS = [
    { path: '/app/mindset', name: 'Mindset Agile', icon: Brain },
    { path: '/app/vision', name: 'Product Vision', icon: Lightbulb },
    { path: '/app/product-strategy', name: 'Product Strategy', icon: Target },
    { path: '/app/objectives', name: 'Obiettivi', icon: Target },
    { path: '/app/kpi', name: 'KPIs', icon: BarChart3 }, // Check import
    { path: '/app/team', name: 'Team', icon: Users },
    { path: '/app/obeya', name: 'Obeya Room', icon: LayoutDashboard },
    { path: '/app/backlog', name: 'Backlog', icon: ListTodo },
    { path: '/app/estimates', name: 'Stime', icon: Clock },
    { path: '/app/roadmap', name: 'Roadmap', icon: Calendar },
    { path: '/app/sprint', name: 'Sprint', icon: Zap },
];

export const getNextStep = (currentPath) => {
    // Normalize path to ignore trailing slashes or full URLs if needed
    const index = APP_STEPS.findIndex(step => currentPath.includes(step.path));
    if (index !== -1 && index < APP_STEPS.length - 1) {
        return APP_STEPS[index + 1];
    }
    return null;
};
