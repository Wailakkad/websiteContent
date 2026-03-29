import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../../data/blogPosts';
import BlogCard from '../../components/blog/BlogCard';
import NewsletterCTA from '../../components/blog/NewsletterCTA';

export default function BlogListing() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map(post => post.category));
    return ['All', ...Array.from(cats)].sort();
  }, []);

  const filteredPosts = useMemo(() => {
    return activeCategory === 'All' 
      ? blogPosts 
      : blogPosts.filter(post => post.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <Helmet>
        <title>Blog - Client Onboarding Tips & Guides | Content Portal</title>
        <meta name="description" content="Expert tips and guides on client onboarding, content collection, and project management for freelancers and agencies." />
        <link rel="canonical" href="https://www.yourdomain.com/blog" />
        <meta property="og:title" content="Blog - Client Onboarding Tips & Guides" />
        <meta property="og:description" content="Expert tips and guides on client onboarding, content collection, and project management for freelancers and agencies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.yourdomain.com/blog" />
      </Helmet>

      {/* Header section */}
      <div className="bg-white border-b border-slate-200 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Expert insights, strategies, and guides to help you streamline client onboarding, collect content faster, and scale your freelance or agency business.
          </p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sm:mb-16">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 ring-1 ring-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl ring-1 ring-slate-200">
            <p className="text-slate-500 text-lg">No posts found for this category.</p>
          </div>
        )}

        <NewsletterCTA />
      </main>
    </div>
  );
}
