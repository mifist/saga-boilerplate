import React, { memo } from 'react';
import { compose } from '@reduxjs/toolkit';
import { withTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

// styles
import './style.scss';

// antd component
import { Card, Space, Tag } from 'antd';
// icons
import CustomIcons from 'legacy/components/CustomIcons';
import defaultCaseImage from 'images/default.jpg';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';
import UserAvatar from 'legacy/components/UserAvatar';
import Badge from 'legacy/components/Badge';
import ConditionalLink from 'legacy/components/ConditionalLink';

// global user
import { withUser } from 'appContext/User.context';
import { withAuthPopup } from 'appContext/AuthPopup.context';
import OverViewComments from 'legacy/components/Comments/OverViewComments';

import { getEmployment } from 'utils/generalHelper';

class CaseCard extends React.Component {
  shouldComponentUpdate(nextProps) {
    const { likes, user } = this.props;

    return (
      nextProps.user.bookmarks.length !== user.bookmarks.length ||
      nextProps.likes.length !== likes.length
    );
  }

  render() {
    let { item, user, history, setAuthPopup, t, ...rest } = this.props;
    // Author Output
    const author = (author) =>
      author?.map((auth) => {
        const { isEmployee, industryName } = getEmployment(auth);

        return (
          auth && (
            <div className="case-author" key={auth._id}>
              <ConditionalLink
                condition={user?._id}
                onClick={() => setAuthPopup({ open: true })}
                to={`profile/${auth._id}`}
                key={`profile-link${auth._id}`}
              >
                <Space>
                  <UserAvatar
                    fontSize={12}
                    user={auth}
                    width={32}
                    height={32}
                  />
                  <span className={'owner_post'}>
                    {auth?.description?.firstname} {auth?.description?.lastname}
                  </span>
                </Space>
              </ConditionalLink>
              {isEmployee && (
                <Badge title={t('communities.employeeOf', { industryName })} />
              )}
            </div>
          )
        );
      });

    // render function
    return (
      item && (
        <Card
          className="case-card"
          style={{ width: '100%' }}
          cover={
            <>
              <div className="case-card__tags">
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
                  {t('cases.resolved')}
                </Tag>
              )}
              <LinkWrapper
                type={'case'}
                _id={item._id}
                goBackName="cases.backToCases"
              >
                <img
                  alt={item.title}
                  src={
                    item.pictures.length > 0
                      ? item.pictures[0]
                      : defaultCaseImage
                  }
                />
              </LinkWrapper>
            </>
          }
        >
          <Card.Meta
            title={
              <LinkWrapper
                type={'case'}
                _id={item._id}
                goBackName="cases.backToCases"
              >
                {item.title.length > 60
                  ? `${item.title.substring(0, 60)}...`
                  : item.title}
              </LinkWrapper>
            }
            description={author(item?.author)}
          />
          <OverViewComments post={item} typeLike={'case'} layout={'single'} />
        </Card>
      )
    );
  }
}

CaseCard.propTypes = {};

export default compose(
  memo,
  withUser,
  withAuthPopup,
)(withTranslation()(CaseCard));
