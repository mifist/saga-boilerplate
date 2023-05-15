/**
 *
 * GalleryVideo
 *
 */

import React, { memo, useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';

import VideoPlayer from '../VideoPlayer';
import './style.scss';

import thumbnailProcessing from 'images/thumbnail-processing.png';

function GalleryVideo({ content, selectionItem }) {
  const [currentVideo, setCurrentVideo] = useState(content[0]);
  const [thumbnail, setThumbnail] = useState(false);

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    fetchThumbnails();
  }, []);

  useEffect(() => {
    if (content.includes(selectionItem)) {
      setCurrentVideo(selectionItem);
    }
  }, [selectionItem]);

  const fetchThumbnails = async () => {
    let thumbnailsFetched = [];
    if (content) {
      for (let i = 0; i < content.length; i++) {
        if (content[i]) {
          const link = content[i].split('.com/').pop();
          const videoId = link.split('/')[0];

          const response = await fetch(
            `https://api.vimeo.com/videos/${videoId}/pictures`,
            {
              headers: {
                Authorization: 'Bearer c13f457c9caae5052c536dc5f23b65be',
              },
            },
          );

          const json = await response.json();

          if (json && json.data && json.data[0].sizes[1].link) {
            thumbnailsFetched.push(json.data[0].sizes[1].link);
          } else {
            thumbnailsFetched.push('no-image');
          }
        }
      }
    }
    setThumbnail(thumbnailsFetched);
  };

  // render function
  return (
    <div>
      <VideoPlayer url={currentVideo} />
      <div className={'gallery-image'}>
        {thumbnail &&
          thumbnail.map((item, index) => (
            <div
              key={item}
              className={`gallery-item ${
                content[index] === currentVideo ? 'selected' : ''
              }`}
              onClick={() => setCurrentVideo(content[index])}
            >
              <img src={item || thumbnailProcessing} alt="" width={100} />
            </div>
          ))}
      </div>
    </div>
  );
}

GalleryVideo.propTypes = {};

export default memo(GalleryVideo);
