import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../../data/blogPosts';
import Breadcrumbs from '../../components/blog/Breadcrumbs';
import TableOfContents from '../../components/blog/TableOfContents';
import ShareButtons from '../../components/blog/ShareButtons';
import AuthorBox from '../../components/blog/AuthorBox';
import RelatedPosts from '../../components/blog/RelatedPosts';
import BlogCTA from '../../components/blog/BlogCTA';
import ReadingProgressBar from '../../components/blog/ReadingProgressBar';
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const postIndex = blogPosts.findIndex(p => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <Helmet>
          <title>Post Not Found | Content Portal</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
        <p className="text-slate-600 mb-8 text-center">The article you're looking for doesn't exist or has been moved.</p>
        <Link to="/blog" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
          Back to Blog
        </Link>
      </div>
    );
  }

  const prevPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;
  const nextPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;

  const absoluteCoverImage = post.coverImage.startsWith('http') 
    ? post.coverImage 
    : `https://www.yourdomain.com${post.coverImage}`;

  // Generate Schemas
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.yourdomain.com/blog/${post.slug}`
    },
    "headline": post.metaTitle,
    "description": post.metaDescription,
    "image": absoluteCoverImage,
    "author": {
      "@type": "Person",
      "name": post.author.name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Content Portal",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.yourdomain.com/logo.png"
      }
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt
  };

  const faqSchema = post.faqSchema && post.faqSchema.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faqSchema.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      <Helmet>
        <title>{post.metaTitle}</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://www.yourdomain.com/blog/${post.slug}`} />
        
        <meta property="og:title" content={post.metaTitle} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={absoluteCoverImage} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.yourdomain.com/blog/${post.slug}`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.metaTitle} />
        <meta name="twitter:description" content={post.metaDescription} />
        <meta name="twitter:image" content={absoluteCoverImage} />
        
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:modified_time" content={post.updatedAt} />
        <meta property="article:author" content={post.author.name} />

        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <ReadingProgressBar />

      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs 
            items={[
              { label: 'Blog', path: '/blog' },
              { label: post.title, path: `/blog/${post.slug}` }
            ]} 
          />
          
          <div className="mt-8 flex items-center gap-x-4 text-sm font-medium">
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
              {post.category}
            </span>
            <time dateTime={post.publishedAt} className="text-slate-500">
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
            <span className="flex items-center text-slate-500">
              <Clock className="w-4 h-4 mr-1.5" />
              {post.readingTime} min read
            </span>
          </div>
          
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-tight">
            {post.title}
          </h1>
          
          <div className="mt-8 flex items-center gap-x-4">
            <img src={post.author.avatar} alt="" className="h-12 w-12 rounded-full bg-slate-50 ring-2 ring-white shadow-sm" loading="lazy" width="48" height="48" />
            <div className="text-sm leading-6">
              <p className="font-semibold text-slate-900">{post.author.name}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          
          {/* Article Main Body */}
          <article className="lg:col-span-8">
            <div className="w-full aspect-[16/9] bg-slate-100 rounded-3xl overflow-hidden mb-12 shadow-sm ring-1 ring-slate-200">
              {!post.coverImage ? (
                <div className="w-full h-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center">
                  <span className="text-indigo-300 font-medium">Cover Image {post.slug}</span>
                </div>
              ) : (
                <img 
                  src={post.coverImage} 
                  alt={post.coverImageAlt} 
                  className="w-full h-full object-cover" 
                  loading="lazy"
                  width="1200"
                  height="630"
                />
              )}
            </div>

            {/* Mobile TOC */}
            <div className="lg:hidden mb-10">
              <TableOfContents items={post.tableOfContents} />
            </div>

            <div 
              className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-500 prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {/* Post Footer Metadata */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              <ShareButtons url={`https://www.yourdomain.com/blog/${post.slug}`} title={post.title} />
            </div>

            <AuthorBox author={post.author} />
            <BlogCTA />
            <RelatedPosts relatedSlugs={post.relatedSlugs} />

            {/* Previous / Next Article Navigation */}
            {(prevPost || nextPost) && (
              <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-slate-200">
                {prevPost ? (
                  <Link to={`/blog/${prevPost.slug}`} className="flex flex-col p-6 rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-indigo-300 transition-all group">
                    <span className="text-sm font-medium text-slate-500 flex items-center mb-2">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </span>
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{prevPost.title}</span>
                  </Link>
                ) : <div />}
                
                {nextPost ? (
                  <Link to={`/blog/${nextPost.slug}`} className="flex flex-col p-6 rounded-2xl bg-white ring-1 ring-slate-200 hover:ring-indigo-300 transition-all text-right group items-end">
                    <span className="text-sm font-medium text-slate-500 flex items-center mb-2">
                       Next <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">{nextPost.title}</span>
                  </Link>
                ) : <div />}
              </div>
            )}
          </article>

          {/* Desktop Right Sidebar Component (sticky offset by reading bar + header) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24">
              <TableOfContents items={post.tableOfContents} />
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
