import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

// styles
import './style.scss';

// antd component
import { List } from 'antd';

// icons
import CustomIcons from 'legacy/components/CustomIcons';

const SidebarActualArticles = ({ title, articles, className, ...rest }) => {
  const childClassNames = classNames('sidebar-item sidebar-actual-list', className);

  return (
    articles && (
      <div className={childClassNames} {...rest}>
        <h4 className="sidebar-title">
          {title ? title : 'Other articles you might find interesting'}
        </h4>
        <List
          itemLayout="horizontal"
          dataSource={articles}
          renderItem={article => (
            <List.Item>
              <List.Item.Meta
                avatar={<CustomIcons type="document" />}
                title={
                  <Link to={`/article/detail/${article._id}`}>
                    {article.title}
                  </Link>
                }
              />
            </List.Item>
          )}
        />
      </div>
    )
  );
};

SidebarActualArticles.propTypes = {
  title: PropTypes.string,
  articles: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
};

export default SidebarActualArticles;
