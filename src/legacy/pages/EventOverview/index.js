import React, { memo, useEffect, useState } from 'react';
import { compose } from '@reduxjs/toolkit';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { camelCase } from 'lodash';
import axios from 'axios';
import classNames from 'classnames';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import { flushState, loadReplay, loadUpcoming } from './actions';

// antd component
import {
  Card,
  Col,
  DatePicker,
  Empty,
  Form,
  Pagination,
  Row,
  Select,
  Skeleton,
  Switch,
  Tabs,
  Spin,
} from 'antd';
// components
import EventCard from 'legacy/components/EventCard';

// contexts
import { withUser } from 'appContext/User.context';
// hooks
import useDeviceDetect from 'appHooks/useDeviceDetect';
// utils
import { setAuthorizationHeader } from 'appAPI/axiosAPI';
import { anatomies, specialities } from 'utils/categoryHelper';
import { useQuery } from 'utils/history';
import { getBaseApiUrl } from 'utils/capacitorHelper';
import { useSearchParams } from 'react-router-dom';

export function EventOverview({
  // props
  user,
  history,
  // default props
  className,
  // core
  state,
  dispatch,
}) {
  const { eventsUpcoming, loadingUpcoming, eventsReplay, loadingReplay } =
    state.EventOverview;

  const { isMobile } = useDeviceDetect();
  const { t, i18n } = useTranslation();
  const query = useQuery();
  let [searchParams, setSearchParams] = useSearchParams();

  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));

  const [myEvents, setMyEvents] = useState([]);

  const todayDate = moment().format('YYYY-MM-DD');
  const dateMore3Year = moment().add(3, 'years').format('YYYY-MM-DD');
  const dateLess5Year = moment().subtract(5, 'years').format('YYYY-MM-DD');

  const eventType = query.get('eventType') || 'upcoming';
  const page = Number(query.get('page')) || 1;
  const speciality = query.get('speciality') || null;
  const anatomy = query.get('anatomy') || null;
  const dateFrom = query.get('dateFrom') || null;
  const dateTo = query.get('dateTo') || null;
  const accredited = query.get('accredited') || false;

  const initFilter = {
    eventType,
    page,
    speciality,
    anatomy,
    dateFrom,
    dateTo,
    accredited,
  };

  useEffect(() => {
    if (eventType === 'upcoming') {
      dispatch(
        loadUpcoming({
          currentPageUpcoming: initFilter.page,
          dateRangeUpcoming:
            initFilter.dateFrom || initFilter.dateTo
              ? [initFilter.dateFrom, initFilter.dateTo]
              : [todayDate, dateMore3Year],
          accreditedUpcoming: initFilter.accredited,
          specialityField: initFilter.speciality || false,
          anatomyField: initFilter.anatomy || false,
        }),
      );
    }
  }, [
    initFilter.accredited,
    initFilter.eventType,
    initFilter.page,
    initFilter.speciality,
    initFilter.anatomy,
    initFilter.dateFrom,
    initFilter.dateTo,
  ]);

  useEffect(() => {
    if (eventType === 'replay') {
      dispatch(
        loadReplay({
          currentPageReplay: initFilter.page,
          dateRangeReplay:
            initFilter.dateFrom || initFilter.dateTo
              ? [initFilter.dateFrom, initFilter.dateTo]
              : [dateLess5Year, todayDate],
          accreditedReplay: initFilter.accredited,
          specialityField: initFilter.speciality || false,
          anatomyField: initFilter.anatomy || false,
        }),
      );
    }
  }, [
    initFilter.accredited,
    initFilter.eventType,
    initFilter.page,
    initFilter.speciality,
    initFilter.anatomy,
    initFilter.dateFrom,
    initFilter.dateTo,
  ]);

  useEffect(() => {
    return () => dispatch(flushState());
  }, []);

  useEffect(() => {
    if ((eventsUpcoming || eventsReplay) && user?._id) {
      getMyEvents().then((r) => {
        if (r?.status === 200) {
          const listEvent = r.data;
          setMyEvents(listEvent || []);
        }
      });
    }
  }, [eventsReplay, eventsUpcoming]);

  const getMyEvents = async () => {
    try {
      setAuthorizationHeader(currentUser.token);
      axios.defaults.baseURL = getBaseApiUrl();
      const response = await axios.get('users/paid-events');
      return response;
    } catch (e) {
      console.log(e);
    }
  };

  const onPageChange = (page) => {
    initFilter.page = page;

    console.log(initFilter);

    console.log(
      Object.keys(initFilter)
        .map((key) => initFilter[key] && `${key}=${initFilter[key]}`)
        .filter(Boolean)
        .join('&'),
    );

    history.push({
      search: Object.keys(initFilter)
        .map((key) => initFilter[key] && `${key}=${initFilter[key]}`)
        .filter(Boolean)
        .join('&'),
    });
  };

  const onEventTabChange = (tab) => {
    initFilter.page = null;
    initFilter.eventType = tab;

    console.log(initFilter);

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

    if (changedValues.hasOwnProperty('accredited')) {
      initFilter.accredited = changedValues.accredited || null;
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

    console.log(
      Object.keys(initFilter)
        .map((key) => initFilter[key] && `${key}=${initFilter[key]}`)
        .filter(Boolean)
        .join('&'),
    );

    history.push({
      search: Object.keys(initFilter)
        .map((key) => initFilter[key] && `${key}=${initFilter[key]}`)
        .filter(Boolean)
        .join('&'),
    });
  };

  const renderLoadingCardEvent = (key) => (
    <Col xs={24} lg={12} xl={8} key={key}>
      <Card style={{ marginTop: 16 }} className="event_card">
        <Skeleton.Image />
        <Skeleton loadingUpcoming={loadingUpcoming} avatar active />
      </Card>
    </Col>
  );

  const renderLoading = () => {
    const items = [];
    for (let i = 0; i <= 8; i++) {
      items.push(renderLoadingCardEvent(i));
    }
    return <>{items}</>;
  };

  const filterOutput = () => (
    <Form
      className="events-filter-form"
      name="validate_other"
      onValuesChange={onValuesChange}
      initialValues={{
        speciality: initFilter.speciality,
        anatomy: initFilter.anatomy,
        accredited: initFilter.accredited,
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
          <Select.Option value={null}>{t('common.allAnatomies')}</Select.Option>
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
        className="sortBy event_date_picker"
      >
        <DatePicker.RangePicker
          allowEmpty={eventType === 'upcoming' && false}
          showToday
          disabledDate={(d) =>
            !d ||
            d.isAfter(eventType === 'upcoming' ? dateMore3Year : todayDate) ||
            d.isSameOrBefore(
              eventType === 'upcoming' ? todayDate : dateLess5Year,
            )
          }
          getPopupContainer={(trigger) => trigger.parentElement}
        />
      </Form.Item>
      <Form.Item
        name="accredited"
        label={t('events.accreditedEvents')}
        style={{ order: isMobile && `1` }}
        className="category-select"
      >
        <Switch checked={accredited} />
      </Form.Item>
    </Form>
  );

  const renderReplayEvents = () => (
    <>
      <Row gutter={!isMobile ? [30, 30] : [0, 26]}>
        {loadingReplay && renderLoading()}
        {eventsReplay !== null &&
          !loadingReplay &&
          eventsReplay.data.length > 0 &&
          eventsReplay.data.map((event, i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={12} xl={8}>
              <EventCard
                event={event}
                key={event.id}
                registered={
                  myEvents.some(
                    (eventItem) => eventItem.econgress?.id == event?.id,
                  )
                    ? 1
                    : 0
                }
              />
            </Col>
          ))}
        {eventsReplay === null && !loadingReplay && (
          <Empty description={t('common.noData')} />
        )}
      </Row>
      {eventsReplay !== null && !loadingReplay && (
        <Row className="main-side-content__pagination">
          <Col span={24}>
            <Pagination
              current={page}
              defaultCurrent={1}
              defaultPageSize={15}
              pageSize={15}
              showSizeChanger={false}
              onChange={onPageChange}
              total={eventsReplay.total}
            />
            <span className="event_list_result">
              {t('events.resultCount', { count: eventsReplay.total })}
            </span>
          </Col>
        </Row>
      )}
    </>
  );

  const renderUpcomingEvents = () => (
    <>
      <Row gutter={!isMobile ? [30, 30] : [0, 26]}>
        {loadingUpcoming && renderLoading()}
        {eventsUpcoming !== null &&
          !loadingUpcoming &&
          eventsUpcoming.data.length > 0 &&
          eventsUpcoming.data.map((event, i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={12} xl={8}>
              <EventCard
                event={event}
                key={event.id}
                registered={
                  myEvents.some(
                    (eventItem) => eventItem.econgress?.id == event?.id,
                  )
                    ? 1
                    : 0
                }
              />
            </Col>
          ))}
        {eventsUpcoming === null && !loadingUpcoming && (
          <Empty description={t('common.noData')} />
        )}
      </Row>
      {eventsUpcoming !== null && !loadingUpcoming && (
        <Row className="main-side-content__pagination">
          <Col span={24}>
            <Pagination
              current={page}
              defaultCurrent={1}
              defaultPageSize={15}
              pageSize={15}
              showSizeChanger={false}
              onChange={onPageChange}
              total={eventsUpcoming.total}
            />
          </Col>
        </Row>
      )}
    </>
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
        <title>{t('common.events')}</title>
        <meta name="description" content="Description of Events" />
      </Helmet>
      <Row className="main-side-content__header events">
        {loadingUpcoming && (
          <Col xs={24} xl={24}>
            <Spin className="loading-preview" size="large" />
          </Col>
        )}

        <Col xs={24} xl={24}>
          <Tabs
            className="events_tabs"
            onChange={(activeKey) => onEventTabChange(activeKey)}
            activeKey={eventType}
          >
            <Tabs.TabPane tab={t('events.upcomingEvents')} key="upcoming">
              <Row className="main-side-content__filter events-filter">
                <Col span={24}>{filterOutput()}</Col>
              </Row>
              {(eventsUpcoming || eventsReplay) &&
                !loadingUpcoming &&
                !loadingReplay &&
                renderUpcomingEvents()}
            </Tabs.TabPane>
            <Tabs.TabPane tab={t('events.replay')} key="replay">
              <Row className="main-side-content__filter events-filter">
                <Col span={24}>{filterOutput(eventType)}</Col>
              </Row>
              {(eventsUpcoming || eventsReplay) &&
                !loadingUpcoming &&
                !loadingReplay &&
                renderReplayEvents()}
            </Tabs.TabPane>
          </Tabs>
        </Col>
        {!eventsUpcoming &&
          !eventsReplay &&
          !loadingUpcoming &&
          !loadingReplay && (
            <Col xs={24} xl={24}>
              <Empty description={t('common.noData')} />
            </Col>
          )}
      </Row>
    </div>
  );
}

export default compose(withRedux, withUser, memo)(EventOverview);
