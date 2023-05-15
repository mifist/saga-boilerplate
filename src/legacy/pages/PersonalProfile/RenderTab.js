/**
 *
 * PersonalProfile
 *
 */

import React, { useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import { useTranslation } from 'react-i18next';

import './style.scss';
// HOC
import withRedux from 'HOC/withRedux';
// actions
import { loadEvents } from './actions';

// antd component
import { Skeleton } from 'antd';
// components
import LinkWrapper from 'legacy/components/LinkWrapper';


function RenderTab({
  // props
  renderTab,
  activeTab,
  url,
  arrayData,
  // default props
  className,
  // core
  state,
  dispatch
}) {
  const { 
    profileData, profileEvents, dataTab,
    loadingTab, tabType,
  } = state.PersonalProfilePage;

  const { t } = useTranslation();

  useEffect(() => {
    if (activeTab == 'events') {
      dispatch(loadEvents());
    }
  }, [activeTab]);

  const renderComments = (array) => {
    if (array.length === 0) {
      return <span className="no-data">No {renderTab} yet</span>;
    }

    return (
      <div>
        {array &&
          array.map((comment) => (
            <div className="profile-small-custom-card" key={comment.post?._id}>
              <span className="profile-comment-type">
                {t('profile.comment')}
              </span>
              <LinkWrapper
                type={comment?.post?.type}
                _id={comment?.post?._id}
                goBackName="profile.backToProfile"
              >
                <span className="profile-comment-title">
                  {comment?.post?.title}
                </span>
                <div
                  className="profile-comment-content"
                  dangerouslySetInnerHTML={{
                    __html: imagelify(comment.content.substring(0, 500)),
                  }}
                />
              </LinkWrapper>
            </div>
          ))}
      </div>
    );
  };

  const imagelify = (text) => {
    // search for http , https , ftp , and file URLs.
    const test1 = text.replace(
      new RegExp('<a href="https://image.beemed.com/', 'g'),
      `<a class="custom-link custom-document" ref="preview" data-preview="?preview=`,
      true,
    );
    const test2 = test1.replace(
      new RegExp(`<a href="https://video.beemed.com/`, 'g'),
      `<a class="custom-link custom-document" ref="preview" data-preview="?preview=`,
    );
    const test3 = test2.replace(
      new RegExp(`<a href="https://document.beemed.com/`, 'g'),
      `<a class="custom-link custom-document" ref="preview"  data-preview="?preview=`,
    );

    return test3;
  };

  const renderPost = ({ title, content, _id, type }) => (
    <div className="profile-small-custom-card">
      {type === 'case' ? (
        <>
          <span className="profile-comment-type">{t(`common.${type}`)}</span>
          <LinkWrapper type={url} _id={_id} goBackName="profile.backToProfile">
            <span className="profile-comment-title">{title}</span>
          </LinkWrapper>
          <span
            className="profile-comment-content"
            dangerouslySetInnerHTML={{
              __html: imagelify(`${content.substring(0, 200)}...`),
            }}
          />
        </>
      ) : (
        <LinkWrapper type={url} _id={_id} goBackName="profile.backToProfile">
          <span className="profile-comment-type">{t(`common.${type}`)}</span>
          <span
            className="profile-comment-content"
            dangerouslySetInnerHTML={{
              __html: imagelify(`${content.substring(0, 200)}...`),
            }}
          />
        </LinkWrapper>
      )}
    </div>
  );

  const renderPostsCases = (array) => {
    if (!array || array.length == 0) {
      return <span className="no-data">No {renderTab} yet</span>;
    }

    return array?.map((i) => renderPost(i));
  };

  const renderEvents = () => {
    if (!profileEvents || profileEvents.length == 0) {
      return <span className="no-data">No {renderTab} yet</span>;
    }
    return (
      <div>
        {profileEvents?.map((event) => (
          <div className="profile-small-custom-card">
            <span className="profile-comment-type">
              {t('profile.event')} - {event?.econgress?.date_from}
            </span>
            <LinkWrapper
              type={url}
              _id={event?.econgress?.id}
              goBackName="profile.backToProfile"
            >
              <span className="profile-comment-title">
                {event?.econgress?.name}
              </span>
            </LinkWrapper>
            <span className="profile-comment-content">
              {event?.econgress?.subtype}
            </span>
          </div>
        ))}
      </div>
    );
  };

  /*   const renderFollowers = () => (
    <div>
      <p>renderFollowers</p>
    </div>
  ); */

  const renderBookmark = (bookmark) => {
    const { type, title, content, _id, community } = bookmark;

    return (
      <LinkWrapper type={type} _id={_id} goBackName="profile.backToProfile">
        <div className="profile-small-custom-card">
          <span className="profile-comment-type">
            {t(`common.${type}`)}{' '}
            {community && `- ${t('communities.community')}`}
          </span>
          <span className="profile-comment-title">{title}</span>
          <span
            className="profile-comment-content"
            dangerouslySetInnerHTML={{
              __html: imagelify(`${content.substring(0, 200)}...`),
            }}
          />
        </div>
      </LinkWrapper>
    );
  };

  const renderBookmarks = (array) => {
    if (!array || array.length === 0) {
      return <span className="no-data">No {renderTab} yet</span>;
    }

    return array?.map((i) => renderBookmark(i));
  };

  if (loadingTab || profileData?.loading) {
    return <Skeleton active />;
  }

  switch (activeTab) {
    case 'comments':
      return renderComments(arrayData);
    case 'posts':
    case 'cases':
      return renderPostsCases(arrayData);
    case 'bookmarks':
      return renderBookmarks(arrayData);
    case 'events':
      return renderEvents();
    default:
      return <Skeleton active />;
  }
}

export default compose(withRedux)(RenderTab);
