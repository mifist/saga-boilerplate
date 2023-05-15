/**
 *
 * TypeFormAsap
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import classNames from 'classnames';
// import { Link, useHistory } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

// styles
import './style.scss';

// import useDeviceDetect from 'utils/useDeviceDetect';

// antd component
//import { Card } from 'antd';
//const { Meta } = Card;

// icons
//import CustomIcons from 'legacy/components/CustomIcons';
//import defaultUnitImage from 'images/default.jpg';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';
// global user
// import { withUser } from 'engine/context/User.context';
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
      console.log('/event/asapwebinardiscount');
      setUrlTypeForm('BzOlasZn');
    }
    if (window.location.pathname === '/event/asap') {
      console.log('/event/asap');
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
