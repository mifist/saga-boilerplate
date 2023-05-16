/**
 *
 * AccountPreferences
 *
 */
import React, { useState, useEffect } from 'react';
import Resizer from 'react-image-file-resizer';
import {
  Camera,
  CameraResultType,
  Filesystem,
  FilesystemDirectory,
} from '@capacitor/camera';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import camelCase from 'lodash/camelCase';
import moment from 'moment';

// styles
import './style.scss';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import {
  Avatar,
  Button,
  Layout,
  Col,
  Row,
  Select,
  Switch,
  message,
} from 'antd';

import {
  anatomies,
  specialities,
  qualification,
  languages,
  professions,
} from 'utils/categoryHelper';
// components
// global user
import { withUser } from 'appContext/User.context';
//import { LOAD_EVENTS } from 'legacy/containers/PersonalSideBar/constants';
import GoBackButton from 'legacy/components/GoBackButton';
import { Keyboard } from '@capacitor/keyboard';
import { Capacitor } from '@capacitor/core';

import api from 'appAPI/axiosAPI';

function RenderInput({
  label,
  value,
  name,
  parent,
  editing,
  onChange,
  type,
  disabled,
  data,
  user,
}) {
  if (type === 'switch') {
    return (
      <Row className="account-input-row" gutter={[16, 16]}>
        <Col xs={20} sm={20} lg={20} xl={20}>
          <span className="account-min-width">{label}</span>
        </Col>
        <Col xs={4} sm={4} lg={4} xl={4}>
          {editing ? (
            <Switch
              checked={value}
              onChange={checked => onChange(name, checked, parent)}
            />
          ) : (
            <Switch disabled={true} checked={value} />
          )}
        </Col>
      </Row>
    );
  } else {
    return (
      <Row className="account-input-row" gutter={[16, 16]}>
        <Col xs={24} sm={4} lg={4} xl={4}>
          <span className="account-min-width">{label}</span>
        </Col>
        <Col xs={24} sm={20} lg={20} xl={20}>
          {editing ? (
            renderInputType(
              type,
              value,
              name,
              parent,
              onChange,
              disabled,
              user,
              data,
            )
          ) : Array.isArray(value) === true ? (
            renderArray(value)
          ) : (
            <span className="account-value">{value}</span>
          )}
        </Col>
      </Row>
    );
  }
}

function renderArray(value) {
  return (
    value &&
    value.map((item, i) => {
      return (
        <span key={item} className={'account-value'}>
          {i > 0 ? ' - ' : ''} {item}
        </span>
      );
    })
  );
}

function renderInputType(
  type,
  value,
  name,
  parent,
  onChange,
  disabled,
  user,
  data,
) {
  const { t, i18n } = useTranslation();

  const onChangeInput = (e, { name, parent }) => {
    onChange(name, e.target.value, parent);
  };

  const handleChange = value => {
    onChange(name, value, parent);
  };

  const handleKeyDown = e => {
    if (Capacitor.platform !== 'web') {
      if (e.key === 'Enter') {
        Keyboard.hide();
      }
    }
  };

  switch (type) {
    case 'input':
      return (
        <input
          disabled={disabled}
          value={value}
          onKeyDown={e => handleKeyDown(e)}
          onChange={e => onChangeInput(e, { value, name, parent })}
        />
      );
    case 'textaera':
      return (
        <textarea
          rows="4"
          cols="50"
          value={value}
          onChange={e => onChangeInput(e, { value, name, parent })}
        />
      );
    case 'select-domain':
      return (
        <Select
          id="domain"
          placeholder={t('common.allDomains')}
          optionFilterProp="children"
          allowClear
          mode="multiple"
          style={{ width: '100%' }}
          value={value}
          onChange={e => handleChange(e)}
          getPopupContainer={trigger => trigger.parentElement}
        >
          {renderOptions(specialities, 'specialities')}
        </Select>
      );
    case 'select-anatomy':
      return (
        <Select
          id="anatomy"
          placeholder={t('common.allAnatomies')}
          optionFilterProp="children"
          allowClear
          mode="multiple"
          style={{ width: '100%' }}
          value={value}
          onChange={e => handleChange(e)}
          getPopupContainer={trigger => trigger.parentElement}
        >
          {renderOptions(anatomies, 'anatomies')}
        </Select>
      );
    case 'select-profession':
      return (
        <Select
          id="profession"
          placeholder={t('profile.selectProfesion')}
          optionFilterProp="children"
          style={{ width: '100%' }}
          value={value}
          onChange={e => handleChange(e)}
          getPopupContainer={trigger => trigger.parentElement}
        >
          {renderOptions(professions, 'professions')}
        </Select>
      );
    case 'select-country':
      return (
        <Select
          id="country"
          placeholder={t('profile.selectCountry')}
          style={{ width: '100%' }}
          value={value.toString()}
          onChange={e => handleChange(e)}
          showSearch
          optionFilterProp="children"
          getPopupContainer={trigger => trigger.parentElement}
          filterOption={(input, option) =>
            option?.children?.toLowerCase().includes(input.toLowerCase())
          }
        >
          {renderOptions(
            data.map(d => ({ value: d.id.toString(), label: d.name })),
            'countries',
          )}
        </Select>
      );

    case 'select-qualifications':
      return (
        <Select
          id="qualifications"
          placeholder={t('profile.selectQualifications')}
          optionFilterProp="children"
          allowClear
          mode="multiple"
          style={{ width: '100%' }}
          value={value}
          onChange={e => handleChange(e)}
          getPopupContainer={trigger => trigger.parentElement}
        >
          {renderOptions(qualification, 'qualifications')}
        </Select>
      );
    case 'select-language':
      return (
        <Select
          id="languages"
          placeholder={t('profile.selectLanguage')}
          optionFilterProp="children"
          allowClear
          style={{ width: '100%' }}
          value={value}
          onChange={e => {
            i18n.changeLanguage(e);
            moment.locale(e);
            localStorage.setItem('cometchat:locale', e);
            handleChange(e);
            user.patchUser();
          }}
          getPopupContainer={trigger => trigger.parentElement}
        >
          {renderOptions(
            languages.map(lang => ({
              value: lang.name,
              label: lang.translatedTitle,
            })),
            'languages',
          )}
        </Select>
      );
  }
}

