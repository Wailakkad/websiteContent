import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Database } from '../../types/database.types';
import SEO from '../../components/SEO';
import logo from '../../images/newlogo.png';

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  client: { name: string, company_name: string | null } | null;
  content: any | null;
};

export default function PortalView() {
  const { token } = useParams<{ token: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Form fields state
  const [formData, setFormData] = useState({
    business_name: '',
    business_description: '',
    about_text: '',
    services: '',
    phone: '',
    email: '',
    address: '',
    instagram: '',
    facebook: '',
    linkedin: ''
  });

  useEffect(() => {
    if (token) {
      fetchProject();
    }
  }, [token]);

  async function fetchProject() {
    try {
      // Find project by token via RPC (Security Definer avoids RLS issues for anon)
      const { data, error: rpcError } = await supabase.rpc('get_portal_data', { p_token: token });

      if (rpcError || !data) {
        throw new Error('Project not found or link is invalid.');
      }

      const portalData = data as Project;
      setProject(portalData);

      // Fix: Check project status instead of content existence to determine submission state.
      // This ensures new projects (status: 'draft') always show the form, even if
      // an empty content row exists. The portal only shows the "Thank you" screen
      // once the status is explicitly set to 'completed' via the submit RPC.
      if (portalData.status === 'completed') {
        setSubmitted(true);
      }

    } catch (err: any) {
      setError(err.message || 'Failed to load project portal');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setSubmitting(true);
    setError('');

    try {
      // Save content and update project status via secure RPC
      const { error: submitError } = await supabase.rpc('save_portal_content', {
        p_token: token,
        p_business_name: formData.business_name,
        p_business_description: formData.business_description,
        p_about_text: formData.about_text,
        p_services: formData.services,
        p_phone: formData.phone,
        p_email: formData.email,
        p_address: formData.address,
        p_instagram: formData.instagram,
        p_facebook: formData.facebook,
        p_linkedin: formData.linkedin
      });

      if (submitError) throw submitError;

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Submission error:', err);
      setError('Failed to submit content. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <SEO 
          title="Portal Not Found" 
          description="This client portal link is invalid or has expired." 
        />
        <div className="max-w-md mx-auto text-center">
          <img src={logo} alt="Content Portal logo" className="mx-auto h-12 w-auto opacity-50" />
          <h1 className="mt-4 text-lg font-semibold text-slate-900">Portal Not Available</h1>
          <p className="mt-2 text-slate-600">{error || 'This portal link is invalid or has expired.'}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8 flex items-center">
        <SEO 
          title="Submission Successful" 
          description="Your content has been successfully submitted via Content Portal." 
        />
        <div className="max-w-md mx-auto text-center bg-white p-10 rounded-3xl shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">Thank you!</h1>
          <p className="mt-3 text-slate-500">
            Your content has been successfully submitted. We will review it shortly and get back to you with the next steps.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <SEO 
        title={`${project?.title || 'Client'} Content Portal`} 
        description="Securely submit your business information, logos, and content for your upcoming web project." 
        canonical={`/portal/${token}`} 
      />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Content Portal logo" className="h-12 w-auto" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Content Collection Portal
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-500">
            Please fill out the form below with the information for your project: <span className="font-medium text-slate-900">{project.title}</span>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow-sm ring-1 ring-slate-200 rounded-3xl overflow-hidden divide-y divide-slate-100">
          {/* General Information */}
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-lg font-semibold leading-7 text-slate-900">Business Information</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">The core details about your company.</p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-full">
                <label htmlFor="business_name" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Official Business Name <span className="text-slate-400 font-normal">(Required)</span>
                </label>
                <input
                  type="text"
                  name="business_name"
                  id="business_name"
                  required
                  value={formData.business_name}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>

              <div className="col-span-full">
                <label htmlFor="business_description" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Short Business Description / Tagline
                </label>
                <input
                  type="text"
                  name="business_description"
                  id="business_description"
                  placeholder="e.g. We provide fast, reliable plumbing services."
                  value={formData.business_description}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
          </div>

          {/* Long Form Content */}
          <div className="px-6 py-8 sm:p-10 bg-slate-50/50">
            <h2 className="text-lg font-semibold leading-7 text-slate-900">Detailed Content</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Text that will appear on main pages of your website.</p>

            <div className="mt-8 space-y-8">
              <div>
                <label htmlFor="about_text" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  About Us / Company History
                </label>
                <textarea
                  id="about_text"
                  name="about_text"
                  rows={4}
                  placeholder="Tell us the story behind your business..."
                  value={formData.about_text}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>

              <div>
                <label htmlFor="services" className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  List of Services / Products
                </label>
                <textarea
                  id="services"
                  name="services"
                  rows={4}
                  placeholder="What exactly do you offer? (You can list them out)"
                  value={formData.services}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-lg font-semibold leading-7 text-slate-900">Contact & Socials</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">Where clients can reach you online and offline.</p>

            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900 mb-2">Public Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900 mb-2">Public Phone</label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-slate-900 mb-2">Physical Address</label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium leading-6 text-slate-900 mb-2">Instagram Username / Link</label>
                <input
                  type="text"
                  name="instagram"
                  id="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium leading-6 text-slate-900 mb-2">Facebook Link</label>
                <input
                  type="text"
                  name="facebook"
                  id="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-slate-900 mb-2">LinkedIn Link</label>
                <input
                  type="text"
                  name="linkedin"
                  id="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4"
                />
              </div>
            </div>
          </div>

          <div className="px-6 py-6 sm:px-10 bg-slate-50 flex items-center justify-between">
            <p className="text-xs text-slate-500">You can only submit this content once.</p>
            <button
              type="submit"
              disabled={submitting || !formData.business_name}
              className="rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
