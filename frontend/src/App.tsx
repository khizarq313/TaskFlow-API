import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import LoadingSpinner from './components/ui/LoadingSpinner';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes with AppLayout */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
        </Route>

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProjectsPage />} />
        </Route>

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AnalyticsPage />} />
        </Route>

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SettingsPage />} />
        </Route>

        {/* Placeholder routes */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <div className="min-h-screen bg-surface pt-24 px-8 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4">
                    assignment
                  </span>
                  <p className="text-lg font-semibold text-white">Tasks Page</p>
                  <p className="text-sm text-on-surface-variant mt-2">Coming soon</p>
                </div>
              </div>
            }
          />
        </Route>

        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <div className="min-h-screen bg-surface pt-24 px-8 flex items-center justify-center">
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-outline mb-4">
                    group
                  </span>
                  <p className="text-lg font-semibold text-white">Team Page</p>
                  <p className="text-sm text-on-surface-variant mt-2">Coming soon</p>
                </div>
              </div>
            }
          />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
