import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

//styles
import './style.scss';

// antd component
import { Button } from 'antd';

function FloatCta({ actionJoin, actionEnter, className }) {
  const mainClassName = classNames('float-form', className);

  return (
    <div className={mainClassName}>
      <div className="float-form__wrapper">
        <div className="wrapper-message">
          <h3 className="message-title">You’re signed out</h3>
          <p className="message-description">Sign in for the full experience</p>
        </div>
        <div className="wrapper-btn">
          <Button onClick={actionJoin} className="btn-join">
            Join the community
          </Button>
          <Button onClick={actionEnter} className="btn-enter">
            Sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

FloatCta.propTypes = {
  actionJoin: PropTypes.func.isRequired,
  actionEnter: PropTypes.func.isRequired,
};

export default FloatCta;
