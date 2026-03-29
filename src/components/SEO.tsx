import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
}

export default function SEO({ 
  title, 
  description, 
  canonical, 
  ogImage = '/og-image.jpg', 
  ogType = 'website',
  keywords = 'client onboarding, content collection, asset management, client portal'
}: SEOProps) {
  const siteName = 'Content Portal';
  const fullTitle = `${title} | ${siteName}`;
  const domain = 'https://www.yourdomain.com';
  const canonicalUrl = canonical ? `${domain}${canonical}` : domain;
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${domain}${ogImage}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:url" content={canonicalUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
