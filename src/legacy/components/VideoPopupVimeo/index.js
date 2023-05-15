/**
 *
 * VideoPopupVimeo
 *
 */

import React, { memo, useEffect, useState } from 'react';
import classNames from 'classnames';

// styles
import './style.scss';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';
import { Image } from 'antd';
import Modal from 'antd/es/modal/Modal';
import VideoPlayer from '../VideoPlayer';

function VideoPopupVimeo({
  // default props
  className,
  imageSrc,
  videoSrc,
  ...rest
}) {
  const childClassNames = classNames('VideoPopupVimeo-wrapper', className);
  //const { isMobile } = useDeviceDetect();

  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
  };

  return (
    <div className={childClassNames}>
      <div className="comment-img comment-img-display">
        <img
          src={imageSrc}
          onClick={() => showModal()}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <Modal
        visible={visible}
        footer={null}
        onCancel={() => hideModal()}
        className={'video-modal'}
      >
        <div className={'video-wrapper-modal'}>
          <VideoPlayer url={videoSrc} />
        </div>
      </Modal>
    </div>
  );
}

VideoPopupVimeo.defaultProps = {};
VideoPopupVimeo.propTypes = {};

export default memo(VideoPopupVimeo);
