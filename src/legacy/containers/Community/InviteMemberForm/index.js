import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Button, Form, Select } from 'antd';

// assets
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

// components
import UserAvatar from 'legacy/components/UserAvatar';

// context
import { withUser } from 'engine/context/User.context';

// helper
import api, { setAuthorizationHeader } from 'engine/api/axiosAPI';
import { getObjId, getArrayIds, getUniqueMembers } from 'utils/generalHelper';

const InviteMemberForm = ({
  communityId,
  members,
  user,
  // actions
  getResponse,
  // default props
  className,
}) => {
  const childClassNames = classNames('invite-member-form-wrapper', className);
  const { t } = useTranslation();

  const [showForm, setShowForm] = useState(false);
  const [options, setOptions] = useState([]);
  const [searchParam, setSearchParam] = useState('');
  const [includesUsers, setIncludesUsers] = useState(user?.followers || []);

  const [inviteMemberForm] = Form.useForm();

  const local = localStorage.getItem('beemed_user');
  const json = JSON.parse(local);
  setAuthorizationHeader(json.token);

  const handleSearch = async value => {
    const allMembers = getUniqueMembers(members);
    const allMembersIDs = getArrayIds(allMembers);
    const includeIDs = includesUsers?.filter(el => {
      let adding = true;
      allMembersIDs?.map(el2 => {
        if (getObjId(el2) == getObjId(el)) {
          adding = false;
        }
      });
      return adding;
    });
    setIncludesUsers(includeIDs);

    const request = {
      user: {
        _id: user?._id,
      },
      include: includeIDs,
      exclude: allMembersIDs || [],
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

  const handleFormSubmit = formData => {
    const newIncludes = includesUsers?.filter(
      el => getObjId(el) !== getObjId(formData.user),
    );
    const newOption = options?.filter(
      el => getObjId(el) !== getObjId(formData.user),
    );
    setIncludesUsers(newIncludes);
    setOptions(newOption);

    api.community.invitation
      .createInvitationToJoin({
        community: communityId,
        ...formData,
      })
      .then(res => {
        setShowForm(false);
        getResponse(res, {
          _id: formData.user,
          role: formData?.role,
          userId: null,
          userRole: null,
        });
      })
      .catch(err => {
        console.error(err);
        setShowForm(false);
        getResponse(null, null, null, null);
      });
  };

  return (
    <div className={childClassNames}>
      <Button
        className="invite-member-btn"
        disabled={showForm}
        onClick={() => setShowForm(true)}
      >
        {t('communities.inviteAnotherMember')}
      </Button>
      {showForm && (
        <Form
          form={inviteMemberForm}
          className="invite-member-form"
          id="invite-member-form"
          onFinish={handleFormSubmit}
        >
          <Form.Item
            name="user"
            className="user-field"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Select
              showSearch
              showArrow={false}
              placeholder={t('communities.findUser')}
              optionFilterProp="children"
              filterOption={false}
              onSearch={debounce(value => setSearchParam(value), 500)}
              onSelect={option => setSearchParam('')}
              getPopupContainer={() =>
                document.getElementById('invite-member-form')
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
                    <p className="company">{option.description?.company}</p>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <div className="invite-member-form__actions">
            <Form.Item
              name="role"
              rules={[
                { required: true, message: t('communities.roleRequired') },
              ]}
              className="user-role"
              initialValue="member"
            >
              <Select
                getPopupContainer={trigger => trigger.parentElement}
                optionFilterProp="children"
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
            <Button htmlType="submit" type="text" className="accept-member-btn">
              <CheckOutlined />
            </Button>
            <CloseOutlined
              onClick={() => {
                setShowForm(false);
              }}
              className="remove-member-btn"
            />
          </div>
        </Form>
      )}
    </div>
  );
};

InviteMemberForm.defaultProps = {};
InviteMemberForm.propTypes = {
  members: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  getResponse: PropTypes.func,
  communityId: PropTypes.string,
};

export default compose(
  withUser,
  memo,
)(InviteMemberForm);
