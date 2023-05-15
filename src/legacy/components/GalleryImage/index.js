/**
 *
 * GalleryImage
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { FormattedMessage } from 'react-intl';
import { Helmet } from 'react-helmet';
import './style.scss';
import { Image, Button } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import VideoPlayer from '../VideoPlayer';
import messages from './messages';

function GalleryImage({ content, selectionItem }) {
  const [currentImage, setCurrentImage] = useState(content[0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (content.includes(selectionItem)) {
      setCurrentImage(selectionItem);
    }
  }, [selectionItem]);

  const handleClickNav = nav => {
    let index = 0;
    for (let i = 0; i < content.length; i++) {
      if (content[i] === currentImage) {
        index = i;
      }
    }

    let isDone = false;
    if (index === content.length - 1) {
      if (nav === 'right') {
        setCurrentImage(content[0]);
        isDone = true;
      }
      if (nav === 'left') {
        setCurrentImage(content[index - 1]);
        isDone = true;
      }
    }
    if (index === 0) {
      if (nav === 'left') {
        setCurrentImage(content[content.length - 1]);
        isDone = true;
      }
      if (nav === 'right') {
        setCurrentImage(content[index + 1]);
        isDone = true;
      }
    }
    if (!isDone) {
      if (nav === 'right') {
        setCurrentImage(content[index + 1]);
      } else {
        setCurrentImage(content[index - 1]);
      }
    }
  };

  return (
    <div>
      {content.length > 1 && (
        <div className="gallery-navigation">
          <Button
            className="left-item"
            type="primary"
            shape="circle"
            icon={<LeftOutlined />}
            onClick={() => handleClickNav('left')}
          />
          <Button
            className="right-item"
            type="primary"
            shape="circle"
            icon={<RightOutlined />}
            onClick={() => handleClickNav('right')}
          />
        </div>
      )}
      <div className="image-container">
        <Image className="main-image" src={currentImage} alt="" width="auto" />
      </div>

      <div className="gallery-image">
        {content &&
          content.map((item, index) => (
            <div
              key={item}
              className={`gallery-item ${
                content[index] === currentImage ? 'selected' : ''
              }`}
              onClick={() => setCurrentImage(content[index])}
            >
              <img src={item} alt="" width={100} />
            </div>
          ))}
      </div>
    </div>
  );
}

GalleryImage.propTypes = {};

export default memo(GalleryImage);
