import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../../components/AuthProvider';
import { cn } from '../../lib/utils';

export default function DashboardLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Projects', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
    { name: 'Feedback', href: '/feedback', icon: MessageSquarePlus },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        {/* Sidebar */}
        <div className="w-full flex-none md:w-64 bg-white border-r border-slate-200">
          <div className="flex h-full flex-col">
            {/* Logo area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-100">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                  <LayoutDashboard className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-900">Content Portal</span>
              </Link>
            </div>

            {/* User info area */}
            <div className="px-6 py-4 flex flex-col items-start bg-slate-50/50 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Signed in as</span>
              <span className="text-sm font-medium text-slate-900 truncate w-full" title={user?.email || ''}>
                {user?.user_metadata?.full_name || user?.email}
              </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const LinkIcon = item.icon;
                const isActive = location.pathname === item.href || (item.href === '/dashboard' && location.pathname.startsWith('/dashboard/projects'));
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    )}
                  >
                    <LinkIcon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-slate-400")} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Sign out */}
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
              >
                <LogOut className="h-5 w-5 text-slate-400" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow p-6 md:overflow-y-auto md:p-8 lg:p-12">
          <div className="mx-auto max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
