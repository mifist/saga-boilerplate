/**
 *
 * ScrollToTop
 *
 */

import { useEffect, useLayoutEffect, useRef } from 'react';
import { withRouter } from 'react-router-dom';

function ScrollToTop({ history }) {
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0);
  }, [location.pathname]);

  var isSafari =
    navigator.vendor &&
    navigator.vendor.indexOf('Apple') > -1 &&
    navigator.userAgent &&
    navigator.userAgent.indexOf('CriOS') == -1 &&
    navigator.userAgent.indexOf('FxiOS') == -1;

  useEffect(() => {
    const unlisten = history.listen(() => {
      const currentTargetBody = document.querySelector(
        '.app-main-layout > .ant-layout.layout',
      );

      if (window?.location?.hash === '#preview' && isSafari) {
      } else {
        if (currentTargetBody) {
          let loca = window.location.pathname;
          if (
            loca.includes('community') &&
            !loca.includes('community/detail') &&
            !loca.includes('community/create')
          ) {
          } else {
            currentTargetBody.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        }
      }

      // document.getElementById('custom-mobile').scrollIntoView();
    });
    return () => {
      unlisten();
    };
  });

  return null;
}

export default withRouter(ScrollToTop);
