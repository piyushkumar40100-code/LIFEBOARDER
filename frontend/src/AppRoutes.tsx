import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import GoalsPage from './pages/dashboard/GoalsPage';
import FinancesPage from './pages/dashboard/FinancesPage';
import HabitsPage from './pages/dashboard/HabitsPage';
import TodosPage from './pages/dashboard/TodosPage';
import HealthPage from './pages/dashboard/HealthPage';
import BucketListPage from './pages/dashboard/BucketListPage';

// Settings Page
import SettingsPage from './pages/settings/SettingsPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/goals"
        element={
          <ProtectedRoute>
            <GoalsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/finances"
        element={
          <ProtectedRoute>
            <FinancesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/habits"
        element={
          <ProtectedRoute>
            <HabitsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/todos"
        element={
          <ProtectedRoute>
            <TodosPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/health"
        element={
          <ProtectedRoute>
            <HealthPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/bucketlist"
        element={
          <ProtectedRoute>
            <BucketListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;