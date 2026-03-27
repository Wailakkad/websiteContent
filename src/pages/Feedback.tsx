import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquarePlus, CheckCircle2, ChevronLeft } from 'lucide-react';
import logo from '../images/newlogo.png';
import { useAuth } from '../components/AuthProvider';

const USER_TYPES = ['Freelancer', 'Agency owner', 'Developer', 'Designer', 'Client', 'Other'];
const USED_AREAS_OPTIONS = ['Dashboard', 'Create Client', 'Create Project', 'Client Portal', 'Content Submission'];

export default function Feedback() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        userType: '',
        email: '',
        canContact: false,
        usedProduct: false,
        usedAreas: [] as string[],
        rating: 0,
        likedMost: '',
        frustrations: '',
        nextFeature: '',
    });

    useEffect(() => {
        if (user && user.email) {
            setFormData((prev) => ({ ...prev, email: user.email! }));
        }
    }, [user]);

    const toggleArea = (area: string) => {
        setFormData((prev) => {
            const isSelected = prev.usedAreas.includes(area);
            if (isSelected) {
                return { ...prev, usedAreas: prev.usedAreas.filter((a) => a !== area) };
            } else {
                return { ...prev, usedAreas: [...prev.usedAreas, area] };
            }
        });
    };

    const handleRating = (r: number) => {
        setFormData((prev) => ({ ...prev, rating: r }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const message = `
📩 *New Feedback Submission*

👤 *Role:* ${formData.userType}
📧 *Email:* ${formData.email || 'Not provided'}
📞 *Can contact:* ${formData.canContact ? 'Yes' : 'No'}
🚀 *Used product:* ${formData.usedProduct ? 'Yes' : 'No'}
📍 *Areas used:* ${formData.usedAreas.join(', ') || 'None'}
⭐ *Rating:* ${formData.rating || 'Not rated'}

❤️ *What they liked:*
${formData.likedMost || 'N/A'}

😟 *Frustrations/Missing:*
${formData.frustrations || 'N/A'}

💡 *Next feature:*
${formData.nextFeature || 'N/A'}

🕒 *Submitted At:* ${new Date().toLocaleString()}
`.trim();

            const whatsappUrl = `https://wa.me/212717837586?text=${encodeURIComponent(message)}`;
            
            // Redirect to WhatsApp
            window.location.href = whatsappUrl;
            
            // Set success state
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900">
                <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl ring-1 ring-slate-200/50 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Thank you!</h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Your feedback is incredibly valuable to us as we continue to improve the platform.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link
                            to={user ? "/dashboard" : "/"}
                            className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                        >
                            {user ? "Back to Dashboard" : "Back to Home"}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
                    <Link to={user ? "/dashboard" : "/"} className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back
                    </Link>
                    <div className="flex items-center h-full py-2">
                        <img src={logo} alt="Content Portal logo" className="h-9 max-h-full w-auto" />
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-12">
                <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-sm ring-1 ring-slate-200/50">
                    <div className="mb-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 mb-4">
                            <MessageSquarePlus className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Share Your Feedback</h1>
                        <p className="mt-3 text-base text-slate-600">
                            Help us build a better experience for you and your clients.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-600/20">
                                {error}
                            </div>
                        )}

                        {/* Profile Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Who are you?</label>
                                <select
                                    required
                                    value={formData.userType}
                                    onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                                    className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
                                >
                                    <option value="" disabled>Select a role...</option>
                                    {USER_TYPES.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">Email address (optional)</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="you@example.com"
                                    className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl ring-1 ring-slate-200/50">
                            <input
                                type="checkbox"
                                id="canContact"
                                checked={formData.canContact}
                                onChange={(e) => setFormData({ ...formData, canContact: e.target.checked })}
                                className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                            />
                            <label htmlFor="canContact" className="text-sm text-slate-700 cursor-pointer">
                                It's okay to contact me about my feedback
                            </label>
                        </div>

                        {/* Usage */}
                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="text-sm font-semibold text-slate-900 mb-4">Product Experience</h3>

                            <div className="mb-6">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="usedProduct"
                                        checked={formData.usedProduct}
                                        onChange={(e) => setFormData({ ...formData, usedProduct: e.target.checked })}
                                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer"
                                    />
                                    <label htmlFor="usedProduct" className="text-sm font-medium text-slate-800 cursor-pointer">
                                        I have used the product for an actual project
                                    </label>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium leading-6 text-slate-900 mb-3">Which areas have you used? (Select all that apply)</label>
                                <div className="flex flex-wrap gap-2">
                                    {USED_AREAS_OPTIONS.map((area) => (
                                        <button
                                            type="button"
                                            key={area}
                                            onClick={() => toggleArea(area)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${formData.usedAreas.includes(area)
                                                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                                }`}
                                        >
                                            {area}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium leading-6 text-slate-900 mb-3">How would you rate your overall experience?</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => handleRating(star)}
                                            className={`h-12 w-12 rounded-xl border text-lg font-semibold transition-all ${formData.rating === star
                                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                                }`}
                                        >
                                            {star}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Detailed Feedback */}
                        <div className="pt-6 border-t border-slate-100 space-y-6">
                            <div>
                                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">What did you like most?</label>
                                <textarea
                                    rows={3}
                                    value={formData.likedMost}
                                    onChange={(e) => setFormData({ ...formData, likedMost: e.target.value })}
                                    className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
                                    placeholder="E.g. The dashboard is very clean..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">What felt confusing, frustrating, or missing?</label>
                                <textarea
                                    rows={3}
                                    value={formData.frustrations}
                                    onChange={(e) => setFormData({ ...formData, frustrations: e.target.value })}
                                    className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
                                    placeholder="E.g. I couldn't figure out how to..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">What feature would you most like next?</label>
                                <textarea
                                    rows={2}
                                    value={formData.nextFeature}
                                    onChange={(e) => setFormData({ ...formData, nextFeature: e.target.value })}
                                    className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
                                    placeholder="E.g. Custom domains, white labeling..."
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-slate-900 px-4 py-4 text-base font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                                {loading ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
