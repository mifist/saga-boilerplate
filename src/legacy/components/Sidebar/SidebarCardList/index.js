import React, { memo } from 'react';

import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

// styles
import './style.scss';

// antd component
import { List } from 'antd';

// helper
import { limit, membersAmount, getEventTitle } from 'utils/generalHelper';

function SidebarCardList({ isCommunity, options }) {
  const { t } = useTranslation();
  const { title, route, data } = options;

  const baseListUrl = type => {
    if (type == 'event') {
      return '/event/detail';
    } else if (isCommunity) {
      return '/community/detail';
    } else {
      return type;
    }
  };

  return (
    options && (
      <div className="sidebar-card-list__wrapper">
        {title && <h4 className="sidebar-card-list__title">{t(title)}</h4>}
        {data && data.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={item => {
              let itemTitle = '';

              if (item.type === 'event') {
                itemTitle = getEventTitle(item.title);
                //console.debug(item.title, itemTitle);
              } else {
                itemTitle = item.title;
              }

              return (
                <List.Item
                  className={classNames(
                    'sidebar-card-list__card',
                    isCommunity && 'community',
                  )}
                >
                  <List.Item.Meta
                    // avatar={
                    //   item.img && (
                    //     <Link to={`${item.type}/${item._id}`}>
                    //       <Avatar shape="square" size="large" src={item.img} />
                    //     </Link>
                    //   )
                    // }
                    title={
                      itemTitle && (
                        <Link to={`${baseListUrl(item.type)}/${item._id}`}>
                          {itemTitle}
                        </Link>
                      )
                    }
                    description={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: !isCommunity
                            ? limit(item.description, 120)
                            : t('communities.membersWithCount', {
                                count: membersAmount(item),
                              }),
                        }}
                      />
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : null}

        <Link className="sidebar-card-list__more" to={route?.to}>
          {t(route?.title)}
        </Link>
      </div>
    )
  );
}

SidebarCardList.defaultProps = {
  isCommunity: false,
};
SidebarCardList.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
};

export default compose(memo)(SidebarCardList);
