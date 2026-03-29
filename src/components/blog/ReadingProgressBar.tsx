import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      // Calculate scroll progress exclusively based on the viewport and document height
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (scrollHeight > 0) {
        const progress = Number((currentScroll / scrollHeight).toFixed(2)) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress(); // Initial check

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-[100]">
      <div 
        className="h-full bg-indigo-600 transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  );
}
