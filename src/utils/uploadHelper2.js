import { message, Upload } from 'antd';
import Resizer from 'react-image-file-resizer';
import i18n from 'i18next';

export const audioFileTypes = [
  'audio/mpeg',
  'audio/ogg',
  'audio/aac',
  'audio/midi',
  'audio/x-midi',
  'audio/opus',
  'audio/wav',
  'audio/webm',
  'audio/3gpp',
  'audio/3gpp2',
];

export const imageFileTypes = [
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/gif',
  'image/tiff',
  'image/webp',
];

export const documentFileTypes = [
  'application/vnd.amazon.ebook',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/epub+zip',
  'application/vnd.oasis.opendocument.presentation',
  'application/vnd.oasis.opendocument.text',
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/rtf',
];

export const videoFileTypes = [
  'video/x-msvideo',
  'video/quicktime',
  'video/mpeg',
  'video/webm',
  'video/MP2T',
  'video/x-ms-wmv',
  'video/mp4',
  'application/x-mpegURL',
  'video/ogg',
];

export const resizeImage = file => {
  return new Promise(resolve => {
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
        uri => {
          // let name = file.name.toLowerCase().replace(/\s/g, '');
          // name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          // let concatObject = Object.assign(uri, {
          //   name: name,
          //   path: file.path,
          //   order: file.order,
          //   thumbUrl: file.thumbUrl,
          //   lastModified: file.lastModified,
          //   uid: file.uid,
          //   order: file.order,
          //   type: file.type,
          // });
          // resolve(concatObject);
          resolve(uri);
        },
        'blob',
      );
    }
  });
};

export const normFile = e => (Array.isArray(e) ? e : e && e.fileList);

export const beforeUploadPodcast = (file, fileList) => {
  const isAudioFile = audioFileTypes.includes(file.type);
  const isImageFile = imageFileTypes.includes(file.type);
  if (
    fileList === undefined ||
    (fileList.length < 2 &&
      ((isAudioFile &&
        !fileList.some(file => audioFileTypes.includes(file.type))) ||
        (isImageFile &&
          !fileList.some(file => imageFileTypes.includes(file.type)))))
  ) {
    if (isAudioFile) {
      const isLt200M = file.size / 1024 / 1024 < 200;

      if (!isLt200M) {
        message.error(i18n.t('common.audioSmallerThan'));
      }

      return isLt200M || Upload.LIST_IGNORE;
    } else if (isImageFile) {
      const isLt20M = file.size / 1024 / 1024 / 1024 / 1024 < 20;

      if (!isLt20M) {
        message.error(i18n.t('common.imageSmallerThan', { size: 20 }));
      }

      return isLt20M || Upload.LIST_IGNORE;
    } else {
      message.error(i18n.t('common.uploadOnlyImageOrAudio'));
      return (isAudioFile && isImageFile) || Upload.LIST_IGNORE;
    }
  } else {
    message.error(i18n.t('common.uploadOnlyImageOrAudioError'));
    return Upload.LIST_IGNORE;
  }
};

export const beforeUploadArticle = file => {
  const isDocument = documentFileTypes.includes(file.type);

  if (!isDocument) {
    message.error(i18n.t('common.uploadOnlyDocumentError'));
  }

  const isLt100M = file.size / 1024 / 1024 < 100;

  if (!isLt100M) {
    message.error(i18n.t('common.documentSmallerThan'));
  }
  return (isDocument && isLt100M) || Upload.LIST_IGNORE;
};

export const beforeUploadPost = file => {
  const isVideoFile = videoFileTypes.includes(file.type);
  const isImageFile = imageFileTypes.includes(file.type);
  const isDocumentFile = documentFileTypes.includes(file.type);

  const isLt100M = file.size / 1024 / 1024 < 100;
  const isLt20M = file.size / 1024 / 1024 / 1024 / 1024 < 20;
  const isLt1GB = file.size / 1024 / 1024 / 1024 < 1;

  if (
    (isDocumentFile && isLt100M) ||
    (isImageFile && isLt20M) ||
    (isVideoFile && isLt1GB)
  ) {
    return isImageFile ? resizeImage(file).then(img => img) : file;
  } else {
    message.info(i18n.t('common.uploadedInFilesSection'));

    return Object.defineProperty(file, 'type', {
      writable: true,
      value: 'hugeFile',
    });
  }
};

export const beforeUploadCommentFiles = file => {
  const isVideoFile = videoFileTypes.includes(file.type);
  const isImageFile = imageFileTypes.includes(file.type);

  if (isVideoFile) {
    const isLt1GB = file.size / 1024 / 1024 / 1024 < 1;

    if (!isLt1GB) {
      message.error(i18n.t('common.videoSmallerThan'));
    }

    return isLt1GB || Upload.LIST_IGNORE;
  } else if (isImageFile) {
    const isLt4M = file.size / 1024 / 1024 / 1024 / 1024 < 4;

    if (!isLt4M) {
      message.error(i18n.t('common.imageSmallerThan', { size: 4 }));
    }

    return isLt4M || Upload.LIST_IGNORE;
  } else {
    message.error(i18n.t('common.uploadOnlyImageOrVideoError'));
    return (isVideoFile && isImageFile) || Upload.LIST_IGNORE;
  }
};
