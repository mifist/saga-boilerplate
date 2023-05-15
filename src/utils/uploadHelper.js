import { Button, Form, message, Modal, Upload } from 'antd';
import Resizer from 'react-image-file-resizer';
import React from 'react';

const scrubFileName = fileName => fileName.replace(/[^\w\d_\-.]+/gi, '');

const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

const normFile = e => {
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

const beforeUpload = file => {
  const tempFile = new File([file], scrubFileName(file.name));
  const isJpgOrPng =
    file.type === 'image/jpeg' ||
    file.type === 'image/png' ||
    file.type === 'image/bmp' ||
    file.type === 'image/gif' ||
    file.type === 'image/tiff' ||
    file.type === 'image/webp';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG/GIF/TIFF/WEBP file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 10;
  if (!isLt2M) {
    message.error('Image must smaller than 10MB!');
  }
  return isJpgOrPng && isLt2M && tempFile;
};

const beforeUploadAudio = file => {
  const tempFile = new File([file], scrubFileName(file.name));
  const isAudio =
    file.type === 'audio/mpeg' ||
    file.type === 'audio/ogg' ||
    file.type === 'audio/aac' ||
    file.type === 'audio/midi' ||
    file.type === 'audio/x-midi' ||
    file.type === 'audio/opus' ||
    file.type === 'audio/wav' ||
    file.type === 'audio/webm' ||
    file.type === 'audio/3gpp' ||
    file.type === 'audio/3gpp2';
  if (!isAudio) {
    message.error(
      'You can only upload MP3/OGG/ACC/MIDI/Opus/WAV/WEBM/3GPP/3GPP2 file!',
    );
  }
  const isLt4M = file.size / 1024 / 1024 / 1024 / 1024 < 2;
  if (!isLt4M) {
    message.error('Audio must smaller than 4MB!');
  }
  return isAudio && isLt4M && tempFile;
};

const beforeUploadDocument = file => {
  const tempFile = new File([file], scrubFileName(file.name));
  const isDocument =
    file.type === 'application/vnd.amazon.ebook' ||
    file.type === 'application/msword' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/epub+zip' ||
    file.type === 'application/vnd.oasis.opendocument.presentation' ||
    file.type === 'application/vnd.oasis.opendocument.text' ||
    file.type === 'application/pdf' ||
    file.type === 'application/vnd.ms-powerpoint' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
    file.type === 'application/rtf';

  if (!isDocument) {
    message.error(
      'You can only upload Amazon eBook/Microsoft Documents/EPUB/OpenDocument/PDF/RTF file!',
    );
  }
  const isLt100M = file.size / 1024 / 1024 < 100;
  if (!isLt100M) {
    message.error(
      'Document must smaller than 100MB to be displayed in the gallery! Please use the files sections to upload bigger files.',
    );
  }
  return isDocument && isLt100M && tempFile;
};

const beforeUploadFile = file => {
  const tempFile = new File([file], scrubFileName(file.name));

  // const isLt4M = file.size / 1024 / 1024 < 100;
  // if (!isLt4M) {
  //   message.error('Document must smaller than 100MB!');
  // }
  return tempFile;
};

const beforeUploadVideo = file => {
  const tempFile = new File([file], scrubFileName(file.name));
  const isDocument =
    file.type === 'video/x-msvideo' ||
    file.type === 'video/quicktime' ||
    file.type === 'video/mpeg' ||
    file.type === 'video/webm' ||
    file.type === 'video/MP2T' ||
    file.type === 'video/x-ms-wmv' ||
    file.type === 'video/mp4' ||
    file.type === 'application/x-mpegURL' ||
    file.type === 'video/ogg';
  if (!isDocument) {
    message.error('You can only upload video file!');
  }
  const isLt1GB = file.size / 1024 / 1024 / 1024 < 1;
  if (!isLt1GB) {
    message.error('Document must smaller than 1GB!');
  }
  return isDocument && isLt1GB && tempFile;
};

const resizeFile = file =>
  new Promise(resolve => {
    if (file.name.includes('.tif') || file.name.includes('.tiff')) {
      resolve(file);
    } else {
      Resizer.imageFileResizer(
        file, // Is the file of the image which will resized.
        1920, // Is the maxWidth of the resized new image.
        1080, // Is the maxHeight of the resized new image.
        'JPEG', // Is the compressFormat of the resized new image.
        90, // Is the quality of the resized new image.
        0, // Is the degree of clockwise rotation to apply to uploaded image.
        // uri => {
        //   resolve(uri);
        // },
        async uri => {
          let name = file.name.toLowerCase().replace(/\s/g, '');
          name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          let concatObject = await Object.assign(uri, {
            name: name,
            path: file.path,
            order: file.order,
            thumbUrl: file.thumbUrl,
            lastModified: file.lastModified,
            uid: file.uid,
            order: file.order,
          });
          resolve(concatObject);
        },
        'blob',
      );
    }
  });

export {
  getBase64,
  normFile,
  beforeUpload,
  beforeUploadAudio,
  beforeUploadDocument,
  beforeUploadVideo,
  beforeUploadFile,
  resizeFile,
  scrubFileName,
};
