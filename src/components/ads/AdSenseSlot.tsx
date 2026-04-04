import React, { useEffect } from 'react';

interface AdSenseSlotProps {
  client?: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  client = 'ca-pub-8686145269114347',
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style = { display: 'block' }
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error', e);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
