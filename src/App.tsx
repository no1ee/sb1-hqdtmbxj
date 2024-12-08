import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import ReceiverDashboard from './components/ReceiverDashboard';
import ChangePassword from './components/ChangePassword';

function App() {
  const { currentUser } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
          <Route
            path="/"
            element={
              currentUser ? (
                currentUser.firstLogin ? (
                  <ChangePassword />
                ) : currentUser.role === 'admin' ? (
                  <AdminDashboard />
                ) : currentUser.role === 'client' ? (
                  <ClientDashboard />
                ) : (
                  <ReceiverDashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;