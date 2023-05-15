/**
 *
 * InvitationControls
 *
 */
import React, { memo, useEffect, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

// antd component
import { notification, Spin, Button } from 'antd';

// assets
// import CustomIcons from 'legacy/legacy/components/CustomIcons';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

// global user
import { withUser } from 'engine/context/User.context';

// Async call for managing of users
import api, { setAuthorizationHeader } from 'engine/api/axiosAPI';
import useAsync from 'appHooks/useAsync';

// helpers function
import { getObjId } from 'utils/generalHelper';

function InvitationControls({
  invitationId,
  community,
  user,
  // action
  respond,
  // default props
  className,
}) {
  const { t } = useTranslation();

  const childClassNames = classNames('invitation-controls', className);

  // User Authorization
  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
  currentUser && setAuthorizationHeader(currentUser.token);

  const { isSuccess, run, data, isLoading, isError } = useAsync();

  const [hideControls, setHideControls] = useState(false);

  const invitationObject = community?.invitations?.find(invitation => {
    /*  const requestAppruved = invitation?.processed && !invitation?.rejected;
    const requestRejected =
      (invitation?.processed && invitation?.rejected) ||
      (!invitation?.processed && invitation?.rejected); */
    const requesPending = !invitation?.processed && !invitation?.rejected;
    return (
      (getObjId(invitation) == getObjId(invitationId) ||
        (!getObjId(invitationId) &&
          getObjId(user) == getObjId(invitation.user))) &&
      requesPending
    );
  });

  useEffect(() => {
    if (data && isSuccess) {
      respond !== undefined && respond(data);
      if (data?.hasOwnProperty('error')) {
        notification.error({ message: data.error });
        setHideControls(true);
      } else {
        notification.success({ message: t('communities.updatedSuccessfully') });
      }
    }
  }, [data]);

  const acceptHandler = e => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoading) {
      run(
        api.community.invitation.acceptInvitationToJoin({
          _id: getObjId(invitationObject),
          community: getObjId(community),
          user: invitationObject?.user,
          role: invitationObject?.role,
        }),
      );
    } else {
      notification.info({
        message: t('common.pendingRequest'),
      });
    }
  };

  const rejectHandler = e => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoading) {
      run(
        api.community.invitation.rejectedInvitationToJoin({
          _id: getObjId(invitationObject),
          community: getObjId(community),
          user: invitationObject?.user,
          role: invitationObject?.role,
        }),
      );
    } else {
      notification.info({
        message: t('common.pendingRequest'),
      });
    }
  };

  return (
    !!invitationObject &&
    !hideControls && (
      <div className={childClassNames}>
        <Button
          icon={<CheckOutlined />}
          className="invitation-controls__accept"
          onClick={acceptHandler}
        >
          {t('common.accept')}
        </Button>
        <Button
          icon={<CloseOutlined />}
          className="invitation-controls__decline"
          onClick={rejectHandler}
        >
          {t('common.decline')}
        </Button>
        {isLoading && (
          <Spin className="request-controls__loading" size="small" />
        )}
      </div>
    )
  );
}

InvitationControls.defaultProps = {};
InvitationControls.propTypes = {
  respond: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  community: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default compose(
  memo,
  withUser,
)(InvitationControls);
