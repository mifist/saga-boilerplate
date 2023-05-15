/**
 *
 * Upvote
 *
 */

import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import reducer from './reducer';
import saga from './saga';
// import messages from './messages';
import './style.scss';


import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { Tabs } from 'antd';
// icons
const { TabPane } = Tabs;

// components


export function Upvote({
  className,
}) {
  useInjectReducer({ key: 'upvote', reducer });
  useInjectSaga({ key: 'upvote', saga });

  const { isMobile } = useDeviceDetect();

  const user = JSON.parse(localStorage.getItem('user'));
  const childClassNames = classNames('upvote-action', className);



  // work like ComponentDidUpdate
  useEffect(() => {


    return () => {
      // Anything in here is fired on component unmount.

    };
  }, []);



  // render function
  return (
    <div className={childClassNames}>
      upvote
    </div>
  );
}

Upvote.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({

});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withRouter(Upvote));
