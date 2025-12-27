import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminGuard = ({ children }) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Check if user is logged in AND has admin role
    if (!user || role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminGuard;
