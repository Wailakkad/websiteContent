interface AuthorBoxProps {
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
}

export default function AuthorBox({ author }: AuthorBoxProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 rounded-2xl bg-indigo-50/50 p-8 ring-1 ring-indigo-100/50 mt-12 mb-16">
      <img
        src={author.avatar}
        alt={author.name}
        width="96"
        height="96"
        loading="lazy"
        className="h-24 w-24 rounded-full object-cover ring-4 ring-white shadow-sm shrink-0"
      />
      <div className="text-center sm:text-left">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Written by {author.name}</h3>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          {author.bio}
        </p>
      </div>
    </div>
  );
}
