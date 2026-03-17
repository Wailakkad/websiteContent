import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import { Copy, ExternalLink, CheckCircle2, Circle } from 'lucide-react';

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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading project details...</div>;
  if (!project) return <div className="p-8 text-center text-gray-500">Project not found</div>;

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
      <div className="bg-white px-6 py-8 shadow sm:rounded-lg">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {project.title}
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Client: {project.clients?.name}
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500">
                Status: {project.status.replace('_', ' ')}
              </div>
            </div>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0 gap-3">
            <button
              onClick={copyPortalLink}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <Copy className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              {copied ? 'Copied!' : 'Copy Portal Link'}
            </button>
            <Link
              to={`/portal/${project.portal_token}`}
              target="_blank"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <ExternalLink className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              View Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Submitted Content</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Information submitted by the client via the portal.
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6 space-y-6">
          {!content ? (
            <div className="text-center py-8 text-gray-500">
              No content has been submitted yet.
            </div>
          ) : (
            fields.map(field => {
              const value = content[field.key];
              const hasResponse = value && value.trim() !== '';
              
              return (
                <div key={field.key} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        {hasResponse ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-300" />
                        )}
                        {field.label}
                      </h4>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700 bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                    {hasResponse ? value : <span className="text-gray-400 italic">No response yet</span>}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
