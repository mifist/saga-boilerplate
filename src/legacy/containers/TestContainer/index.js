import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';

import reducer from './reducer';
import saga from './saga';

import { flushState } from './actions';
import { makeSelectTestContainer } from './selectors';

// styles
import './style.scss';

// antd component
import { Col, Row, Typography, Space } from 'antd';
const { Text } = Typography;

// assets
import CustomIcons from 'legacy/legacy/components/CustomIcons';
import VideoPopupVimeo from 'legacy/components/VideoPopupVimeo';
import LexicalEditor from 'legacy/components/LexicalEditor';
import log from 'eslint-plugin-react/lib/util/log';

// components

export function TestContainer({ flushState }) {
  useInjectReducer({ key: 'testContainer', reducer });
  useInjectSaga({ key: 'testContainer', saga });

  // const [example, setExample] = useState('Hello world');

  /**
   * Loading data for rendering in a component
   * - work like ComponentDidUpdate
   */
  useEffect(() => {
    console.debug('TestContainer useEffect');
  }, []);

  // Clearing the state after unmounting a component
  useEffect(
    () => () => {
      // Anything in here is fired on component unmount.
      flushState();
    },
    [],
  );

  // render function
  return (
    <div>
      <Row>
        <Col span={24}>
          <div style={{ marginTop: '50px' }} />
          <LexicalEditor
            handleChange={text => console.debug(text)}
            content={'test'}
            contentType={'case'}
            type={'case' === 'case' ? 'full' : 'simple'}
          />
        </Col>
      </Row>
    </div>
  );
}

TestContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  testContainer: makeSelectTestContainer(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    flushState: () => dispatch(flushState()),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(TestContainer);
