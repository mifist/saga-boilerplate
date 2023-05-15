/**
 *
 * NewsFeedPost
 *
 */

import React, { memo } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

// styles
import './style.scss';

// antd component
import { Button, Card, Col, Image, Row, Space, Tag } from 'antd';

// assets
import { CalendarOutlined, FilePdfOutlined } from '@ant-design/icons';
import defaultPodcastImage from 'images/podcast.jpg';
import iconImage from 'images/icons/image.svg';
import iconQuestion from 'images/icons/qcm.svg';
import iconVideo from 'images/icons/video.svg';
import iconDocument from 'images/icons/document.svg';

// components
import OverViewComments from 'legacy/components/Comments/OverViewComments';
import BookmarkAction from 'legacy/components/BookmarkAction';
import LinkWrapper from 'legacy/components/LinkWrapper';
import MediaPlayer from 'legacy/components/MediaPlayer';
import CustomIcons from 'legacy/components/CustomIcons';
import UserAvatar from 'legacy/components/UserAvatar';
import ReadMore from 'legacy/components/ReadMore';
import PostTabs from 'legacy/components/PostTabs';
import ConditionalLink from 'legacy/components/ConditionalLink';
import VideoPlayer from 'legacy/components/VideoPlayer';
import Badge from 'legacy/components/Badge';

// context
import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

// helper
import { PROXY_API_URL } from 'utils/constants';
import { Capacitor } from '@capacitor/core';
import ErrorBoundary from '../ErrorBoundary';
import GalleryPDF from '../GalleryPDF';
import { getObjId } from 'utils/generalHelper';
import { getEmployment } from 'utils/generalHelper';

class NewsFeedPost extends React.Component {
  // Control render manually
  shouldComponentUpdate(nextProps) {
    const { likes, user, type } = this.props;

    if (type === 'event') {
      return (
        nextProps.user.bookmarksEvents.length !== user.bookmarksEvents.length ||
        nextProps.likes.length !== likes.length ||
        nextProps.lang !== this.props.lang
      );
    }

    if (type !== 'event') {
      return (
        nextProps.user.bookmarks.length !== user.bookmarks.length ||
        nextProps.likes.length !== likes.length ||
        nextProps.lang !== this.props.lang
      );
    }
  }

