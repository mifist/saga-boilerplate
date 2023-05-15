import React, { memo, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Helmet } from 'react-helmet';
import { camelCase } from 'lodash';
import classNames from 'classnames';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import {
  flushState as flushStateAction,
  loadPodcasts as loadPodcastsAction,
  createPodcast as createPodcastAction,
} from './actions';

// antd component
import {
  Col, DatePicker, Empty, Form, Pagination,
  Row, Select, Spin,
} from 'antd';
// components
import PodcastCard from 'legacy/components/PodcastCard';
import CreatePublicationv2 from 'legacy/components/CreatePublicationv2';

// contexts
import { withUser } from 'appContext/User.context';
// hooks
import useDeviceDetect from 'appHooks/useDeviceDetect';
//utils
import { anatomies, specialities } from 'utils/categoryHelper';
import { useQuery } from 'utils/history';


export function PodcastsOverview({
  // props
  history,
  // default props
  className,
  // core
  state,
  dispatch
}) {
  const { error, loading, podcasts } = state.PodcastsOverview;

  const { isMobile } = useDeviceDetect();
  const query = useQuery();
  const { t, i18n } = useTranslation();

  const speciality = query.get('speciality') || null;
  const anatomy = query.get('anatomy') || null;
  const page = Number(query.get('page')) || 1;
  const dateFrom = query.get('dateFrom') || null;
  const dateTo = query.get('dateTo') || null;

  const initFilter = {
    speciality,
    anatomy,
    dateFrom,
    dateTo,
    page,
  };

  useEffect(() => {
    dispatch(loadPodcasts({
      type: 'podcast',
      limit: 15,
      page: initFilter.page,
      sort: 'date',
      speciality: initFilter.speciality
        ? [specialities.find((s) => s.value === initFilter.speciality).label]
        : [],
      anatomy: initFilter.anatomy
        ? [anatomies.find((a) => a.value === initFilter.anatomy).label]
        : [],
      dateFrom: moment(initFilter.dateFrom),
      dateTo: moment(initFilter.dateTo),
    }));
  }, [
    initFilter.page,
    initFilter.anatomy,
    initFilter.speciality,
    initFilter.dateFrom,
    initFilter.dateTo,
  ]);

  useEffect(() => {
    return () => dispatch(flushState());
  }, []);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  const onPageChange = (page) => {
    initFilter.page = page;

    history.push({
      search: Object.keys(initFilter)
        .map((key) => initFilter[key] && `${key}=${initFilter[key]}`)
        .filter(Boolean)
        .join('&'),
    });
  };

  const onValuesChange = (changedValues, _) => {
    if (changedValues.hasOwnProperty('speciality')) {
      initFilter.speciality = changedValues.speciality || null;
    }

    if (changedValues.hasOwnProperty('anatomy')) {
      initFilter.anatomy = changedValues.anatomy || null;
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
          name="datePicker"
          label={!isMobile && t('common.date')}
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
        <title>{t('common.podcasts')}</title>
        <meta name="description" content="Description of Podcasts" />
      </Helmet>
      <div className="main-side-content__header podcast">
        <h1>{t('common.podcasts')}</h1>
        <CreatePublicationv2 type="podcast" onSubmit={(data) => dispatch(createPodcast(data))} />
      </div>
      <Row className="main-side-content__filter podcast-filter">
        <Col span={24}>{filterOutput()}</Col>
      </Row>
      <Row gutter={!isMobile ? [30, 30] : [0, 26]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {podcasts &&
          !loading &&
          podcasts.data.map((item, i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={12} xl={8}>
              <PodcastCard item={item} user={currentUser} key={item?._id} />
            </Col>
          ))}
        {(!podcasts || podcasts.totalCount === 0) && !loading && (
          <Empty description={t('common.noData')} />
        )}
      </Row>
      {podcasts && podcasts.totalCount !== 0 && !loading && (
        <Row className="main-side-content__pagination">
          <Col span={24}>
            <Pagination
              current={page}
              defaultCurrent={1}
              defaultPageSize={15}
              pageSize={15}
              showSizeChanger={false}
              onChange={onPageChange}
              total={podcasts.totalCount}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default compose(withRedux, withUser, memo)(PodcastsOverview);
