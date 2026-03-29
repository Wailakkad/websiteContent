import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthProvider';

// Lazy load all route components for better Initial Page Load (Core Web Vitals)
const DashboardLayout = lazy(() => import('./pages/dashboard/DashboardLayout'));
const Projects = lazy(() => import('./pages/dashboard/Projects'));
const NewProject = lazy(() => import('./pages/dashboard/NewProject'));
const ProjectDetail = lazy(() => import('./pages/dashboard/ProjectDetail'));
const Clients = lazy(() => import('./pages/dashboard/Clients'));
const NewClient = lazy(() => import('./pages/dashboard/NewClient'));
const Login = lazy(() => import('./pages/auth/Login'));
const SignUp = lazy(() => import('./pages/auth/SignUp'));
const PortalView = lazy(() => import('./pages/portal/PortalView'));
const Home = lazy(() => import('./pages/Home'));
const Feedback = lazy(() => import('./pages/Feedback'));

// Professional loading fallback
const PageLoader = () => (
  <div className="flex min-h-[100dvh] items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"></div>
      <p className="text-sm font-medium text-slate-500">Loading Content Portal...</p>
    </div>
  </div>
);

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
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/feedback" element={<Feedback />} />

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
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
