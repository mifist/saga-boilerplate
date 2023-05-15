/**
 *
 * UserWalkthrough
 *
 */

import React, { memo, useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import {
  Modal,
  Button,
  Row,
  Col,
  Steps,
  message,
  Space,
  notification,
} from 'antd';
const { Step } = Steps;

import moment from 'moment';
import { withUser } from 'engine/context/User.context';

import { FormattedMessage } from 'react-intl';
import './style.scss';
import { Link } from 'react-router-dom';

import imageShare from 'images/icons/share.svg';
import imageListen from 'images/icons/microphone.svg';
import imageParticipate from 'images/icons/event.svg';
import imageDiscover from 'images/icons/discover.svg';
import logoLogin from 'images/logo-name.svg';

import history from 'utils/history';



function UserWalkthrough({ user }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user.isTourFinished) {
      const tour = localStorage.getItem('beemed_tour');
      const oldCurrent = localStorage.getItem('beemed_tour_current');
      if (tour) {
        if (moment.duration(moment().diff(tour)).asDays() < 1) {
          setVisible(false);
        } else {
          setVisible(true);
          if (oldCurrent) {
            setCurrent(parseInt(oldCurrent));
          }
        }
      } else {
        setVisible(true);
        if (oldCurrent) {
          setCurrent(parseInt(oldCurrent));
        }
      }
    }
  }, []);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const handleClose = url => {
    history.push(url);
    setVisible(false);
    localStorage.setItem('beemed_tour', moment());
    localStorage.setItem('beemed_tour_current', current);
  };

  const handleFinish = url => {
    user.handleFinishTour(user._id);
    setVisible(false);
    localStorage.removeItem('beemed_tour');
    localStorage.removeItem('beemed_tour_current');
    notification.open({
      className: 'walkthrough-notification',
      message: `Welcome to the community ${user.description.firstname}`,
      description: (
        <span>
          We are glad you joined BeeMed! Please take a moment to{' '}
          <a href={`profile/${user._id}`}>complete your profile</a>, increasing
          your visibility & networking opportunities with your peers.
        </span>
      ),
      placement: 'bottomRight',
      bottom: 50,
      duration: 10,
    });
  };

  return (
    <div>
      <Modal
        className="modal-walkthrough"
        visible={false}
        title={null}
        footer={null}
        closable={false}
      >
        <div className="steps-content">
          {current === 0 && (
            <div>
              <img src={logoLogin} className="logo-tour" alt="BeeMed Logo" />
              <h2>Welcome</h2>
              <h3>to the BeeMed Community</h3>
              <p>
                We are glad to have you onboard! Here is a quick tour of the
                platform & its features.
              </p>
              <Space style={{ marginTop: 24 }}>
                <Button size="large" className="btn-2" onClick={() => next()}>
                  Start the tour
                </Button>
              </Space>
            </div>
          )}
          {current === 1 && (
            <div>
              <img src={imageShare} />
              <h2>Share</h2>
              <h3>medical cases with your peers</h3>
              <p>
                This is the place to share, exchange, debate and gain insights
                from medical cases posted by your peers.
              </p>
              <Space style={{ marginTop: 24 }}>
                <Button
                  size="large"
                  className="btn-1"
                  onClick={() => handleClose('case')}
                >
                  Show me cases
                </Button>
                <Button
                  size="large"
                  className="btn-2"
                  onClick={() => handleClose('case')}
                >
                  Upload a case
                </Button>
              </Space>
            </div>
          )}
          {current === 2 && (
            <div>
              <img src={imageListen} />
              <h2>Listen</h2>
              <h3>to the latest medical podcasts</h3>
              <p>Find relevant podcasts from a variety of sources</p>
              <Button
                size="large"
                className="btn-2"
                onClick={() => handleClose('podcast')}
              >
                Listen to a podcast
              </Button>
            </div>
          )}
          {current === 3 && (
            <div>
              <img src={imageParticipate} />
              <h2>Participate</h2>
              <h3>in engaging events</h3>
              <p>
                Register for upcoming courses & access all past events as replay
              </p>
              <Space style={{ marginTop: 24 }}>
                <Button
                  size="large"
                  className="btn-2"
                  onClick={() => handleClose('event')}
                >
                  Browse events
                </Button>
              </Space>
            </div>
          )}
          {current === 4 && (
            <div>
              <img src={imageDiscover} />
              <h2>Discover</h2>
              <h3>the most recent scientific articles</h3>
              <p>
                Stay up-to-date on medical research thanks to our summaries of
                relevant articles
              </p>
              <Space style={{ marginTop: 24 }}>
                <Button
                  size="large"
                  className="btn-2"
                  onClick={() => handleClose('article')}
                >
                  Read a scientific article
                </Button>
              </Space>
            </div>
          )}
        </div>
        <div className="steps-action">
          <Space>
            {current > 1 && (
              <Button
                className="btn-previous"
                size="large"
                onClick={() => prev()}
              >
                Back
              </Button>
            )}
            {current < 4 && current > 0 && (
              <Button className="btn-next" size="large" onClick={() => next()}>
                Next
              </Button>
            )}
            {current === 5 - 1 && (
              <Button
                className="btn-done"
                size="large"
                onClick={() => handleFinish('newsfeed')}
              >
                Go to my newsfeed
              </Button>
            )}
          </Space>
          <div className="finish-later">
            <a href="#" onClick={() => handleClose('newsfeed')}>
              Skip the tour for now
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
}

UserWalkthrough.propTypes = {};

export default memo(withUser(UserWalkthrough));
