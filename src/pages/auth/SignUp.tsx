import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';
import SEO from '../../components/SEO';
import logo from '../../images/newlogo.png';
import { Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user) {
    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <SEO 
          title="Check Your Email" 
          description="We've sent a confirmation link. Please verify your address to activate your account." 
          canonical="/signup" 
        />
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex flex-col items-center">
            <Link to="/" className="mb-6 drop-shadow-md">
              <img src={logo} alt="Content Portal logo" width="131" height="36" className="h-9 w-auto" />
            </Link>
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 mb-6 shadow-sm ring-8 ring-green-50">
              <Mail className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Check your email
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              We've sent a confirmation link to <span className="font-semibold text-slate-900">{email}</span>.
              Please verify your address to activate your account.
            </p>
          </div>

          <div className="bg-white px-8 py-10 shadow-xl shadow-slate-200/40 ring-1 ring-slate-200 rounded-3xl space-y-6">
            <div className="flex items-start gap-3 text-left bg-indigo-50/50 p-4 rounded-2xl ring-1 ring-indigo-100">
              <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
              <p className="text-sm text-indigo-900">
                <span className="font-semibold">Almost there!</span> Once confirmed, you'll be able to log in and start creating portals.
              </p>
            </div>

            <div className="text-sm text-slate-500 italic">
              Don't see it? Check your spam or junk folder.
            </div>

            <div className="pt-2">
              <Link
                to="/login"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
              >
                Go to login
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 selection:bg-indigo-100 selection:text-indigo-900">
      <SEO 
        title="Sign Up" 
        description="Create a unified Content Portal to stop chasing clients. Start collecting assets and website content elegantly today." 
        canonical="/signup" 
      />
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center">
          <Link to="/" className="mb-6 drop-shadow-md">
            <img src={logo} alt="Content Portal logo" width="131" height="36" className="h-9 w-auto" />
          </Link>
          <h1 className="text-center text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600">
            Start organizing your client content today.
          </p>
        </div>

        <div className="bg-white px-8 py-10 shadow-xl shadow-slate-200/40 ring-1 ring-slate-200 sm:rounded-2xl">
          <form className="space-y-6" onSubmit={handleSignUp}>
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 ring-1 ring-inset ring-red-600/20">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 transition-all"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 transition-all"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-slate-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  className="block w-full rounded-xl border-0 py-2.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-4 transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 transition-all"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </div>
            <div className="text-center text-sm pt-4">
              <span className="text-slate-500">Already have an account?</span>{' '}
              <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
