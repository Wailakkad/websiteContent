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
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create New Project
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Set up a new content collection portal for your client.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:rounded-2xl space-y-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="client" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Select Client <span className="text-red-500">*</span>
            </label>
            <select
              id="client"
              name="client"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 cursor-pointer"
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name} {client.company_name ? `(${client.company_name})` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              placeholder="e.g. Website Redesign Content"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Internal Notes (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Private notes about this project collection..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !clientId}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
