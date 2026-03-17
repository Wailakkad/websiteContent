import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { format } from 'date-fns';
import { useAuth } from '../../components/AuthProvider';

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading projects...</div>;

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold leading-6 text-gray-900">Projects</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage content collection projects for your clients.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/dashboard/projects/new"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create Project
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-lg border border-dashed border-gray-300">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new project.</p>
            <div className="mt-6">
              <Link
                to="/dashboard/projects/new"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create Project
              </Link>
            </div>
          </div>
        ) : (
          projects.map((project) => (
            <Link
              key={project.id}
              to={`/dashboard/projects/${project.id}`}
              className="flex flex-col justify-between rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:ring-indigo-600 transition-all"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold leading-6 text-gray-900">{project.title}</h3>
                  <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                    project.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                    project.status === 'in_progress' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                    'bg-gray-50 text-gray-600 ring-gray-500/10'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{project.description || 'No description'}</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                <span>{project.clients?.name || 'Unknown Client'}</span>
                <span>{format(new Date(project.created_at), 'MMM d, yyyy')}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