  render() {
    const {
      author,
      _id,
      title,
      likes,
      speciality,
      name,
      anatomy,
      type,
      digest,
      community,
      url,
      videos,
      audio,
      documents,
      content,
      image_url,
      listing_image_url,
      pictures,
      start_time,
      date_from,
      date_creation,
      econgress_video_type,
      user,
      event_type,
      id,
      tags,
      setAuthPopup,
      t,
    } = this.props;

    const goBackName = 'common.backToFeed';

    const typeLike = this.props.typeLike ? this.props.typeLike : 'post';
    const isCommunity =
      this.props.community !== undefined && this.props.community;
    let isIndustry = false;
    let communityName;

    if (isCommunity) {
      if (typeof this.props.community === 'object') {
        communityName = this.props.community?.title;
        isIndustry =
          this.props.community !== undefined &&
          this.props.community.private == 'industry';
      } else {
        communityName =
          this.props.communityName && this.props.communityName[0]?.title;
        isIndustry =
          this.props.communityName &&
          this.props.communityName[0]?.private == 'industry';
      }
    }

    const childClassNames = classNames(
      'newsfeed-post-card',
      this.props.className,
    );

    // trick for add event id
    const post = { ...this.props };
    if (type === 'event') {
      post._id = this.props.id;
    }

    const renderType = () => {
      let typeString = '';
      switch (type) {
        case 'case':
          typeString = t('common.cases');
          break;
        case 'event':
          typeString = t('common.events');
          break;
        case 'podcast':
          typeString = t('common.podcasts');
          break;
        case 'article':
          typeString = t('common.articles');
          break;
      }

      return (
        <>
          {isCommunity && (
            <LinkWrapper
              type={'detail-community'}
              isCommunity={community}
              style={{ display: 'inline-block' }}
              extraParams={{ from: 'newsfeed_post' }}
            >
              <Tag
                className={`tag type-tag tag--type tag-speciality ${
                  isCommunity ? 'community-tag' : ''
                } ${isIndustry ? 'industry-tag' : ''}`}
              >
                {communityName || t('communities.community')}
              </Tag>
            </LinkWrapper>
          )}
          <LinkWrapper
            type={type}
            isCommunity={community}
            style={{ display: 'inline-block' }}
            extraParams={{ from: 'newsfeed_post' }}
          >
            {type !== 'post' ? (
              <Tag
                // key={`tag-speciality_${type}`}
                className={`tag type-tag tag--type tag-speciality `}
              >
                {type === 'case' && <CustomIcons type="casestudy" />}
                {type === 'event' && <CustomIcons type="event" />}
                {type === 'article' && <CustomIcons type="document" />}
                {type === 'podcast' && <CustomIcons type="microphone" />}
                {typeString}
              </Tag>
            ) : null}
          </LinkWrapper>
        </>
      );
    };

    const renderSpecialty = speciality => (
      <>
        {speciality.map(tag => (
          <Tag className="tag tag--speciality">
            {t(`common.specialities-${camelCase(tag)}`)}
          </Tag>
        ))}
      </>
    );

    const renderAnatomy = anatomy => (
      <>
        {anatomy.map((tag, index) => (
          <Tag className="tag tag--anatomy" key={index}>
            {t(`common.anatomies-${camelCase(tag)}`)}
          </Tag>
        ))}
      </>
    );

    const renderPostTags = tags =>
      tags && (
        <>
          {tags.map((tag, index) => (
            <Tag className="tag tag--tag" key={index}>
              {tag?.label}
            </Tag>
          ))}
        </>
      );

    const renderTags = () => (
      <div className="post-feed--tags">
        {renderType()}
        {renderSpecialty(speciality)}
        {renderAnatomy(anatomy)}
        {renderPostTags(tags)}
      </div>
    );

    // Article Time creation output
    const timeCreation = timeString => {
      return (
        timeString && (
          <span className="article-time-creation">
            <span>{moment(timeString).fromNow()}</span>
          </span>
        )
      );
    };

    const headerRender = () => (
      <>
        {/* <div className="newsfeed-post-card__sub-content"> */}
        {/*  Peter and 3 other connections have commented on this post */}
        {/* </div> */}
        <div className="newsfeed-post-card__sub-content">
          {author &&
            author.map(auth => {
              const isIndustryUser = auth?.role == 'industry';
              const { isEmployee, industryName } = getEmployment(auth);

              return (
                <div className="newsfeed-post-card__sub-content--author">
                  <ConditionalLink
                    condition={
                      user?._id &&
                      (user?.role !== 'industry' || auth?.role !== 'industry')
                    }
                    to={{
                      pathname:
                        auth.role === 'industry' && auth.employment
                          ? `/community/detail/${getObjId(
                              auth.employment.industryCommunity[0],
                            )}`
                          : `/profile/${auth._id}`,
                      state: { from: 'newsfeed_post' },
                    }}
                    key={`profile-link${auth._id}`}
                    onClick={() => setAuthPopup({ open: true })}
                  >
                    <Space>
                      {type !== 'event' && (
                        <UserAvatar
                          fontSize={12}
                          user={auth}
                          width={32}
                          height={32}
                        />
                      )}
                      <span className={'owner_post'}>
                        {auth?.description?.firstname}{' '}
                        {auth?.description?.lastname}
                      </span>
                      {isIndustryUser && (
                        <span className="members-badge industry">
                          {t('communities.community-industryPartner')}
                        </span>
                      )}
                    </Space>
                  </ConditionalLink>
                  {isEmployee && (
                    <Badge
                      title={t('communities.employeeOf', { industryName })}
                    />
                  )}
                </div>
              );
            })}

          <span>
            {date_from !== undefined
              ? timeCreation(date_from)
              : timeCreation(date_creation)}
          </span>
        </div>
      </>
    );

    const articleRender = () => (
      <div className="post-feed article">
        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <h3 className="post-feed__title">{title}</h3>
        </LinkWrapper>

        {renderTags()}
        <ReadMore
          className="article-content-html"
          children={content}
          length={300}
        />

        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <Button type="default" className="bm-btn-default" href={digest}>
            {t('articles.fullArticle')}
          </Button>
        </LinkWrapper>
      </div>
    );

    const podcastRender = () => (
      <div className="post-feed podcast">
        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <h3 className="post-feed__title">{title}</h3>
        </LinkWrapper>
        {renderTags()}
        <ReadMore
          className="article-content-html"
          children={content}
          length={300}
        />
        <div className="article-pictures podcast-item">
          {pictures.length === 0 ? (
            <Image
              className="podcast-image"
              width={260}
              alt={title}
              src={defaultPodcastImage}
              preview={false}
            />
          ) : (
            <Image
              className="podcast-image"
              width={260}
              alt={title}
              src={pictures}
              preview={false}
            />
          )}
        </div>
        {audio && <MediaPlayer type="feed" url={audio} date={date_creation} />}
      </div>
    );

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

    const caseRender = () => (
      <div className="post-feed case">
        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <h3 className="post-feed__title">{title}</h3>
        </LinkWrapper>

        {renderTags()}

        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <ReadMore
            className="article-content-html"
            children={imagelify(content)}
            length={300}
          />
        </LinkWrapper>
        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <div className="article-pictures">
            {pictures.slice(0, 1).map((image, index) => (
              <Image
                key={`${_id}_image`}
                // key={index}
                className="pictures-gallery"
                width={'100%'}
                src={image}
                preview={false}
              />
            ))}
          </div>
          {videos !== null &&
          videos !== undefined &&
          videos.length > 0 &&
          pictures.length === 0 ? (
            <VideoPlayer url={videos[0]} />
          ) : null}
          {videos?.length === 0 &&
          pictures.length === 0 &&
          documents.length > 0 &&
          documents !== null &&
          documents !== undefined ? (
            <div>
              {Capacitor.platform !== 'ios' ? (
                <ErrorBoundary>
                  <GalleryPDF
                    noGallery={true}
                    content={documents || []}
                    selectionItem={documents[0]}
                  />
                </ErrorBoundary>
              ) : (
                <div>{renderListDocument(documents)}</div>
              )}
            </div>
          ) : null}
        </LinkWrapper>
      </div>
    );

    const imagelify = text => {
      // search for http , https , ftp , and file URLs.
      let test1 = text.replace(
        new RegExp('<a href="https://image.beemed.com/', 'g'),
        `<img class="miniature" src="${iconImage}" /><a class="custom-link custom-image" ref="preview" href='#' data-preview="?preview=`,
        true,
      );
      let test2 = test1.replace(
        new RegExp(`<a href="https://video.beemed.com/`, 'g'),
        `<img class="miniature" src="${iconVideo}" /><a class="custom-link custom-video" ref="preview" href='#' data-preview="?preview=`,
      );
      let test3 = test2.replace(
        new RegExp(`<a href="https://document.beemed.com/`, 'g'),
        `<img class="miniature" src="${iconDocument}" /><a class="custom-link custom-document" ref="preview" href='#' data-preview="?preview=`,
      );
      // let test4 = test3.replace(
      //   `<a href="https://question.beemed.com/`,
      //   `<img class="miniature" src="${iconQuestion}" /><a class="custom-link custom-question" href='#' data="?preview=`,
      // );
      return test3;
    };

    const generateSharelinks = text => {
      // search for http , https , ftp , and file URLs.
      const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

      const urls = text.match(urlRegex); // array
      if (urls !== null && urls.length > 0) {
        const uniqueUrls = [...new Set(urls)];
        return uniqueUrls.map((link, inx) => (
          <></>
          // <ReactTinyLink
          //   key={`sharelink-${inx}`}
          //   cardSize="small"
          //   showGraphic={true}
          //   maxLine={2}
          //   minLine={1}
          //   url={link}
          //   proxyUrl={PROXY_API_URL}
          //   style={{ marginBottom: '15px' }}
          // />
        ));
      }
      return '';
    };

    const postRender = () => (
      <div className="post-feed post">
        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <h3 className="post-feed__title">{title}</h3>
        </LinkWrapper>
        {renderTags()}

        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <ReadMore
            className="article-content-html"
            children={imagelify(content)}
            length={300}
          />
        </LinkWrapper>
        <LinkWrapper
          _id={_id}
          type={type}
          goBackName={goBackName}
          extraParams={{ from: 'newsfeed_post' }}
        >
          <div className="article-pictures">
            {pictures.slice(0, 1).map((image, index) => (
              <Image
                key={`${_id}_image`}
                // key={index}
                className="pictures-gallery"
                width={260}
                src={image}
                preview={false}
              />
            ))}
          </div>

          {videos !== null &&
          videos !== undefined &&
          videos.length > 0 &&
          pictures.length === 0 ? (
            <VideoPlayer url={videos[0]} />
          ) : null}
          {videos?.length === 0 &&
          pictures.length === 0 &&
          documents.length > 0 &&
          documents !== null &&
          documents !== undefined ? (
            <div>
              {Capacitor.platform !== 'ios' ? (
                <ErrorBoundary>
                  <GalleryPDF
                    noGallery={true}
                    content={documents || []}
                    selectionItem={documents[0]}
                  />
                </ErrorBoundary>
              ) : (
                <div>{renderListDocument(documents)}</div>
              )}
            </div>
          ) : null}
        </LinkWrapper>
      </div>
    );

    const eventRender = () => (
      <div className="event-feed">
        {(listing_image_url || image_url) && (
          <Image
            src={listing_image_url || image_url}
            className="event-feed__banner"
            preview={false}
          />
        )}
        {/* {renderType()} */}
        {/* {renderSpecialty(speciality)} */}
        {/* {renderAnatomy(anatomy)} */}
        <Row>
          <Col
            className="event-feed__date"
            xs={24}
            sm={4}
            md={6}
            lg={4}
            style={{ padding: 10 }}
          >
            <CalendarOutlined className="event-feed__date-icon" />
            <h3 className="event-feed__date-title">
              <span className="Do">{moment(date_from).format('Do')}</span>
              <span className="MM">{moment(date_from).format('MMM')}</span>
            </h3>
          </Col>
          <Col xs={24} sm={20} md={18} lg={20}>
            <h4 className="event-feed__title">
              {start_time === null
                ? moment(date_from).format('LL')
                : moment(`${date_from} ${start_time}`).format('LLLL')}
            </h4>
            <LinkWrapper
              _id={id}
              type={type}
              goBackName={goBackName}
              extraParams={{ from: 'newsfeed_post' }}
            >
              <h3 className="event-feed__subtitle">{name}</h3>
            </LinkWrapper>
            <Space
              style={{ width: '100%' }}
              className="button-row event-feed__button-row"
            >
              {econgress_video_type === 'live' ||
              econgress_video_type === 'live-spot' ? (
                <Button
                  type="primary"
                  className="event_detail_button_register"
                  size="large"
                  href={`https://beemed.com/econgresses/${id}?register=1`}
                  target="_blank"
                >
                  {t('events.register')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  className="event_detail_button_register"
                  size="large"
                  href={`https://beemed.com/econgresses/${id}/replay`}
                  target="_blank"
                >
                  {t('events.watchReplay')}
                </Button>
              )}
              <BookmarkAction
                key={`postfeed${_id}${type}`}
                _id={id}
                typeBookMark={type}
                className="icon_overview_comments"
                type="button"
              />
            </Space>
          </Col>
        </Row>
      </div>
    );

    const BodyRender = type => {
      switch (type) {
        case 'article':
          return articleRender();
        case 'post':
          return postRender();
        case 'event':
          return eventRender();
        case 'case':
          return caseRender();
        case 'podcast':
          return podcastRender();
      }
    };

    return (
      <Card
        id={this.props.id}
        key={this.props.key - 'kard'}
        className={childClassNames}
        bordered
        bodyStyle={{
          padding: '0',
        }}
      >
        {headerRender()}
        <div className={`newsfeed-post-card__main-content ${type}`}>
          {BodyRender(type)}
        </div>
        <OverViewComments
          key={this.props.key + '-comment-feed'}
          post={post}
          communityName={communityName}
          typeLike={typeLike}
          from="newsfeed_post"
        />
      </Card>
    );
  }
}

NewsFeedPost.defaultProps = {};
NewsFeedPost.propTypes = {
  type: PropTypes.string,
};

export default memo(withUser(withAuthPopup(withTranslation()(NewsFeedPost))));
