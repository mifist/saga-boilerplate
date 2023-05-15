import React, { memo, useEffect, useMemo, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Checkbox,
  Upload,
} from 'antd';

import {
  CloseOutlined,
  ArrowLeftOutlined,
  FileOutlined,
  AudioOutlined,
  FileImageOutlined,
  PictureOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

import UploadArticlesIcon from 'public/images/icon/upload-articles.svg';
import UploadPodcastsIcon from 'public/images/icon/upload-podcasts.svg';
import UploadMediasIcon from 'public/images/icon/upload-medias.svg';

import { isEqual, camelCase } from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import { ContentState, convertFromHTML } from 'draft-js';

import useDeviceDetect from 'appHooks/useDeviceDetect';
import { getBaseApiUrl } from 'utils/capacitorHelper';
import {
  audioFileTypes,
  documentFileTypes,
  imageFileTypes,
  videoFileTypes,
  beforeUploadPost,
  beforeUploadArticle,
  beforeUploadPodcast,
  normFile,
} from 'utils/uploadHelper2';
import { PRODUCTION_VIDEOS_API_URL } from 'utils/constants';

import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

import { anatomies, specialities, references } from 'utils/categoryHelper';

import UserAvatar from 'legacy/components/UserAvatar';
import RichEditorDescription from 'legacy/components/RichEditorDescription';
import CreateMCQs from 'legacy/components/MCQs/CreateMCQs';
import PreviewMCQs from 'legacy/components/MCQs/PreviewMCQs';

import './style.scss';
import LexicalEditor from 'legacy/components/LexicalEditor';

const CreatePublicationv2 = ({
  type,
  initialData,
  user,
  setAuthPopup,
  onSubmit,
  communityId,
  tags,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { isMobile } = useDeviceDetect();
  const [form] = Form.useForm();
  const [isVideo, setIsVideo] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [tagList, setTagList] = useState([]);
  const { t, i18n } = useTranslation();

  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));

  const isUpdate = useMemo(
    () => (initialData ? Object.keys(initialData).length > 0 : false),
    [initialData],
  );

  useEffect(() => {
    if (
      initialData &&
      Object.keys(initialData).length > 0 &&
      (type === 'case' || type === 'post')
    ) {
      setQuestions(initialData.questions);
    }
  }, [initialData, type]);

  useEffect(() => {
    if (tags && communityId) {
      setTagList(tags);
    }
  }, [tags]);

  const initialValues = useMemo(() => {
    const getFiles = () => {
      let files = [];

      if (initialData.documents) {
        const documents = initialData.documents.map((document, index) => ({
          uid: `Document_${index + 1}`,
          url: document,
          name: t('common.document', { number: index + 1 }),
          status: 'done',
          type: 'application/pdf',
        }));

        files = [...files, ...documents];
      }

      if (initialData.audio) {
        const audios = [
          {
            uid: 'Audio_1',
            url: initialData.audio,
            name: t('common.audio', { number: '1' }),
            status: 'done',
            type: 'audio/mpeg',
          },
        ];
        files = [...files, ...audios];
      }

      if (initialData.pictures) {
        const pictures = initialData.pictures.map((picture, index) => ({
          uid: `Picture_${index + 1}`,
          url: picture,
          name: t('common.picture', { number: index + 1 }),
          status: 'done',
          type: 'image/jpeg',
        }));

        files = [...files, ...pictures];
      }

      if (initialData.videos) {
        const videos = initialData.videos.map((video, index) => ({
          uid: `Video_${index + 1}`,
          url: video,
          name: t('common.video', { number: index + 1 }),
          status: 'done',
          type: 'video/mpeg',
        }));

        files = [...files, ...videos];
      }

      if (initialData.files) {
        const hugeFiles = initialData.files.map((file, index) => ({
          uid: index,
          url: file,
          name: t('common.file', { number: index + 1 }),
          status: 'done',
          type: 'hugeFile',
        }));

        files = [...files, ...hugeFiles];
      }

      return files;
    };

    return initialData && Object.keys(initialData).length > 0
      ? {
          title: type !== 'post' ? initialData.title : undefined,
          content: initialData.content || '',
          speciality: initialData.speciality,
          anatomy: initialData.anatomy,
          persons:
            type === 'article' || type === 'podcast'
              ? initialData.persons
              : undefined,
          reference: type === 'article' ? initialData.reference : undefined,
          fullArticle: type === 'article' ? initialData.fullArticle : undefined,
          tags: initialData.tags
            ? initialData.tags?.map(tag => tag.name)
            : undefined,
          date_creation:
            type === 'article' || type === 'podcast'
              ? moment(initialData.date_creation)
              : undefined,
          files: getFiles(),
        }
      : {
          content: '',
        };
  }, [initialData, type]);

  const handleFormSubmit = values => {
    onSubmit({
      title: type !== 'post' ? values.title : undefined,
      content: form.getFieldValue(['content']),
      speciality: values.speciality,
      anatomy: values.anatomy,
      persons:
        type === 'article' || type === 'podcast' ? values.persons : undefined,
      reference: type === 'article' ? values.reference : undefined,
      fullArticle: type === 'article' ? values.fullArticle : undefined,
      tags:
        (type === 'post' || type === 'case') && communityId
          ? tagList.filter(tag =>
              values.tags?.some(valueTag => valueTag === tag.name),
            )
          : undefined,
      date_creation:
        type === 'article' || type === 'podcast'
          ? values.date_creation
            ? values.date_creation.format()
            : moment(new Date()).format()
          : undefined,
      pictures:
        type !== 'article'
          ? values.files
            ? values.files
                .filter(file => imageFileTypes.includes(file.type))
                .map(file => file.url)
            : []
          : undefined,
      audio:
        type === 'podcast'
          ? values.files
            ? values.files.filter(file => audioFileTypes.includes(file.type))[0]
                ?.url
            : ''
          : undefined,
      documents:
        type !== 'podcast'
          ? values.files
            ? values.files
                .filter(file =>
                  type === 'case' || type === 'post'
                    ? file.type === 'application/pdf'
                    : documentFileTypes.includes(file.type),
                )
                .map(file => file.url)
            : []
          : undefined,
      videos:
        type === 'case' || type === 'post'
          ? values.files
            ? values.files
                .filter(file => videoFileTypes.includes(file.type))
                .map(file => file.url)
            : []
          : undefined,
      files:
        type === 'case' || type === 'post'
          ? values.files
            ? values.files
                .filter(
                  file =>
                    file.type === 'hugeFile' ||
                    (documentFileTypes.includes(file.type) &&
                      file.type !== 'application/pdf'),
                )
                .map(file => file.url)
            : []
          : undefined,
      questions: type === 'case' || type === 'post' ? questions : undefined,
      type,
      author: { _id: user._id },
      _id: isUpdate ? initialData._id : undefined,
      community: communityId,
    });
    setModalVisible(false);
    form.resetFields();
  };

  const getUploadMaxCountByType = () => {
    if (type === 'article') {
      return 1;
    } else if (type === 'podcast') {
      return 2;
    } else {
      return undefined;
    }
  };

  const getBeforeUploadByType = file => {
    if (type === 'article') {
      return beforeUploadArticle(file);
    } else if (type === 'podcast') {
      return beforeUploadPodcast(file, form.getFieldValue('files'));
    } else {
      videoFileTypes.includes(file.type) ? setIsVideo(true) : setIsVideo(false);
      return beforeUploadPost(file);
    }
  };

  const getDraggerContent = () => {
    if (type === 'article') {
      return t('common.isDocument');
    } else if (type === 'podcast') {
      return t('common.isImageOrAudio');
    } else {
      return t('common.isImageOrDocumentOrVideo');
    }
  };

  const prepearTagsToSave = (value, option) => {
    const newTags =
      value &&
      value
        .map(
          tagStr =>
            !tagList.some(
              tag => tag.name.toLowerCase() === tagStr.toLowerCase(),
            ) && {
              name: tagStr.toLowerCase(),
              label: tagStr,
            },
        )
        .filter(tags => tags);
    setTagList(prev => [...prev, ...newTags]);
  };

  return (
    <>
      {type === 'post' && !isUpdate ? (
        <Button
          className={classNames(
            'action-button-post',
            i18n.language === 'ar' && 'action-button-post--rtl',
          )}
          onClick={() =>
            user?._id ? setModalVisible(true) : setAuthPopup({ open: true })
          }
        >
          <UserAvatar width={36} height={36} />
          <p>{t('common.clickToMakePost')}</p>
        </Button>
      ) : (
        (type === 'case' ||
          type === 'post' ||
          ((!isMobile || isUpdate) && user.role === 'admin')) && (
          <Button
            className={classNames(
              'action-button',
              !!communityId && !isUpdate && 'community-case',
            )}
            onClick={() =>
              user?._id ? setModalVisible(true) : setAuthPopup({ open: true })
            }
          >
            {t(`common.${isUpdate ? 'editPost' : 'addPost'}`, {
              type: t(`common.${type}`),
            })}
          </Button>
        )
      )}
      {type === 'podcast' && user?.role === 'podcast' && (
        <Button
          className={classNames(
            'action-button',
            !!communityId && !isUpdate && 'community-case',
          )}
          onClick={() =>
            user?._id ? setModalVisible(true) : setAuthPopup({ open: true })
          }
        >
          {t(`common.${isUpdate ? 'editPost' : 'addPost'}`, {
            type: t(`common.${type}`),
          })}
        </Button>
      )}
      {user?._id && (
        <Modal
          className={classNames(
            'publication-modal',
            i18n.language === 'ar' && 'publication-modal--rtl',
          )}
          forceRender
          visible={modalVisible}
          title={t(`common.${isUpdate ? 'editPost' : 'createPost'}`, {
            type: t(`common.${type}`),
          })}
          closeIcon={
            <span className="close" onClick={() => setModalVisible(false)}>
              {!isMobile ? (
                <>
                  <CloseOutlined /> {t('common.close')}
                </>
              ) : (
                <ArrowLeftOutlined />
              )}
            </span>
          }
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            className="publication-form"
            onFinish={handleFormSubmit}
            onError={e => console.log(e)}
            initialValues={initialValues}
            validateTrigger="onSubmit"
          >
            {type !== 'post' && (
              <Form.Item
                name="title"
                label=""
                rules={[{ required: true, message: '' }]}
                className="publication-form--title"
              >
                <Input
                  placeholder={t('common.postTitle', {
                    type: t(`common.${type}`),
                  })}
                />
              </Form.Item>
            )}
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, curValues) =>
                prevValues.content !== curValues.content ||
                !isEqual(prevValues.files, curValues.files)
              }
            >
              {({ getFieldValue, setFieldsValue }) => (
                <Form.Item
                  name="content_field"
                  label={t('common.postContent', {
                    type: t(`common.${type}`),
                  })}
                  className="publication-form--content"
                  rules={[
                    {
                      validator: () => {
                        const _content = ContentState.createFromBlockArray(
                          convertFromHTML(getFieldValue(['content'])),
                        );
                        return _content.getPlainText().trim().length > 0
                          ? Promise.resolve()
                          : Promise.reject();
                      },
                      message: '',
                    },
                  ]}
                >
                  <LexicalEditor
                    handleChange={text => setFieldsValue({ content: text })}
                    content={getFieldValue(['content'])}
                    contentType={type}
                    type={type === 'case' ? 'full' : 'simple'}
                  />
                  {/*<RichEditorDescription*/}
                  {/*  pictures={*/}
                  {/*    getFieldValue(['files'])*/}
                  {/*      ? getFieldValue(['files'])*/}
                  {/*          .filter(file => imageFileTypes.includes(file.type))*/}
                  {/*          .map(file => file.url)*/}
                  {/*      : []*/}
                  {/*  }*/}
                  {/*  documents={*/}
                  {/*    getFieldValue(['files'])*/}
                  {/*      ? getFieldValue(['files'])*/}
                  {/*          .filter(file =>*/}
                  {/*            documentFileTypes.includes(file.type),*/}
                  {/*          )*/}
                  {/*          .map(file => file.url)*/}
                  {/*      : []*/}
                  {/*  }*/}
                  {/*  videos={*/}
                  {/*    getFieldValue(['files'])*/}
                  {/*      ? getFieldValue(['files'])*/}
                  {/*          .filter(file => videoFileTypes.includes(file.type))*/}
                  {/*          .map(file => file.url)*/}
                  {/*      : []*/}
                  {/*  }*/}
                  {/*  questions={questions}*/}
                  {/*  handleChange={text => setFieldsValue({ content: text })}*/}
                  {/*  content={getFieldValue(['content'])}*/}
                  {/*  contentType={type}*/}
                  {/*  type={type === 'case' ? 'full' : 'simple'}*/}
                  {/*/>*/}
                </Form.Item>
              )}
            </Form.Item>

            <Form.Item
              name="speciality"
              label={
                <span>
                  <i>
                    {t('common.domainsAndAnatomies', {
                      type: t(`common.${type}`),
                    })}
                  </i>
                </span>
              }
              rules={[
                {
                  required: type !== 'post',
                  message: '',
                },
              ]}
              className="publication-form--specialities"
            >
              <Select
                placeholder={t('common.domainsPlaceholder')}
                optionFilterProp="children"
                allowClear
                mode="multiple"
                getPopupContainer={trigger => trigger.parentElement}
              >
                {specialities.map(speciality => (
                  <Select.Option
                    key={speciality.value || speciality.name}
                    value={speciality.label || speciality.name}
                  >
                    {t(`common.specialities-${camelCase(speciality.label)}`)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="anatomy"
              label=""
              rules={[
                {
                  required: type !== 'post',
                  message: '',
                },
              ]}
              className="publication-form--anatomies"
            >
              <Select
                placeholder={t('common.anatomiesPlaceholder')}
                optionFilterProp="children"
                allowClear
                mode="multiple"
                getPopupContainer={trigger => trigger.parentElement}
              >
                {anatomies.map(anatomy => (
                  <Select.Option
                    key={anatomy.value || anatomy.name}
                    value={anatomy.label || anatomy.name}
                  >
                    {t(`common.anatomies-${camelCase(anatomy.label)}`)}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            {tags && (
              <Form.Item
                name="tags"
                label=""
                rules={[{ required: false, message: '' }]}
                className="publication-form--tags"
              >
                <Select
                  placeholder={t('common.tagsPlaceholder')}
                  optionFilterProp="children"
                  allowClear
                  onChange={prepearTagsToSave}
                  mode="tags"
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  {tagList.map(tag => (
                    <Select.Option key={tag.name} value={tag.name}>
                      {tag.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {(type === 'article' || type === 'podcast') && (
              <Form.Item
                name="persons"
                label=""
                rules={[{ required: true, message: '' }]}
                className="publication-form--persons"
              >
                <Input.TextArea
                  placeholder={
                    type === 'article'
                      ? t('common.addAuthors')
                      : t('common.addSpeakers')
                  }
                  autoSize={{ minRows: 3 }}
                />
              </Form.Item>
            )}
            {type === 'article' && (
              <Form.Item
                name="reference"
                label=""
                rules={[{ required: true, message: '' }]}
                className="publication-form--reference"
              >
                <Select
                  placeholder={t('common.referencesPlaceholder')}
                  optionFilterProp="children"
                  allowClear
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  {references.map(reference => (
                    <Select.Option key={reference} value={reference}>
                      {t(`common.references-${camelCase(reference)}`)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            {type === 'article' && (
              <Form.Item
                name="fullArticle"
                label=""
                rules={[{ required: true, message: '' }]}
                className="publication-form--fullArticle"
              >
                <Input.TextArea
                  placeholder={t('common.addFullArticle')}
                  autoSize={{ minRows: 2 }}
                />
              </Form.Item>
            )}
            {(type === 'article' || type === 'podcast') && (
              <Form.Item
                name="date_creation"
                label=""
                className="publication-form--dateCreation"
              >
                <DatePicker
                  getPopupContainer={trigger => trigger.parentElement}
                />
              </Form.Item>
            )}
            <Form.Item
              name="files"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              className="publication-form--files"
              shouldUpdate
            >
              <Upload.Dragger
                multiple={false}
                maxCount={getUploadMaxCountByType()}
                beforeUpload={getBeforeUploadByType}
                iconRender={file => {
                  if (documentFileTypes.includes(file.type)) {
                    return <FileOutlined />;
                  } else if (audioFileTypes.includes(file.type)) {
                    return <AudioOutlined />;
                  } else if (imageFileTypes.includes(file.type)) {
                    return <PictureOutlined />;
                  } else if (videoFileTypes.includes(file.type)) {
                    return <VideoCameraOutlined />;
                  } else if (file.type === 'hugeFile') {
                    return <FileImageOutlined />;
                  }
                }}
                action={
                  isVideo
                    ? `${PRODUCTION_VIDEOS_API_URL}posts/upload-video`
                    : `${getBaseApiUrl()}posts/upload`
                }
                headers={{
                  Authorization: `Token ${currentUser?.token}`,
                }}
                onChange={info => {
                  let newFileList = [...info.fileList];
                  newFileList = newFileList.map(file => {
                    if (file.response) {
                      file.url = file.response.url;
                    }
                    return file;
                  });
                  form.setFieldsValue({ files: newFileList });
                }}
              >
                <p className="ant-upload-drag-icon">
                  {type === 'article' && <img src={UploadArticlesIcon} />}
                  {type === 'podcast' && <img src={UploadPodcastsIcon} />}
                  {type !== 'podcast' && type !== 'article' && (
                    <img src={UploadMediasIcon} />
                  )}
                </p>
                <p className="ant-upload-text">
                  {t('common.selectMediaOrDragAndDrop', {
                    content: getDraggerContent(),
                  })}
                </p>
              </Upload.Dragger>
            </Form.Item>
            {(type === 'case' || type === 'post') && (
              <>
                <CreateMCQs
                  update={questionObj =>
                    setQuestions([...questions, questionObj])
                  }
                />
                <PreviewMCQs
                  questions={questions}
                  change={questionsArr => setQuestions([...questionsArr])}
                />
              </>
            )}
            <Form.Item
              name="agreement"
              valuePropName="checked"
              className="publication-form--agreement"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error(t('common.confirmationAgreeError')),
                        ),
                },
              ]}
            >
              <Checkbox>{t('common.confirmationText')}</Checkbox>
            </Form.Item>

            <div className="publication-form--submit">
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, curValues) =>
                  !isEqual(prevValues.files, curValues.files)
                }
              >
                {({ getFieldValue }) => (
                  <Button
                    htmlType="submit"
                    disabled={
                      getFieldValue(['files'])
                        ? getFieldValue(['files'])?.some(
                            file => file.status === 'uploading',
                          )
                        : false
                    }
                  >
                    {t(`common.${isUpdate ? 'update' : 'publish'}`)}
                  </Button>
                )}
              </Form.Item>
            </div>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default compose(
  withUser,
  withAuthPopup,
  memo,
)(CreatePublicationv2);