// Specialities
const renderOptions = (options, type) => {
  const { t } = useTranslation();

  return (
    options &&
    options.map(item => {
      return (
        <Select.Option key={item.value} value={item.value} title={item.label}>
          {type === 'languages' || type === 'countries'
            ? item.label
            : t(`common.${type}-${camelCase(item.label)}`)}
        </Select.Option>
      );
    })
  );
};

const InputsMemo = React.memo(RenderInput);

function AccountPreferences({ user, history }) {
  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const platform = Capacitor.getPlatform();

  const [editingInformation, setEditingInformation] = useState(false);
  const [editingCredentials, setEditingCredentials] = useState(false);
  const [editingNotifications, setEditingNotifications] = useState(false);

  const [countries, setCountries] = useState([]);

  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);

  const onClickSave = e => {
    e.preventDefault();
    user.patchUser();

    message.success(t('profile.profileUpdatedSuccessfully'));
  };

  /*   const onClickEditInformation = e => {
    e.preventDefault();

    if (editingInformation) {
      user.patchUser();
    }

    setEditingInformation(!editingInformation);
  }; */

  /*   const onClickEditCredential = e => {
    e.preventDefault();

    if (editingCredentials) {
      user.patchUser();
    }

    setEditingCredentials(!editingCredentials);
  };

  const onClickEditNotifications = e => {
    e.preventDefault();

    if (editingNotifications) {
      user.patchUser();
    }

    setEditingNotifications(!editingNotifications);
  }; */

  const resizeFile = file =>
    new Promise(resolve => {
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
            thumbUrl: file.thumbUrl,
            lastModified: file.lastModified,
            uid: file.uid,
            order: file.order,
          });
          resolve(concatObject);
        },
        'blob',
      );
    });

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

  const handleUpload = file => {
    setUploading(true);
    const {
      description: { firstname, lastname },
    } = user;

    const formPayload = new FormData();

    // compress uploaded file
    resizeFile(file)
      // need to wait the image are compress
      .then(compressFile => {
        // change Blob to File
        const fileExt = file.name.split('.')[file.name.split('.').length - 1];
        const tempCompressFile = new File(
          [compressFile],
          `${firstname}_${lastname}_avatar_${Date.now()}.${fileExt}`,
        );

        formPayload.append('file', tempCompressFile);
        user.uploadAvatar(formPayload);
        setUploading(false);
      })
      .catch(err => {
        console.log('Compress Error: ', { err });
        if (err?.response?.data.hasOwnProperty('url')) {
          setUploading(false);
        }
      });
  };

  useEffect(() => {
    if (file !== null) {
      handleUpload(file);
    }
  }, [file]);

  useEffect(() => {
    api.users.fetchAllCountries().then(data => {
      setCountries(data);
    });
  }, []);

  const onUploadFile = e => {
    if (platform !== 'web') {
      const cameraPhoto = takePicture();
      // console.debug('info cameraPhoto: ', cameraPhoto);
    }
    setFile(e.target.files[0]);
  };

  // Sorry it was not aligned...
  const uploadAvatar = () => {
    return (
      <Row className="account-input-row flex-avatar" gutter={[16, 16]}>
        <Col xs={24} sm={4} lg={4} xl={4}>
          <span>{t('profile.avatar')}</span>
        </Col>
        <Col
          xs={24}
          sm={20}
          lg={20}
          xl={20}
          className={`${uploading ? 'uploading' : ''} avatar-row`}
        >
          <Avatar size={50} src={user.image} />
          &nbsp; &nbsp;
          <div className="avatar-upload-message">
            <input type="file" onChange={onUploadFile} label={'ck'} />
            {!isMobile && uploading ? t('profile.uploading') : ''}
          </div>
        </Col>
      </Row>
    );
  };

  const renderInformationAccount = () => {
    const {
      email,
      description: {
        firstname = 'firstname',
        lastname = 'lastname',
        company,
        description,
      },
      language,
    } = user;

    const inputs = [
      {
        label: t('profile.firstname'),
        name: 'firstname',
        value: firstname,
        parent: 'description',
        type: 'input',
      },
      {
        label: t('profile.lastname'),
        name: 'lastname',
        value: lastname,
        parent: 'description',
        type: 'input',
      },
      {
        label: t('profile.email'),
        name: 'email',
        value: email,
        parent: null,
        type: 'input',
        disabled: true,
      },
      {
        label: t('profile.organization'),
        name: 'company',
        value: company,
        parent: 'description',
        type: 'input',
      },
      {
        label: t('profile.aboutMe'),
        name: 'description',
        value: description,
        parent: 'description',
        type: 'textaera',
      },
      {
        label: t('profile.preferredAppLanguage'),
        name: 'language',
        value: language,
        parent: null,
        type: 'select-language',
      },
    ];

    return (
      <div className="account-card">
        {uploadAvatar()}
        {inputs.map(i => (
          <InputsMemo
            {...i}
            editing={true}
            onChange={user.onChangeState}
            key={'inputs' + i.name}
            user={user}
          />
        ))}
      </div>
    );
  };

  const renderNotifications = () => {
    const {
      notificationsSetting: { emailNotification, pushNotification },
    } = user;

    const inputs = [
      {
        label: t('profile.allowEmailNotifications'),
        name: 'emailNotification',
        value: emailNotification,
        parent: 'notificationsSetting',
        type: 'switch',
      },
      {
        label: t('profile.allowPushNotifications'),
        name: 'pushNotification',
        value: pushNotification,
        parent: 'notificationsSetting',
        type: 'switch',
      },
    ];
    return (
      <div className="account-card">
        <div className="flex-justify-content">
          <span>{t('profile.notifications')}</span>
        </div>
        {/*TODO add switch*/}
        {inputs.map(i => (
          <InputsMemo
            {...i}
            editing={true}
            onChange={user.onChangeState}
            key={'inputs' + i.name}
          />
        ))}
      </div>
    );
  };

  const renderCredentials = () => {
    const {
      credential: { title, anatomies, domains, qualifications, profession },
      address: { city, country, telephone, address },
    } = user;
    const inputs = [
      {
        label: t('profile.titles'),
        name: 'title',
        value: title,
        parent: 'credential',
        type: 'input',
      },
      {
        label: t('profile.accreditations'),
        name: 'qualifications',
        value: qualifications,
        parent: 'credential',
        type: 'select-qualifications',
      },
      {
        label: t('common.domains'),
        name: 'domains',
        value: domains,
        parent: 'credential',
        type: 'select-domain',
      },
      {
        label: t('common.anatomies'),
        name: 'anatomies',
        value: anatomies,
        parent: 'credential',
        type: 'select-anatomy',
      },
      {
        label: t('profile.professional'),
        name: 'profession',
        value: profession,
        parent: 'credential',
        type: 'select-profession',
      },
      {
        label: t('profile.address'),
        name: 'address',
        value: address,
        parent: 'address',
        type: 'input',
      },
      {
        label: t('profile.city'),
        name: 'city',
        value: city,
        parent: 'address',
        type: 'input',
      },
      {
        label: t('profile.country'),
        name: 'country',
        value: country,
        parent: 'address',
        type: 'select-country',
        data: countries,
      },
      {
        label: t('profile.telephone'),
        name: 'telephone',
        value: telephone,
        parent: 'address',
        type: 'input',
      },
    ];

    return (
      <div className="account-card">
        <div className="flex-justify-content">
          <span>{t('profile.credentials')}</span>
        </div>
        {inputs.map(i => (
          <InputsMemo
            {...i}
            editing={true}
            onChange={user.onChangeState}
            key={'inputs' + i.name}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="main-full-content">
      <Helmet>
        <title>{t('profile.accountPreferences')}</title>
        <meta name="description" content="Description of Account preferences" />
      </Helmet>
      <Row gutter={[0, 30]}>
        <Layout className="main-single-layout account-pref">
          <Layout.Content className="main-single-content">
            <Row className="main-single-content__header">
              <Col span={12}>
                <GoBackButton goTo={t('profile.backToMyProfile')} />
              </Col>
            </Row>
            <Row className="main-single-content__main">
              <Col xs={24}>
                <article className="main-single-content__article">
                  <section className="article-main">
                    <div className="flex-justify-content">
                      <h2 className="account-title">
                        {t('profile.accountPreferences')}
                      </h2>
                      <Button
                        loading={user.loading}
                        className="ant-btn account-information-edit"
                        onClick={onClickSave}
                      >
                        {t('common.save')}
                      </Button>
                    </div>

                    <h4 className="account-subtitle">
                      {t('profile.generalAccountSettings')}
                    </h4>
                    {renderInformationAccount()}
                    {renderCredentials()}
                    {/*<h4 className={'account-subtitle'}>Content Preferences</h4>*/}
                    {renderNotifications()}
                  </section>
                </article>
              </Col>
            </Row>
          </Layout.Content>
        </Layout>
      </Row>
    </div>
  );
}

AccountPreferences.propTypes = {};

export default withUser(AccountPreferences);
