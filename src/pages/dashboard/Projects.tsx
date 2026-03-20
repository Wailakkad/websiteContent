import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { format } from 'date-fns';
import { useAuth } from '../../components/AuthProvider';
import { Plus, LayoutDashboard } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'] & {
  clients: { name: string } | null;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  async function fetchProjects() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*, clients(name)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data as unknown as Project[]);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage content collection portals for your clients.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/dashboard/projects/new"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm antialiased font-medium ring-1 ring-inset ring-red-600/20">
          {error}
        </div>
      )}

      <div className="mt-6">
        {projects.length === 0 ? (
          <div className="text-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-6 sm:px-12">
            <LayoutDashboard className="mx-auto h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-sm font-semibold text-slate-900">No projects started</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">Get started by creating a new content portal project for a client. You'll be able to send them a secure link.</p>
            <div className="mt-6">
              <Link
                to="/dashboard/projects/new"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
              >
                <Plus className="h-4 w-4" />
                Create New Project
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                to={`/dashboard/projects/${project.id}`}
                className="group flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 hover:ring-indigo-600 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{project.title}</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset shrink-0 ${project.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                        project.status === 'in_progress' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' :
                          'bg-slate-50 text-slate-600 ring-slate-500/10'
                      }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 h-10">{project.description || 'No description provided.'}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="truncate max-w-[120px]" title={project.clients?.name}>{project.clients?.name || 'Unknown Client'}</span>
                  <span>{format(new Date(project.created_at), 'MMM d, yyyy')}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
