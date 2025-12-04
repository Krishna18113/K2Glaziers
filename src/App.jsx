import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';

// Pages
import Register from './pages/Register';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import SalesHistory from './pages/SalesHistory';
import Sell from './pages/Sell';
import ReturnHistory from './pages/ReturnHistory';
import Returns from './pages/Returns';
import InventoryList from './pages/InventoryList';
import AddInventory from './pages/AddInventory';
import ChangeHistory from './pages/ChangeHistory';
import HistoryMenu from './pages/HistoryMenu'; // <--- IMPORT NEW PAGE

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- NEW HISTORY MENU ROUTE --- */}
            <Route path="/history" element={
              <ProtectedRoute><HistoryMenu /></ProtectedRoute>
            } />

            {/* ADMIN ROUTES */}
            <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/inventory" element={<ProtectedRoute adminOnly={true}><InventoryList /></ProtectedRoute>} />
            <Route path="/inventory/add" element={<ProtectedRoute adminOnly={true}><AddInventory /></ProtectedRoute>} />
            <Route path="/change-history" element={<ProtectedRoute adminOnly={true}><ChangeHistory /></ProtectedRoute>} />

            {/* STAFF ROUTES */}
            <Route path="/sell" element={<ProtectedRoute><Sell /></ProtectedRoute>} />
            <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
            <Route path="/sales-history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
            <Route path="/return-history" element={<ProtectedRoute><ReturnHistory /></ProtectedRoute>} />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;