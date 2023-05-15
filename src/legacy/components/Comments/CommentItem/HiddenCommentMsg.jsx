import React, { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { notification, Typography, Button } from 'antd';

import { withUser } from 'appContext/User.context';

// Async call for managing of users
import api, { setAuthorizationHeader } from 'appAPI/axiosAPI';
import useAsync from 'appHooks/useAsync';

const HiddenCommentMsg = ({ user, commentId }) => {
  const { t } = useTranslation();
  const { isSuccess, run, data, isLoading } = useAsync();
  // User Authorization
  const local = localStorage.getItem('beemed_user');
  const json = JSON.parse(local);
  setAuthorizationHeader(json.token);

  useEffect(() => {
    if (data && isSuccess) {
      user.authLocalUser();
    }
  }, [data]);

  const handleHideOrShowCommentClick = useCallback(() => {
    if (user?._id) {
      if (!isLoading) {
        run(
          api.users.hideOrShowComment({
            userId: user?._id,
            commentId: commentId,
            status: 'show',
          }),
        );
      } else {
        notification.info({
          description: t('common.pendingRequest'),
        });
      }
    }
  }, [user?._id, commentId]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '20px 15px 12px',
        backgroundColor: '#fff',
        marginBottom: '8px',
      }}
    >
      <Typography.Text style={{ fontStyle: 'italic', fontSize: '16px' }}>
        {t('common.hiddenComment')}
      </Typography.Text>
      <Button type="link" onClick={handleHideOrShowCommentClick}>
        {t('common.show')}
      </Button>
    </div>
  );
};

HiddenCommentMsg.defaultProps = {};
HiddenCommentMsg.propTypes = {};

export default memo(withUser(HiddenCommentMsg));
