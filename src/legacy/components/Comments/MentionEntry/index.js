/**
 *
 * MentionEntry
 *
 */

import React, { memo } from 'react';
import classNames from 'classnames';

// styles
import './style.scss';

// components
import UserAvatar from 'legacy/components/UserAvatar';

function MentionEntry(props) {
  const {
    mention,
    theme,
    searchValue, // eslint-disable-line @typescript-eslint/no-unused-vars
    isFocused, // eslint-disable-line @typescript-eslint/no-unused-vars
    className,
    ...parentProps
  } = props;

  const childClassName = classNames(
    'author-list-view',
    theme.mentionSuggestionsEntryContainer,
    className,
  );

  return (
    <div
      key={`${mention?._id ? mention?._id : id}-MentionEntry`}
      className={`${childClassName}${isFocused ? ' focused' : ''}`}
      {...parentProps}
    >
      <div className="author-list-view__avatar">
        <UserAvatar fontSize={12} user={mention} width={56} height={56} />
      </div>
      <div className="author-list-view__content">
        <h4 className="author-list-view__title">
          {`${mention?.description?.firstname} ${
            mention?.description?.lastname
          }`}
        </h4>
        {mention?.credential?.title && (
          <div
            className="author-list-view__description"
            dangerouslySetInnerHTML={{ __html: mention?.credential?.title }}
          />
        )}
      </div>
    </div>
  );
}

export default memo(MentionEntry);
