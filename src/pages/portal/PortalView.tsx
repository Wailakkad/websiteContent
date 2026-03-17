import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

export default function PortalView() {
  const { token } = useParams<{ token: string }>();
  const [project, setProject] = useState<any>(null);
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (token) fetchPortalData();
  }, [token]);

  async function fetchPortalData() {
    if (!token) {
      setLoading(false);
      return;
    }

    // Fetch project and content securely via RPC
    const { data, error } = await supabase
      .rpc('get_portal_data', { p_token: token });

    if (error || !data) {
      console.error('Error fetching portal data:', error);
      setLoading(false);
      return;
    }

    const { project, content } = data as any;
    setProject(project);

    if (content) {
      setFormData({
        business_name: content.business_name || '',
        business_description: content.business_description || '',
        about_text: content.about_text || '',
        services: content.services || '',
        phone: content.phone || '',
        email: content.email || '',
        address: content.address || '',
        instagram: content.instagram || '',
        facebook: content.facebook || '',
        linkedin: content.linkedin || ''
      });
    }
    
    setLoading(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !token) return;
    setSaving(true);
    setSaveMessage('');

    try {
      // Save content securely via RPC
      const { error } = await supabase
        .rpc('save_portal_content', {
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
      
      if (error) throw error;

      setSaveMessage('Progress saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving responses:', error);
      setSaveMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Portal Not Found</h2>
          <p className="text-gray-600">The link you followed may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white px-6 py-8 shadow sm:rounded-lg text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">{project.description}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Business Details</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Basic information about your business.</p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium leading-6 text-gray-900">Business Name</label>
                <div className="mt-2">
                  <input type="text" name="business_name" id="business_name" value={formData.business_name} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                </div>
              </div>
              <div>
                <label htmlFor="business_description" className="block text-sm font-medium leading-6 text-gray-900">Business Description</label>
                <div className="mt-2">
                  <textarea name="business_description" id="business_description" rows={3} value={formData.business_description} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                </div>
              </div>
              <div>
                <label htmlFor="about_text" className="block text-sm font-medium leading-6 text-gray-900">About Us Text</label>
                <div className="mt-2">
                  <textarea name="about_text" id="about_text" rows={4} value={formData.about_text} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                </div>
              </div>
              <div>
                <label htmlFor="services" className="block text-sm font-medium leading-6 text-gray-900">Services</label>
                <div className="mt-2">
                  <textarea name="services" id="services" rows={4} value={formData.services} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow sm:rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Contact & Socials</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">How customers can reach you.</p>
            </div>
            <div className="px-4 py-5 sm:p-6 space-y-6">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">Phone</label>
                  <div className="mt-2">
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                  <div className="mt-2">
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Address</label>
                  <div className="mt-2">
                    <textarea name="address" id="address" rows={2} value={formData.address} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium leading-6 text-gray-900">Instagram URL</label>
                  <div className="mt-2">
                    <input type="url" name="instagram" id="instagram" value={formData.instagram} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium leading-6 text-gray-900">Facebook URL</label>
                  <div className="mt-2">
                    <input type="url" name="facebook" id="facebook" value={formData.facebook} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="linkedin" className="block text-sm font-medium leading-6 text-gray-900">LinkedIn URL</label>
                  <div className="mt-2">
                    <input type="url" name="linkedin" id="linkedin" value={formData.linkedin} onChange={handleChange} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Save Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="text-sm font-medium">
                {saveMessage && (
                  <span className={saveMessage.includes('Failed') ? 'text-red-600' : 'text-green-600'}>
                    {saveMessage}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                <Save className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                {saving ? 'Saving...' : 'Save Progress'}
              </button>
            </div>
          </div>
          
          {/* Spacer for floating bar */}
          <div className="h-24"></div>
        </form>
      </div>
    </div>
  );
}
