import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

export default function NewClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.from('clients').insert([
        {
          user_id: user.id,
          name,
          email: email || null,
          company_name: companyName || null,
        },
      ]).select().single();

      if (error) throw error;
      if (!data) throw new Error('No data returned');

      navigate('/dashboard/clients');
    } catch (err: any) {
      console.error('Error creating client:', err);
      alert('Failed to create client: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Add New Client
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Create a client profile to assign projects to them.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:rounded-2xl space-y-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Contact Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              placeholder="e.g. Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
            />
          </div>

          <div>
            <label htmlFor="companyName" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              id="companyName"
              placeholder="e.g. Acme Corp"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="jane@acmecorp.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard/clients')}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !name}
            className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all"
          >
            {loading ? 'Adding...' : 'Add Client'}
          </button>
        </div>
      </form>
    </div>
  );
}
