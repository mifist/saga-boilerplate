import React, { memo, useState, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Capacitor } from '@capacitor/core';
import moment from 'moment';
import axios from 'axios';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import {
  flushState,
  loadEvent as loadEventAction,
  registerEvent as registerEventAction,
  watchEvent as watchEventAction,
  closeLiveEventPopup as closeLiveEventPopupAction,
} from './actions';

// assets
import { UserOutlined } from '@ant-design/icons';

// antd component
import {
  Layout, Row, Col, Spin, Empty, Button,
  Avatar, Space,Tabs, Modal,
} from 'antd';
// components
import CommentsOverview from 'containers/CommentsOverview';
import GoBackButton from 'legacy/components/GoBackButton';
import BookmarkAction from 'legacy/components/BookmarkAction';
import ShareAction from 'legacy/components/ShareAction';
import ConditionalLink from 'legacy/components/ConditionalLink';

// contexts
import { withUser } from 'appContext/User.context';
import { withAuthPopup } from 'appContext/AuthPopup.context';
// hooks
import useDeviceDetect from 'appHooks/useDeviceDetect';
// utils
import { setAuthorizationHeader } from 'appAPI/axiosAPI';
import { BEEMED_LEGACY_API_URL } from 'utils/constants';
import { getBaseApiUrl } from 'utils/capacitorHelper';

let apiURL = getBaseApiUrl();
axios.defaults.baseURL = apiURL;
const baseURL = apiURL;

