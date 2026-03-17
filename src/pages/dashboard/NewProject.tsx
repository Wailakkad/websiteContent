import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import { Database } from '../../types/database.types';

type Client = Database['public']['Tables']['clients']['Row'];

export default function NewProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clientId, setClientId] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchClients() {
      if (!user) return;
      const { data } = await supabase.from('clients').select('*').eq('user_id', user.id).order('name');
      if (data) setClients(data);
    }
    fetchClients();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !clientId) return;
    
    setLoading(true);
    
    try {
      // Generate a random token for the portal
      const portalToken = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

      // Create Project
      const { data: projectData, error: projectError } = await supabase.from('projects').insert([
        {
          user_id: user.id,
          client_id: clientId,
          title,
          description,
          status: 'draft',
          portal_token: portalToken
        },
      ]).select().single();

      if (projectError) throw projectError;
      if (!projectData) throw new Error('No project data returned');

      navigate(`/dashboard/projects/${projectData.id}`);
    } catch (err: any) {
      console.error('Error creating project:', err);
      alert('Failed to create project: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            New Project
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow sm:rounded-lg">
        <div>
          <label htmlFor="client" className="block text-sm font-medium leading-6 text-gray-900">
            Client *
          </label>
          <div className="mt-2">
            <select
              id="client"
              name="client"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            >
              <option value="">Select a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name} {client.company_name ? `(${client.company_name})` : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
            Project Title *
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="title"
              id="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>
        </div>

        <div className="flex justify-end gap-x-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !clientId}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
