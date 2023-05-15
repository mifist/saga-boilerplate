import * as React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  TypeaheadOption,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';

import { $createMentionNode } from '../nodes/MentionNode';
import api from '../engine/api/axiosAPI';
import UserAvatar from '../../UserAvatar';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const CapitalizedNameMentionsRegex = new RegExp(
  '(^|[^#])((?:' + DocumentMentionsRegex.NAME + '{' + 1 + ',})$)',
);

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

const mentionsCache = new Map();

const mentionLookupService = {
  async search({ query, postId, currentUser }, callback) {
    try {
      // console.log(string);
      const initRequest = {
        user: {
          _id: currentUser._id,
        },
        postId: postId,
        include: [],
        exclude: [currentUser._id],
        value: query,
        limit: 50,
        firstLoad: false,
      };
      const data = await api.users.fetchAllMentions(initRequest);
      // setOptions(data.data);
      // console.debug(data.data);
      callback(data.data);
    } catch (e) {
      console.log(e);
    }
  },
};

function useMentionLookupService({ mentionString, postId, currentUser }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString);

    if (mentionString == null) {
      setResults([]);
      return;
    }

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    mentionLookupService.search(
      { query: mentionString, postId, currentUser },
      newResults => {
        mentionsCache.set(mentionString, newResults);
        setResults(newResults);
      },
    );
  }, [mentionString]);

  return results;
}

function checkForCapitalizedNameMentions(text, minMatchLength) {
  const match = CapitalizedNameMentionsRegex.exec(text);
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[2];
    if (matchingString != null && matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: matchingString,
      };
    }
  }
  return null;
}

function checkForAtSignMentions(text, minMatchLength) {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text) {
  const match = checkForAtSignMentions(text, 1);
  return match === null ? checkForCapitalizedNameMentions(text, 3) : match;
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  mention,
  user,
}) {
  let className = 'item author-list-view';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={user._id}
      tabIndex={-1}
      className={className}
      ref={mention.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={() => {
        lastId = user._id;
        onClick();
      }}
    >
      <div className="author-list-view__avatar">
        <UserAvatar fontSize={12} user={user} width={56} height={56} />
      </div>
      <div className="author-list-view__content">
        <h4 className="author-list-view__title">
          {`${user?.description?.firstname} ${user?.description?.lastname}`}
        </h4>
        {user?.credential?.title && (
          <div
            className="author-list-view__description"
            dangerouslySetInnerHTML={{ __html: user?.credential?.title }}
          />
        )}
      </div>
    </li>
  );
}

let lastId = '';

export default function MentionsPlugin({ currentUser, postId }) {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState(null);

  const results = useMentionLookupService({
    mentionString: queryString,
    currentUser,
    postId,
  });

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => results, [results]);

  const onSelectOption = useCallback(
    (selectedOption, nodeToReplace, closeMenu) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          typeof selectedOption === 'string'
            ? selectedOption
            : selectedOption.name,
          null,
          null,
          lastId,
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    text => {
      const mentionMatch = getPossibleQueryMatch(text);
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      return !slashMatch && mentionMatch ? mentionMatch : null;
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) =>
        anchorElementRef && results.length > 0 ? (
          <div className="typeahead-popover mentions-menu">
            <ul>
              {options.map((mention, i) => (
                <MentionsTypeaheadMenuItem
                  index={mention?._id}
                  isSelected={selectedIndex === i}
                  onClick={() => {
                    setHighlightedIndex(i);
                    selectOptionAndCleanUp(mention.name);
                  }}
                  onMouseEnter={() => {
                    setHighlightedIndex(i);
                  }}
                  key={mention?._id}
                  user={mention}
                  mention={mention.name}
                />
              ))}
            </ul>
          </div>
        ) : null
      }
    />
  );
}
