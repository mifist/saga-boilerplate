/**
 *
 * LeaveButton
 *
 */
import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Button, notification, Popconfirm } from 'antd';

// containers
import JoinButton from 'legacy/containers/Community/JoinButton';

// global user
import { withUser } from 'engine/context/User.context';

// Async call for managing of users
import api, { setAuthorizationHeader } from 'engine/api/axiosAPI';
import useAsync from 'appHooks/useAsync';

// helpers function
import { getObjId, getUniqueMembers } from 'utils/generalHelper';
import history from 'utils/history';

function LeaveButton({
  community,
  user,
  // action
  respond,
  // default props
  className,
}) {
  const childClassNames = classNames('leave-button-wrapper', className);
  const { t } = useTranslation();

  // User Authorization
  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
  currentUser && setAuthorizationHeader(currentUser.token);

  const { isSuccess, run, data, isLoading, isError } = useAsync();

  const [communityMembers, setCommunityMembers] = useState([]);

  useEffect(() => {
    if (community) {
      const membersList = getUniqueMembers(community);
      setCommunityMembers(membersList);
    }
  }, [community]);

  const isJoined = useCallback(() => {
    const userId = getObjId(user);
    return communityMembers?.find(el => getObjId(el) == userId);
  }, [communityMembers, user]);

  useEffect(() => {
    if (data && isSuccess) {
      if (data.hasOwnProperty('error')) {
        notification.error({ message: data.error });
        respond !== undefined && respond(data);
      } else {
        respond !== undefined && respond(data);
        history.push('/community');
      }
    }
  }, [data]);

  const leaveHandler = () => {
    if (!isLoading) {
      run(api.community.leaveCommunity(getObjId(user), getObjId(community)));
    } else {
      notification.info(t('common.pendingRequest'));
    }
  };

  const manageCommunity = responseData => {
    if (responseData?._id && responseData?.community?.private == 'public') {
      setCommunityMembers([...communityMembers, responseData?.user]);
    }
  };

  return (
    <div className={childClassNames}>
      {isJoined() && user.role !== 'industry' && (
        <Popconfirm
          title={t('communities.doYouWantToLeaveCommunity')}
          onConfirm={leaveHandler}
          okText={t('common.yes')}
          cancelText={t('common.no')}
        >
          <Button loading={isLoading}>{t('communities.leaveCommunity')}</Button>
        </Popconfirm>
      )}
      {!isJoined() && (
        <JoinButton community={community} respond={manageCommunity} />
      )}
    </div>
  );
}

LeaveButton.defaultProps = {};
LeaveButton.propTypes = {
  respond: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  user: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
  community: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default compose(
  memo,
  withUser,
)(LeaveButton);
