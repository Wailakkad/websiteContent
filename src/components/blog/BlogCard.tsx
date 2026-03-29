import { Link } from 'react-router-dom';
import { BlogPost } from '../../data/blogPosts';
import { Clock } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  small?: boolean;
}

export default function BlogCard({ post, small = false }: BlogCardProps) {
  return (
    <article className="flex flex-col items-start justify-between bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/50 overflow-hidden transition-all hover:shadow-md hover:ring-slate-300 h-full group">
      <Link to={`/blog/${post.slug}`} className="w-full relative overflow-hidden aspect-[16/9]">
        {!post.coverImage ? (
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center text-indigo-300 font-medium">Cover Image Placeholder</div>
        ) : (
          <img 
            src={post.coverImage} 
            alt={post.coverImageAlt}
            width="600"
            height="338"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </Link>
      
      <div className={`flex flex-col flex-1 w-full ${small ? 'p-5' : 'p-6 sm:p-8'}`}>
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={post.publishedAt} className="text-slate-500">
            {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </time>
          <span className="relative z-10 rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-600">
            {post.category}
          </span>
        </div>
        
        <div className="group relative mt-4 flex-1">
          <h2 className={`${small ? 'text-lg' : 'text-xl'} font-semibold leading-tight text-slate-900 group-hover:text-indigo-600 transition-colors`}>
            <Link to={`/blog/${post.slug}`}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h2>
          <p className={`mt-3 ${small ? 'text-sm' : 'text-base'} leading-relaxed text-slate-600 line-clamp-3`}>
            {post.excerpt}
          </p>
        </div>

        <div className="relative mt-6 flex items-center justify-between w-full border-t border-slate-100 pt-6">
          <div className="flex items-center gap-x-4">
            <img src={post.author.avatar} alt={post.author.name} width="40" height="40" loading="lazy" className="h-10 w-10 rounded-full bg-slate-50 object-cover" />
            <div className="text-sm leading-6">
              <p className="font-semibold text-slate-900">
                <span className="absolute inset-0" />
                {post.author.name}
              </p>
            </div>
          </div>
          <div className="flex items-center text-xs text-slate-500 font-medium">
            <Clock className="w-4 h-4 mr-1.5" />
            {post.readingTime} min read
          </div>
        </div>
      </div>
    </article>
  );
}
