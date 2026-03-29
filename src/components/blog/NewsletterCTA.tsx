import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter signup:', email);
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 5000);
    }
  };

  return (
    <section className="bg-slate-900 rounded-3xl overflow-hidden mt-16 mb-24 relative isolate py-16 px-6 sm:py-20 sm:px-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.800),theme(colors.slate.900))] opacity-50" />
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Get weekly tips on client management
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-300">
          Join 5,000+ freelancers and agency owners learning how to streamline their onboarding.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md gap-x-4">
          <label htmlFor="email-address" className="sr-only">Email address</label>
          <div className="relative flex-auto">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Mail className="h-5 w-5 text-slate-400" aria-hidden="true" />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-w-0 w-full flex-auto rounded-xl border-0 bg-white/5 py-3.5 pl-11 pr-4 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 transition-all"
              placeholder="Enter your email"
            />
          </div>
          <button
            type="submit"
            className={`flex-none rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all ${
              subscribed ? 'bg-green-500 hover:bg-green-400' : 'bg-indigo-500 hover:bg-indigo-400'
            }`}
          >
            {subscribed ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}
