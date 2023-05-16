import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import camelCase from 'lodash/camelCase';

// styles
import './style.scss';

// antd component
import { Modal, Image, Tag } from 'antd';
// assets
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';

// components
import UserAvatar from 'legacy/components/UserAvatar';
import Badge from 'legacy/components/Badge';
import ConditionalLink from 'legacy/components/ConditionalLink';
// containers
import JoinButton from 'legacy/containers/Community/JoinButton';
import InvitationControls from 'legacy/containers/Community/InvitationControls';

import { withUser } from 'appContext/User.context';
import { withAuthPopup } from 'appContext/AuthPopup.context';

// helper
import useDeviceDetect from 'appHooks/useDeviceDetect';
import { membersAmount, getObjId, getEmployment } from 'utils/generalHelper';
import { communityTypes } from 'utils/categoryHelper';

const AboutCommunityPopup = ({
  visible,
  communityInfo,
  // action
  onCancel,
  updateCommunityList,
  setAuthPopup,
  // default
  user,
  className,
}) => {
  const mainClassNames = classNames('about-community-popup-wrapper', className);
  const { t } = useTranslation();
  const { isMobile } = useDeviceDetect();

  const manageCommunity = (type, data) => {
    updateCommunityList !== undefined && updateCommunityList(type, data);
    onCancel !== undefined && onCancel();
  };

  const CommunityAdminCard = admin => {
    const adminData = admin?._id ? admin : admin?.admin;
    const { isEmployee, industryName } = getEmployment(adminData);
    const isIndustryUser = adminData.role == 'industry';

    return (
      adminData && (
        <div className="about-community__content--admin">
          <ConditionalLink
            condition={user?._id && !isIndustryUser}
            onClick={() => {
              onCancel();
              setAuthPopup({ open: true });
            }}
            to={`/profile/${adminData._id}`}
            className="about-community__content--admin-div"
          >
            <UserAvatar fontSize={12} user={adminData} width={36} height={36} />
            <div className="about-community__content--admin-div-desc">
              <div>
                <h5 className="about-community__content--admin-div-name">
                  <span>
                    {`${adminData?.description?.firstname} ${
                      adminData?.description?.lastname
                    }`}
                  </span>
                </h5>
              </div>
              {isIndustryUser && (
                <span className="comment-author__badge industry">
                  {t('communities.community-industryPartner')}
                </span>
              )}
              <Tag color="orange">{t('communities.admin')}</Tag>
            </div>
          </ConditionalLink>
          {isEmployee && (
            <Badge title={t('communities.employeeOf', { industryName })} />
          )}
        </div>
      )
    );
  };

  const isUserInvitedAndNotProcessed = communityInfo.invitations?.find(
    invitation => invitation.user === user._id && !invitation.processed,
  );

  const canEdit = useCallback(() => {
    const userId = getObjId(user);
    const isAdmin =
      communityInfo?.admins &&
      communityInfo?.admins.find(el => getObjId(el) == userId);
    return isAdmin;
  }, [communityInfo, user]);

  const isModerator = useCallback(() => {
    const userId = getObjId(user);
    const isModerator =
      communityInfo?.moderators &&
      communityInfo?.moderators.find(el => getObjId(el) == userId);
    return isModerator;
  }, [communityInfo, user]);

  return (
    <Modal
      visible={visible}
      onCancel={onCancel}
      className={`${mainClassNames} about-community`}
      title={t('communities.aboutTheCommunity')}
      closeIcon={
        <span className="about-community__close" onClick={() => onCancel()}>
          {!isMobile ? (
            <>
              <CloseOutlined /> {t('common.close')}
            </>
          ) : (
            <ArrowLeftOutlined />
          )}
        </span>
      }
      footer={[
        isUserInvitedAndNotProcessed ? (
          <div className="about-community__invitation">
            <h5>{t('communities.invitedThisCommunity')}</h5>
            <InvitationControls
              invitation={isUserInvitedAndNotProcessed}
              respond={data => manageCommunity('invitation', data)}
              community={communityInfo}
            />
          </div>
        ) : (
          <JoinButton
            community={communityInfo}
            respond={data => manageCommunity('request_join', data)}
            setAuthPopup={open => {
              setAuthPopup(open);
              onCancel();
            }}
          />
        ),
      ]}
    >
      <div
        className="about-community__header"
        style={{
          background:
            communityInfo.header?.picture &&
            `url("${communityInfo.header.picture}")`,
        }}
      >
        {/*{communityInfo.logotype && (*/}
        {/*  <Image*/}
        {/*    className="about-community__header--logo"*/}
        {/*    src={communityInfo.logotype}*/}
        {/*    width={64}*/}
        {/*    height={64}*/}
        {/*    preview={false}*/}
        {/*  />*/}
        {/*)}*/}
      </div>
      <div className="about-community__content">
        {communityInfo.title && (
          <h3 className="about-community__content--title">
            {communityInfo.title}
          </h3>
        )}
        <div className="about-community__content--description">
          {communityInfo.private == 'industry' ? (
            <>
              {communityTypes[communityInfo.private] && (
                <span
                  className={`description-title label-${communityInfo.private}`}
                >
                  {t(
                    `communities.community-${camelCase(
                      communityTypes[communityInfo.private],
                    )}`,
                  )}
                </span>
              )}
              {(canEdit() ||
                isModerator() ||
                communityInfo?.showMembersAmount) && (
                <span className="description-members">
                  {t('communities.membersWithCount', {
                    count: membersAmount(communityInfo),
                  })}
                </span>
              )}
            </>
          ) : (
            <>
              {communityTypes[communityInfo.private] && (
                <span
                  className={`description-title label-${communityInfo.private}`}
                >
                  {`${t(
                    `communities.community-${camelCase(
                      communityTypes[communityInfo.private],
                    )}`,
                  )} • `}
                </span>
              )}
              <span className="description-members">
                {t('communities.membersWithCount', {
                  count: membersAmount(communityInfo),
                })}
              </span>
            </>
          )}
        </div>

        {(communityInfo?.speciality?.length > 0 ||
          communityInfo?.anatomy?.length > 0) && (
          <div className="about-community__content--tags-wrapper">
            <div className="community-tags">
              {communityInfo?.speciality?.length > 0 &&
                communityInfo?.speciality?.map((tag, i) => (
                  <Tag
                    key={`tag-speciality__${i}`}
                    className="tag tag--speciality"
                  >
                    {t(`common.specialities-${camelCase(tag)}`)}
                  </Tag>
                ))}
              {communityInfo?.anatomy?.length > 0 &&
                communityInfo?.anatomy?.map((tag, i) => (
                  <Tag key={`tag-anatomy__${i}`} className="tag tag--anatomy">
                    {t(`common.anatomies-${camelCase(tag)}`)}
                  </Tag>
                ))}
            </div>
          </div>
        )}

        <div className="about-community__content--admins-content">
          {communityInfo?.admins?.map(admin => (
            <CommunityAdminCard
              admin={admin}
              key={`${admin?._id}-${communityInfo?._id}-about-admin`}
            />
          ))}
        </div>
        <h4 className="about-community__content--about">
          {t('communities.aboutTheCommunity')}
        </h4>
        <div
          className="about-community__content--summary"
          dangerouslySetInnerHTML={{ __html: communityInfo.description }}
        />
      </div>
    </Modal>
  );
};

AboutCommunityPopup.defaultProps = {
  visible: false,
};
AboutCommunityPopup.propTypes = {
  communityInfo: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  updateCommunityList: PropTypes.func,
  onCancel: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
};

export default memo(withUser(withAuthPopup(AboutCommunityPopup)));
