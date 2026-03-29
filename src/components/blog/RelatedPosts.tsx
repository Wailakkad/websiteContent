import { blogPosts } from '../../data/blogPosts';
import BlogCard from './BlogCard';

interface RelatedPostsProps {
  relatedSlugs: string[];
}

export default function RelatedPosts({ relatedSlugs }: RelatedPostsProps) {
  if (!relatedSlugs || relatedSlugs.length === 0) return null;

  const posts = relatedSlugs
    .map(slug => blogPosts.find(p => p.slug === slug))
    .filter(Boolean)
    .slice(0, 3); // Max 3

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-16 border-t border-slate-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Read Next</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          post && <BlogCard key={post.id} post={post} small={true} />
        ))}
      </div>
    </section>
  );
}
