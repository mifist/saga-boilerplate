/**
 *
 * MembersTab
 *
 */

import React, { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { compose } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Collapse, Typography } from 'antd';
// context
import { withUser } from 'appContext/User.context';

// components
import MembersListWidget from 'legacy/components/Widgets/MembersListWidget';

// containers
import InviteMemberForm from 'legacy/containers/Community/InviteMemberForm';

// helpers function
import {
  isUserAnAdmin,
  membersAmount,
  getObjId,
  arrayUniqueByKey,
  gindUserInRole,
  convertRequestToUsersRolesArr,
  getUrlVars,
  makeSearchQueryParams,
} from 'utils/generalHelper';
import api, { setAuthorizationHeader } from 'appAPI/axiosAPI';

const MembersTab = ({
  members,
  invitations,
  joinRequests,
  communityData,
  user,
  showMembersAmount,
  // actions
  updateRequests,
  updateMembers,
  updateInvitations,
}) => {
  const { t } = useTranslation();
  const history = useNavigate();
  const urlVars = getUrlVars();

  const local = localStorage.getItem('beemed_user');
  const json = JSON.parse(local);
  setAuthorizationHeader(json.token);

  const communityId = communityData?._id;
  const communityType = communityData?.private;

  const [activePanel, setActivePanel] = useState(urlVars?.panel || '3');
  const [membersAmountLength, setMembersAmount] = useState(
    membersAmount(members, false) || 0,
  );

  const canEdit = useCallback(() => {
    const userId = getObjId(user);
    const isAdmin =
      members?.admins && members?.admins.find(el => getObjId(el) == userId);
    return isAdmin;
  }, [members, user]);

  const requestedMembers = convertRequestToUsersRolesArr(joinRequests);
  const _invitations = convertRequestToUsersRolesArr(invitations);

  const _isUserAnAdmin = isUserAnAdmin(user, members);

  const getUserRole = useCallback(
    itemData => {
      const isAdmin =
        members?.admins &&
        members?.admins.find(el => getObjId(el) == getObjId(itemData));
      const isModerator =
        members?.moderators &&
        members?.moderators.find(el => getObjId(el) == getObjId(itemData));
      const isMember =
        members?.members &&
        members?.members.find(el => getObjId(el) == getObjId(itemData));
      return (
        (isAdmin && 'admin') ||
        (isModerator && 'moderator') ||
        (isMember && 'member')
      );
    },
    [members],
  );

  const getUserRoleFrom = (itemData, objectArrays) => {
    const isAdmin =
      objectArrays?.admins &&
      objectArrays?.admins.find(el => getObjId(el) == getObjId(itemData));
    const isModerator =
      objectArrays?.moderators &&
      objectArrays?.moderators.find(el => getObjId(el) == getObjId(itemData));
    const isMember =
      objectArrays?.members &&
      objectArrays?.members.find(el => getObjId(el) == getObjId(itemData));
    return (
      (isAdmin && 'admin') ||
      (isModerator && 'moderator') ||
      (isMember && 'member')
    );
  };

  const manageMembersHandle = (response, user) => {
    if (response && response?._id && !response.hasOwnProperty('employment')) {
      if (user?.role && members !== undefined) {
        const selectedUserRole = getUserRole(user);
        const selectedUserRoleNew = getUserRoleFrom(user, response);

        if (
          selectedUserRoleNew !== undefined &&
          selectedUserRole != selectedUserRoleNew
        ) {
          const oldArr = members[`${selectedUserRoleNew}s`];
          const uniqueUsersNew = arrayUniqueByKey(
            oldArr.concat(response[`${selectedUserRoleNew}s`]),
          );
          updateMembers({
            ...members,
            [`${selectedUserRole}s`]: members[`${selectedUserRole}s`]
              .map(el => (getObjId(el) != getObjId(user) ? el : null))
              .filter(el => el != null),
            [`${selectedUserRoleNew}s`]: uniqueUsersNew,
          });
        } else {
          const uniqueUsersNew = arrayUniqueByKey(
            response[`${selectedUserRole}s`],
          );
          updateMembers({
            ...members,
            [`${selectedUserRole}s`]: uniqueUsersNew,
          });
        }
      } else {
        const newMembers = gindUserInRole(response);
        updateMembers({
          ...newMembers,
        });
      }
    } else {
      const selectedUserRole = getUserRole(user);
      const sameUser =
        user &&
        response &&
        response?._id &&
        getObjId(user) == getObjId(response);

      if (sameUser && response.hasOwnProperty('employment') && members) {
        const newMemberArrray = members[`${selectedUserRole}s`].map(element => {
          if (
            response &&
            response?._id &&
            getObjId(element) == getObjId(response)
          ) {
            let employment = response?.employment;
            if (element.hasOwnProperty('employment')) {
              employment = {
                ...element?.employment,
                ...response?.employment,
              };
            }
            return {
              ...element,
              employment: employment,
            };
          } else {
            return element;
          }
        });

        updateMembers({
          ...members,
          [`${selectedUserRole}s`]: newMemberArrray,
        });
      }
    }
  };

  const manageRequestsHandle = (response, user) => {
    const requestAppruved = response?.processed && !response?.rejected;

    if (response && response?._id) {
      const filteredRequests = joinRequests.filter(
        request =>
          !request?.processed &&
          !request?.rejected &&
          getObjId(request) !== getObjId(response),
      );
      updateRequests([...filteredRequests]);
      // for deleteing members from community
      user.hasOwnProperty('role') && delete user?.role;

      response?.role && requestAppruved && members !== undefined;
      updateMembers({
        ...members,
        [`${response?.role}s`]: [...members[`${response?.role}s`], user],
      });
    }
  };

  const manageInvitationHandle = (response, user) => {
    if (response && response?._id) {
      if (!response.processed) {
        updateInvitations([...invitations, response]);
      } else if (response.processed && response.rejected) {
        const newInvitationList = invitations.filter(
          invitation => invitation._id !== response._id,
        );
        updateInvitations(newInvitationList);
      }
    }
  };

  const activeInvitations = invitations.filter(
    invitation => !invitation.processed,
  );

  const isPrivate = () => {
    if (communityType === 'private') {
      return true;
    } else {
      return false;
    }
  };

  const changePanel = key => {
    setActivePanel(key);
    history.replace({
      pathname: window.location.pathname,
      search: makeSearchQueryParams({
        tab: 'members',
        page: 1,
        panel: key,
      }),
    });
  };

  return (
    <div className="members-tab">
      <Collapse
        accordion
        defaultActiveKey={[activePanel]}
        className={'collapse-member'}
        onChange={key => changePanel(key)}
      >
        {canEdit() &&
          requestedMembers &&
          !isPrivate() &&
          membersAmount(requestedMembers, false) > 0 &&
          communityType !== 'industry' && (
            <Collapse.Panel
              header={
                <Typography.Title level={5}>
                  {t('communities.newMembersRequestsWithCount', {
                    count: membersAmount(requestedMembers, false) || 0,
                  })}
                </Typography.Title>
              }
              key="1"
            >
              <div className="members-tab__requests">
                {membersAmount(requestedMembers, false) > 0 && (
                  <MembersListWidget
                    mode="component"
                    requestControlMode="request"
                    members={requestedMembers}
                    isUserAnAdmin={_isUserAnAdmin}
                    community={communityData}
                    updateList={manageRequestsHandle}
                    communityType={communityType}
                    panel={'1'}
                    showMembersAmount={showMembersAmount}
                  />
                )}
              </div>
            </Collapse.Panel>
          )}

        {canEdit() && communityType !== 'industry' && (
          <Collapse.Panel
            header={
              <Typography.Title level={5}>
                {activeInvitations.length > 0
                  ? t('communities.invitationsWithCount', {
                      count: activeInvitations.length,
                    })
                  : t('communities.invitations')}
              </Typography.Title>
            }
            key="2"
          >
            <div className="members-tab__invitations">
              <InviteMemberForm
                members={members}
                communityId={communityId}
                getResponse={manageInvitationHandle}
              />
              <MembersListWidget
                mode="component"
                requestControlMode="invitation"
                members={_invitations}
                community={communityData}
                isUserAnAdmin={_isUserAnAdmin}
                updateList={manageInvitationHandle}
                panel={'2'}
                communityType={communityType}
                showMembersAmount={showMembersAmount}
              />
            </div>
          </Collapse.Panel>
        )}
        <Collapse.Panel
          header={
            <Typography.Title level={5}>
              {showMembersAmount
                ? t('communities.communityMemberWithCount', {
                    count: membersAmountLength,
                  })
                : 'communities.members'}
            </Typography.Title>
          }
          key="3"
        >
          <div className="members-tab__members">
            <MembersListWidget
              mode="component"
              members={members}
              community={communityData}
              isUserAnAdmin={_isUserAnAdmin}
              updateList={manageMembersHandle}
              panel={'3'}
              communityType={communityType}
              showMembersAmount={showMembersAmount}
              changeMembersAmount={setMembersAmount}
            />
          </div>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

MembersTab.defaultProps = {
  showMembersAmount: true,
};
MembersTab.propTypes = {
  members: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  invitations: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]),
  joinRequests: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.bool.isRequired,
  ]),
  communityId: PropTypes.string,
  updateRequests: PropTypes.func.isRequired,
  updateMembers: PropTypes.func.isRequired,
  updateInvitations: PropTypes.func.isRequired,
};

export default compose(
  memo,
  withUser,
)(MembersTab);
