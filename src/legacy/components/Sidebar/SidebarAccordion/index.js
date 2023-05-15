import React, { memo } from 'react';

import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import { Link } from 'react-router-dom';

// styles
import './style.scss';

// antd component
import { Collapse } from 'antd';

// icons
import { PlusOutlined } from '@ant-design/icons';

const { Panel } = Collapse;

function SidebarAccordion({ options, children, type }) {
  const { title, route } = options;

  /*
   * TODO: remove collapsing on click,
   *       and then remove the bug of reloading the page
   *       for clicking on the link
   * TODO: add highlighting of the active link to the menu
   */
  const genExtra = () => (
    <Link to={route.to}>
      <PlusOutlined
      /* onClick={event => {
          // If you don't want click extra trigger collapse, you can prevent this:
          event.stopPropagation();
        }} */
      />
    </Link>
  );

  return (
    options && (
      <Collapse
        defaultActiveKey={['1']}
        expandIconPosition="right"
        className={`sidebar-accordion sidebar-${type}`}
      >
        <Panel header={title} key="1" extra={genExtra()}>
          {children}
        </Panel>
      </Collapse>
    )
  );
}

SidebarAccordion.propTypes = {
  options: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.bool,
    PropTypes.object,
  ]),
};

export default compose(memo)(SidebarAccordion);
