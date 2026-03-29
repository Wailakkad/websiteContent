import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Generate JSON-LD schema
  const schemaList = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.yourdomain.com/"
    },
    ...items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: item.label,
      item: `https://www.yourdomain.com${item.path}`
    }))
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": schemaList
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-slate-500 overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          <li>
            <Link to="/" className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center">
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.path} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4 text-slate-300" />
                {isLast ? (
                  <span className="text-slate-900 font-medium line-clamp-1 max-w-[200px] sm:max-w-none" aria-current="page">
                    {item.label}
                  </span>
                ) : (
                  <Link to={item.path} className="hover:text-indigo-600 transition-colors">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
