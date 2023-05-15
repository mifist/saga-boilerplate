import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import './style.scss';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from 'draft-js';
import CustomOptionEditor from 'legacy/components/CustomOptionEditor';

import draftToHtml from 'draftjs-to-html';

import iconImage from 'images/icons/image.svg';
import iconQuestion from 'images/icons/qcm.svg';
import iconVideo from 'images/icons/video.svg';
import iconDocument from 'images/icons/document.svg';
import iconOrderList from 'images/icons/ordered-list.svg';
import iconLink from 'images/icons/link.svg';
import linkifyHtml from 'linkify-html';

function RichEditorDescription({
  pictures,
  documents,
  files,
  placeholder,
  questions,
  videos,
  content,
  handleChange,
  type,
  contentType,
  contentIndex,
  ...rest
}) {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [isOptionClosed, setIsOptionClosed] = useState('image');
  const [currentOption, setCurrentOption] = useState('');

  // Clearing the state after unmounting a component
  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(content)),
      ),
    );
  }, []);

  // this useEffect only for edit rules in community
  useEffect(() => {
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromBlockArray(convertFromHTML(content)),
      ),
    );
  }, [contentIndex]);

  const styleMap = {
    CUSTOMLINK: {
      textDecoration: 'line-through',
      backgroundColor: '#faed27',
    },
  };

  const modifyLinkContent = content => {
    const options = {
      defaultProtocol: 'https',
      //target: '_blank'
    };
    return linkifyHtml(content, options);
  };

  const onEditorStateChange = editorState => {
    setEditorState(editorState);
    const currentEditorContent = editorState.getCurrentContent();
    let content = draftToHtml(convertToRaw(currentEditorContent));
    //console.log(content);
    let updatedContent = modifyLinkContent(content);

    //console.log(updatedContent);
    handleChange(updatedContent);
  };

  const imagelify = text => {
    // search for http , https , ftp , and file URLs.

    const test1 = text.replace(
      `<a href="https://image.beemed.com/`,
      `<img class="miniature" src="${iconImage}" /><a class="custom-link custom-image" href="?preview=`,
    );
    const test2 = test1.replace(
      `<a href="https://video.beemed.com/`,
      `<img class="miniature" src="${iconVideo}" /><a class="custom-link custom-video" href="?preview=`,
    );
    const test3 = test2.replace(
      `<a href="https://document.beemed.com/`,
      `<img class="miniature" src="${iconDocument}" /><a class="custom-link custom-document" href="?preview=`,
    );
    const test4 = test3.replace(
      `<a href="https://question.beemed.com/`,
      `<img class="miniature" src="${iconQuestion}" /><a class="custom-link custom-question" href="?preview=`,
    );

    return test4;
  };

  const formatLink = obj => {
    try {
      if (obj.target.includes('https://beta.beemed.com/')) {
        obj.targetOption = '_self';
        const newTarget = obj.target.replace('https://beta.beemed.com/', '/');
        obj.target = newTarget;
      }
      if (obj.target.includes('https://app.beemed.com/')) {
        obj.targetOption = '_self';
        const newTarget = obj.target.replace('https://app.beemed.com/', '/');
        obj.target = newTarget;
      }
      //console.log(obj);
      return obj;
    } catch (e) {
      return obj;
    }
  };

  return (
    <Editor
      {...rest}
      editorState={editorState}
      stripPastedStyles={true}
      onEditorStateChange={onEditorStateChange}
      placeholder={placeholder || t(`common.editorPlaceholder-${contentType}`)}
      toolbarClassName="toolbarClassName"
      wrapperClassName={classNames(
        'wrapperClassName',
        focused && 'rdw-editor-wrapper--focused',
        rest.wrapperClassName,
      )}
      editorClassName="custom-editor"
      toolbar={{
        options: ['inline', 'list', 'link', 'history'],
        inline: {
          options: ['bold', 'italic', 'underline'],
        },
        list: {
          options: ['unordered', 'ordered'],
          ordered: { icon: iconOrderList, className: 'option-icon' },
          // ordered: { icon: <OrderedListOutlined /> },
        },
        link: {
          // className: undefined,
          popupClassName: 'link-popup',
          // dropdownClassName: undefined,
          showOpenOptionOnHover: false,
          defaultTargetOption: '_blank',
          options: ['link'], //'unlink'
          link: { icon: iconLink, className: 'option-icon', title: 'test' },
          // unlink: { icon: unlink, className: undefined },
          linkCallback: obj => formatLink(obj),
        },
      }}
      customStyleMap={styleMap}
      toolbarCustomButtons={
        type === 'full' && [
          <CustomOptionEditor
            isOptionClosed={isOptionClosed === 'image'}
            informChangeOption={() => setIsOptionClosed('image')}
            type="image"
            content={pictures}
          />,
          <CustomOptionEditor
            isOptionClosed={isOptionClosed}
            informChangeOption={() => setIsOptionClosed('video')}
            type="video"
            content={videos}
          />,
          <CustomOptionEditor
            isOptionClosed={isOptionClosed}
            informChangeOption={() => setIsOptionClosed('document')}
            type="document"
            content={documents}
          />,
          // <CustomOptionEditor
          //   isOptionClosed={isOptionClosed}
          //   informChangeOption={() => setIsOptionClosed('file')}
          //   type="file"
          //   content={files}
          // />,
          // <CustomOptionEditor type={'question'} content={questions} />,
        ]
      }
      onFocus={e => {
        setFocused(true);
        rest.onFocus && rest.onFocus(e);
      }}
      onBlur={e => {
        setFocused(false);
        rest.onBlur && rest.onBlur(e);
      }}
    />
  );
}

RichEditorDescription.defaultProps = {
  type: 'simple',
  contentType: 'text',
  placeholder: '',
};
RichEditorDescription.propTypes = {
  type: PropTypes.oneOf(['simple', 'full']),
};

export default RichEditorDescription;
