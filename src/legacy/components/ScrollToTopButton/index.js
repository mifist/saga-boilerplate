/**
 *
 * ScrollToTopButton
 *
 */

import React, { useEffect, useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { BackTop, Button } from 'antd';

// icons
import { ToTopOutlined } from '@ant-design/icons';
//import CustomIcons from 'legacy/components/CustomIcons';

function ScrollToTopButton({
  target,
  visibilityHeight,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('scroll-top-button', className);

  const { isMobile } = useDeviceDetect();

  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const currentTargetBody = document.querySelector(
      '.app-main-layout > .ant-layout.layout',
    );
    const scrolled = currentTargetBody.scrollTop;

    if (scrolled > visibilityHeight) {
      setVisible(true);
    } else if (scrolled <= visibilityHeight) {
      setVisible(false);
    }
  };

  const toggleVisibleTarget = () => {
    if (target) {
      const currentTargetBody = document.querySelector(
        '.app-main-layout > .ant-layout.layout',
      );
      const currentTarget = document.querySelector(target);
      const scrolledTarget = currentTarget.scrollTop;
      // const scrolled = document.documentElement.scrollTop;
      //   getComputedStyle(document.documentElement).getPropertyValue("--sat")
      if (currentTarget.offsetTop > 0) {
        currentTargetBody.scrollTo({
          top:
            (currentTarget.offsetTop || 0) +
            (currentTarget.offsetParent.offsetTop || 0) -
            (32 + 20),
          behavior: 'smooth',
        });
      }
      if (scrolledTarget > visibilityHeight) {
        setVisible(true);
      } else if (scrolledTarget <= visibilityHeight) {
        setVisible(false);
      }
    }
  };

  //SCROLL LISTENER
  useEffect(() => {
    const currentTargetBody = document.querySelector(
      '.app-main-layout > .ant-layout.layout',
    );
    currentTargetBody.addEventListener('scroll', toggleVisible);
    if (target) {
      const currentTarget = document.querySelector(target);
      currentTarget.addEventListener('scroll', toggleVisibleTarget);
    }
  }, [target]);

  const scrollTopHandle = e => {
    const currentTargetBody = document.querySelector(
      '.app-main-layout > .ant-layout.layout',
    );
    currentTargetBody.scrollTo({
      top: 0,
      behavior: 'smooth',
      /* you can also use 'auto' behaviour
         in place of 'smooth' */
    });
    if (target) {
      const currentTarget = document.querySelector(target);
      currentTarget.scrollTo({
        top: 0,
        behavior: 'smooth',
        /* you can also use 'auto' behaviour
           in place of 'smooth' */
      });
    }
  };

  return (
    (isMobile || !isMobile) && (
      <div
        className={childClassNames}
        //  target={target}
        onClick={scrollTopHandle}
      >
        <Button
          shape="circle"
          className={'scroll-to-top-button'}
          icon={<ToTopOutlined />}
          size="large"
        />
      </div>
    )
  );
}

ScrollToTopButton.defaultProps = {
  visibilityHeight: 300,
};
ScrollToTopButton.propTypes = {};

export default ScrollToTopButton;
