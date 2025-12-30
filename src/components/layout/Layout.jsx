import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen font-sans text-zinc-100 relative">
            {/* Animated Mesh Background - Fixed & Behind everything */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
                <div className="mesh-gradient-bg absolute inset-0" />

                {/* Floating Orbs */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <Sidebar />

            <main className="flex-1 ml-72 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="p-8 min-h-screen"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
