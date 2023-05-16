import lexicalTheme from './theme';
import React, { memo, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import './style.scss';

// lexical import
import { $getRoot, $getSelection } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';

import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { EditorState } from 'lexical';

// end of lexical import

// import iconImage from 'images/icons/image.svg';
// import iconQuestion from 'images/icons/qcm.svg';
// import iconVideo from 'images/icons/video.svg';
// import iconDocument from 'images/icons/document.svg';
// import iconOrderList from 'images/icons/ordered-list.svg';
// import iconLink from 'images/icons/link.svg';
import linkifyHtml from 'linkify-html';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import { MentionNode } from './nodes/MentionNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { compose } from '@reduxjs/toolkit';
import { withUser } from 'appContext/User.context';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';

const defaultValue = '';
function LexicalEditor({
  pictures,
  documents,
  files,
  placeholder,
  questions,
  videos,
  content = defaultValue,
  handleChange,
  type,
  contentType,
  contentIndex,
  user,
  mention = false,
  postId,
  ...rest
}) {
  const { t } = useTranslation();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const Placeholder = (content) => {
    return <div className="editor-placeholder">{content?.content}</div>;
  };
  const editorConfig = {
    // The editor theme
    theme: lexicalTheme,
    // editorState: initialEditorState,
    // Handling of errors during update
    onError(error) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
      MentionNode,
    ],
  };

  // When the editor changes, you can get notified via the onChange prop.
  // This plugin will call the onChange function with the new editorState
  // and the editor instance itself as arguments (see below)
  const onChange = (editorState, editor) => {
    editorState.read(() => {
      const html = $generateHtmlFromNodes(editor, null);
      handleChange(html);
    });
  };

  // this is the plugin that will be used to update the content of the editor
  // when the content prop changes
  // it will be called only once, on the first render
  // it will insert the content prop into the editor
  const HtmlPlugin = () => {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
      if (isFirstRender) {
        setIsFirstRender(false);
        // console.debug('1. first render', content);

        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(content, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          $getRoot().select();
          const selection = $getSelection();
          // !TODO - COMMENTED THIS LINE TO RUN the project - @ts-expect-error not sure...
          // selection.insertNodes(nodes);
        });
      }
      // console.log('editor', editor);
    }, []);
    return <></>;
  };

  // main component
  return (
    <LexicalComposer initialConfig={editorConfig}>
      {type === 'comment' ? (
        <div className="editor-container editor-container-comment">
          <div className="editor-inner-simple">
            <PlainTextPlugin
              contentEditable={<ContentEditable />}
              placeholder={
                placeholder !== false ? (
                  <Placeholder
                    content={
                      placeholder ||
                      t(`common.editorPlaceholder-${contentType}`)
                    }
                  />
                ) : (
                  ''
                )
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={onChange} />
            <HtmlPlugin onChange={onChange} />
            {mention && postId && (
              <MentionsPlugin currentUser={user} postId={postId} />
            )}
            <HistoryPlugin />
            <AutoLinkPlugin />
          </div>
        </div>
      ) : (
        <div className="editor-container">
          <ToolbarPlugin options={''} />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={
                <Placeholder
                  content={
                    placeholder || t(`common.editorPlaceholder-${contentType}`)
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={onChange} />
            <HtmlPlugin onChange={onChange} />
            <HistoryPlugin />
            <AutoLinkPlugin />
            <ListMaxIndentLevelPlugin />
            <ListPlugin />
            <LinkPlugin />
            {mention && <MentionsPlugin currentUser={user} />}
          </div>
        </div>
      )}
    </LexicalComposer>
  );
}

LexicalEditor.defaultProps = {
  type: 'simple',
  contentType: 'text',
  placeholder: '',
};
LexicalEditor.propTypes = {
  type: PropTypes.oneOf(['simple', 'full']),
};

export default compose(memo, withUser)(LexicalEditor);
