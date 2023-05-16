import React, { memo, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

// styles
import './style.scss';

// antd component
import { List, Button, Switch } from 'antd';

// components
import UserAvatar from 'legacy/components/UserAvatar';
import ConditionalLink from 'legacy/components/ConditionalLink';
import Badge from 'legacy/components/Badge';

// containers
import RequestControls from 'legacy/containers/Community/RequestControls';
// global user
import { withUser } from 'appContext/User.context';

// helpers function
import {
  getObjId,
  getUniqueMembers,
  membersAmount,
  getUrlVars,
  makeSearchQueryParams,
  getEmployment,
} from 'utils/generalHelper';

function MembersListWidget({
  mode,
  requestControlMode,
  showMembersAmount,
  communityType,
  // main
  members,
  community,
  isUserAnAdmin,
  user,
  // actions
  openTab,
  updateList,
  panel,
  changeMembersAmount,
  // default props
  className,
}) {
  const childClassNames = classNames(
    'members-list-wrapper',
    'members-list-widget',
    'community-widget',
    className,
  );
  const { t } = useTranslation();
  const urlVars = getUrlVars();

  const [activePage, setActivePage] = useState(parseInt(urlVars?.page) || 1);
  const [membersList, setMembersList] = useState([]);

  const sortMembers = (array) => {
    const amount = mode == 'component' ? 20 : 5;
    return array && array.length > 0 && array.slice(0, amount);
  };

  const getMembers = useCallback(() => {
    const uniqueArr = getUniqueMembers(members);
    if (mode == 'component') {
      return uniqueArr;
    }
    return sortMembers(uniqueArr);
  }, [members]);

  useEffect(() => {
    if (JSON.stringify(members) != JSON.stringify(membersList)) {
      const getMembersList = getMembers(members);
      setMembersList(getMembersList);
    }
  }, [members]);

  const getUserRole = useCallback(
    (itemData) => {
      const isAdmin =
        members?.admins &&
        members?.admins.find((el) => getObjId(el) == getObjId(itemData));
      const isModerator =
        members?.moderators &&
        members?.moderators.find((el) => getObjId(el) == getObjId(itemData));
      const isMember =
        members?.members &&
        members?.members.find((el) => getObjId(el) == getObjId(itemData));
      return (
        (isAdmin && 'admin') ||
        (isModerator && 'moderator') ||
        (isMember && 'member')
      );
    },
    [members],
  );

  const createLable = useCallback(
    (itemData) => {
      const userRole = getUserRole(itemData);
      const isIndustryUser = itemData?.role == 'industry';

      if (userRole !== 'member') {
        return (
          <>
            <span className={`members-badge ${userRole}`}>
              {t(`communities.${userRole}`)}
            </span>
            {isIndustryUser && (
              <span className="members-badge industry">
                {t('communities.community-industryPartner')}
              </span>
            )}
          </>
        );
      }
    },
    [community, members],
  );

  const manageRespondHandler = (data, item) => {
    if (!data?.hasOwnProperty('error')) {
      updateList !== undefined && updateList(data, item);
    }
  };

  const listItem = useCallback(
    (item) => {
      const { isEmployee, industryName } = getEmployment(item);

      return (
        <List.Item>
          <ConditionalLink
            condition={user?.role !== 'industry' || item.role !== 'industry'}
            className="list-item-link"
            to={
              item.role === 'industry' && item.employment
                ? `/community/detail/${getObjId(
                    item.employment.industryCommunity,
                  )}`
                : `/profile/${item._id}`
            }
            key={`${item?._id}-member-${mode}`}
          >
            <List.Item.Meta
              title={
                <>
                  <span className="members-name">
                    {`${
                      item?.description?.firstname
                    } ${item?.description?.lastname.trim()}`}
                  </span>
                  {isEmployee && (
                    <Badge
                      title={t('communities.employeeOf', { industryName })}
                    />
                  )}
                  {requestControlMode !== 'invitation' && createLable(item)}
                </>
              }
              avatar={
                <UserAvatar
                  fontSize={12}
                  user={item}
                  width={mode == 'widget' ? 29 : 50}
                  height={mode == 'widget' ? 29 : 50}
                />
              }
              description={
                <>
                  <span style={{ marginRight: 15, display: 'block' }}>
                    {item.description?.company}
                  </span>
                </>
              }
            />
          </ConditionalLink>
          {mode === 'component' && requestControlMode === 'invitation' && (
            <span className="invitation-state">{t('common.pending')}</span>
          )}
          {mode === 'component' && community && (
            <RequestControls
              key={'RequestControls-' + item._id}
              mode={requestControlMode}
              manageData={
                requestControlMode === 'request'
                  ? {
                      _id: item?.requestId,
                      user: item._id,
                      role: getUserRole(item),
                      isIndusty:
                        getUserRole(item) == 'admin' &&
                        item?.role == 'industry',
                    }
                  : {
                      ...item,
                      role: getUserRole(item),
                      isIndusty:
                        getUserRole(item) == 'admin' &&
                        item?.role == 'industry',
                    }
              }
              respond={(data) => manageRespondHandler(data, item)}
              community={community}
              communityType={communityType}
            />
          )}
        </List.Item>
      );
    },
    [mode, members],
  );

  const onPageChange = (page) => {
    setActivePage(page);
    //replace
    navigate({
      pathname: window.location.pathname,
      search: makeSearchQueryParams({
        tab: 'members',
        page: page,
        panel: panel,
      }),
    });
  };

  const showOnlyEmployeesHandle = (value) => {
    if (value) {
      const newmemberList = membersList.filter((el) => {
        const sameCommunity =
          getObjId(el?.employment?.industryCommunity) == getObjId(community);
        return el?.employment?.isEmployee && sameCommunity;
      });
      setMembersList(newmemberList);
      changeMembersAmount(newmemberList?.length || 0);
    } else {
      const initMembersList = getMembers(members);
      setMembersList(initMembersList);
      changeMembersAmount(initMembersList?.length || 0);
    }
  };

  const getFilteredMembersList = useCallback((membersList) => {
    const industryPartners = membersList.filter(
      (member) => member?.role === 'industry',
    );

    const otherMembers = membersList.filter(
      (member) => member?.role !== 'industry',
    );

    return industryPartners.concat(otherMembers);
  }, []);

  return (
    <div className={childClassNames}>
      {communityType === 'industry' && mode == 'component' && (
        <div className="industry-partner-switch">
          <Switch
            id="only-show-industry-partner"
            onChange={showOnlyEmployeesHandle}
          />
          <label htmlFor="only-show-industry-partner">
            {t('communities.onlyShowEmployeesOfThisIndustryPartner')}
          </label>
        </div>
      )}
      {members && membersList && (
        <>
          <List
            dataSource={getFilteredMembersList(membersList) || []}
            className={mode == 'widget' ? 'list-members' : 'list-members-tab'}
            pagination={
              mode == 'component' && {
                current: activePage,
                pageSize: 10,
                onChange: (page) => {
                  onPageChange(page);
                },
              }
            }
            renderItem={listItem}
          />
          {openTab !== undefined && (
            <Button
              onClick={() => openTab('members')}
              type="link"
              className="members-amount"
            >
              {showMembersAmount
                ? t('communities.seeAllWithCount', {
                    count: membersAmount(members),
                  })
                : t('common.seeAll')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

MembersListWidget.defaultProps = {
  mode: 'widget',
  requestControlMode: 'member',
  showMembersAmount: true,
  communityType: 'open',
};
MembersListWidget.propTypes = {
  mode: PropTypes.oneOf(['widget', 'component']).isRequired,
  requestControlMode: PropTypes.oneOf(['request', 'member']).isRequired,
  members: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  isUserAnAdmin: PropTypes.bool,
  openTab: PropTypes.func,
  updateList: PropTypes.func,
};

export default compose(memo, withUser)(MembersListWidget);
