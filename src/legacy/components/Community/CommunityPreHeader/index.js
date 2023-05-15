import React, { memo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import {
  Camera,
  CameraResultType,
  Filesystem,
  FilesystemDirectory,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import useDeviceDetect from 'appHooks/useDeviceDetect';

// styles
import './style.scss';

// antd component
import { Button, Image, Form, Modal } from 'antd';

//icons
import {
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

// contexts
import { withUser } from 'engine/context/User.context';

// helper
import { isWeb } from 'utils/capacitorHelper';
import { resizeFile } from 'utils/uploadHelper';

function CommunityPreHeader({
  communityInfo,
  media,
  loading,
  // states
  user,
  // actions
  onChangeHeader,
  onMedia,
  // default props
  className,
}) {
  const childClassNames = classNames('community-pre-header-wrapper', className);
  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();

  const [isEditMode, setIsEditMode] = useState(false);

  const initForm = {
    color: communityInfo?.header?.color || '',
    picture: communityInfo?.header?.picture || '',
    logotype: communityInfo?.logotype || '',
  };

  const defaultBg = 'linear-gradient(90deg, #005E72, #005E7299)';

  const [logotype, setLogotype] = useState(initForm?.logotype);
  const [picture, setPicture] = useState(initForm?.picture);

  // const [color, setColor] = useState(communityInfo?.header?.color);
  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);

  const [preHeaderFrom] = Form.useForm();

  /*  useEffect(() => {
    if (communityInfo) {
    }
  }, [communityInfo]); */

  useEffect(() => {
    if (media) {
      setFile(null);
      if (media.hasOwnProperty('url')) {
        if (uploading) {
          setUploading(false);
          if (communityInfo?.logotype !== media?.url) {
            setLogotype(media?.url);
            onChangeHeader({
              logotype: media.url,
            });
          }
        } else if (uploadingBg) {
          setUploadingBg(false);
          if (communityInfo?.header?.picture !== media?.url) {
            setPicture(media?.url);
            preHeaderFrom.setFieldsValue({
              background: media?.url,
            });
          }
        }
      }
    }
  }, [media]);

  useEffect(() => {
    if (file !== null) {
      handleUpload(file?.fileF, file?.type);
    }
  }, [file]);

  const canEdit = useCallback(() => {
    const userId = user?._id;
    const isAdmin =
      communityInfo?.admins &&
      communityInfo?.admins.find(el => el?._id == userId);
    return isAdmin;
  }, [communityInfo, user]);

  const onSave = valuse => {
    let newObj = {};
    /*   if (valuse.hasOwnProperty('color') && valuse?.color) {
      Object.assign(newObj, { header: { color: valuse?.color } });
    } */
    if (valuse.hasOwnProperty('background') && valuse?.background) {
      Object.assign(newObj, { header: { picture: valuse?.background } });
    } else if (
      valuse.hasOwnProperty('background') &&
      valuse?.background == null
    ) {
      Object.assign(newObj, { header: { picture: '' } });
    }

    newObj && onChangeHeader(newObj);
    setIsEditMode(!isEditMode);
  };

  const handleUpload = (file, type) => {
    type == 'logotype' ? setUploading(true) : setUploadingBg(true);

    const formPayload = new FormData();

    // compress uploaded file
    resizeFile(file)
      // need to wait the image are compress
      .then(compressFile => {
        // change Blob to File
        const fileExt = file.name.split('.')[file.name.split('.').length - 1];
        const tempCompressFile = new File(
          [compressFile],
          `${communityInfo?._id}_logotype_${Date.now()}.${fileExt}`,
        );

        // add uploading file to array of all files
        tempCompressFile.status = 'uploading';
        formPayload.append('file', tempCompressFile);
        onMedia(formPayload);
      })
      .catch(err => {
        console.log('Compress Error: ', { err });
        if (err?.response?.data.hasOwnProperty('url')) {
          type == 'logotype' ? setUploading(false) : setUploadingBg(false);
        }
      });
  };

  const takePicture = async () => {
    const options = {
      resultType: CameraResultType.Uri,
    };
    const originalPhoto = await Camera.getPhoto(options);
    const photoInTempStorage = await Filesystem.readFile({
      path: originalPhoto.path,
    });
    let date = new Date(),
      time = date.getTime(),
      fileName = time + '.jpeg';
    await Filesystem.writeFile({
      data: photoInTempStorage.data,
      path: fileName,
      directory: FilesystemDirectory.Data,
    });
    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: fileName,
    });
    let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    return photoPath;
  };

  const onUploadFile = (e, type) => {
    if (!isWeb || isMobile) {
      const cameraPhoto = takePicture();
      // setFile(cameraPhoto);
      //  handleUpload(cameraPhoto);
      // console.debug('info cameraPhoto: ', cameraPhoto);
    }
    setFile({
      fileF: e.target.files[0],
      type: type,
    });
  };

  const removeBackground = () => {
    setPicture('');
    preHeaderFrom.setFieldsValue({
      background: null,
    });
  };

  return (
    <div
      className={childClassNames}
      style={{
        background: `${picture ? `url("${picture}")` : defaultBg}`,
      }}
    >
      <div className="community-logo-wrrapper">
        {canEdit() ? (
          <div
            name="logotype"
            className={`${uploading ? 'uploading' : ''} avatar-row`}
          >
            <></>
          </div>
        ) : (
          <div className="community-logo-img-wrapper">
            {logotype && (
              <Image
                className="community-logo-img"
                width={94}
                height={94}
                preview={false}
                src={logotype}
              />
            )}
          </div>
        )}
      </div>

      {canEdit() && (
        <Button
          className="edit-header-btn"
          onClick={() => setIsEditMode(!isEditMode)}
        >
          {t('communities.uploadBanner')}
        </Button>
      )}
      <Modal
        title={t('communities.changeCommunityBanner')}
        visible={isEditMode}
        onCancel={() => setIsEditMode(!isEditMode)}
        className="pre-header-modal"
      >
        <Form
          form={preHeaderFrom}
          className="pre-header-form"
          name="pre_headedr_form"
          initialValues={initForm}
          onFinish={onSave}
          // onFieldsChange={handleFormChange}
        >
          <Form.Item
            name="background"
            // noStyle
            label={t('communities.communityBanner')}
            className={`${uploadingBg ? 'uploading' : ''} background-row`}
          >
            <Image
              className="community-logo-img"
              // width={150}
              // height={150}
              preview={false}
              src={picture}
              fallback="data:image/png;base64,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"
            />
            <div className="background-upload-message">
              <span className="upload-action">
                {uploadingBg ? <LoadingOutlined /> : <UploadOutlined />}
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingBg}
                onChange={e => onUploadFile(e, 'background')} /* label={'ck'} */
              />
              <DeleteOutlined
                className="delete-action"
                onClick={removeBackground}
              />
            </div>
          </Form.Item>
          {/*      <Form.Item
            name="color"
            label="Header Color"
            className={`color-picker-row`}
          >
            <span
              className="color-preview"
              style={{ background: `${color || initForm?.color || '#2d77f7'}` }}
            />
            <ChromePicker
              color={color || '#2d77f7'}
              onChangeComplete={changeColorPicker}
            />
          </Form.Item> */}
          <Form.Item style={{ width: '100%' }}>
            <Button
              className="header-update-btn"
              key="submit"
              htmlType="submit"
            >
              {t('common.update')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

CommunityPreHeader.defaultProps = {};
CommunityPreHeader.propTypes = {
  communityInfo: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  onChangeHeader: PropTypes.func.isRequired,
};

export default compose(
  memo,
  withUser,
)(CommunityPreHeader);
