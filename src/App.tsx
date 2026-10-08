import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/layout/Layout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Fleet } from './pages/Fleet';
import { VehicleDetail } from './pages/VehicleDetail';
import { Trips } from './pages/Trips';
import { TripDetail } from './pages/TripDetail';
import { Loads } from './pages/Loads';
import { RouteIntelligence } from './pages/RouteIntelligence';
import { Expenses } from './pages/Expenses';
import { Documents } from './pages/Documents';
import { Customers } from './pages/Customers';
import { CustomerDetail } from './pages/CustomerDetail';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Protected Layout Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="fleet" element={<Fleet />} />
        <Route path="fleet/:vehicleId" element={<VehicleDetail />} />
        <Route path="trips" element={<Trips />} />
        <Route path="trips/:tripId" element={<TripDetail />} />
        <Route path="loads" element={<Loads />} />
        <Route path="route-intelligence" element={<RouteIntelligence />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="documents" element={<Documents />} />
        <Route path="customers" element={<Customers />} />
        <Route path="customers/:customerId" element={<CustomerDetail />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
};

export default App;
