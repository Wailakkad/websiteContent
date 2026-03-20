import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { Link2, ExternalLink, CheckCircle2, Circle, Eye } from 'lucide-react';

type Project = Database['public']['Tables']['projects']['Row'] & {
  clients: { name: string } | null;
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) fetchProjectData();
  }, [id]);

  async function fetchProjectData() {
    if (!id) return;

    // Fetch project
    const { data: projectData } = await supabase
      .from('projects')
      .select('*, clients(name)')
      .eq('id', id)
      .single();

    if (projectData) setProject(projectData as unknown as Project);

    // Fetch content
    const { data: contentData } = await supabase
      .from('project_contents')
      .select('*')
      .eq('project_id', id)
      .single();

    if (contentData) setContent(contentData);

    setLoading(false);
  }

  const copyPortalLink = () => {
    if (!project) return;
    const url = `${window.location.origin}/portal/${project.portal_token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
  );
  if (!project) return <div className="p-8 text-center text-slate-500">Project not found</div>;

  const fields = [
    { key: 'business_name', label: 'Business Name' },
    { key: 'business_description', label: 'Business Description' },
    { key: 'about_text', label: 'About Us Text' },
    { key: 'services', label: 'Services' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'linkedin', label: 'LinkedIn' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white px-8 py-8 shadow-sm ring-1 ring-slate-200 sm:rounded-2xl">
        <div className="md:flex md:items-start md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:truncate">
                {project.title}
              </h2>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${project.status === 'completed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                  project.status === 'in_progress' ? 'bg-indigo-50 text-indigo-700 ring-indigo-600/20' :
                    'bg-slate-50 text-slate-600 ring-slate-500/10'
                }`}>
                {project.status.replace('_', ' ')}
              </span>
            </div>
            <div className="mt-2 flex flex-col sm:mt-2 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="flex items-center text-sm font-medium text-slate-500">
                Client: <span className="text-slate-900 ml-1">{project.clients?.name}</span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col sm:flex-row md:ml-4 md:mt-0 gap-3">
            <button
              onClick={copyPortalLink}
              className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
            >
              <Link2 className="-ml-0.5 mr-2 h-4 w-4 text-slate-400" aria-hidden="true" />
              {copied ? 'Copied to clipboard!' : 'Copy Portal Link'}
            </button>
            <Link
              to={`/portal/${project.portal_token}`}
              target="_blank"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
            >
              <Eye className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
              View Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white shadow-sm ring-1 ring-slate-200 sm:rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-base font-semibold leading-6 text-slate-900">Submitted Content</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Information provided by the client via their secure portal wrapper.
          </p>
        </div>

        <div className="p-0">
          {!content ? (
            <div className="text-center py-12 px-4 sm:px-6">
              <Circle className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-2 text-sm font-semibold text-slate-900">Waiting for client</h3>
              <p className="mt-1 text-sm text-slate-500">No content has been submitted yet. Once they fill out the form, it will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {fields.map(field => {
                const value = content[field.key];
                const hasResponse = value && value.trim() !== '';

                return (
                  <div key={field.key} className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-8">
                    <dt className="text-sm font-medium text-slate-900 flex items-center gap-2">
                      {hasResponse ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                      )}
                      {field.label}
                    </dt>
                    <dd className="mt-2 text-sm text-slate-700 sm:col-span-2 sm:mt-0">
                      {hasResponse ? (
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 whitespace-pre-wrap font-mono text-sm">
                          {value}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">No response provided</span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
