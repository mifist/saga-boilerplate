import React, { useState, useMemo, memo } from 'react';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import isEqual from 'lodash/isEqual';
import axios from 'axios';

import './style.scss';

//assets
import { PictureOutlined } from '@ant-design/icons';

// antd component
import { Form, Button, Upload, message } from 'antd';
// components
import UserAvatar from 'legacy/components/UserAvatar';
import LexicalEditor from 'legacy/components/LexicalEditor';
// Comments componanets
import CommentFilePreview from 'legacy/components/Comments/CommentFilePreview';

// contexts
import { withUser } from 'appContext/User.context';
import { withAuthPopup } from 'appContext/AuthPopup.context';

// hooks
import { useRefState } from 'appHooks'

// utils
import api, { setAuthorizationHeader } from 'appAPI/axiosAPI';
import { getBaseApiUrl } from 'utils/capacitorHelper';
import { PRODUCTION_VIDEOS_API_URL } from 'utils/constants';
import { normFile, beforeUploadCommentFiles, videoFileTypes } from 'utils/uploadHelper2';


const CommentFormNew = ({
  className,
  initialData,
  postData,
  user,
  setAuthPopup,
  nodeType,
  postType,
  onSubmitResponse,
  showForm,
  setShowForm,
  actionType,
  parent,
}) => {
  const containerClassNames = classNames('comment-form-container', className);

  const { t } = useTranslation();

  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));

  const [isVideo, setIsVideo] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const [currentContent, currentContentRef, setCurrentContent] = useRefState(
    initialData?.content || '',
  );

  const initialValues = useMemo(() => {
    return initialData && Object.keys(initialData).length > 0
      ? {
          comment: initialData.content,
          pictures: initialData.pictures
            ? initialData.pictures.map((file, index) => ({
                uid: index,
                url: file,
                status: 'done',
                type: 'image/jpeg',
              }))
            : [],
        }
      : {
          comment: '',
          pictures: [],
        };
  }, [initialData]);



  const handleFormCancel = () => {
    form.resetFields();
    if (actionType === 'reply') {
      setShowForm({ opened: false, type: null });
    } else {
      setShowForm(false);
    }
  };

  const handleFormFinish = values => {
    // check if the temporary element has any child nodes or not
    let tmp = document.createElement('DIV');
    tmp.innerHTML = currentContentRef.current;

    if (tmp.innerText.trim().length > 0) {
      values.comment = currentContentRef.current;
      setLoading(true);
      setAuthorizationHeader(currentUser.token);
      axios.defaults.baseURL = getBaseApiUrl();

      let request = {
        type: nodeType,
        content: values.comment,
        pictures:
          values.pictures?.length > 0
            ? values.pictures.map(pic => pic.url)
            : [],
        post: postType != 'event' ? postData?._id : null,
        event: postType == 'event' ? postData?.id : null,
        author: user._id,
        community: postData?.community?._id || null,
        highlighted: false,
        active: true,
        _id: initialData?._id || undefined,
        parent: parent ? { _id: parent._id } : undefined,
        answers: parent ? parent.answers : undefined,
      };
      if (actionType === 'edit') {
        api.comments
          .editComment(request)
          .then(data => {
            setLoading(false);
            onSubmitResponse(data.data);
            handleFormCancel();
          })
          .catch(e => {
            console.log(e);
            setLoading(false);
          });
      } else if (actionType === 'reply') {
        api.comments
          .addReplyComment(request)
          .then(data => {
            setLoading(false);
            onSubmitResponse(data.data);
            handleFormCancel();
          })
          .catch(e => {
            console.log(e);
            setLoading(false);
          });
      } else {
        api.comments
          .addParentComment(request)
          .then(data => {
            setLoading(false);
            onSubmitResponse(data.data);
            handleFormCancel();
          })
          .catch(e => {
            console.log(e);
            setLoading(false);
          });
      }
    } else {
      message.error(t('common.commentError'));
    }
  };

  const mentionEditor = useMemo(
    () => (
      <Form.Item name="comment" noStyle>
        <LexicalEditor
          className="comment-form--fields__content"
          handleChange={text => {
            setCurrentContent(text);
          }}
          content={currentContentRef.current}
          // placeholder={t('common.addComment')}
          placeholder={false}
          type="comment"
          mention
          postId={postType != 'event' ? postData?._id : postData.id}
          key={`MentionEditorComponent-main-${
            postType != 'event' ? postData?._id : postData.id
          }`}
        />
      </Form.Item>
    ),
    [currentContentRef, actionType, user?._id, postType],
  );

  return (
    <div className={containerClassNames}>
      <div className="comment-form-container--initial">
        {actionType !== 'edit' && <UserAvatar width={38} height={38} />}
        {!showForm ? (
          <p
            className="comment-form-container--initial__message"
            onClick={() =>
              user?._id ? setShowForm(true) : setAuthPopup({ open: true })
            }
          >
            {t('common.writeComment')}
          </p>
        ) : (
          <Form
            form={form}
            layout="vertical"
            className="comment-form"
            onFinish={handleFormFinish}
            onError={e => console.log(e)}
            initialValues={initialValues}
            validateTrigger="onSubmit"
          >
            <div className="comment-form--fields">
              <div className="container">
                {mentionEditor}
                <Form.Item
                  name="pictures"
                  noStyle
                  getValueFromEvent={normFile}
                  valuePropName="fileList"
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    showUploadList={false}
                    beforeUpload={file => {
                      videoFileTypes.includes(file.type)
                        ? setIsVideo(true)
                        : setIsVideo(false);

                      return beforeUploadCommentFiles(file);
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
                    className="comment-form--fields__file-upload"
                  >
                    <div style={{ cursor: 'pointer' }}>
                      <PictureOutlined style={{ fontSize: 32 }} />
                    </div>
                  </Upload>
                </Form.Item>
              </div>
              <div className="comment-form--fields__preview">
                <Form.Item
                  noStyle
                  shouldUpdate={(prevValues, curValues) =>
                    isEqual(prevValues.pictures, curValues.pictures)
                  }
                >
                  {({ getFieldValue, setFieldsValue }) =>
                    getFieldValue(['pictures']) &&
                    getFieldValue(['pictures'])[0] && (
                      <CommentFilePreview
                        fileUrl={getFieldValue(['pictures'])[0].url}
                        onDelete={data =>
                          setFieldsValue({
                            pictures: data,
                          })
                        }
                        loading={
                          getFieldValue(['pictures'])[0].status !== 'done'
                        }
                      />
                    )
                  }
                </Form.Item>
              </div>
            </div>

            <div className="comment-form--action-buttons">
              <Button
                htmlType="submit"
                className="comment-form--action-buttons__submit"
                loading={loading}
              >
                {t(`common.${actionType}`)}
              </Button>
              <Button
                className="comment-form--action-buttons__cancel"
                onClick={handleFormCancel}
              >
                {t('common.cancel')}
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default compose(
  memo,
  withUser,
  withAuthPopup,
)(CommentFormNew);
