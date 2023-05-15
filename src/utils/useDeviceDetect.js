// appHooks/useDeviceDetect.js
import React from 'react';

export default function useDeviceDetect() {
  const [isMobile, setMobile] = React.useState(false);
  const [isMobileBrowser, setIsMobileBrowser] = React.useState(false);
  React.useEffect(() => {
    window.addEventListener('resize', () => {
      const width = window.innerWidth > 0 ? window.innerWidth : screen.width;
      if (width < 800) {
        setMobile(true);
      } else {
        setMobile(false);
      }
    });
  }, []);

  React.useEffect(() => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    let mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
      ),
    );

    if (!mobile) {
      const width = window.innerWidth > 0 ? window.innerWidth : screen.width;

      if (width < 800) {
        mobile = true;
      }
    } else {
      setIsMobileBrowser(true);
    }

    setMobile(mobile);
  }, []);

  return { isMobile, isMobileBrowser };
}
