import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';
import classNames from 'classnames';

import './style.scss';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { Col, Empty, Form, Pagination, Row, Select, Spin } from 'antd';
// components
import CaseCard from 'legacy/components/CaseCard';
//import CreatePublicationv2 from 'legacy/components/CreatePublicationv2';

// Category
import { anatomies, specialities } from 'utils/categoryHelper';
import { Helmet } from 'react-helmet';
import { useQuery } from 'utils/history';

import { flushState, loadCases, createCase } from './actions';
import saga from './saga';
import reducer from './reducer';

export function CaseOverview({ createCase, history }) {
  const { cases, loading, error } = useSelector((state) => {
    return state.CaseOverview;
  });

  //  loadCases: (filter) => dispatch(loadCasesAction(filter)),
  //     createCase: (data) => dispatch(createCaseAction(data)),

  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  const { isMobile } = useDeviceDetect();
  const query = useQuery();

  const speciality = query.get('speciality') || null;
  const anatomy = query.get('anatomy') || null;
  const page = Number(query.get('page')) || 1;
  const sort = query.get('sort') || 'date';

  const initFilter = {
    page,
    speciality,
    anatomy,
    sort,
  };

  useEffect(() => {
    dispatch(
      loadCases({
        type: 'case',
        limit: 15,
        page: initFilter.page,
        speciality: initFilter.speciality
          ? [specialities.find((s) => s.value === initFilter.speciality).label]
          : [],
        anatomy: initFilter.anatomy
          ? [anatomies.find((a) => a.value === initFilter.anatomy).label]
          : [],
        sort: initFilter.sort,
      }),
    );
  }, [
    initFilter.page,
    initFilter.anatomy,
    initFilter.speciality,
    initFilter.sort,
  ]);

  useEffect(() => {
    return () => {
      dispatch(flushState());
    };
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

  const onValuesChange = (changedValues, _) => {
    if (changedValues.hasOwnProperty('speciality')) {
      initFilter.speciality = changedValues.speciality || null;
    }

    if (changedValues.hasOwnProperty('anatomy')) {
      initFilter.anatomy = changedValues.anatomy || null;
    }

    if (changedValues.hasOwnProperty('sort')) {
      initFilter.sort = changedValues.sort || 'date';
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
  const filterOutput = () => (
    <Form
      name="validate_other"
      onValuesChange={onValuesChange}
      initialValues={{
        speciality: initFilter.speciality,
        anatomy: initFilter.anatomy,
        sort: initFilter.sort,
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
          <Select.Option value={null}>{t('common.allAnatomies')}</Select.Option>
          {anatomies.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {t(`common.anatomies-${camelCase(item.label)}`)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="sort"
        label={!isMobile && t('common.sortBy')}
        className="sortBy"
      >
        <Select
          optionFilterProp="children"
          getPopupContainer={(trigger) => trigger.parentElement}
        >
          <Select.Option value="date">{t('common.mostRecenet')}</Select.Option>
          <Select.Option value="most_liked">
            {t('common.mostLiked')}
          </Select.Option>
          <Select.Option value="most_commented">
            {t('common.mostCommented')}
          </Select.Option>
        </Select>
      </Form.Item>
    </Form>
  );

  // render function
  return (
    <div
      className={classNames(
        'main-side-content',
        i18n.language === 'ar' && 'main-side-content--rtl',
      )}
    >
      <Helmet>
        <title>{t('common.cases')}</title>
        <meta name="description" content="Description of Cases" />
      </Helmet>
      <div className="main-side-content__header article">
        <h1 className={'custom-h1-cases'}>{t('common.cases')}</h1>
        {/*<CreatePublicationv2 type="case" onSubmit={createCase} />*/}
      </div>
      <Row className="main-side-content__filter">
        <Col span={24}>{filterOutput()}</Col>
      </Row>
      <Row gutter={!isMobile ? [30, 30] : [0, 26]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {cases &&
          !loading &&
          cases.data.map((item, i) => (
            <Col key={i} xs={24} md={12} lg={12} xl={8}>
              <CaseCard
                item={item}
                key={item?._id}
                {...{
                  ...item,
                  likes: item.likes || [], // Default data for populate events
                  comments: item.comments || [],
                  author: item.author || [],
                  history,
                }}
              />
            </Col>
          ))}
        {(!cases || cases.totalCount === 0) && !loading && (
          <Empty description={t('common.noData')} />
        )}
      </Row>
      {cases && !loading && cases.totalCount !== 0 && (
        <Row className="main-side-content__pagination">
          <Col span={24}>
            <Pagination
              current={page}
              defaultCurrent={1}
              defaultPageSize={15}
              pageSize={15}
              onChange={onPageChange}
              total={cases.totalCount}
            />
          </Col>
        </Row>
      )}
    </div>
  );
}

CaseOverview.propTypes = {
  loadCases: PropTypes.func,
  createCase: PropTypes.func,
  cases: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
};

export default compose(memo)(CaseOverview);
