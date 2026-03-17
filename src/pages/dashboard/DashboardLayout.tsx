import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../components/AuthProvider';
import { cn } from '../../lib/utils';

export default function DashboardLayout() {
  const { signOut, user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Projects', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/dashboard/clients', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
        <div className="w-full flex-none md:w-64 bg-white border-r border-gray-200">
          <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
              className="mb-2 flex h-20 items-end justify-start rounded-md bg-indigo-600 p-4 md:h-40"
              to="/dashboard"
            >
              <div className="w-32 text-white md:w-40">
                <span className="text-xl font-bold">Content Portal</span>
              </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
              {navigation.map((item) => {
                const LinkIcon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3',
                      location.pathname === item.href || (item.href === '/dashboard' && location.pathname.startsWith('/dashboard/projects'))
                        ? 'bg-indigo-100 text-indigo-600'
                        : ''
                    )}
                  >
                    <LinkIcon className="w-6 h-6" />
                    <p className="hidden md:block">{item.name}</p>
                  </Link>
                );
              })}
              <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
              <button
                onClick={() => signOut()}
                className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-indigo-100 hover:text-indigo-600 md:flex-none md:justify-start md:p-2 md:px-3"
              >
                <LogOut className="w-6 h-6" />
                <div className="hidden md:block">Sign Out</div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
