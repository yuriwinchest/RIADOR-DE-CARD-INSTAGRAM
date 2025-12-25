import React, { useEffect } from 'react';
import styles from './GoogleAdSense.module.css';

interface GoogleAdSenseProps {
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdSense: React.FC<GoogleAdSenseProps> = ({ className = '' }) => {
  useEffect(() => {
    try {
      // Initialize AdSense
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense initialization error:', err);
    }
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="autorelaxed"
        data-ad-client="ca-pub-9418698951727721"
        data-ad-slot="8622011802"
      />
    </div>
  );
};

export default GoogleAdSense;

