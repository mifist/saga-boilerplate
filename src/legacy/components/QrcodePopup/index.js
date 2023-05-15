import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Typography, Button, Image, notification } from 'antd';
import api from 'engine/api/axiosAPI';

import './style.scss';
import { compose } from 'redux';
import { withUser } from '../../engine/context/User.context';
import i18n from 'i18next';

const QrcodePopup = ({ qrcode, newsfeed, user }) => {
  const { t } = useTranslation();

  const [qrPopupVisible, setQrPopupVisible] = useState(false);
  const [communityData, setCommunityData] = useState(null);

  useEffect(() => {
    if (qrcode) {
      api.community.getDetailsByToken(qrcode).then(data => {
        if (data) {
          setCommunityData(data);
          setQrPopupVisible(true);
        }
      });
    }
  }, [qrcode]);

  const sendRequestToCommunity = () => {
    api.community.request
      .createRequestToJoin({
        user: user?._id,
        community: communityData?._id,
      })
      .then(data => {
        if (data) {
          setQrPopupVisible(false);
          notification.success({
            message: `The request to join ${
              communityData?.title
            } community has been sent. You will be notified when the request is approved.`,
          });
        }
      })
      .catch(err => {
        notification.error({
          message: 'Error requesting to join the community',
        });
        setQrPopupVisible(false);
      });
  };

  return (
    <Modal
      visible={qrPopupVisible}
      onCancel={() => setQrPopupVisible(false)}
      className="qr-popup-container"
      footer={null}
    >
      {communityData?.logotype && (
        <Image
          className="upper-box-communities-logo"
          src={communityData?.logotype}
          width={64}
          height={64}
          preview={false}
        />
      )}
      {newsfeed ? (
        <>
          <Typography.Title level={4}>
            Clicking on this button will send a request to join{' '}
            {communityData?.title} community.
          </Typography.Title>
          <Button className="continue" onClick={() => sendRequestToCommunity()}>
            Request to join
          </Button>
        </>
      ) : (
        <>
          <Typography.Title level={4}>
            {t('auth.communityInfo', { communityName: communityData?.title })}
          </Typography.Title>
          <Button className="continue" onClick={() => setQrPopupVisible(false)}>
            {t('common.continue')}
          </Button>
        </>
      )}
    </Modal>
  );
};

export default compose(memo)(withUser(QrcodePopup));
