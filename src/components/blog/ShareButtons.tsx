import { useState } from 'react';
import { Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-900 mr-2">Share:</span>
      
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#1DA1F2] hover:text-white transition-colors"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </a>
      
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#0A66C2] hover:text-white transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </a>
      
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-[#1877F2] hover:text-white transition-colors"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>
      
      <button
        onClick={handleCopy}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
          copied ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
        aria-label="Copy Link"
        title="Copy Link"
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      </button>

      {copied && (
        <span className="text-xs font-medium text-green-600 animate-in fade-in slide-in-from-bottom-2">
          Link copied!
        </span>
      )}
    </div>
  );
}
