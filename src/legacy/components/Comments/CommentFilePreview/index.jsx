import React, { memo, useState, useEffect } from 'react';
import { Image, Modal, Spin } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import thumbnailProcessing from 'images/thumbnail-processing.png';

import VideoPlayer from 'legacy/components/VideoPlayer';

import './style.scss';

const CommentFilePreview = ({
  fileUrl,
  onDelete,
  loading,
  className,
  showVideoPreview,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [url, setUrl] = useState(fileUrl);

  useEffect(() => {
    if (fileUrl && !loading) {
      if (fileUrl.includes('vimeo.com')) {
        const link = fileUrl.split('.com/').pop();
        const videoId = link.split('/')[0];

        fetch(`https://api.vimeo.com/videos/${videoId}/pictures`, {
          headers: {
            Authorization: 'Bearer c13f457c9caae5052c536dc5f23b65be',
          },
        })
          .then(res => res.json())
          .then(({ data }) => {
            if (data) {
              setUrl(data[0].sizes[1].link);
            }
          })
          .catch(e => setUrl(null));
      } else {
        setUrl(fileUrl);
      }
    }
  }, [fileUrl, loading]);

  return (
    <div className={classNames('comment-img comment-img-edit', className)}>
      {loading ? (
        <Spin className="loading-preview" size="large" />
      ) : (
        <>
          <Image src={url || thumbnailProcessing} preview={false} />
          <div className="comment-img-icon">
            <span className="comment-img-icon-wrapper">
              {url && <EyeOutlined onClick={() => setPreviewVisible(true)} />}

              {onDelete && (
                <DeleteOutlined
                  onClick={() => onDelete([])}
                  className={classNames(!url && 'delete')}
                />
              )}
            </span>
          </div>
        </>
      )}

      {fileUrl && !loading && (
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
        >
          {fileUrl.includes('vimeo.com') ? (
            <VideoPlayer url={fileUrl} />
          ) : (
            <img alt="example" style={{ width: '100%' }} src={url} />
          )}
        </Modal>
      )}
    </div>
  );
};

export default memo(CommentFilePreview);
