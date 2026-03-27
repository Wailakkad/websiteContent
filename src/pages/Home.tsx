import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Send, Inbox, Shield, Zap, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import logo from '../images/newlogo.png';

export default function Home() {
    const { user } = useAuth();

    return (
        <div className="bg-white min-h-screen text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center h-full py-2">
                            <img src={logo} alt="Content Portal logo" className="h-9 max-h-full w-auto" />
                        </div>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                                        Sign in
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-indigo-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <div className="mx-auto max-w-3xl">
                            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6 leading-tight">
                                Stop chasing clients for <span className="text-indigo-600">website content.</span>
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-slate-600 mb-10">
                                Collect logos, copy, contact info, and website details in one clean, professional client portal. Say goodbye to endless email threads and missing files.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {user ? (
                                    <Link
                                        to="/dashboard"
                                        className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                                    >
                                        Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            to="/signup"
                                            className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                                        >
                                            Start Free <ArrowRight className="ml-2 h-5 w-5" />
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all"
                                        >
                                            Try the Portal
                                        </Link>
                                    </>
                                )}
                            </div>
                            <p className="mt-6 text-sm text-slate-500">No credit card required. Setup takes 2 minutes.</p>
                        </div>
                    </div>
                </section>

                {/* Problem/Solution Section */}
                <section className="py-24 bg-slate-50 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">The old way is broken</h2>
                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                Collecting assets via email leads to scattered files, missed messages, and delayed launches. Our portal provides a single source of truth for your client's brand.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                                <div className="flex flex-col items-start bg-white p-8 rounded-2xl shadow-sm ring-1 ring-slate-200/50">
                                    <div className="rounded-lg bg-indigo-50 p-2 ring-1 ring-indigo-200/50 mb-6">
                                        <Inbox className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <dt className="text-xl font-semibold leading-7 text-slate-900">One Central Hub</dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <p className="flex-auto">Everything you need from your client lives in one secure, branded link. No more searching through past emails for that one missing logo.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col items-start bg-white p-8 rounded-2xl shadow-sm ring-1 ring-slate-200/50">
                                    <div className="rounded-lg bg-indigo-50 p-2 ring-1 ring-indigo-200/50 mb-6">
                                        <Zap className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <dt className="text-xl font-semibold leading-7 text-slate-900">Professional Experience</dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <p className="flex-auto">Show your clients you mean business. Send them a beautifully designed form that builds trust and makes submitting content easy.</p>
                                    </dd>
                                </div>
                                <div className="flex flex-col items-start bg-white p-8 rounded-2xl shadow-sm ring-1 ring-slate-200/50">
                                    <div className="rounded-lg bg-indigo-50 p-2 ring-1 ring-indigo-200/50 mb-6">
                                        <Shield className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                                    </div>
                                    <dt className="text-xl font-semibold leading-7 text-slate-900">Automated Organization</dt>
                                    <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                        <p className="flex-auto">All submitted content is automatically organized by project. View everything at a glance in your agency dashboard.</p>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section className="py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How it works</h2>
                            <p className="mt-6 text-lg leading-8 text-slate-600">
                                Get your client's content in three simple steps.
                            </p>
                        </div>

                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24">
                            <div className="flex flex-col gap-12">
                                <div className="flex items-start gap-8">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">1</div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-slate-900">Create a Project</h3>
                                        <p className="mt-4 text-slate-600 leading-relaxed">Add your client's name and project details to your dashboard. We'll automatically generate a unique, secure portal link for them.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-8">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xl font-bold text-white">2</div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-slate-900">Send the Link</h3>
                                        <p className="mt-4 text-slate-600 leading-relaxed">Share the portal link with your client. They can open it on any device and start filling out their business details, social links, and about text.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-8">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white">3</div>
                                    <div>
                                        <h3 className="text-2xl font-semibold text-slate-900">Review and Build</h3>
                                        <p className="mt-4 text-slate-600 leading-relaxed">Check your dashboard to see when they've completed the form. All their responses are neatly organized, ready for you to use in their new website.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Feature Highlights List */}
                <section className="py-24 bg-indigo-50 sm:py-32 overflow-hidden">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-6">
                                    Everything you need to launch faster
                                </h2>
                                <p className="text-lg text-slate-600 mb-8">
                                    Built specifically for web design agencies, freelancers, and marketers who want to provide a premium onboarding experience.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        'Clean, conversion-optimized client forms',
                                        'Mobile-friendly portal for clients on the go',
                                        'Dashboard to manage multiple clients and projects',
                                        'Secure, private links for every project',
                                        'No confusing logins required for your clients'
                                    ].map((feature, idx) => (
                                        <li key={idx} className="flex items-center gap-3">
                                            <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                                            <span className="text-slate-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200 to-indigo-100 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
                                <div className="relative bg-white p-8 rounded-3xl shadow-xl ring-1 ring-slate-200/50">
                                    <div className="flex items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600">A</div>
                                        <div>
                                            <h4 className="font-semibold text-slate-900">Acme Corp Redesign</h4>
                                            <p className="text-sm text-slate-500">Acme Corporation</p>
                                        </div>
                                        <span className="ml-auto inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="space-y-4 opacity-80">
                                        <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                                    </div>
                                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                        <div className="text-sm font-medium text-indigo-600">View Client Responses</div>
                                        <ArrowRight className="h-4 w-4 text-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="relative isolate py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
                    <div className="mx-auto max-w-2xl">
                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Ready to streamline your workflow?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600">
                            Join professional agencies who have stopped fighting with email threads and started using Content Portal.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            {user ? (
                                <Link
                                    to="/dashboard"
                                    className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                                >
                                    Open Dashboard
                                </Link>
                            ) : (
                                <Link
                                    to="/signup"
                                    className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center">
                        <img src={logo} alt="Content Portal logo" className="h-9 w-auto" />
                    </div>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <Link to="/feedback" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
                            <MessageSquarePlus className="h-4 w-4" />
                            Leave Feedback
                        </Link>
                        <p className="text-sm text-slate-500">
                            &copy; {new Date().getFullYear()} Content Portal Inc. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
