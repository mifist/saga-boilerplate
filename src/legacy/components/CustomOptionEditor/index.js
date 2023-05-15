/**
 *
 * CustomOptionEditor
 *
 */

import React, { useEffect, useState } from 'react';

import { EditorState, Modifier, ContentState, convertFromHTML } from 'draft-js';

import { Button, Image, Input, Select, Space } from 'antd';

import {
  PictureOutlined,
  VideoCameraOutlined,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';
import './style.scss';

import iconQuestion from 'images/icons/qcm.svg';

function CustomOptionEditor({
  content,
  type,
  informChangeOption,
  isOptionClosed,
  ...props
}) {
  const [visible, setVisible] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [title, setTitle] = useState('');

  const handleChange = value => {
    setCurrentItem(value);
  };

  useEffect(() => {
    if (isOptionClosed !== type) {
      setVisible(false);
    }
  }, [isOptionClosed]);

  const handleClickLink = clear => {
    // The current editor state. It is an instance of EditorState
    const { editorState, onChange } = props;
    let sampleMarkup = '';
    if (clear) {
      sampleMarkup = `<b><a href="https://${type}.beemed.com/${currentItem}&type=${type}" style="CUSTOMLINK">${title}</a></b>`;
    } else {
      sampleMarkup = `<span>${title}</span>`;
    }

    const blocksFromHTML = convertFromHTML(sampleMarkup);

    const state = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap,
    );

    const contentState = Modifier.replaceWithFragment(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      ).getBlockMap(),
    );

    //  The function can be used to update editor state.
    onChange(EditorState.push(editorState, contentState, 'insert-fragment'));
    setIsShown(false);
    setVisible(false);
  };

  const handleOnHover = item => {
    setCurrentItem(item);
    setIsShown(true);
  };

  const openOptionPanel = () => {
    setVisible(!visible);
    informChangeOption();
    const { editorState, onChange } = props;
    // Get block for current selection
    let selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    //Then based on the docs for SelectionState -
    const start = selection.getStartOffset();
    const end = selection.getEndOffset();
    const selectedText = currentBlock.getText().slice(start, end);
    setTitle(selectedText);
  };

  const renderIconType = () => {
    switch (type) {
      case 'image':
        return <PictureOutlined />;
      case 'document':
        return <FundProjectionScreenOutlined />;
      case 'file':
        return <FundProjectionScreenOutlined />;
      case 'video':
        return <VideoCameraOutlined />;
      case 'question':
        return <img src={iconQuestion} style={{ height: 20, width: 20 }} />;
    }
  };

  return (
    <div>
      <Button
        style={{ marginRight: 5 }}
        icon={renderIconType()}
        onClick={() => openOptionPanel()}
      />
      {visible && (
        <div className={'custom-option-wrapper'}>
          <span>Title</span>
          <Input
            placeholder="Title"
            defaultValue={title}
            onChange={e => setTitle(e.target.value)}
          />
          <span>Link target</span>
          <Select
            className={'custom-select'}
            placeholder={`Select ${type}`}
            style={{ width: 120 }}
            onChange={handleChange}
            optionFilterProp="children"
            getPopupContainer={trigger => trigger.parentElement}
          >
            {content.map((item, index) => {
              return type === 'image' ? (
                <Select.Option
                  onMouseEnter={() => handleOnHover(item)}
                  onMouseLeave={() => setIsShown(false)}
                  value={item}
                >
                  <PictureOutlined style={{ marginRight: 10 }} /> {type}{' '}
                  {index + 1}
                </Select.Option>
              ) : (
                <Select.Option value={item}>
                  <PictureOutlined style={{ marginRight: 10 }} /> {type}{' '}
                  {index + 1}
                </Select.Option>
              );
            })}
          </Select>
          {isShown && (
            <Image className={'current-img'} width={200} src={currentItem} />
          )}
          <Space>
            <Button
              disabled={title.length === 0}
              onClick={() => handleClickLink(true)}
            >
              Link
            </Button>
            <Button onClick={() => handleClickLink(false)}>Unlink</Button>
          </Space>
        </div>
      )}
    </div>
  );
}

export default CustomOptionEditor;
