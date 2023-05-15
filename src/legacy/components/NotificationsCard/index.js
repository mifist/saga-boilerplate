import React from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { List } from 'antd';

import './style.scss';

//components
import UserAvatar from 'legacy/components/UserAvatar';

import InvitationControls from 'legacy/containers/Community/InvitationControls';
// helper
import { limit } from 'utils/generalHelper';

function NotificationsCard({
  category,
  title,
  body,
  show,
  post,
  mention,
  community,
  invitationId,
  isInvitation,
  manageNotification,
}) {
  if (category === 'post') {
    category = 'case';
  }

  const { t } = useTranslation();
  const history = useHistory();

  const handleCommunityNameClick = e => {
    e.preventDefault();
    e.stopPropagation();

    let _invitation = community.invitations.find(
      invitation => invitation?._id === invitationId,
    );

    if (_invitation?.processed && !_invitation?.rejected) {
      history.push(`/community/detail/${community?._id}`);
    }
  };

  return (
    <>
      {show && <div className="dot" />}
      <List.Item.Meta
        className="notification-list"
        avatar={<UserAvatar user={mention} />} // todo : replace by user avatar
        description={
          <>
            <div className="actualTitle">{title}</div>
            <div className="mainContent">{body}</div>
            {post && post?._id && (
              <>
                {post?.type != 'post' && (
                  <div className="linkContent">{post?.title}</div>
                )}
                {post?.type == 'post' && (
                  <div className="linkContent">
                    {limit(post?.content, 30)}...
                  </div>
                )}
              </>
            )}
            {community && (
              <div className="community-info">
                <div className="community-info__title">
                  <span className="label-community">
                    {t('communities.community')}:
                  </span>
                  <span
                    className="linkContent"
                    onClick={handleCommunityNameClick}
                  >
                    {community?.title}
                  </span>
                </div>

                {isInvitation && (
                  <InvitationControls
                    invitationId={invitationId}
                    respond={manageNotification}
                    community={community}
                  />
                )}
              </div>
            )}
          </>
        }
      />
    </>
  );
}

NotificationsCard.propTypes = {
  show: PropTypes.bool,
  category: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.string,
  invitation: PropTypes.bool,
  userId: PropTypes.string,
  manageNotification: PropTypes.func,
};

export default NotificationsCard;
