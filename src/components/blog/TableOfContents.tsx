import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Get offset taking sticky header into account
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-50 rounded-2xl p-6 ring-1 ring-slate-200/50">
      <div 
        className="flex items-center justify-between cursor-pointer lg:cursor-default" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-semibold text-slate-900 text-lg">Table of Contents</h3>
        <button className="lg:hidden text-slate-500">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <nav className={`mt-4 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li 
              key={item.id} 
              style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}
              className="border-l-2 border-transparent transition-colors"
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block w-full hover:text-indigo-600 transition-colors ${
                  activeId === item.id 
                    ? 'text-indigo-600 font-medium' 
                    : 'text-slate-600'
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