export function EventDetail({
  // props
  user,
  setAuthPopup,
  // default props
  className,
  // core
  state,
  dispatch
}) {
  const { 
    event, nextEventId, loading, eventUrl, replayOpen, liveEventPopup
  } = state.EventDetail;

  const { t } = useTranslation();

  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));
  const { isMobile } = useDeviceDetect();
  const [small, setSmall] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [myEvents, setMyEvents] = useState([]);

  let { id } = useParams();

  const onScroll = (e) => {
    setSmall(e.target.scrollTop > 4);
  };

  useEffect(() => {
    if (id !== 'new' && id) {
      dispatch(loadEvent(id));
    }

    return () => {
      dispatch(flushState());
    };
  }, [id]);

  useEffect(() => {
    if (event) {
      getEventSpeakerId(event).then((r) => {
        if (r?.status === 200) {
          setUsersList(r?.data);
        }
      });

      if (user?._id) {
        getMyEvents().then((r) => {
          if (r?.status === 200) {
            setMyEvents(r.data || []);
          }
        });
      }
    }
  }, [event]);

  const getEventSpeakerId = async (event) => {
    try {
      let speakers = event.speakers.map((speaker, i) => {
        return speaker.id;
      });
      let moderators = event.moderators.map((speaker, i) => {
        return speaker.id;
      });
      let eventUsers = [...speakers, ...moderators];

      //console.log(eventUsers);

      const response = await axios.post(
        baseURL + 'users/match',
        {
          users: eventUsers,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );
      return response;
    } catch (e) {
      console.log(e);
    }
  };

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

  // this useEffect is for catching scroll event so that
  // we can minimize top header height based on scroll height
  useEffect(() => {
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const renderFutureEventsButton = () => {
    return myEvents.some((event) => event.econgress?.id == id) ? (
      <Button
        type="primary"
        className={'event_detail_button_register'}
        size={'large'}
        disabled={event?.is_open !== 1}
        onClick={() => {
          if (user?._id) {
            if (event.reg_types.length > 0) {
              window.location.replace(`https://beemed.com/econgresses/${id}`);
            } else {
              dispatch(watchEvent({
                id,
                userId: user.userId,
                eventType: 'live',
              }));
            }
          } else {
            setAuthPopup({ open: true });
          }
        }}
      >
        {t('events.watchEvent')}
      </Button>
    ) : (
      <Button
        type="primary"
        className={'event_detail_button_register'}
        size={'large'}
        onClick={() => {
          if (user?._id) {
            if (event.reg_types.length > 0) {
              window.location.replace(`https://beemed.com/econgresses/${id}`);
            } else {
              dispatch(registerEvent({
                id,
                userId: user.userId,
                eventType: 'show',
              }));

              setMyEvents((prev) => [...prev, { econgress: { id } }]);
            }
          } else {
            setAuthPopup({ open: true });
          }
        }}
      >
        {t('events.register')}
      </Button>
    );
  };

  const renderPastEventsButton = () => {
    return myEvents.some((event) => event.econgress?.id == id) || replayOpen ? (
      <Button
        type="primary"
        className={'event_detail_button_register'}
        size={'large'}
        onClick={() => {
          if (user?._id) {
            if (event.reg_types.length > 0) {
              window.location.replace(`https://beemed.com/econgresses/${id}`);
            } else {
              dispatch(watchEvent({
                id,
                userId: user.userId,
                eventType: 'replay',
              }));
            }
          } else {
            setAuthPopup({ open: true });
          }
        }}
      >
        {t('events.watchReplay')}
      </Button>
    ) : (
      <Button
        type="primary"
        className={'event_detail_button_register'}
        size={'large'}
        onClick={() => {
          if (user?._id) {
            if (event.reg_types.length > 0) {
              window.location.replace(`https://beemed.com/econgresses/${id}`);
            } else {
              dispatch(registerEvent({
                id,
                userId: user.userId,
                eventType: 'replay',
              }));

              setMyEvents((prev) => [...prev, { econgress: { id } }]);
            }
          } else {
            setAuthPopup({ open: true });
          }
        }}
      >
        {t('events.register')}
      </Button>
    );
  };

  const banner = () => (
    <div className="event-detail__banner">
      {!isMobile && event.image_url && (
        <img src={event.image_url} className="event-detail__banner-image" />
      )}

      <div className="article-detail">
        <div className="detail-row narrow">
          <div className="detail-item event_detail_banner_text">
            {event.start_time === null
              ? `${moment(event.date_from).format('LL')}`
              : `${moment(`${event.date_from} ${event.start_time}`).format(
                  'LLLL',
                )} (CET)`}
            {event.date_to !== event.date_from
              ? ` | ${moment(event.date_to).format('LL')} `
              : null}
            &nbsp; - {event.min_price}
          </div>
        </div>
        <header className="detail-row narrow article-header">
          <div className="detail-item event-detail__description">
            <h1 className="article-title">{event.name}</h1>
            <h3 className="article-sub-title">{event.subtype}</h3>
          </div>
          <div className="detail-item event-detail__actions">
            <div className="detail-item event-detail__actions--btns">
              {event.econgress_video_type === 'live' ||
              event.econgress_video_type === 'live-spot'
                ? renderFutureEventsButton()
                : renderPastEventsButton()}
              <BookmarkAction
                key={`eventdetail${event.id}${'event'}`}
                _id={event.id}
                typeBookMark={'event'}
                className={'event_detail_button_bookmark'}
                type={'button'}
              />
            </div>

            <div className="detail-item event-detail__actions--share">
              <ShareAction
                type="list"
                title={event.name}
                content={event.name}
              />
            </div>
          </div>
        </header>
      </div>
    </div>
  );

  const getProfileId = (id) =>
    usersList?.find((user) => user.userId === id)?._id;
  //console.log(usersList);

  const tabs = () => (
    <Tabs
      defaultActiveKey="1"
      onChange={() => {}}
      className={'event_detail_tabs'}
    >
      <Tabs.TabPane tab={t('events.description')} key="1">
        <div
          className={'event_detail_program_html'}
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('events.speakers')} key="2">
        <h4>{t('events.speakers')}</h4>
        {event.speakers.map((speaker, i) => (
          <ConditionalLink
            condition={usersList?.some((user) => user.userId === speaker.id)}
            to={`/profile/${getProfileId(speaker.id)}`}
            key={`profile-link${getProfileId(speaker.id)}`}
            style={{ cursor: 'auto' }}
          >
            {speaker.speaker === null ? (
              <div className={'speaker-list-item'}>
                <Space>
                  <Avatar
                    key={speaker.id}
                    className="speaker-list-item-avatar"
                    size={50}
                    icon={<UserOutlined />}
                    src={speaker.image_url}
                  />
                  <h4>{speaker.name}</h4>
                </Space>
              </div>
            ) : (
              <div className={'speaker-list-item'}>
                <Space>
                  <Avatar
                    key={speaker.id}
                    className="speaker-list-item-avatar"
                    size={50}
                    icon={<UserOutlined />}
                    src={speaker?.speaker.image_url}
                  />
                  <h4>{speaker?.speaker.name}</h4>
                </Space>
              </div>
            )}
          </ConditionalLink>
        ))}
        {event.moderators.length > 0 && (
          <h4 style={{ marginTop: 20 }}>{t('events.moderators')}</h4>
        )}
        {event.moderators.map((speaker, i) => (
          <ConditionalLink
            condition={usersList?.some((user) => user.userId === speaker.id)}
            to={`/profile/${getProfileId(speaker.id)}`}
            key={`profile-link${getProfileId(speaker.id)}`}
            style={{ cursor: 'auto' }}
          >
            {speaker.speaker === null ? (
              <div className={'speaker-list-item'}>
                <Space>
                  <Avatar
                    key={speaker.id}
                    className="speaker-list-item-avatar"
                    size={50}
                    icon={<UserOutlined />}
                    src={speaker.image_url}
                  />
                  <h4>{speaker.name}</h4>
                </Space>
              </div>
            ) : (
              <div className={'speaker-list-item'}>
                <Space>
                  <Avatar
                    key={speaker.id}
                    className="speaker-list-item-avatar"
                    size={50}
                    icon={<UserOutlined />}
                    src={speaker?.speaker.image_url}
                  />
                  <h4>{speaker?.speaker.name}</h4>
                </Space>
              </div>
            )}
          </ConditionalLink>
        ))}
      </Tabs.TabPane>
      <Tabs.TabPane tab={t('events.program')} key="3">
        <div
          className={'event_detail_program_html'}
          dangerouslySetInnerHTML={{ __html: event.program }}
        />
      </Tabs.TabPane>
    </Tabs>
  );

  // render function
  return (
    <div className="main-full-content" id="detail-event">
      <Row gutter={[0, 30]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {event !== null && !loading && (
          <Layout className="main-single-layout events-layout">
            <Layout.Content className="main-single-content event-detail">
              <Row className="main-single-content__header events">
                <Col
                  span={24}
                  className={`header-actions ${isMobile && 'white'}`}
                  style={{
                    backgroundImage:
                      isMobile &&
                      event?.image_url &&
                      `url('${event?.image_url}')`,
                    minHeight:
                      isMobile && !event?.image_url
                        ? '40px'
                        : small
                        ? '40px'
                        : isMobile && '134px',
                  }}
                >
                  <div className="main-single-content__header--goback">
                    <GoBackButton
                      goTo="/event"
                      label={!isMobile && t('events.backToEvents')}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col xs={24}>{banner()}</Col>
              </Row>
              {eventUrl && (
                <>
                  {event.econgress_video_type === 'live' ||
                  event.econgress_video_type === 'live-spot' ||
                  Capacitor.platform !== 'web' ? (
                    <Modal
                      visible={liveEventPopup}
                      onCancel={() => dispatch(closeLiveEventPopup())}
                      destroyOnClose={true}
                      footer={false}
                      className="live-event-modal"
                    >
                      <iframe
                        src={eventUrl}
                        title={event.name}
                        allow="fullscreen"
                      />
                    </Modal>
                  ) : (
                    <Row className="main-single-content--iframe">
                      <Col xs={24}>
                        <iframe
                          src={eventUrl}
                          title={event.name}
                          allow="fullscreen"
                        />
                      </Col>
                    </Row>
                  )}
                </>
              )}

              <Row className="main-single-content__main events">
                <Col xs={24}>
                  <article className="main-single-content__article">
                    <section className="article-main">{tabs()}</section>
                  </article>
                </Col>
              </Row>

              {event !== null && (
                <div id="comments">
                  {
                    <CommentsOverview
                      commentType="event"
                      itemData={{
                        ...event,
                        comments: [],
                        likes: [],
                        author: [],
                      }}
                      changeItem={(e) => {}}
                      className="events"
                    />
                  }
                </div>
              )}
            </Layout.Content>
          </Layout>
        )}
        {event === null && !loading && (
          <Empty description={t('common.noData')} />
        )}
      </Row>
    </div>
  );
}

EventDetail.propTypes = {
  loading: PropTypes.bool,
  event: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default compose(withRedux, withUser, withAuthPopup, memo)(EventDetail);
