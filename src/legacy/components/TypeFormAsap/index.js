/**
 *
 * TypeFormAsap
 *
 */

import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames';
// styles
import './style.scss';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';
import { Widget } from 'react-typeform-embed';

function TypeFormAsap({
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('TypeFormAsap-wrapper', className);
  //const { isMobile } = useDeviceDetect();

  const [urlTypeForm, setUrlTypeForm] = useState('UVQArv8G');

  useEffect(() => {
    const boxes = document.querySelectorAll('.unauthorized-footer');
    boxes.forEach(box => {
      box.style.display = 'none';
    });
    const scroll = document.querySelectorAll('.scroll-top-button');
    scroll.forEach(box => {
      box.style.display = 'none';
    });
    if (window.location.pathname === '/event/asapwebinardiscount') {
      //console.log('/event/asapwebinardiscount');
      setUrlTypeForm('BzOlasZn');
    }
    if (window.location.pathname === '/event/asap') {
      //console.log('/event/asap');
      setUrlTypeForm('UVQArv8G');
    }
  }, []);
  // BzOlasZn

  return (
    <div className={childClassNames}>
      <Widget id={urlTypeForm} hideHeaders />
    </div>
  );
}

TypeFormAsap.defaultProps = {};
TypeFormAsap.propTypes = {};

export default memo(TypeFormAsap);
