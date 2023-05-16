/**
 *
 * EventCard
 *
 */
import React, { memo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

import './style.scss';

// antd components
import { Card, Tag, Avatar, Row, Col, Space } from 'antd';

// icons
import CustomIcons from 'legacy/components/CustomIcons';
import { UserOutlined } from '@ant-design/icons';

import eventBanner from 'public/images/event.jpg';

// components
import LinkWrapper from 'legacy/components/LinkWrapper';
import { useNavigate } from 'react-router-dom';

function EventCard({ event, registered, ...rest }) {
  const { t } = useTranslation();
  //console.debug(registered);
  const {
    id,
    name,
    duration,
    accredited,
    date_from,
    start_time,
    speakers,
    bkg_color,
    logo_url,
    subtype,
  } = event;

  return (
    <LinkWrapper
      key={id}
      _id={id}
      type="event"
      goBackName="events.backToEvents"
    >
      <Card
        className="event_card"
        cover={
          <div
            className="event_banner honeycomb"
            style={{
              background: `${logo_url !== '' ? bkg_color : bkg_color}`,
              backgroundImage: `url("${logo_url !== '' ? '' : eventBanner}")`,
              backgroundSize: 'cover',
            }}
          >
            <div
              className="event-img-logo"
              style={{
                backgroundImage: `url("${
                  logo_url !== '' ? logo_url : logo_url
                }")`,
              }}
            />
            <div className="event_card__tags">
              {event.fields.length > 0 &&
                event.fields.map((tag, i) => (
                  <Tag
                    key={`tag-speciality__${i}`}
                    className="tag tag--speciality"
                  >
                    {t(`common.specialities-${camelCase(tag.name)}`)}
                  </Tag>
                ))}
              {event.anatomies.length > 0 &&
                event.anatomies.map((tag, i) => (
                  <Tag key={`tag-anatomy__${i}`} className="tag tag--anatomy">
                    {t(`common.anatomies-${camelCase(tag.name)}`)}
                  </Tag>
                ))}
            </div>
          </div>
        }
        {...rest}
      >
        <h3 className="event_name">{name}</h3>
        <h4 className="event_subtitle">{subtype}</h4>
        <Row>
          <Col span={18} className="event_date">
            <CustomIcons type="naked" className="event_icon_calendar" />
            {start_time === null
              ? `${moment(date_from).format('LL')}`
              : `${moment(`${date_from} ${start_time}`).format('LLL')} (CET)`}
          </Col>
          <Col span={6} className="event_duration">
            <span>
              {duration !== null && '~'}
              {duration} {duration !== null && 'mins'}
            </span>
          </Col>
        </Row>
        <Row className="avatars_speakers_event">
          <Space>
            {speakers
              .slice(0, 3)
              .map((speaker, i) =>
                speaker.speaker === null ? (
                  <Avatar
                    key={speaker.id}
                    className="avatar_speakers_event"
                    size={32}
                    icon={<UserOutlined />}
                    src={speaker.image_url}
                  />
                ) : (
                  <Avatar
                    key={speaker.id}
                    className="avatar_speakers_event"
                    size={32}
                    icon={<UserOutlined />}
                    src={speaker?.speaker?.image_url}
                  />
                ),
              )}
            <div className="speakers_name">
              {speakers.slice(0, 3).map((speaker, i) =>
                speaker.speaker === null ? (
                  <span key={i}>
                    {speaker.name}
                    {i === speakers.length - 1 || i === 2 ? null : ','}{' '}
                  </span>
                ) : (
                  <span key={i}>
                    {speaker?.speaker?.name}
                    {i === speakers.length - 1 || i === 2 ? null : ','}{' '}
                  </span>
                ),
              )}
            </div>
          </Space>
        </Row>
        {accredited === 1 && (
          <span className="event_accredited_tag">
            <CustomIcons
              type="verified-white2"
              className="event_accredited_icon"
            />
            {t('events.accredited')}
          </span>
        )}
        {registered === 1 && (
          <span className={'event_registred_tag'}>
            {t('events.registered')}
          </span>
        )}
      </Card>
    </LinkWrapper>
  );
}

export default memo(EventCard);
