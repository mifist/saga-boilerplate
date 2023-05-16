/**
 *
 * MentionEditor
 *
 */

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { split } from 'ramda';
import { useTranslation } from 'react-i18next';

// styles
import '@draft-js-plugins/mention/lib/plugin.css';
import './style.scss';

import {
  EditorState,
  convertToRaw,
  CompositeDecorator,
  convertFromHTML,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin from '@draft-js-plugins/mention';
import { stateToHTML } from 'draft-js-export-html';

// Async call mantions
import api, { setAuthorizationHeader } from 'appAPI/axiosAPI';
import useAsync from 'appHooks/useAsync';

// components
import MentionEntry from 'legacy/components/Comments/MentionEntry';

const searchElemByProps = (item, propsArr, value) => {
  const val = value.toString().toLowerCase();
  for (let i = 0; i < propsArr.length; i++) {
    if (propsArr[i].indexOf('.') != -1) {
      const searchPath = split('.', propsArr[i]);
      if (
        item.hasOwnProperty(searchPath[0]) &&
        item[searchPath[0]] &&
        item[searchPath[0]].hasOwnProperty(searchPath[1]) &&
        item[searchPath[0]][searchPath[1]]
          .toString()
          .toLowerCase()
          .includes(val)
      )
        return item;
    } else if (item.hasOwnProperty(propsArr[i])) {
      const propVal = item[propsArr[i]].toString().toLowerCase();
      const check = propVal.includes(val);
      if (item.hasOwnProperty(propsArr[i]) && check) return item;
    }
  }
};

function MentionEditor({
  isFocus,
  placeholder,
  content,
  postId,
  user,
  actionType,
  onChangeEditor,
  setContent,
  className,
  ...rest
}) {
  const childClassNames = classNames(`mention-editor`, className);
  const { t } = useTranslation();
  // User Authorization
  const local = localStorage.getItem('beemed_user');
  const json = JSON.parse(local);
  setAuthorizationHeader(json.token);

  const { isSuccess, run, data, reset } = useAsync();

  const refEditor = useRef(null);

  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [firsrСircle, setFirsrСircle] = useState([]);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [currentSearch, setCurrentSearch] = useState('');

  const entityHTMLoptions = {
    entityStyleFn: entity => {
      const entityType = entity.get('type').toLowerCase();
      if (entityType === 'mention') {
        const data = entity.getData();
        return {
          element: 'a',
          attributes: {
            id: data?.mention ? data?.mention?._id : data?._id,
            href: data?.mention
              ? `/profile/${data?.mention?._id}`
              : data?.href || data?.url,
          },
          /*  style: {
            color: 'blue',
          }, */
        };
      }
      if (entityType === 'link') {
        const data = entity.getData();
        return {
          element: 'a',
          attributes: {
            id: data?.mention ? data?.mention?._id : data?._id,
            href: data?.mention
              ? `/profile/${data?.mention?._id}`
              : data?.href || data?.url,
          },
        };
      }
    },
  };

  const { MentionSuggestions, plugins } = useMemo(() => {
    const mentionPlugin = createMentionPlugin({
      entityMutability: 'SEGMENTED',
      mentionPrefix: '@',
      supportWhitespace: true,
      mentionComponent(mentionProps) {
        const { className, mention, children, entityKey } = mentionProps;
        return (
          <span
            key={`${mention?._id}-component-${entityKey}`}
            className={`${className} mention-enter-label`}
            // onClick={() => navigate(`/profile/${mention?._id}`)}
          >
            <span>{children}</span>
          </span>
        );
      },
    });

    const { MentionSuggestions } = mentionPlugin;
    const plugins = [mentionPlugin];
    return { MentionSuggestions, plugins };
  }, []);

  const getDecoratorFormPlugins = plugins => {
    const _decorators = plugins.reduce(
      (decoratorArray, { decorators = [] }) => [
        ...decoratorArray,
        ...decorators,
      ],
      [],
    );

    return new CompositeDecorator(_decorators);
  };

  const userCallback = useCallback(
    userInfo => ({
      ...userInfo,
      link: `/profile/${userInfo?._id}`,
    }),
    [],
  );

  const initRequest = {
    user: {
      _id: user?._id,
    },
    postId: postId,
    include: user?.followers,
    exclude: [user?._id],
    value: '',
    limit: 50,
    firstLoad: true,
  };

  useEffect(() => {
    // set content if edit the comment
    if (content && actionType == 'edit') {
      const decorator = getDecoratorFormPlugins(plugins);
      const currentContent = convertFromHTML(content, entityHTMLoptions);
      refEditor && refEditor.current && refEditor.current.focus();
      const editorState = EditorState.createWithContent(
        currentContent,
        decorator,
      );
      if (editorState) {
        setEditorState(editorState);
      }
    } else {
      const focus = setTimeout(() => {
        isFocus &&
          editorState &&
          refEditor &&
          refEditor.current &&
          refEditor.current.focus();
      }, 500);
      return () => {
        clearTimeout(focus);
      };
    }
  }, []);

  // async get mentions list
  useEffect(() => {
    if (isSuccess && data?.data) {
      const optioins = data?.data && data?.data.map(elem => userCallback(elem));
      !currentSearch && setFirsrСircle(optioins);
      setSuggestions(optioins);
    }
  }, [data, isSuccess]);

  const onChange = useCallback(
    _editorState => {
      setEditorState(_editorState);

      const currentContent = _editorState.getCurrentContent();
      const dataToSaveBackend = convertToRaw(currentContent);

      let editorContentHtml = '';

      if (dataToSaveBackend.blocks[0].text) {
        editorContentHtml = stateToHTML(currentContent, entityHTMLoptions);
      }

      if (
        content &&
        actionType == 'edit' &&
        !dataToSaveBackend.blocks[0].text
      ) {
        editorContentHtml = content;
      }

      // console.log({
      //   editorContentHtml,
      //   content,
      //   actionType,
      //   dataToSaveBackend,
      // });
      setContent(editorContentHtml);
      onChangeEditor(editorContentHtml);
    },
    [content, actionType],
  );

  const onOpenChange = useCallback(_open => setOpen(_open), []);

  const focus = e => {
    if (refEditor && refEditor?.current) {
      refEditor.current.focus();
    }
  };

  const onSearchChange = useCallback(
    ({ trigger, value }) => {
      setCurrentSearch(value);

      /*  const isDeleting = currentSearch.length >= value.length;
const isAdd = currentSearch.length < value.length; */

      const mentions = [...new Set([...suggestions, ...firsrСircle])];
      const props = ['description.firstname', 'description.lastname', 'name'];
      const filteredMentions = mentions
        ? mentions.filter(item => searchElemByProps(item, props, value))
        : [];
      setSuggestions(filteredMentions);

      if (value) {
        const request = {
          ...initRequest,
          value: value,
          firstLoad: false,
        };
        run(api.users.fetchAllMentions(request));
      } else {
        // call action for default list of mentions
        run(api.users.fetchAllMentions(initRequest));
      }
    },
    [suggestions, firsrСircle],
  );

  return (
    <div className={childClassNames} onFocus={focus} {...rest}>
      <Editor
        className="mentions-editor"
        placeholder={placeholder || t('common.addComment')}
        editorKey="comment"
        editorState={editorState}
        onChange={onChange}
        plugins={plugins}
        ref={refEditor}
      />
      <MentionSuggestions
        open={open}
        onOpenChange={onOpenChange}
        suggestions={suggestions}
        onSearchChange={onSearchChange}
        entryComponent={props => <MentionEntry {...props} />}
        popoverContainer={({ children }) => (
          <div className="mentions-lists">{children}</div>
        )}
      />
    </div>
  );
}

MentionEditor.defaultProps = {
  actionType: 'post',
};

MentionEditor.propTypes = {
  actionType: PropTypes.oneOf(['post', 'reply', 'edit']),
  user: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
  onChangeEditor: PropTypes.func.isRequired,
};

class MentionEditorComponent extends React.PureComponent {
  componentDidCatch() {
    this.forceUpdate();
  }

  render() {
    return <MentionEditor {...this.props} />;
  }
}

export default MentionEditorComponent;
