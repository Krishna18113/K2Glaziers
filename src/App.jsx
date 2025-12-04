import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SalesHistory from './pages/SalesHistory';
import Sell from './pages/Sell';
import ReturnHistory from './pages/ReturnHistory';
import Returns from './pages/Returns';
// NOTE: Assuming you add these imports for the inventory pages:
import InventoryList from './pages/InventoryList';
import AddInventory from './pages/AddInventory';
import ChangeHistory from './pages/ChangeHistory'; // Added for completeness
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 1. ADMIN-ONLY ROUTES */}
          <Route
            path="/admin"
            element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/inventory"
            element={<ProtectedRoute adminOnly={true}><InventoryList /></ProtectedRoute>}
          />
          <Route
            path="/inventory/add"
            element={<ProtectedRoute adminOnly={true}><AddInventory /></ProtectedRoute>}
          />
          <Route
            path="/change-history"
            element={<ProtectedRoute adminOnly={true}><ChangeHistory /></ProtectedRoute>}
          />

          {/* 2. STAFF/ADMIN PROTECTED ROUTES (Need login & approval, but not admin role) */}
          <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
          <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
          <Route path="/sales-history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
          <Route path="/return-history" element={<ProtectedRoute><ReturnHistory /></ProtectedRoute>} />

          {/* Default redirect for unauthenticated users */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;