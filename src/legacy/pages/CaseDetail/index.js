import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import camelCase from 'lodash/camelCase';
import { withUser } from 'engine/context/User.context';
import './style.scss';

import {
  flushState,
  loadCase,
  onDelete,
  updateCase,
  pinUnpinPost,
  loadCommunityTags,
  hideUnhidePost,
} from './actions';

// assets
import CustomIcons from 'legacy/components/CustomIcons';
import iconImage from 'public/images/icons/image.svg';
import iconVideo from 'public/images/icons/video.svg';
import iconDocument from 'public/images/icons/document.svg';

// antd component
import { Col, Empty, Layout, Row, Space, Spin, Tag } from 'antd';
// components
import CommentsOverview from 'legacy/containers/CommentsOverview';
import GoBackButton from 'legacy/components/GoBackButton';
import CreatePublicationv2 from 'legacy/components/CreatePublicationv2';
import UserAvatar from 'legacy/components/UserAvatar';
import PostTabs from 'legacy/components/PostTabs';
import ConditionalLink from 'legacy/components/ConditionalLink';
import LinkWrapper from 'legacy/components/LinkWrapper';
import Badge from 'legacy/components/Badge';

// utils
import { getEmployment, getObjId } from 'utils/generalHelper';

export function CaseDetail({ history, user, setAuthPopup }) {
  const {
    caseData: { data: caseData },
    loading,
    deleteSuccessful,
    error,
    tags,
  } = useSelector((state) => {
    return state.CaseDetail;
  });
  //console.log(caseData);
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const { id: initialId } = useParams();

  const [tabSelection, setTabSelection] = useState({
    type: null,
    url: null,
  });
  const [htmlReady, setHtmlReady] = useState(false);

  useEffect(() => {
    if (error.message == 'Unauthorized') {
      navigate('/case');
    }
  }, [error]);

  // Redirect on successful post deletion
  useEffect(() => {
    if (htmlReady) {
      const customLinksHtmlCollection =
        document.getElementsByClassName('custom-link');
      const customLinks = Array.from(customLinksHtmlCollection);
      for (let i = 0; i < customLinks.length; i++) {
        customLinks[i].addEventListener('click', (event) => {
          const p = customLinks[i].getAttribute('data-preview');
          const pArray = p.split('?preview=');
          const tArray = pArray[1].split('&type=');
          const urlPrev = tArray[0];
          const typePre = tArray[1];

          // INFO: hide this functionality for testing scrollTo inside 'PostTabs' component on line 44
          //customLinks[i].href = '#preview';

          if (urlPrev && typePre) {
            setTabSelection({
              type: typePre,
              url: urlPrev,
            });
          }
        });
      }
    }
  }, [htmlReady]);

  useEffect(() => {
    if (initialId !== 'new' && initialId) {
      dispatch(loadCase(initialId));
    }

    // TODO: not working
    // Initial scroll to element
    /*     const hash = history.location.hash;
    // Check if there is a hash and if an element with that id exists
    const elToScroll = hash && document.getElementById(hash.substr(1));
    elToScroll && scrollTo(elToScroll); */

    return () => {
      // Clearing the state after unmounting a component
      dispatch(flushState());
    };
  }, [initialId]);

  useEffect(() => {
    if (caseData && caseData.community) {
      dispatch(loadCommunityTags(caseData.community._id));
    }
  }, [caseData]);

  // Redirect on successful post deletion
  useEffect(() => {
    if (deleteSuccessful) {
      dispatch(flushState());
      if (history.location?.state?.from == 'newsfeed_post') {
        history.push({
          pathname: '/newsfeed',
          state: {
            deletedId: initialId,
            from: 'case_detail',
          },
        });
      } else {
        history.goBack();
      }
    }
  }, [deleteSuccessful]);

  // Author Output
  const author = (author) =>
    author.map((auth) => {
      const isIndustryUser = auth?.role == 'industry';
      const { isEmployee, industryName } = getEmployment(auth);

      return (
        auth && (
          <div className="case-author" key={auth._id}>
            <ConditionalLink
              condition={
                user?._id &&
                (user?.role !== 'industry' || auth.role !== 'industry')
              }
              to={
                auth.role === 'industry' && auth.employment
                  ? `/community/detail/${getObjId(
                      auth.employment.industryCommunity,
                    )}`
                  : `/profile/${auth._id}`
              }
              onClick={() => setAuthPopup({ open: true })}
              key={`/profile-link${auth._id}`}
              style={{ display: 'flex' }}
            >
              <Space>
                <UserAvatar fontSize={12} user={auth} width={32} height={32} />
                <span className="owner_post">
                  {auth?.description?.firstname} {auth?.description?.lastname}
                </span>
                {isIndustryUser && (
                  <span className="comment-author__badge industry">
                    {t('common.industryPartner')}
                  </span>
                )}
              </Space>
            </ConditionalLink>
            {isEmployee && (
              <Badge
                title={t('communities.employeeOf', { industryName })}
                className="badge-container"
              />
            )}
          </div>
        )
      );
    });

  const timeCreation = (timeString) =>
    timeString && (
      <span className="article-time-creation">
        <span>{moment(timeString).fromNow()}</span>
      </span>
    );

  const imagelify = (text) => {
    // search for http , https , ftp , and file URLs.
    const test1 = text.replace(
      new RegExp('<a href="https://image.beemed.com/', 'g'),
      `<img class="miniature" src="${iconImage}" /><a class="custom-link custom-image" ref="preview" href='#preview' data-preview="?preview=`,
      true,
    );
    const test2 = test1.replace(
      new RegExp(`<a href="https://video.beemed.com/`, 'g'),
      `<img class="miniature" src="${iconVideo}" /><a class="custom-link custom-video" ref="preview" href='#preview' data-preview="?preview=`,
    );
    const test3 = test2.replace(
      new RegExp(`<a href="https://document.beemed.com/`, 'g'),
      `<img class="miniature" src="${iconDocument}" /><a class="custom-link custom-document" ref="preview" href='#preview' data-preview="?preview=`,
    );
    // let test4 = test3.replace(
    //   `<a href="https://question.beemed.com/`,
    //   `<img class="miniature" src="${iconQuestion}" /><a class="custom-link custom-question" href='#' data="?preview=`,
    // );

    if (htmlReady === false) {
      setHtmlReady(true);
    }
    return test3;
  };

  const renderType = (data) => {
    const { type } = data;
    const isCommunity = data.community?._id
      ? data.community?._id
      : data.community;
    const isIndustry =
      data.community?._id && data.community?.private == 'industry';
    const communityLink = isCommunity && `/community/detail/${isCommunity}`;

    return (
      <>
        <LinkWrapper
          type="detail-community"
          isCommunity={isCommunity}
          style={{ display: 'inline-block' }}
        >
          {isCommunity && (
            <Tag
              className={`tag type-tag tag--type tag-speciality ${
                isCommunity ? 'community-tag' : ''
              } ${isIndustry ? 'industry-tag' : ''}`}
            >
              {data.community?.title}
            </Tag>
          )}
        </LinkWrapper>
        <LinkWrapper
          type={type}
          isCommunity={isCommunity}
          style={{ display: 'inline-block' }}
        >
          {type !== 'post' && (
            <Tag className="tag type-tag tag--type tag-speciality ">
              {<CustomIcons type="casestudy" />}
              {t('common.cases')}
            </Tag>
          )}
        </LinkWrapper>
      </>
    );
  };

  const renderSpecialty = (speciality) => (
    <>
      {speciality?.map((tag, index) => (
        <Tag className="tag tag--speciality" key={index}>
          {t(`common.specialities-${camelCase(tag)}`)}
        </Tag>
      ))}
    </>
  );

  const renderAnatomy = (anatomy) => (
    <>
      {anatomy?.map((tag, index) => (
        <Tag className="tag tag--anatomy" key={index}>
          {t(`common.anatomies-${camelCase(tag)}`)}
        </Tag>
      ))}
    </>
  );

  const renderPostTags = (tags) =>
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
    <>
      {renderType(caseData)}
      {renderSpecialty(caseData.speciality)}
      {renderAnatomy(caseData.anatomy)}
      {renderPostTags(caseData.tags)}
    </>
  );

  if (
    caseData &&
    caseData.community &&
    user.role === 'industry' &&
    getObjId(caseData.community) !== user.employment.industryCommunity
  ) {
    navigate('/');
    return null;
  }

  // render function
  return (
    <div className="main-full-content case-detail">
      <Helmet>
        <title>{t('common.cases')}</title>
        <meta name="description" content="Description of " />
      </Helmet>
      <Row gutter={[0, 30]}>
        {loading && <Spin className="loading-preview" size="large" />}
        {caseData && !loading && (
          <Layout className="main-single-layout">
            <Layout.Content className="main-single-content">
              <Row className="main-single-content__header">
                <Col xs={12} md={15} lg={18} className="header-actions">
                  <GoBackButton goTo={t('cases.backToCases')} />
                </Col>
                <Col xs={12} md={9} lg={6} className="header-actions">
                  {caseData?.author &&
                    caseData?.author.some((e) => e._id == user._id) && (
                      <CreatePublicationv2
                        type={caseData.type}
                        onSubmit={(data) =>
                          dispatch(updateCase(data, 'update'))
                        }
                        initialData={caseData}
                        communityId={caseData.community?._id}
                        tags={tags}
                      />
                    )}
                </Col>
              </Row>
              <Row className="main-single-content__main">
                <Col xs={24}>
                  <article className="main-single-content__article">
                    <header className="article-header">
                      {caseData.author && author(caseData.author)}
                      {caseData.date_creation &&
                        timeCreation(caseData.date_creation)}
                    </header>
                    <section className="article-main">
                      {caseData.title && (
                        <h3 className="article-title">{caseData.title}</h3>
                      )}
                      {renderTags()}

                      {caseData.content && (
                        <>
                          <div
                            style={
                              caseData?.type === 'post'
                                ? { marginTop: 0 }
                                : null
                            }
                            className="article-content-html"
                            dangerouslySetInnerHTML={{
                              __html: imagelify(caseData.content),
                            }}
                          />
                        </>
                      )}
                      <PostTabs
                        content={caseData}
                        tabSelection={tabSelection}
                        resetOpenedSelection={() => setUrlPreview(false)}
                      />
                    </section>
                  </article>
                </Col>
              </Row>
              {caseData && (
                <div id="comments">
                  <CommentsOverview
                    onDelete={() => dispatch(onDelete(caseData._id))}
                    onPinUnpinPost={() =>
                      dispatch(
                        pinUnpinPost({
                          postId: caseData._id,
                          pinned: caseData.pinned ? false : true,
                        }),
                      )
                    }
                    onHideUnhidePost={() =>
                      dispatch(
                        hideUnhidePost({
                          postId: caseData._id,
                          hidden: caseData.hidden ? false : true,
                        }),
                      )
                    }
                    commentType="post"
                    itemData={caseData}
                    changeItem={(data) =>
                      dispatch(
                        updateCase(
                          {
                            _id: data._id,
                            likes: data.likes.map((like) => ({
                              _id: like._id,
                            })),
                          },
                          'like',
                        ),
                      )
                    }
                  />
                </div>
              )}
            </Layout.Content>
          </Layout>
        )}
        {!caseData && !loading && <Empty description={t('common.noData')} />}
      </Row>
    </div>
  );
}

CaseDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  flushState: PropTypes.func.isRequired,
  caseData: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  loadCase: PropTypes.func.isRequired,
  updateCase: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default withUser(CaseDetail);
