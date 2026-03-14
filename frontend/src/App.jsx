import React from 'react'
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './hooks/useAuth';

import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import Transactions from "./features/transactions/Transactions";
import Budgets from "./features/budgets/Budgets";
import AIInsights from "./features/ai/AIInsights";
import Reports from "./features/reports/Reports";



const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;

};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
      <Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
      <Route path="/ai" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

      {/* Fallback*/ }
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App