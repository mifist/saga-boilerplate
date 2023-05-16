import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

// styles
import './style.scss';

// antd component
import { Card, Space, Tag } from 'antd';
// icons
import CustomIcons from 'legacy/components/CustomIcons';
import defaultPodcastImage from 'images/podcast.jpg';

// components
import MediaPlayer from 'legacy/components/MediaPlayer';
import LinkWrapper from 'legacy/components/LinkWrapper';
import UserAvatar from 'legacy/components/UserAvatar';
import Badge from 'legacy/components/Badge';
import ConditionalLink from 'legacy/components/ConditionalLink';

import { getEmployment } from 'utils/generalHelper';
import { withAuthPopup } from 'appContext/AuthPopup.context';

function PodcastCard({ item, user, className, setAuthPopup, ...rest }) {
  const childClassNames = classNames('podcast-card', className);
  const { t } = useTranslation();

  // Author Output
  const author = (author) =>
    author?.map((auth) => {
      const { isEmployee, industryName } = getEmployment(auth);

      return (
        auth && (
          <Fragment key={auth._id}>
            <ConditionalLink
              condition={user?._id}
              to={`profile/${auth?._id}`}
              key={`profile-link${auth?._id}`}
              onClick={() => setAuthPopup({ open: true })}
            >
              <Space>
                <UserAvatar fontSize={12} user={auth} width={32} height={32} />
                <span className={'owner_post'}>
                  {auth?.description?.firstname} {auth?.description?.lastname}
                </span>
              </Space>
            </ConditionalLink>
            {isEmployee && (
              <Badge title={t('common.industryEmployee', { industryName })} />
            )}
          </Fragment>
        )
      );
    });

  // render function
  return (
    item && (
      <Card
        className={childClassNames}
        style={{ width: '100%' }}
        cover={
          <>
            <div className="podcast-card__tags">
              {item.speciality.length > 0 &&
                item.speciality.map((tag, i) => (
                  <Tag
                    key={`tag-speciality__${i}`}
                    className="tag tag--speciality"
                  >
                    {t(`common.specialities-${camelCase(tag)}`)}
                  </Tag>
                ))}
              {item.anatomy.length > 0 &&
                item.anatomy.map((tag, i) => (
                  <Tag key={`tag-anatomy__${i}`} className="tag tag--anatomy">
                    {t(`common.anatomies-${camelCase(tag)}`)}
                  </Tag>
                ))}
            </div>
            {item.optin && (
              <Tag className="tag tag--resolved">
                <CustomIcons type="verified-white" />
                {t('podcast.resolved')}
              </Tag>
            )}
            <LinkWrapper
              type={'podcast'}
              _id={item._id}
              goBackName="podcasts.backToPodcasts"
            >
              <img
                alt={item.title}
                src={
                  item.pictures.length > 0
                    ? item.pictures[0]
                    : defaultPodcastImage
                }
              />
            </LinkWrapper>

            {item?.audio && (
              // null
              <MediaPlayer
                type="small"
                date={item.date_creation}
                url={item?.audio}
              />
            )}
          </>
        }
        actions={[]}
        {...rest}
      >
        <Card.Meta
          title={
            <LinkWrapper
              type={'podcast'}
              _id={item._id}
              goBackName="podcasts.backToPodcasts"
              extraParams={{ hash: '#Comments' }}
            >
              {item.title.length > 56
                ? `${item.title.substring(0, 56)}...`
                : item.title}
            </LinkWrapper>
          }
          description={
            item?.author[0] && (
              <span className="podcast-card__description">
                {item?.author[0]?._id && author(item?.author)}
              </span>
            )
          }
        />
      </Card>
    )
  );
}

PodcastCard.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.object.isRequired,
  ]),
  user: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default memo(withAuthPopup(PodcastCard));
