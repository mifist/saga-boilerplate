/**
 *
 * PostTabs
 *
 */

import React, { memo, useEffect, useState, useRef } from 'react';
import { Capacitor } from '@capacitor/core';
import { Space, Tabs, List } from 'antd';
import { useTranslation } from 'react-i18next';

import './style.scss';

import MCQsComponents from 'legacy/components/MCQs/MCQsComponents';
import GalleryVideo from '../GalleryVideo';
import GalleryImage from '../GalleryImage';
import GalleryPDF from '../GalleryPDF';
import useDeviceDetect from 'appHooks/useDeviceDetect';
import ErrorBoundary from '../ErrorBoundary';

import {
  FileExcelOutlined,
  FileImageOutlined,
  FileOutlined,
  FilePdfOutlined,
  FileWordOutlined,
} from '@ant-design/icons';

function PostTabs({ content, tabSelection }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('tab-image');
  const [selectionItem, setSelectionItem] = useState({
    type: null,
    url: null,
  });

  const refPostTabs = useRef(null);

  const { isMobile } = useDeviceDetect();

  const changeTab = key => {
    setActiveTab(key);
  };

  useEffect(() => {
    if (tabSelection?.type && tabSelection?.url) {
      setActiveTab(`tab-${tabSelection?.type}`);
      setSelectionItem(tabSelection?.url);
      /*   if (refPostTabs?.current) {
        const currentTargetBody = document.querySelector(
          '.app-main-layout > .ant-layout.layout',
        );
        const value = refPostTabs?.current.offsetTop || 0
        currentTargetBody.scrollTo({
          top: value + 45,
          behavior: 'smooth',
        });
      }  */
    }
  }, [tabSelection]);

  useEffect(() => {
    if (content?.pictures.length === 0) {
      if (content?.pictures.length) {
        setActiveTab('tab-image');
      } else if (content?.videos.length > 0) {
        setActiveTab('tab-video');
      } else if (content?.documents.length > 0) {
        setActiveTab('tab-document');
      } else if (content?.questions.length > 0) {
        setActiveTab('tab-question');
      } else if (content?.files.length > 0) {
        setActiveTab('tab-files');
      }
      // if (content?.questions.length > 0) {
      //   setActiveTab('tab-question');
      // }
    }

    // document.onkeydown = checkKey;
  }, []);

  const renderListDocument = array => {
    return array.map((item, i) => {
      return (
        <div>
          <a href={item} target={'_blank'} style={{ fontSize: 18 }}>
            <Space size={'small'}>
              <FilePdfOutlined style={{ fontSize: 24, color: 'black' }} />
              <h4 />
              {t('common.document', { number: i + 1 })}
            </Space>
          </a>
        </div>
      );
    });
  };

  const renderIconType = item => {
    const styles = { fontSize: 25, color: '#005d72' };
    const ext = item.split('.')[item.split('.').length - 1];

    switch (ext) {
      case 'jpg':
        return <FileImageOutlined style={styles} />;
      case 'jpeg':
        return <FileImageOutlined style={styles} />;
      case 'png':
        return <FileImageOutlined style={styles} />;
      case 'pdf':
        return <FilePdfOutlined style={styles} />;
      case 'doc':
        return <FileWordOutlined style={styles} />;
      case 'docx':
        return <FileWordOutlined style={styles} />;
      case 'xls':
        return <FileExcelOutlined style={styles} />;
      case 'xlsx':
        return <FileExcelOutlined style={styles} />;
      default:
        return <FileOutlined style={styles} />;
    }
  };

  return (
    <div id="preview" className="post-tabs-wrapper" ref={refPostTabs}>
      {content?.videos &&
      content?.videos.filter(n => n).length === 0 &&
      content?.pictures &&
      content?.pictures.length === 0 &&
      content?.documents &&
      content?.documents.length === 0 &&
      content?.questions &&
      content?.questions.length === 0 &&
      content?.files &&
      content?.files.length === 0 ? null : ( // content?.questions.length === 0
        <Tabs
          type="card"
          className="tab-wrapper"
          tabBarGutter={4}
          onTabClick={changeTab}
          activeKey={activeTab}
          defaultActiveKey={activeTab}
        >
          <Tabs.TabPane
            tab={
              t(`cases.${isMobile ? 'pic' : 'images'}`) +
              ` (${content.pictures ? content.pictures.length : 0})`
            }
            key="tab-image"
            disabled={!content.pictures || content?.pictures.length === 0}
          >
            <GalleryImage
              content={content.pictures || []}
              selectionItem={selectionItem}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={
              t(`cases.${isMobile ? 'vid' : 'videos'}`) +
              ` (${content.videos ? content.videos.filter(n => n).length : 0})`
            }
            key="tab-video"
            disabled={!content.videos || content?.videos.length === 0}
          >
            <GalleryVideo
              content={content.videos || []}
              selectionItem={selectionItem}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${t('cases.mcq')} (${
              content.questions ? content.questions.length : 0
            })`}
            key="tab-question"
            disabled={!content?.questions || content?.questions.length === 0}
          >
            <MCQsComponents
              quizQuestionsList={content.questions || []}
              selectionItem={selectionItem}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${t('cases.pdf')} (${
              content.documents ? content.documents.length : 0
            })`}
            key="tab-document"
            disabled={!content?.documents || content?.documents.length === 0}
          >
            {Capacitor.platform !== 'ios' ? (
              <ErrorBoundary>
                <GalleryPDF
                  content={content.documents || []}
                  selectionItem={selectionItem}
                />
              </ErrorBoundary>
            ) : (
              <div>{renderListDocument(content.documents)}</div>
            )}
            <div />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${t('cases.files')} (${
              content.files ? content.files.length : 0
            })`}
            key="tab-files"
            disabled={!content?.files || content?.files.length === 0}
          >
            {content?.files && content?.files.length > 0 && (
              <List
                size="small"
                bordered
                dataSource={content.files}
                renderItem={(item, index) => (
                  <List.Item>
                    <a
                      href={item}
                      download
                      target={'_blank'}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <span>{t('common.file', { number: index + 1 })}</span>
                      {renderIconType(item)}
                    </a>
                  </List.Item>
                )}
              />
            )}
          </Tabs.TabPane>
        </Tabs>
      )}
    </div>
  );
}

PostTabs.propTypes = {};

export default memo(PostTabs);
