import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Services from './pages/Services';
import CreateService from './pages/CreateService';
import MyRequests from './pages/MyRequests';
import Wallet from './pages/Wallet';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="services" element={<Services />} />
            <Route path="create-service" element={<CreateService />} />
            <Route path="requests" element={<MyRequests />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="chat" element={<Chat />} />
            
            {/* Admin Only Routes */}
            <Route
              path="analytics"
              element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <Analytics />
                </RoleBasedRoute>
              }
            />
            <Route
              path="users"
              element={
                <RoleBasedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </RoleBasedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
