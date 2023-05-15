import React, { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export default function useScreenOrientation() {
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    const handleOrientationChange = () => {
      if (Capacitor.getPlatform() !== 'web') {
        setOrientation(
          window.innerHeight > window.innerWidth ? 'portrait' : 'landscape',
        );
      }
    };

    window.addEventListener('resize', handleOrientationChange);

    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  return orientation;
}
