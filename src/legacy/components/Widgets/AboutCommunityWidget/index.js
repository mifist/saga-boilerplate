import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import camelCase from 'lodash/camelCase';

// styles
import './style.scss';

//antd components
import { Button, Form, Input } from 'antd';

// components
import RichEditorDescription from 'legacy/components/RichEditorDescription';

// helper
import { limit, getObjId } from 'utils/generalHelper';
import { communityTypes } from 'utils/categoryHelper';

// contexts
import { withUser } from 'appContext/User.context';
import LexicalEditor from 'legacy/components/LexicalEditor';

function AboutCommunityWidget({
  communityInfo,
  members,
  mode,
  // states
  user,
  //action
  openTab,
  onChangeCommunity,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames(
    'about-community-wrapper',
    'about-community-widget',
    'community-widget',
    className,
  );

  const { t } = useTranslation();
  const initForm = { description: communityInfo?.description || '' };
  const [editorForm] = Form.useForm();

  const [isEditMode, setIsEditMode] = useState(false);
  const [aboutContent, setAboutContent] = useState(initForm?.description);

  const getMembers = () => {
    let membersConcat = [];

    membersConcat =
      communityInfo?.admins && membersConcat.concat(communityInfo?.admins);
    membersConcat =
      communityInfo?.moderators &&
      membersConcat.concat(communityInfo?.moderators);
    membersConcat =
      communityInfo?.members && membersConcat.concat(communityInfo?.members);

    const uniqueArr = membersConcat ? Array.from(new Set(membersConcat)) : [];

    return uniqueArr;
  };

  const canEdit = useCallback(() => {
    const userId = user?._id;
    const isAdmin =
      communityInfo?.admins &&
      communityInfo?.admins.some(el => el?._id == userId);
    return isAdmin;
  }, [communityInfo, user]);

  const isModerator = useCallback(() => {
    const userId = getObjId(user);
    const isModerator =
      communityInfo?.moderators &&
      communityInfo?.moderators.find(el => getObjId(el) == userId);
    return isModerator;
  }, [communityInfo, user]);

  const onSave = values => {
    if (
      values.hasOwnProperty('description') &&
      values?.description &&
      values?.description !== communityInfo?.description
    ) {
      const isDescriptionString = typeof values?.description === 'string';
      onChangeCommunity({
        description: isDescriptionString ? values?.description : aboutContent,
      });
    }
    editorForm.resetFields();
    setIsEditMode(!isEditMode);
  };

  const membersList = getMembers() ? getMembers() : [];

  const AboutDescription = communityInfo?.description?.length > 8 && (
    <>
      <div
        className={`about-community-description ${mode}`}
        dangerouslySetInnerHTML={{
          __html:
            mode == 'widget'
              ? limit(communityInfo?.description, 140)
              : communityInfo?.description,
        }}
      />
      {mode == 'widget' && (
        <Button
          onClick={() => openTab !== undefined && openTab('about')}
          type="link"
        >
          {t('common.seeMore')}
        </Button>
      )}
    </>
  );

  return (
    <div className={childClassNames}>
      {mode == 'component' && (
        <>
          {canEdit() && !isEditMode && (
            <Button
              className="edit-about-btn"
              onClick={() => setIsEditMode(!isEditMode)}
            >
              {t('common.edit')}
            </Button>
          )}
          <div className="about-community-tab">
            {isEditMode ? (
              <>
                <Form
                  form={editorForm}
                  name="about_community_form"
                  initialValues={initForm}
                  onFinish={onSave}
                >
                  <Form.Item>
                    <div>
                      <Button
                        className="save-edit-btn"
                        key="submit"
                        htmlType="submit"
                      >
                        {t('common.save')}
                      </Button>
                      <Button
                        className="cancel-edit-btn"
                        onClick={() => setIsEditMode(!isEditMode)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </div>
                  </Form.Item>
                  <Form.Item
                    hidden
                    name="description"
                    className="about-editor-widget"
                  >
                    <Input value={aboutContent} />
                  </Form.Item>
                  <Form.Item
                    name="description-editor"
                    className="about-editor-widget"
                  >
                    <LexicalEditor
                      handleChange={text => {
                        // console.debug('text', text);
                        setAboutContent(text);
                        editorForm.setFieldsValue({
                          description: text,
                        });
                      }}
                      content={aboutContent}
                      type="full"
                    />
                    {/*<RichEditorDescription*/}
                    {/*  handleChange={text => {*/}
                    {/*    console.debug('text', text);*/}
                    {/*    setAboutContent(text);*/}
                    {/*    editorForm.setFieldsValue({*/}
                    {/*      description: text,*/}
                    {/*    });*/}
                    {/*  }}*/}
                    {/*  content={aboutContent}*/}
                    {/*  type={'simple'}*/}
                    {/*/>*/}
                  </Form.Item>
                </Form>
              </>
            ) : (
              AboutDescription
            )}
          </div>
        </>
      )}
      {mode == 'widget' && (
        <div className="about-community">
          {AboutDescription}
          <div className="about-community-private">
            <h3 className="private-title">
              {t(
                `communities.community-${camelCase(
                  communityTypes[communityInfo.private],
                )}`,
              )}
            </h3>
            <p className="private-description">
              {communityInfo.private == 'private' &&
                t('communities.privateCommunityDesc')}
              {communityInfo.private == 'semi-private' &&
                t('communities.semiPrivateCommunityDesc')}
              {communityInfo.private == 'public' &&
                t('communities.publicCommunityDesc')}
              {communityInfo.private == 'industry' &&
                t('communities.industryPartnetCommunityDesc')}
            </p>
          </div>
          {(canEdit() || isModerator() || communityInfo?.showMembersAmount) && (
            <div className="about-community-members">
              <span className="members-amount">{membersList?.length || 0}</span>
              <p className="members-description">
                {t('communities.membetsOfThisCommunity')}
              </p>
            </div>
          )}
          <div className="about-community-date">
            <span className="date-create-community">
              {moment(communityInfo.createdAt).format('DD MMM YYYY')}
            </span>
            <p className="date-create-description">
              {t('common.creationDate')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

AboutCommunityWidget.defaultProps = {
  mode: 'widget',
};
AboutCommunityWidget.propTypes = {
  mode: PropTypes.oneOf(['widget', 'component']).isRequired,
  communityInfo: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
  onChangeCommunity: PropTypes.func,
};

export default compose(
  memo,
  withUser,
)(AboutCommunityWidget);
