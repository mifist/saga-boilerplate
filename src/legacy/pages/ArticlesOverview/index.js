import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';
import classNames from 'classnames';
import './style.scss';

import { createArticle, flushState, loadArticles } from './actions';

import { withUser } from 'appContext/User.context';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { Col, DatePicker, Empty, Form, Row, Select, Spin } from 'antd';

// components
import ArticlesList from 'legacy/components/ArticlesList';
import CreatePublicationv2 from 'legacy/components/CreatePublicationv2';

import { anatomies, references, specialities } from 'utils/categoryHelper';
import { useQuery } from 'utils/history';

export function ArticlesOverview({ history }) {
  const { articles, loading } = useSelector((state) => {
    return state.ArticlesOverview;
  });

  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const query = useQuery();

  const speciality = query.get('speciality') || null;
  const anatomy = query.get('anatomy') || null;
  const reference = query.get('reference') || null;
  const page = Number(query.get('page')) || 1;
  const dateFrom = query.get('dateFrom') || null;
  const dateTo = query.get('dateTo') || null;

  const initFilter = {
    speciality,
    anatomy,
    reference,
    dateFrom,
    dateTo,
    page,
  };

  useEffect(() => {
    dispatch(
      loadArticles({
        type: 'article',
        limit: 15,
        page: initFilter.page,
        sort: 'newest',
        speciality: initFilter.speciality
          ? [specialities.find((s) => s.value === initFilter.speciality).label]
          : [],
        anatomy: initFilter.anatomy
          ? [anatomies.find((a) => a.value === initFilter.anatomy).label]
          : [],
        reference: initFilter.reference,
        dateFrom: moment(initFilter.dateFrom),
        dateTo: moment(initFilter.dateTo),
      }),
    );
  }, [
    initFilter.page,
    initFilter.anatomy,
    initFilter.speciality,
    initFilter.reference,
    initFilter.dateFrom,
    initFilter.dateTo,
  ]);

  useEffect(() => {
    return () => dispatch(flushState());
  }, []);

  const onPageChange = (page) => {
    initFilter.page = page;

    history.push({
      search: Object.keys(initFilter)
        .map((key) => initFilter[key] && `${key}=${initFilter[key]}`)
        .filter(Boolean)
        .join('&'),
    });
  };

  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('speciality')) {
      initFilter.speciality = changedValues.speciality || null;
    }

    if (changedValues.hasOwnProperty('anatomy')) {
      initFilter.anatomy = changedValues.anatomy || null;
    }

    if (changedValues.hasOwnProperty('reference')) {
      initFilter.reference = changedValues.reference || null;
    }

    if (changedValues.hasOwnProperty('datePicker')) {
      initFilter.dateFrom = changedValues.datePicker
        ? changedValues.datePicker[0].format('YYYY-MM-DD')
        : null;

      initFilter.dateTo = changedValues.datePicker
        ? changedValues.datePicker[1].format('YYYY-MM-DD')
        : null;
    }

    initFilter.page = null;

    history.push({
      search: Object.keys(initFilter)
        .map((key) => initFilter[key] && `${key}=${initFilter[key]}`)
        .filter(Boolean)
        .join('&'),
    });
  };

  // Filter Form
  const filterOutput = () => {
    return (
      <Form
        className="article-filter-form"
        name="validate_other"
        onValuesChange={onValuesChange}
        initialValues={{
          speciality: initFilter.speciality,
          anatomy: initFilter.anatomy,
          reference: initFilter.reference,
          datePicker: (initFilter.dateFrom || initFilter.dateTo) && [
            moment(initFilter.dateFrom),
            moment(initFilter.dateTo),
          ],
        }}
      >
        <Form.Item
          name="speciality"
          label={!isMobile && t('common.domains')}
          className="category-select"
        >
          <Select
            optionFilterProp="children"
            getPopupContainer={(trigger) => trigger.parentElement}
          >
            <Select.Option value={null}>{t('common.allDomains')}</Select.Option>
            {specialities.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {t(`common.specialities-${camelCase(item.label)}`)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="anatomy"
          label={!isMobile && t('common.anatomy')}
          className="category-select"
        >
          <Select
            optionFilterProp="children"
            getPopupContainer={(trigger) => trigger.parentElement}
          >
            <Select.Option value={null}>
              {t('common.allAnatomies')}
            </Select.Option>
            {anatomies.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {t(`common.anatomies-${camelCase(item.label)}`)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="reference"
          label={!isMobile && t('articles.journal')}
          className="category-select"
        >
          <Select
            optionFilterProp="children"
            style={{ width: '250px' }}
            getPopupContainer={(trigger) => trigger.parentElement}
          >
            <Select.Option value={null}>
              {t('articles.allJournals')}
            </Select.Option>
            {references.map((reference) => (
              <Select.Option key={reference} value={reference}>
                {t(`common.references-${camelCase(reference)}`)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="datePicker"
          label={!isMobile && t('articles.publicationDate')}
          className="sortBy"
        >
          <DatePicker.RangePicker
            allowEmpty={false}
            showToday
            getPopupContainer={(trigger) => trigger.parentElement}
          />
        </Form.Item>
      </Form>
    );
  };

  // render function
  return (
    <div
      className={classNames(
        'main-side-content',
        i18n.language === 'ar' && 'main-side-content--rtl',
      )}
    >
      <Helmet>
        <title>{t('articles.articleSummaries')}</title>
        <meta name="description" content="Description of Articles" />
      </Helmet>
      <div className="main-side-content__header article">
        <div>
          <h1>{t('articles.articleSummaries')}</h1>
          <h2 className="sub-title">{t('articles.scientificPublications')}</h2>
        </div>
        <CreatePublicationv2
          type="article"
          onSubmit={(data) => dispatch(createArticle(data))}
        />
      </div>
      <Row className="main-side-content__filter article-filter">
        <Col span={24}>{filterOutput()}</Col>
      </Row>
      <Row gutter={!isMobile ? [30, 30] : [0, 26]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {articles && !loading && (
          <Col span={24}>
            <ArticlesList
              style={{ marginBottom: 30 }}
              items={articles.data}
              pagination={{
                current: page,
                defaultCurrent: 1,
                defaultPageSize: 15,
                pageSize: 15,
                showSizeChanger: false,
                onChange: onPageChange,
                total: articles.totalCount,
              }}
            />
          </Col>
        )}
        {(!articles || articles.totalCount === 0) && !loading && (
          <Empty description={t('articles.noArticleAvailable')} />
        )}
      </Row>
    </div>
  );
}

ArticlesOverview.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
  articles: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  loadArticles: PropTypes.func,
  createArticle: PropTypes.func,
};

export default compose(memo)(withUser(ArticlesOverview));
