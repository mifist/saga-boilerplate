/**
 *
 * UploadContent
 *
 */
import React, { memo, useState, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';

import { uploadContentFile, flushState } from './actions';

// assets
import LogoClient from 'images/logo.svg';
import {
  VideoCameraOutlined,
  FileAddOutlined,
  AudioOutlined,
  PictureOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';

// antd component
import { Modal, Upload } from 'antd';
// components
import VideoPlayer from 'legacy/components/VideoPlayer';

// utils
import {
  beforeUpload,
  beforeUploadAudio,
  beforeUploadDocument,
  beforeUploadVideo,
  beforeUploadFile,
  resizeFile,
  getBase64,
  scrubFileName,
} from 'utils/uploadHelper';


export function UploadContent({
  // props
  type,
  content,
  handleUploadChange,
  size,
  // actions
  processUploadFile,
  // default props
  className,
  // core
  state,
  dispatch
}) {

  const { 
    uploadedFile, loading, error, uploadFileType
  } = state.CommentsOverview;

  const [fileList, setFileList] = useState([]);
  // Preview
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  //video
  const [thumbnail, setThumbnail] = useState(false);

  // TODO : fix this :)
  // processUploadFile(fileList)

  // Clearing the state after unmounting a component
  useEffect(() => {
    return () => {
      // Anything in here is fired on component unmount.
      dispatch(flushState());
    };
  }, []);

  // if content from parent change => refresh the list
  useEffect(() => {
    let newArr = [];
    content &&
      content?.map((pic, i) => {
        newArr.push({
          order: i,
          uid: pic,
          name:
            type === 'video' ||
            type === 'document' ||
            type === 'audio' ||
            type === 'file'
              ? `File ${i + 1}`
              : pic,
          status: 'done',
          url: pic,
          thumbUrl: type === 'video' ? LogoClient : pic,
          fromServer: true,
        });
      });

    setFileList(newArr);

    if (type === 'video') {
      fetchThumbnails(newArr);
    }
  }, [content]);

  // fetch url async when we have video
  const fetchThumbnails = async newArr => {
    if (newArr) {
      for (let i = 0; i < newArr.length; i++) {
        let id = newArr[i] && newArr[i]?.url?.split('.com/').pop();
        const response = await fetch(
          `https://vimeo.com/api/oembed.json?url=https://player.vimeo.com/video/${id}`,
        );
        const json = await response.json();

        const url = json.thumbnail_url.split('_')[0] + '_320x180';
        newArr[i].thumbUrl = url;
        newArr[i].status = 'done';
      }
    }

    setFileList(newArr);
  };

  // When file is getting back to the server, we refresh the list + the parent
  useEffect(() => {
    if (uploadedFile) {
      if (uploadedFile.hasOwnProperty('url') && uploadFileType === type) {
        if (content.length > 0) {
          content.map(item => {
            if (item !== uploadedFile.url) {
              handleUploadChange([...content, uploadedFile.url]);
            }
          });
        } else {
          handleUploadChange([uploadedFile.url]);
        }
      }
      //
      // if (uploadedFile === 'error' && error) {
      //   fileList.map(item => {
      //     if (item.uid !== currentFile.uid) {
      //       handleUploadChange([...content, uploadedFile.url]);
      //     }
      //   });
      // }
    }
  }, [uploadedFile]);

  const renderTitleUpload = type => {
    if (type !== 'document') {
      return `Upload ${type}`;
    } else {
      return `Upload PDF`;
    }
  };

  const uploadButton = (
    <div className={'upload-zone'}>
      {type === 'video' ? (
        <VideoCameraOutlined style={{ fontSize: 32 }} />
      ) : null}
      {type === 'image' ? <PictureOutlined style={{ fontSize: 32 }} /> : null}
      {type === 'document' ? (
        <FilePdfOutlined style={{ fontSize: 32 }} />
      ) : null}
      {type === 'audio' ? <AudioOutlined style={{ fontSize: 32 }} /> : null}
      {type === 'file' ? <FileAddOutlined style={{ fontSize: 32 }} /> : null}
      {size !== 'mini' && (
        <div style={{ marginTop: 8 }}>{renderTitleUpload(type)}</div>
      )}
    </div>
  );

  // modal preview on click of image
  const handlePreview = async file => {
    if (
      type === 'video' ||
      type === 'document' ||
      type === 'audio' ||
      type === 'file'
    ) {
      return false;
    }
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
  };

  // when file remove, we upload the filelist + the parent
  const fileOnRemove = file => {
    let newFileList = [];
    let newContent = [];
    for (let i = 0; i < fileList.length; i++) {
      if (file.uid !== fileList[i].uid) {
        newFileList.push(fileList[i]);
        newContent.push(fileList[i].url);
      }
    }
    setFileList(newFileList);
    handleUploadChange(newContent);
  };

  // upload and compress File
  const handleUpload = ({ onSuccess, onError, file, onProgress }) => {
    const formPayload = new FormData();
    if (type === 'image') {
      // compress uploaded file
      resizeFile(file)
        // need to wait the image are compress
        .then(compressFile => {
          // change Blob to File
          let tempCompressFile = new File(
            [compressFile],
            scrubFileName(compressFile.name),
          );

          /**
           * Check if previous files have same name
           * if yes, add timestamp to the current file name
           */
          fileList.length > 0 &&
            fileList.map(propFile => {
              if (propFile.name === tempCompressFile.name) {
                tempCompressFile = new File(
                  [tempCompressFile],
                  scrubFileName(
                    `${tempCompressFile.lastModified}_${tempCompressFile.name}`,
                  ),
                );
              }
            });

          // add uploading file to array of all files
          tempCompressFile.status = 'uploading';
          setFileList([...fileList, tempCompressFile]);

          formPayload.append('file', tempCompressFile);
          dispatch(uploadContentFile(formPayload, type));
        })
        .catch(err => {
          onError({ err });
        });
    }
    if (
      type === 'document' ||
      (type === 'audio' || type === 'video') ||
      type === 'file'
    ) {
      // change Blob to File
      let tempCompressFile = new File([file], scrubFileName(file.name));

      // add uploading file to array of all files
      tempCompressFile.status = 'uploading';
      setFileList([...fileList, tempCompressFile]);

      formPayload.append('file', tempCompressFile);

      dispatch(uploadContentFile(formPayload, type));
    }
  };

  const beforeUploadHandle = file => {
    switch (type) {
      case 'image':
        return beforeUpload(file);
      case 'image-comment':
        return beforeUpload(file);
      case 'audio':
        return beforeUploadAudio(file);
      case 'document':
        return beforeUploadDocument(file);
      case 'video':
        return beforeUploadVideo(file);
      case 'file':
        return beforeUploadFile(file);
    }
  };
  // render function
  return (
    <div>
      <Upload
        itemRender={(originNode, file, currFileList) => {
          return originNode;
          // if (type !== 'document') {
          //   return originNode;
          // } else {
          //   return (
          //     <div className={'gallery-document-upload'}>
          //       <FilePdfOutlined style={{ fontSize: 24 }} />
          //       <br />
          //       Doc n° {file.order + 1}
          //     </div>
          //   );
          // }
        }}
        // className="create-publication__pictures"
        name={`upload-${type}`}
        listType={
          type === 'image' || type === 'video' ? 'picture-card' : 'picture-card' //'text'
        }
        multiple={false}
        fileList={fileList} // our file
        onRemove={fileOnRemove}
        beforeUpload={beforeUploadHandle} // validation the data
        onPreview={handlePreview} // use for modal preview
        customRequest={handleUpload} // function to upload
        showUploadList={{
          showPreviewIcon:
            type !== 'video' &&
            type !== 'document' &&
            type !== 'audio' &&
            type !== 'file',
          showDownloadIcon: false,
        }}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        footer={null}
        onCancel={() => setPreviewVisible(!previewVisible)}
      >
        {/*we trim the video link to only the id*/}
        {type === 'video' ? (
          <VideoPlayer url={previewImage.split('.com/').pop()} />
        ) : null}
        {type === 'image' ? (
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        ) : null}
      </Modal>
    </div>
  );
}

UploadContent.defaultProps = {
  type: 'image',
  content: [],
};

export default compose(
  withRedux,
  memo,
)(UploadContent);
