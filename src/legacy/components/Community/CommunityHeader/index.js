import React, { memo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

// styles
import './style.scss';

// antd component
import { Button, Tag, Input, Form, Select, Modal, Switch } from 'antd';

//icons
import { EditOutlined } from '@ant-design/icons';

// containers
import LeaveButton from 'legacy/containers/Community/LeaveButton';

// contexts
import { withUser } from 'appContext/User.context';

// helpers function
import { anatomies, specialities, communityTypes } from 'utils/categoryHelper';
import { membersAmount, getObjId } from 'utils/generalHelper';

function CommunityHeader({
  communityInfo,
  loading,
  // states
  user,
  // actions
  onChangeHeader,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('community-header-wrapper', className);
  const { t } = useTranslation();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showMembersAmountValue, setShowMembersAmountValue] = useState(
    communityInfo?.showMembersAmount || true,
  );

  const initForm = {
    title: communityInfo?.title || '',
    speciality: communityInfo?.speciality || null,
    anatomy: communityInfo?.anatomy || null,
  };
  const [headerFrom] = Form.useForm();

  const isIndustry = communityInfo?.private == 'industry';

  useEffect(() => {
    isIndustry && setShowMembersAmountValue(communityInfo?.showMembersAmount);
  }, [communityInfo?.showMembersAmount]);

  const canEdit = useCallback(() => {
    const userId = getObjId(user);
    const isAdmin =
      communityInfo?.admins &&
      communityInfo?.admins.find(el => getObjId(el) == userId);
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
    let newObj = {};
    if (values.hasOwnProperty('title') && values?.title) {
      Object.assign(newObj, { title: values?.title });
    }

    if (values.hasOwnProperty('speciality') && values?.speciality) {
      Object.assign(newObj, { speciality: values?.speciality });
    }

    if (values.hasOwnProperty('anatomy') && values?.anatomy) {
      Object.assign(newObj, { anatomy: values?.anatomy });
    }

    if (isIndustry) {
      Object.assign(newObj, {
        showMembersAmount: showMembersAmountValue,
      });
    }

    onChangeHeader(newObj);

    setIsEditMode(!isEditMode);
  };

  const changeMembersAmount = value => setShowMembersAmountValue(value);

  return (
    <div className={childClassNames}>
      {communityInfo && (
        <>
          <div className="community-description">
            <div className="community-title-wrapper">
              <h3 className="community-description-title">
                {communityInfo.title}
              </h3>
              {!isEditMode && canEdit() && (
                <EditOutlined
                  className="edit-comm-title"
                  onClick={() => setIsEditMode(!isEditMode)}
                />
              )}
            </div>

            <span className="community-description-members">
              {isIndustry ? (
                <>
                  {communityTypes[communityInfo.private] && (
                    <span
                      className={`description-title label-${
                        communityInfo.private
                      }`}
                    >
                      {t(
                        `communities.community-${camelCase(
                          communityTypes[communityInfo.private],
                        )}`,
                      )}
                    </span>
                  )}
                  {(canEdit() ||
                    isModerator() ||
                    communityInfo?.showMembersAmount) && (
                    <span className="description-members">
                      {t('communities.membersWithCount', {
                        count: membersAmount(communityInfo),
                      })}
                    </span>
                  )}
                </>
              ) : (
                <>
                  {communityTypes[communityInfo.private] && (
                    <span
                      className={`description-title label-${
                        communityInfo.private
                      }`}
                    >
                      {t(
                        `communities.community-${camelCase(
                          communityTypes[communityInfo.private],
                        )}`,
                      )}
                      {' • '}
                    </span>
                  )}
                  <span className="description-members">
                    {t('communities.membersWithCount', {
                      count: membersAmount(communityInfo),
                    })}
                  </span>
                </>
              )}
            </span>

            <div className="community-tags-wrapper">
              <div className="community-tags">
                {communityInfo?.speciality?.length > 0 &&
                  communityInfo?.speciality?.map((tag, i) => (
                    <Tag
                      key={`tag-speciality__${i}`}
                      className="tag tag--speciality"
                    >
                      {t(`common.specialities-${camelCase(tag)}`)}
                    </Tag>
                  ))}
                {communityInfo?.anatomy?.length > 0 &&
                  communityInfo?.anatomy?.map((tag, i) => (
                    <Tag key={`tag-anatomy__${i}`} className="tag tag--anatomy">
                      {t(`common.anatomies-${camelCase(tag)}`)}
                    </Tag>
                  ))}
              </div>
            </div>
          </div>
          <div className="community-action">
            <LeaveButton community={communityInfo} />
            {/* <Tooltip title="Chat with community members">
              <Button
                type="primary"
                icon={<CustomIcons type="chat" />}
                onClick={() =>
                  history.push(`/chat/conversations/group/${communityInfo._id}`)
                }
                className="chat-btn"
                style={{ marginLeft: 20 }}
              />
            </Tooltip> */}
            {/* <Input
              placeholder="Quick search"
              className="community-action-input"
              bordered={false}
              onChange={inputChange}
              prefix={<SearchOutlined />}
              enterbutton="true"
            /> */}
          </div>

          {canEdit() && (
            <Modal
              title={t('communities.changeCommunityHeader')}
              visible={isEditMode}
              onCancel={() => setIsEditMode(!isEditMode)}
              // onOk={onSave}
              className="pre-header-modal"
            >
              <Form
                form={headerFrom}
                className="header-form"
                name="headedr_form"
                initialValues={initForm}
                onFinish={onSave}
              >
                <Form.Item
                  className="title-form-item"
                  name="title"
                  rules={[
                    { required: true, message: t('common.requiredField') },
                  ]}
                  label={t('communities.nameOfTheCommunity')}
                >
                  <Input placeholder={t('communities.communityName')} />
                </Form.Item>

                <Form.Item
                  name="speciality"
                  label={t('communities.communityDomains')}
                  className="category-select"
                >
                  <Select
                    placeholder={t('communities.selectDomain')}
                    mode="multiple"
                    showArrow
                    optionFilterProp="children"
                    getPopupContainer={trigger => trigger.parentElement}
                  >
                    {specialities.map(item => (
                      <Select.Option key={item.value} value={item.label}>
                        {t(`common.specialities-${camelCase(item.label)}`)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="anatomy"
                  label={t('communities.communityAnatomies')}
                  className="category-select"
                >
                  <Select
                    placeholder={t('communities.selectAnatomies')}
                    mode="multiple"
                    showArrow
                    optionFilterProp="children"
                    getPopupContainer={trigger => trigger.parentElement}
                  >
                    {anatomies.map(item => (
                      <Select.Option key={item.value} value={item.label}>
                        {t(`common.anatomies-${camelCase(item.label)}`)}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                {isIndustry && (
                  <Form.Item
                    className="form-item"
                    name="showMembersAmount"
                    valuePropName="checked"
                    rules={[{ required: false }]}
                    label={t('communities.hideCommunityMembers')}
                  >
                    <Switch
                      defaultChecked={communityInfo?.showMembersAmount}
                      checked={showMembersAmountValue}
                      checkedChildren={t('common.show')}
                      unCheckedChildren={t('common.hide')}
                      loading={loading}
                      onChange={changeMembersAmount}
                    />
                  </Form.Item>
                )}

                <Form.Item className="header-form-actions">
                  <Button
                    key="cancel"
                    className="cancel"
                    onClick={() => {
                      headerFrom.resetFields();
                      setIsEditMode(!isEditMode);
                    }}
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button key="submit" className="submit" htmlType="submit">
                    {t('common.save')}
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          )}
        </>
      )}
    </div>
  );
}

CommunityHeader.defaultProps = {
  loading: false,
};
CommunityHeader.propTypes = {
  communityInfo: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  onChangeHeader: PropTypes.func.isRequired,
};

export default compose(
  memo,
  withUser,
)(CommunityHeader);
