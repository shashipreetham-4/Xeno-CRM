import './App.css';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabaseClient';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

import Customers from './pages/Customers';
import AddCustomer from './pages/AddCustomer';
import AddOrder from './pages/AddOrder';
import SegmentBuilder from './pages/SegmentBuilder';
import CampaignCreate from './pages/CampaignCreate';
import CampaignHistory from './pages/CampaignHistory';
import OnboardForm from './pages/OnboardForm';

function App() {
  const { session, loading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/onboarding" element={<OnboardForm />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            session ? (
              <>
                <Navbar user={session.user} onLogout={handleLogout} />
                <Dashboard />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/customers"
          element={
            session ? (
              <>
                <Navbar user={session.user} onLogout={handleLogout} />
                <Customers />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-customer"
          element={
            session ? (
              <>
                <Navbar user={session.user} onLogout={handleLogout} />
                <AddCustomer />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-order"
          element={
            session ? (
              <>
                <Navbar user={session.user} onLogout={handleLogout} />
                <AddOrder />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/segments/new"
          element={
            session ? (
              <>
                <Navbar user={session.user} onLogout={handleLogout} />
                <SegmentBuilder />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/campaigns/new"
          element={
            session ? (
              <>
                <Navbar user={session.user} onLogout={handleLogout} />
                <CampaignCreate />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/campaigns"
          element={
            session ? (
              <>
                <Navbar user={session.user} onLogout={handleLogout} />
                <CampaignHistory />
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
