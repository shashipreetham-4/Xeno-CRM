import './App.css';
import { useAuth } from './hooks/useAuth';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Login Page */}
<Route path="/login" element={session ? <Navigate to="/dashboard" /> : <Login />} />

        <Route path="/onboarding" element={<OnboardForm />} />
        {/* Authenticated Routes */}
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/customers" element={session ? <Customers /> : <Navigate to="/login" />} />
        <Route path="/add-customer" element={session ? <AddCustomer /> : <Navigate to="/login" />} />
        <Route path="/add-order" element={session ? <AddOrder /> : <Navigate to="/login" />} />
        <Route path="/segments/new" element={session ? <SegmentBuilder /> : <Navigate to="/login" />} />
        <Route path="/campaigns/new" element={session ? <CampaignCreate /> : <Navigate to="/login" />} />
        <Route path="/campaigns" element={session ? <CampaignHistory /> : <Navigate to="/login" />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
