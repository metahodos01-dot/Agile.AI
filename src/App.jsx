import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Vision from './pages/Vision';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import Login from './pages/Login';
import Register from './pages/Register';
import AuthGuard from './components/common/AuthGuard';
import AdminGuard from './components/common/AdminGuard';
import AdminDashboard from './pages/AdminDashboard';

import Objectives from './pages/Objectives';
import Kpis from './pages/Kpis';
import Team from './pages/Team';
import Obeya from './pages/Obeya';
import Backlog from './pages/Backlog';
import Estimates from './pages/Estimates';
import Roadmap from './pages/Roadmap';
import Sprint from './pages/Sprint';
import Mindset from './pages/Mindset';
import LandingPage from './pages/LandingPage';

// Placeholder components - will be implemented one by one
const Placeholder = ({ title }) => (
  <div className="glass-panel p-8">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-gray-400">This step is under construction.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Public Landing Page */}
            <Route path="/landing" element={<LandingPage />} />

            {/* Root Route: Logic inside Home or a Wrapper could decide, but simple is:
                If we want Landing to be at '/', we need a conditional component. 
                For now, let's make Landing the default public face if not guarding.
                But existing users expect App.
                Let's try: Public Route at /welcome, or make / check auth?
                
                Better approach: 
                Route path="/" element={<RootRedirect />} 
                where RootRedirect checks auth?
                
                Let's stick to the prompt: "Landing page sopra la app".
                I'll put LandingPage at `/` but strictly for guests? 
                AuthGuard redirects to /login usually.
                
                Let's make a new Gate component.
            */}
            <Route path="/" element={
              <AuthGate />
            } />

            {/* Protected App Routes */}
            <Route path="/app" element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }>
              <Route index element={<Home />} />
              <Route path="mindset" element={<Mindset />} />
              <Route path="admin" element={
                <AdminGuard>
                  <AdminDashboard />
                </AdminGuard>
              } />
              <Route path="vision" element={<Vision />} />
              <Route path="objectives" element={<Objectives />} />
              <Route path="kpi" element={<Kpis />} />
              <Route path="team" element={<Team />} />
              <Route path="obeya" element={<Obeya />} />
              <Route path="backlog" element={<Backlog />} />
              <Route path="estimates" element={<Estimates />} />
              <Route path="roadmap" element={<Roadmap />} />
              <Route path="sprint" element={<Sprint />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}


// Wrapper to redirect authenticated users to App, or show Landing to guests
const AuthGate = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;

  // If user is logged in, redirect to the main app dashboard
  if (user) return <Navigate to="/app" replace />;

  // Otherwise, show the public landing page
  return <LandingPage />;
};

export default App;
