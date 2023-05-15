import React, { memo, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Collapse, Button, Empty } from 'antd';

//icons

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

//components
import CreateRules from './CreateRules';

// contexts
import { withUser } from 'engine/context/User.context';

function RulesWidget({
  rules,
  defaultKey,
  mode,
  members,
  // states
  user,
  // actions
  openTab,
  onChangeRules,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames(
    'rules-wrapper',
    'rules-widget',
    'community-widget',
    className,
  );

  const { t } = useTranslation();
  const [keyRules, setKeyRules] = useState(defaultKey || '');
  const [isEditMode, setIsEditMode] = useState(false);
  const [rulesCommunity, setRulesCommunity] = useState([...rules]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rulesIndex, setRulesIndex] = useState(null);

  const [editRules, setEditRules] = useState(false);
  const [createRules, setCreateRules] = useState(false);

  useEffect(() => {
    if (defaultKey && defaultKey !== keyRules) {
      setKeyRules(defaultKey);
    }

    return () => {};
  }, [defaultKey]);

  const showModal = () => {
    setIsModalVisible(true);
    setCreateRules(true);
    setRulesIndex(null);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setRulesIndex(null);
  };

  const DeleteRules = (e, id) => {
    e.stopPropagation();
    const filteredRules = rulesCommunity.filter(el => el._id !== id);
    setRulesCommunity(filteredRules);
  };

  const editRulesHandle = (e, index) => {
    e.stopPropagation();
    setIsModalVisible(true);
    setRulesIndex(index);
    setEditRules(true);
  };

  const handelEdit = (values, rulesIndex) => {
    let rulesCommunityChange = [...rulesCommunity];
    rulesCommunityChange[rulesIndex].title = values.title;
    rulesCommunityChange[rulesIndex].description = values.description;
    setRulesCommunity(rulesCommunityChange);
    setIsModalVisible(false);
  };

  const craetePanel = useCallback(() => {
    return rulesCommunity?.map((el, index) => {
      return (
        <Collapse.Panel
          header={
            <>
              <span>{el.title}</span>
              {isEditMode === true ? (
                <div className="box-btn-edit">
                  <Button
                    type="link"
                    onClick={e => editRulesHandle(e, index)}
                    icon={<EditOutlined />}
                  />
                  <Button
                    type="link"
                    onClick={e => DeleteRules(e, el._id)}
                    icon={<DeleteOutlined />}
                  />
                </div>
              ) : null}
            </>
          }
          key={el._id}
        >
          <div
            className="rules-list-description"
            onClick={() => openTab !== undefined && openTab('rules', el._id)}
            dangerouslySetInnerHTML={{
              __html: el.description,
            }}
          />
        </Collapse.Panel>
      );
    });
  }, [rulesCommunity, isEditMode, mode]);

  const canEdit = useCallback(() => {
    const userId = user?._id;
    const isAdmin =
      members?.admins && members?.admins.find(el => el?._id == userId);
    return isAdmin;
  }, [members, user]);

  const onSave = () => {
    onChangeRules !== undefined && onChangeRules(rulesCommunity);
    setIsEditMode(!isEditMode);
  };

  return (
    <div className={childClassNames}>
      {mode == 'component' && canEdit() && (
        <>
          {isEditMode ? (
            <div>
              <Button className="save-edit-btn" onClick={onSave}>
                {t('common.save')}
              </Button>
              <Button
                onClick={() => {
                  setIsEditMode(!isEditMode);
                  setRulesCommunity(rules);
                }}
                className="cancel-edit-btn"
              >
                {t('common.cancel')}
              </Button>
            </div>
          ) : (
            <>
              <Button
                className="edit-rules-btn"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {t('common.edit')}
              </Button>
            </>
          )}
        </>
      )}

      <Collapse
        accordion="true"
        expandIconPosition="right"
        ghost={true}
        bordered={false}
        activeKey={keyRules}
        className={mode == 'widget' ? 'rules-list' : 'rules-list-tabs'}
        onChange={value => {
          setKeyRules(value);
          // mode == 'component' && setClickKeyForTab(value)
        }}
      >
        {craetePanel()}
        {mode == 'component' && isEditMode && canEdit() && (
          <>
            <Button
              type="primary"
              onClick={showModal}
              className="create-rules-btn"
            >
              {t('common.create')}
            </Button>
            <CreateRules
              visibleModal={isModalVisible}
              handleCancel={handleCancel}
              update={rulesObj =>
                setRulesCommunity([...rulesCommunity, rulesObj])
              }
              rulesCommunity={rulesCommunity}
              rulesIndex={rulesIndex}
              handelEdit={handelEdit}
              editRulesMode={editRules}
              createRulesMode={createRules}
            />
          </>
        )}
      </Collapse>
      {rulesCommunity && rulesCommunity.length <= 0 && !isEditMode && (
        <Empty description={t('communities.noRules')} />
      )}
    </div>
  );
}

RulesWidget.defaultProps = {
  mode: 'widget',
};
RulesWidget.propTypes = {
  mode: PropTypes.oneOf(['widget', 'component']).isRequired,
  rules: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.string.isRequired,
    PropTypes.bool.isRequired,
  ]),
  defaultKey: PropTypes.string,
  openTab: PropTypes.func,
  onChangeRules: PropTypes.func,
};

export default compose(
  memo,
  withUser,
)(RulesWidget);
