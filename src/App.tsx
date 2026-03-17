import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Projects from './pages/dashboard/Projects';
import NewProject from './pages/dashboard/NewProject';
import ProjectDetail from './pages/dashboard/ProjectDetail';
import Clients from './pages/dashboard/Clients';
import NewClient from './pages/dashboard/NewClient';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import PortalView from './pages/portal/PortalView';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          <Route path="/portal/:token" element={<PortalView />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Projects />} />
            <Route path="projects/new" element={<NewProject />} />
            <Route path="projects/:id" element={<ProjectDetail />} />
            <Route path="clients" element={<Clients />} />
            <Route path="clients/new" element={<NewClient />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
