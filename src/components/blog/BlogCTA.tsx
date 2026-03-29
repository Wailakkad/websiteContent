import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function BlogCTA() {
  return (
    <div className="bg-indigo-50 rounded-3xl p-8 sm:p-12 border border-indigo-100 mt-12 mb-16 relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
      {/* Background decoration */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
      
      <div className="relative z-10 max-w-xl">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">
          Ready to streamline your client onboarding?
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Stop waiting on endless email threads. Get all your client logos, copy, and brand assets perfectly organized in one professional drag-and-drop portal.
        </p>
      </div>
      
      <div className="relative z-10 shrink-0">
        <Link
          to="/signup"
          className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 transition-all whitespace-nowrap"
        >
          Try Content Portal Free
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
        <p className="text-xs text-center text-slate-500 mt-3">No credit card required.</p>
      </div>
    </div>
  );
}
