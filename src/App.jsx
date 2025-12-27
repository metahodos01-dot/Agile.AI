import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Vision from './pages/Vision';
import { AuthProvider } from './context/AuthContext';
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

            <Route path="/" element={
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
