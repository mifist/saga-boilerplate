import React, { memo } from 'react';
import { compose } from '@reduxjs/toolkit';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import './style.scss';

// assets
import chatsIcon from 'engine/CometChatWorkspace/src/components/CometChatUI/CometChatNavBar/resources/chats.svg';
import usersIcon from 'engine/CometChatWorkspace/src/components/CometChatUI/CometChatNavBar/resources/users.svg';
import groupsIcon from 'engine/CometChatWorkspace/src/components/CometChatUI/CometChatNavBar/resources/groups.svg';

// contexts
import { withUser } from 'appContext/User.context';
// Comet Chat
import Translator from 'engine/CometChatWorkspace/src/resources/localization/translator';


function ChatNavigation({ event, user, ...rest }) {
  const { i18n } = useTranslation();

  return (
    <div className="chat-navbar">
      <ul>
        <li>
          <NavLink
            to="/chat/conversations"
            activeClassName="chat-navbar-active"
          >
            <img src={chatsIcon} alt="" />
            {Translator.translate('CHATS', i18n.language)}
          </NavLink>
        </li>
        {user.role !== 'industry' && (
          <li>
            <NavLink to="/chat/users" activeClassName="chat-navbar-active">
              <img src={usersIcon} alt="" />
              {Translator.translate('USERS', i18n.language)}
            </NavLink>
          </li>
        )}
        {user.role !== 'industry' && (
          <li>
            <NavLink to="/chat/groups" activeClassName="chat-navbar-active">
              <img src={groupsIcon} alt="" />
              {Translator.translate('GROUPS', i18n.language)}
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
}

ChatNavigation.propTypes = {};

export default compose(
  memo,
  withUser,
)(ChatNavigation);
