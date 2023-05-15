import React, { memo, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';

// HOC
import withRedux from 'HOC/withRedux';

import { flushState } from './actions';

// styles
import './style.scss';

// antd component
import { Col, Row, Typography, Space } from 'antd';
const { Text } = Typography;

// assets
import CustomIcons from 'legacy/components/CustomIcons';
import VideoPopupVimeo from 'legacy/components/VideoPopupVimeo';
import LexicalEditor from 'legacy/components/LexicalEditor';
import log from 'eslint-plugin-react/lib/util/log';

// components

export function TestContainer({ 
  // core
  state,
  dispatch
}) {
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

export default compose(
  withRedux,
  memo,
)(TestContainer);
