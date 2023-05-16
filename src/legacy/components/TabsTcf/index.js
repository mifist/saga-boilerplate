/**
 *
 * TabsTcf
 *
 */

import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { Link, useNavigate } from 'react-router-dom';

// styles
import './style.scss';

import useDeviceDetect from 'appHooks/useDeviceDetect';

// antd component
import { Select } from 'antd';

// Helper Component
function Tab({ tab }) {
  return (
    tab?.content && (
      <div className={`tabs-tcf__tab-content ${tab.key}`}>{tab?.content}</div>
    )
  );
}
Tab.propTypes = {
  tab: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
  ]),
};
// Helper Component
function TabsNavigation({ activeTabKey, tabs, type, onNavClick }) {
  return (
    tabs && (
      <>
        {type == 'tabs' && (
          <ul className={`tabs-tcf__nav`}>
            {tabs.map(item => (
              <li key={item?.key} className={`tabs-tcf__nav-item`}>
                <button
                  className={`tabs-tcf__nav-button ${
                    activeTabKey === item?.key ? 'active' : ''
                  }`}
                  onClick={() => onNavClick(item?.key)}
                >
                  {item?.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {type == 'select' && (
          <Select
            className={`tabs-tcf__nav-select`}
            defaultValue={activeTabKey}
            onChange={(value, option) => onNavClick(value)}
            optionFilterProp="children"
            getPopupContainer={trigger => trigger.parentElement}
          >
            {tabs.map(item => (
              <Select.Option key={item?.key} value={item?.key}>
                {item?.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </>
    )
  );
}
TabsNavigation.defaultProps = {
  type: 'tabs',
  tabs: [],
};
TabsNavigation.propTypes = {
  type: PropTypes.oneOf(['tabs', 'select']).isRequired,
  activeTabKey: PropTypes.string.isRequired,
  onNavClick: PropTypes.func.isRequired,
  tabs: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
    PropTypes.array.isRequired,
  ]),
};

// Main Component
function TabsTcf({
  tabsOptions,
  type,
  defaultKey,
  activeKey,
  // actions
  onChangeTab,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('tabs-tcf-wrapper', type, className);

  const { isMobile } = useDeviceDetect();

  const [activeTabKey, setActiveTab] = useState(
    defaultKey || tabsOptions[0]?.key || null,
  );

  useEffect(() => {
    if (activeKey) {
      changeActiveTab(activeKey);
    }

    return () => {};
  }, [activeKey, changeActiveTab]);

  const activeTab = useMemo(
    () => tabsOptions && tabsOptions?.find(tab => tab.key === activeTabKey),
    [activeTabKey, tabsOptions],
  );

  const changeActiveTab = key => {
    setActiveTab(key);
    onChangeTab(key, activeTabKey);
  };

  return (
    tabsOptions &&
    tabsOptions.length > 0 && (
      <div className={childClassNames} {...rest}>
        <div className="tabs-tcf">
          <TabsNavigation
            type={!type ? (!isMobile ? 'tabs' : 'select') : type}
            tabs={tabsOptions}
            onNavClick={changeActiveTab}
            activeTabKey={activeTabKey}
          />
          <Tab tab={activeTab} />
        </div>
      </div>
    )
  );
}

/* const tabs = [
  {
    key: 'tab1',
    name: 'Tab 1',
    content: <div>html content 1</div>,
  },
  {
    key: 'tab2',
    name: 'Tab 2',
    content: <div>html content 2</div>,
  },
]; */

TabsTcf.defaultProps = {
  tabsOptions: [],
};
TabsTcf.propTypes = {
  type: PropTypes.oneOf(['tabs', 'select']),
  defaultKey: PropTypes.string,
  onChangeTab: PropTypes.func,
  tabsOptions: PropTypes.oneOfType([
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
    PropTypes.array.isRequired,
  ]),
};

export default memo(TabsTcf);
