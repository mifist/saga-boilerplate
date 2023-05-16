import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import classNames from 'classnames';
import camelCase from 'lodash/camelCase';

// styles
import './style.scss';

// antd component
import { List, Tag } from 'antd';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';

function ArticlesList({ items, pagination, className, ...rest }) {
  const { t } = useTranslation();
  const childClassNames = classNames('article-lists', className);

  // render function
  return (
    items && (
      <List
        className={childClassNames}
        itemLayout="vertical"
        size="large"
        pagination={pagination}
        dataSource={items}
        renderItem={(article) => (
          <List.Item key={article._id} className="article-list-item" extra="">
            <List.Item.Meta
              title={
                <div className="article-list-item__header">
                  <div className="header-meta">
                    {article?.reference && (
                      <span className="reference">
                        {t('common.source')}:{' '}
                        {t(`common.references-${camelCase(article.reference)}`)}
                      </span>
                    )}
                    {article?.date_creation && (
                      <span className="article-time-creation">
                        <span>
                          {moment(article.date_creation).format('MMM. YYYY')}
                        </span>
                      </span>
                    )}
                  </div>
                  <LinkWrapper
                    type={'article'}
                    _id={article._id}
                    goBackName="articles.backToArticles"
                  >
                    {article.title.length > 200
                      ? `${article.title.substring(0, 200)}...`
                      : article.title}
                  </LinkWrapper>
                </div>
              }
              description={
                <div className="article-list-item__bottom">
                  <div className="article-list-item__tags">
                    {article.speciality.length > 0 &&
                      article.speciality.map((speciality, i) => (
                        <Tag
                          key={`tag-speciality__${i}`}
                          className="tag tag--speciality"
                        >
                          {t(`common.specialities-${camelCase(speciality)}`)}
                        </Tag>
                      ))}
                    {article.anatomy.length > 0 &&
                      article.anatomy.map((anatomy, i) => (
                        <Tag
                          key={`tag-anatomy__${i}`}
                          className="tag tag--anatomy"
                        >
                          {t(`common.anatomies-${camelCase(anatomy)}`)}
                        </Tag>
                      ))}
                  </div>
                  <LinkWrapper
                    className="article-list-item__more"
                    type={'article'}
                    _id={article._id}
                    goBackName="articles.backToArticles"
                  >
                    {t('common.seeMore')}
                  </LinkWrapper>
                </div>
              }
            />
          </List.Item>
        )}
        {...rest}
      />
    )
  );
}

ArticlesList.propTypes = {
  items: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.array.isRequired,
  ]),
  pagination: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
};

export default memo(ArticlesList);
