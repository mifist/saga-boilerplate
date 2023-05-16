import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import camelCase from 'lodash/camelCase';

// styles
import './style.scss';

// andt components
import { Image, Button } from 'antd';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';
import AboutCommunityPopup from 'legacy/components/Community/AboutCommunityPopup';
// containers
import JoinButton from 'legacy/containers/Community/JoinButton';

// helper
import { membersAmount } from 'utils/generalHelper';
import { communityTypes } from 'utils/categoryHelper';

const CommunityCard = ({
  community,
  type,
  // action
  manageCommunityList,
  // default props
  className,
}) => {
  const { t } = useTranslation();
  const mainClassNames = classNames(
    'overview-card-wrapper ant-list-item',
    className,
  );

  const [visible, setVisible] = useState(false);

  // this is for wrapping parent element conditionally
  const content = (
    <>
      <div
        className="overview-card-wrapper__upper-box"
        style={{
          background:
            community.header?.picture && `url("${community?.header?.picture}")`,
        }}
        onClick={() => type == 'active-communities' && setVisible(true)}
      >
        {/*{community?.logotype && (*/}
        {/*  <Image*/}
        {/*    className="upper-box-communities-logo"*/}
        {/*    src={community?.logotype}*/}
        {/*    width={64}*/}
        {/*    height={64}*/}
        {/*    preview={false}*/}
        {/*  />*/}
        {/*)}*/}
      </div>

      <div
        className="overview-card-wrapper__lower-box"
        onClick={() => type == 'active-communities' && setVisible(true)}
      >
        {community?.title && (
          <h3 className="lower-box-communities-title">
            {community.title.length > 60
              ? `${community.title.substring(0, 60)}...`
              : community.title}
          </h3>
        )}
        <div className="lower-box-communities-description">
          {community.private == 'industry' ? (
            <>
              {communityTypes[community.private] && (
                <span
                  className={`description-title label-${community.private}`}
                >
                  {t(
                    `communities.community-${camelCase(
                      communityTypes[community.private],
                    )}`,
                  )}
                </span>
              )}
              {community?.showMembersAmount && (
                <span className="description-members">
                  {t('communities.membersWithCount', {
                    count: membersAmount(community),
                  })}
                </span>
              )}
            </>
          ) : (
            <>
              {communityTypes[community.private] && (
                <span
                  className={`description-title label-${community.private}`}
                >
                  {`${t(
                    `communities.community-${camelCase(
                      communityTypes[community.private],
                    )}`,
                  )} • `}
                </span>
              )}
              <span className="description-members">
                {t('communities.membersWithCount', {
                  count: membersAmount(community),
                })}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {type == 'my-communities' && (
        <LinkWrapper
          className={`${mainClassNames}`}
          type={'community'}
          _id={community._id}
          goBackName="communities.backToCommunities"
        >
          {content}
        </LinkWrapper>
      )}
      {type == 'active-communities' && (
        <>
          <div className={`${mainClassNames}`}>
            {content}
            <div className="overview-card-wrapper__action-buttons">
              <Button className="ant-btn-link" onClick={() => setVisible(true)}>
                {t('common.about')}
              </Button>
              <JoinButton
                community={community}
                respond={(responseData) => {
                  manageCommunityList !== undefined &&
                    manageCommunityList('request_join', responseData);
                }}
              />
            </div>
          </div>
          <AboutCommunityPopup
            visible={visible}
            onCancel={() => setVisible(false)}
            updateCommunityList={(type, responseData) => {
              manageCommunityList !== undefined &&
                manageCommunityList(type, responseData);
            }}
            communityInfo={community}
          />
        </>
      )}
    </>
  );
};

CommunityCard.defaultProps = {
  type: 'my-communities',
};
CommunityCard.propTypes = {
  community: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  manageCommunityList: PropTypes.func,
  type: PropTypes.oneOf(['my-communities', 'active-communities']).isRequired,
};

export default memo(CommunityCard);
