import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const DeletedCommentMsg = ({ showMsg }) => {
  const {t} = useTranslation()

  return (
    showMsg && (
      <div className="comment-item deleted">
        <p>{t('common.deletedComment')}</p>
      </div>
    )
  );
};

DeletedCommentMsg.defaultProps = {
  showMsg: false,
};
DeletedCommentMsg.propTypes = {
  showMsg: PropTypes.bool,
};

export default memo(DeletedCommentMsg);
