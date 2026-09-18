import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { WebSocketProvider } from './context/WebSocketContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Centres from './pages/Centres';
import BookSlot from './pages/BookSlot';
import LiveQueue from './pages/LiveQueue';
import FarmerDashboard from './pages/FarmerDashboard';
import MyBookings from './pages/MyBookings';
import ProcurementTracking from './pages/ProcurementTracking';
import PaymentTracking from './pages/PaymentTracking';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <WebSocketProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/centres" element={<Centres />} />
                  <Route path="/live-queue" element={<LiveQueue />} />

                  {/* Farmer protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['farmer']}>
                        <FarmerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/book-slot"
                    element={
                      <ProtectedRoute allowedRoles={['farmer']}>
                        <BookSlot />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute allowedRoles={['farmer']}>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/procurement"
                    element={
                      <ProtectedRoute allowedRoles={['farmer', 'staff', 'admin']}>
                        <ProcurementTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/payments"
                    element={
                      <ProtectedRoute allowedRoles={['farmer', 'staff', 'admin']}>
                        <PaymentTracking />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  {/* Staff routes */}
                  <Route
                    path="/staff/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['staff', 'admin']}>
                        <StaffDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all redirect */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </WebSocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
