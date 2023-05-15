/**
 *
 * JoinButton
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Button, Tooltip, notification } from 'antd';

// global user
import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

// Async call for managing of users
import api, {
  setAuthorizationHeader,
  setLanguageHeader,
} from 'engine/api/axiosAPI';
import useAsync from 'appHooks/useAsync';

// helpers function
import { getObjId } from 'utils/generalHelper';
import history from 'utils/history';

function JoinButton({
  type,
  community,
  user,
  // action
  respond,
  setAuthPopup,
  // default props
  className,
}) {
  const childClassNames = classNames('join-button', className);
  const { t } = useTranslation();

  // User Authorization
  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
  currentUser && setAuthorizationHeader(currentUser.token);

  const [joinRequestSent, setJoinRequestSent] = useState(false);

  const { isSuccess, run, data, isLoading, isError } = useAsync();

  useEffect(() => {
    if (
      community?.private == 'semi-private' &&
      community?.requests_join &&
      user
    ) {
      const userHasSentRequest = community?.requests_join?.find(request => {
        const requestAppruved = request?.processed && !request?.rejected;
        const requestRejected =
          (request?.processed && request?.rejected) ||
          (!request?.processed && request?.rejected);
        const requesPending = !request?.processed && !request?.rejected;
        return (
          getObjId(request?.user) === getObjId(user) &&
          (requestAppruved || requestRejected || requesPending)
        );
      });
      userHasSentRequest && setJoinRequestSent(true);
    }
  }, [community, user]);

  useEffect(() => {
    if (data && isSuccess) {
      if (data.hasOwnProperty('error')) {
        notification.info({ message: data.error });
        respond !== undefined && respond('joined');
        setJoinRequestSent(true);
      } else {
        respond !== undefined && respond(data);
        const msg =
          community?.private == 'semi-private'
            ? t('communities.requestedSuccessfully')
            : community.private == 'public'
            ? t('communities.joinedSuccessfully')
            : t('communities.joinedSuccessfully');
        notification.success({ message: msg });
        setJoinRequestSent(true);
        (community?.private == 'public' || community?.private == 'industry') &&
          history.push(`/community/detail/${community?._id}`);
      }
    }
  }, [data]);

  const joinHandler = () => {
    if (user?._id) {
      if (!isLoading) {
        run(
          api.community.request.createRequestToJoin({
            user: getObjId(user),
            community: getObjId(community),
          }),
        );
      } else {
        notification.info({
          description: t('common.pendingRequest'),
        });
      }
    } else {
      setAuthPopup({ open: true });
    }
  };

  return (
    community && (
      <>
        {community?.private == 'private' && (
          <Tooltip title={t('common.accessByInvitation')}>
            <Button
              className={`${childClassNames} ${type} ant-btn-link`}
              disabled
            >
              {t('communities.private')}
            </Button>
          </Tooltip>
        )}
        {community?.private !== 'private' && (
          <Button
            className={`${childClassNames} ${type} ant-btn-link ${
              joinRequestSent ? 'disabeled' : ''
            }`}
            onClick={joinHandler}
            disabled={community.private == 'semi-private' && joinRequestSent}
          >
            {community?.private == 'semi-private' &&
              !joinRequestSent &&
              t('communities.requestToJoin')}
            {community?.private == 'semi-private' &&
              joinRequestSent &&
              t('communities.requested')}
            {(community?.private == 'public' ||
              community?.private == 'industry') &&
              t('communities.join')}
          </Button>
        )}
      </>
    )
  );
}

JoinButton.defaultProps = {
  type: 'simple',
};
JoinButton.propTypes = {
  type: PropTypes.oneOf(['simple', 'in-row']),
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
  withAuthPopup,
)(JoinButton);
