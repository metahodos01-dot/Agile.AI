import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#09090b]">
            {/* Ambient Gradient Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
            </div>

            <Sidebar />

            <main className="ml-72 min-h-screen">
                <div className="max-w-6xl mx-auto px-8 py-10">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
