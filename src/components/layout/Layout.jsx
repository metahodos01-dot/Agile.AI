import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen font-sans text-white bg-slate-950 relative overflow-hidden selection:bg-amber-500 selection:text-slate-900">
            {/* Unifying Theme: Background Overlay MATCHING Landing Page */}
            <div className="fixed inset-0 z-[-1] pointer-events-none">
                <img
                    src="/turbine-bg.png"
                    alt="App Background"
                    className="w-full h-full object-cover opacity-20 blur-sm scale-110"
                />
                {/* Gradient consistent with Landing Page but darker for app legibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-950/95"></div>
            </div>

            <div className="relative z-10 w-64 flex-shrink-0">
                <Sidebar />
            </div>

            <main className="relative z-10 flex-1 p-6 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-7xl mx-auto space-y-6"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
