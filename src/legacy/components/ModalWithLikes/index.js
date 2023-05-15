import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

import useDeviceDetect from 'utils/useDeviceDetect';

// antd components
import { Modal, Button, List, Tooltip } from 'antd';

// icons
import { CloseOutlined } from '@ant-design/icons';

// components
import ConditionalLink from 'legacy/components/ConditionalLink';
import UserAvatar from 'legacy/components/UserAvatar';
import Badge from 'legacy/components/Badge';
// global user
import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

// helpers function
import { getObjId, getEmployment } from 'utils/generalHelper';

function ModalWithLikes({
  dataSourse,
  userLikes,
  community,
  communityName,
  className,
  user,
  setAuthPopup,
}) {
  const mainClassName = classNames('modal-form-likes', className);
  const { isMobile } = useDeviceDetect();
  const { t } = useTranslation();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const communityId = getObjId(community) || getObjId(dataSourse?.community);
  const currentCommunityName =
    community?.title || dataSourse?.community?.title || communityName;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const sortUserAvatar = arr => {
    const newArr = [...arr.likes];
    return newArr.sort(el => (el.image ? -1 : 1));
  };

  const showUserName = useCallback(() => {
    if (userLikes === 0) {
      return '0';
    }
    if (userLikes > 0 && userLikes < 2) {
      return !isMobile ? (
        <Tooltip
          overlayClassName="tooltip"
          title={
            <>
              {dataSourse?.likes[0]?.description?.firstname}{' '}
              {dataSourse?.likes[0]?.description?.lastname}
            </>
          }
        >
          {userLikes}
        </Tooltip>
      ) : (
        userLikes
      );
    }
    return !isMobile ? (
      <Tooltip
        overlayClassName="tooltip"
        title={
          <>
            {`${dataSourse?.likes[0]?.description?.firstname}
              ${dataSourse?.likes[0]?.description?.lastname},
              ${dataSourse?.likes[1]?.description?.firstname}
              ${dataSourse?.likes[1]?.description?.lastname} ...`}
          </>
        }
      >
        {userLikes}
      </Tooltip>
    ) : (
      userLikes
    );
  }, [dataSourse, userLikes, isMobile]);

  const renderListItem = useCallback(
    item => {
      const isIndustryUser = item?.role == 'industry';
      const { isEmployee, industryName } = getEmployment(item);

      const sameCommunity =
        getObjId(item?.employment?.industryCommunity) == getObjId(communityId);

      const useLabel = (
        <>
          {isIndustryUser && sameCommunity && (
            <>
              <span className={`user-badge industry`}>
                {t('communities.community-industryPartner')}
              </span>
            </>
          )}
          {isIndustryUser && (
            <span className="user-badge industry">
              {t('communities.community-industryPartner')}
            </span>
          )}
        </>
      );

      return (
        <>
          <List.Item key={item.description._id}>
            <ConditionalLink
              condition={
                user?._id && (user?.role !== 'industry' || !isIndustryUser)
              }
              onClick={() => {
                setAuthPopup({ open: true });
                handleCancel();
              }}
              to={
                isIndustryUser && item?.employment
                  ? `/community/detail/${getObjId(
                      item?.employment?.industryCommunity,
                    )}`
                  : `/profile/${item._id}`
              }
            >
              <List.Item.Meta
                title={
                  <>
                    <span className="user-name">{`${
                      item.description.firstname
                    } ${item.description.lastname}`}</span>
                    {useLabel}
                  </>
                }
                avatar={
                  <UserAvatar
                    fontSize={12}
                    user={item}
                    width={56}
                    height={56}
                  />
                }
                description={
                  <>
                    <span>{item.credential.title}</span>
                  </>
                }
              />
            </ConditionalLink>
            {isEmployee && (
              <Badge title={t('communities.employeeOf', { industryName })} />
            )}
          </List.Item>
        </>
      );
    },
    [communityId, dataSourse],
  );

  return (
    <div className={mainClassName}>
      <>
        <Button
          type="text"
          className="modal-form-likes__btn-open"
          onClick={showModal}
        >
          {showUserName()}
        </Button>
        {userLikes > 0 ? (
          <Modal
            className="modal-form-likes__wrapper"
            title={t('common.whoIsLikingThisContent')}
            visible={isModalVisible}
            width={542}
            onCancel={handleCancel}
            footer={null}
            closeIcon={
              <span className="wrapper-close">
                <CloseOutlined /> {t('common.close')}
              </span>
            }
          >
            <List
              dataSource={sortUserAvatar(dataSourse)}
              renderItem={renderListItem}
            />
          </Modal>
        ) : null}
      </>
    </div>
  );
}

ModalWithLikes.propTypes = {
  dataSourse: PropTypes.object.isRequired,
  userLikes: PropTypes.number,
};

export default compose(
  memo,
  withUser,
  withAuthPopup,
)(ModalWithLikes);
