/**
 *
 * RequestControls
 *
 */

import React, { memo, useEffect, useState, useCallback } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Select, notification, Spin } from 'antd';

// assets
// import CustomIcons from 'legacy/legacy/components/CustomIcons';
import { CloseOutlined, CheckOutlined, UserOutlined } from '@ant-design/icons';

// components
import ChatButton from 'legacy/components/ChatButton';

// global user
import { withUser } from 'engine/context/User.context';

// Async call for managing of users
import api, { setAuthorizationHeader } from 'engine/api/axiosAPI';
import useAsync from 'appHooks/useAsync';
// helpers function
import { getObjId } from 'utils/generalHelper';

function RequestControls({
  mode,
  manageData,
  community,
  communityType,
  user,
  // action
  respond,
  // default props
  className,
}) {
  const childClassNames = classNames('request-controls', className);
  const { t } = useTranslation();
  const initRole = manageData?.role || 'member';

  const [currentRole, setCurrentRole] = useState(initRole);

  // User Authorization
  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
  currentUser && setAuthorizationHeader(currentUser.token);

  const { isSuccess, run, data, isLoading, isError } = useAsync();

  useEffect(() => {
    if (data && isSuccess) {
      respond !== undefined && respond(data);
      if (data?.hasOwnProperty('error')) {
        setCurrentRole(initRole);
        notification.error({ message: data.error });
      } else {
        notification.success({ message: t('common.dataUpdatedSuccessfully') });
      }
    }
  }, [data]);

  const canEdit = useCallback(() => {
    const userId = getObjId(user);
    const isAdmin =
      community?.admins && community?.admins.find(el => getObjId(el) == userId);
    return isAdmin;
  }, [community, user]);

  const changeRole = option => {
    if (!isLoading) {
      setCurrentRole(option);
      if (mode == 'member') {
        run(
          api.community.updateUserRole(
            getObjId(manageData),
            getObjId(community),
            option,
          ),
        );
      } else if (mode === 'invitation') {
        run(
          api.community.invitation.updateRoleInvitationToJoin({
            user: getObjId(manageData),
            _id: manageData.requestId,
            community: getObjId(community),
            role: option,
          }),
        );
      }
    } else {
      notification.info({
        message: t('common.requestPending'),
      });
    }
  };

  // Only for Requests
  const acceptHundler = () => {
    if (!isLoading) {
      run(
        api.community.request.acceptRequestToJoin({
          _id: getObjId(manageData),
          user: manageData?.user,
          community: getObjId(community),
          role: currentRole,
        }),
      );
    } else {
      notification.info({
        message: t('common.requestPending'),
      });
    }
  };

  const rejectHundler = () => {
    if (!isLoading) {
      if (mode == 'member') {
        run(
          api.community.removeUserFromCommunity(
            getObjId(manageData),
            getObjId(community),
          ),
        );
      } else if (mode == 'invitation') {
        run(
          api.community.invitation.rejectedInvitationToJoin({
            user: getObjId(manageData),
            _id: manageData.requestId,
            community: getObjId(community),
          }),
        );
      } else {
        run(
          api.community.request.rejectedRequestToJoin({
            _id: getObjId(manageData),
            user: manageData?.user,
            community: getObjId(community),
          }),
        );
      }
    } else {
      notification.info({
        message: t('common.requestPending'),
      });
    }
  };

  const employeeHundler = () => {
    if (!isLoading) {
      run(
        api.community.updateEmployee({
          _id: getObjId(manageData),
          employment: {
            isEmployee: !(
              !!manageData.employment && manageData.employment?.isEmployee
            ),
            industryCommunity: getObjId(community),
          },
        }),
      );
    } else {
      notification.info({
        message: t('common.requestPending'),
      });
    }
  };

  const sameCommunity =
    getObjId(manageData?.employment?.industryCommunity) == getObjId(community);

  return (
    manageData &&
    community && (
      <div className={childClassNames}>
        {isLoading && (
          <Spin className="request-controls__loading" size="small" />
        )}
        {user?.role != 'industry' && (
          <ChatButton
            mode="small"
            visibility={community && mode == 'member'}
            memberID={getObjId(manageData)}
          />
        )}
        {!manageData?.isIndusty &&
          communityType === 'industry' &&
          (user?.role == 'industry' || canEdit()) && (
            <UserOutlined
              onClick={employeeHundler}
              className={classNames(
                'request-controls__employee-btn',
                (!manageData?.employment ||
                  ((!manageData?.employment?.isEmployee && sameCommunity) ||
                    (manageData?.employment?.isEmployee && !sameCommunity) ||
                    (!manageData?.employment?.isEmployee && !sameCommunity))) &&
                  'not-employee',
              )}
            />
          )}
        {!manageData?.isIndusty && canEdit() && (
          <>
            <Select
              defaultValue={currentRole}
              value={currentRole}
              onChange={changeRole}
              optionFilterProp="children"
              className="request-controls__role-select"
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
            {mode == 'request' && (
              <CheckOutlined
                onClick={acceptHundler}
                className="request-controls__accept-btn"
              />
            )}

            <CloseOutlined
              onClick={rejectHundler}
              className="request-controls__reject-btn"
            />
          </>
        )}
      </div>
    )
  );
}

RequestControls.defaultProps = {
  mode: 'request',
};
RequestControls.propTypes = {
  mode: PropTypes.oneOf(['request', 'member', 'invitation']),
  respond: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  community: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  communityType: PropTypes.string,
  manageData: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default compose(
  memo,
  withUser,
)(RequestControls);
