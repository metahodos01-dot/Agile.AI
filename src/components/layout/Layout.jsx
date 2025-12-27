import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex min-h-screen font-sans text-zinc-100 bg-zinc-950 relative overflow-hidden">
            {/* Animated Mesh Background */}
            <div className="mesh-gradient-bg" />

            {/* Floating Orbs (Optional for extra cool factor) */}
            <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
            <div className="fixed bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000" />

            <Sidebar />

            <main className="flex-1 ml-72 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="p-8 h-full overflow-y-auto"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Layout;
