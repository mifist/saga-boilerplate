import React, { useState, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Layout, Typography, Form, Select, Space, Button } from 'antd';

// assets
import { CloseOutlined } from '@ant-design/icons';

// context
import { withUser } from 'engine/context/User.context';

// helpers function
import api, { setAuthorizationHeader } from 'engine/api/axiosAPI';
import UserAvatar from 'legacy/components/UserAvatar';

const MemberInvitationForm = ({ onFinish, loading, user }) => {
  const { t } = useTranslation();
  const [inviteMembersForm] = Form.useForm();
  const [options, setOptions] = useState([]);
  const [searchParam, setSearchParam] = useState('');

  const local = localStorage.getItem('beemed_user');
  const json = JSON.parse(local);
  setAuthorizationHeader(json.token);

  const handleSearch = async value => {
    const request = {
      user: {
        _id: user?._id,
      },
      include: user?.followers,
      exclude: [user?._id],
      limit: 50,
      value,
      firstLoad: false,
    };

    try {
      const data = await api.users.fetchAllMentions(request);
      setOptions(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    handleSearch(searchParam);
  }, [searchParam]);

  return (
    <Layout.Content className="main-single-content">
      <Typography.Title level={3} className="main-single-content-heading">
        {t('communities.inviteUsersToCommunity')}
      </Typography.Title>
      <div className="invitation-form">
        <Form
          form={inviteMembersForm}
          name="invite-members-form"
          id="invite-members-form"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.List name="invitations" className="member-list">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    className="member-list-item"
                    align="baseline"
                    id={`member-list-item-${key}`}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, 'user']}
                      className="user-field"
                      rules={[
                        { required: true, message: t('common.requiredField') },
                        {
                          message: t('common.sameUserError'),
                          validator: (_, value) => {
                            const users = inviteMembersForm
                              .getFieldsValue()
                              .invitations?.map(r => r.user);

                            if (
                              users.filter(user => user === value).length === 1
                            ) {
                              return Promise.resolve();
                            } else {
                              return Promise.reject();
                            }
                          },
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        showArrow={false}
                        placeholder={t('communities.findUser')}
                        optionFilterProp="children"
                        filterOption={false}
                        onSearch={debounce(value => setSearchParam(value), 500)}
                        onSelect={() => setSearchParam('')}
                        getPopupContainer={() =>
                          document.getElementById(`member-list-item-${key}`)
                        }
                        dropdownMatchSelectWidth={false}
                      >
                        {options.map(option => (
                          <Select.Option
                            value={option._id}
                            key={option._id}
                            className="user-field-option"
                          >
                            <UserAvatar
                              fontSize={12}
                              user={option}
                              width={56}
                              height={56}
                            />
                            <div className="description">
                              <h4 className="fullname">{`${
                                option.description?.firstname
                              } ${option.description?.lastname}`}</h4>
                              <p className="company">
                                {option.description?.company}
                              </p>
                            </div>
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'role']}
                      rules={[
                        {
                          required: true,
                          message: t('communities.roleRequired'),
                        },
                      ]}
                      className="user-role"
                      initialValue="member"
                    >
                      <Select
                        optionFilterProp="children"
                        getPopupContainer={trigger => trigger.parentElement}
                      >
                        <Select.Option value="member">
                          {t('communities.member')}
                        </Select.Option>
                        <Select.Option value="moderator">
                          {t('communities.moderator')}
                        </Select.Option>
                        <Select.Option value="admin">
                          {t('communities.admin')}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                    <CloseOutlined
                      onClick={() => remove(name)}
                      className="remove-member-btn"
                    />
                  </Space>
                ))}
                <Form.Item>
                  <Button className="add-member-btn" onClick={() => add()}>
                    {t(
                      `communities.${
                        fields.length > 0
                          ? 'inviteAnotherMember'
                          : 'inviteMember'
                      }`,
                    )}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <div className="action-buttons">
              <Button
                onClick={() => onFinish({ invitations: [] })}
                type="link"
                className="invite-leter-btn"
              >
                {t('communities.inviteLater')}
              </Button>
              <Button
                type="primary"
                className="invite-btn"
                htmlType="submit"
                loading={loading}
              >
                {t('communities.invite')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Layout.Content>
  );
};

MemberInvitationForm.defaultProps = {};
MemberInvitationForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
};

export default compose(
  withUser,
  memo,
)(MemberInvitationForm);
