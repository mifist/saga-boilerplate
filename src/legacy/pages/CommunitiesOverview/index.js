import React, { memo, useState, useEffect } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';

import {
  flushState,
  loadMyCommunities,
  loadActiveCommunities,
  updateCommunityRequestJoinsById,
  updateCommunityInvitationsById,
} from './actions';

// antd component
import { Col, Pagination, Row, Spin } from 'antd';
// components
import CommunityCard from 'legacy/components/Community/CommunityCard';
import CommunityWelcome from 'legacy/components/Community/CommunityWelcome';
import ActiveCommunities from 'legacy/components/Community/ActiveCommunities';

// contexts
import { withUser } from 'appContext/User.context';
// utils
import { useQuery } from 'utils/history';
import { anatomies, specialities } from 'utils/categoryHelper';
import { makeSearchQueryParams } from 'utils/generalHelper';

const CommunitiesOverview = ({
  // props
  history,
  user,
  // core
  state,
  dispatch,
}) => {
  const {
    myCommunitiesLoading,
    myCommunities,
    activeCommunitiesLoading,
    activeCommunities,
    error,
  } = state.CommunitiesOverview;

  const { t, i18n } = useTranslation();
  const query = useQuery();

  const speciality = query.get('speciality') || null;
  const anatomy = query.get('anatomy') || null;
  const page = Number(query.get('page')) || 1;
  const sort = query.get('sort') || 'most_members';
  const type = query.get('type') || 'all';

  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(9);

  const initFilter = {
    speciality,
    anatomy,
    page,
    sort,
    type,
  };

  useEffect(() => {
    if (user?._id) {
      dispatch(loadMyCommunities());
    }
    dispatch(
      loadActiveCommunities({
        limit: 9,
        page: initFilter.page,
        sort: initFilter.sort,
        type: initFilter.type,
        speciality: initFilter.speciality
          ? specialities.find((s) => s.value === initFilter.speciality).label
          : undefined,
        anatomy: initFilter.anatomy
          ? anatomies.find((a) => a.value === initFilter.anatomy).label
          : undefined,
      }),
    );

    return () => {
      dispatch(flushState());
    };
  }, [user.id]);

  // filtered communities after changes inside filter
  useEffect(() => {
    dispatch(
      loadActiveCommunities({
        limit: 9,
        page: initFilter.page,
        sort: initFilter.sort,
        type: initFilter.type,
        speciality: initFilter.speciality
          ? specialities.find((s) => s.value === initFilter.speciality).label
          : undefined,
        anatomy: initFilter.anatomy
          ? anatomies.find((a) => a.value === initFilter.anatomy).label
          : undefined,
      }),
    );
  }, [
    initFilter.page,
    initFilter.sort,
    initFilter.type,
    initFilter.anatomy,
    initFilter.speciality,
  ]);

  const onValuesChange = (changedValues, allValues) => {
    if (changedValues.hasOwnProperty('speciality')) {
      initFilter.speciality = changedValues.speciality || null;
    }

    if (changedValues.hasOwnProperty('anatomy')) {
      initFilter.anatomy = changedValues.anatomy || null;
    }

    if (changedValues.hasOwnProperty('sort')) {
      initFilter.sort = changedValues.sort || 'most_members';
    }

    if (changedValues.hasOwnProperty('type')) {
      initFilter.type = changedValues.type || 'all';
    }

    initFilter.page = null;

    history.push({
      search: makeSearchQueryParams(initFilter),
    });
  };

  const onPageChange = (page) => {
    initFilter.page = page;

    history.push({
      search: makeSearchQueryParams(initFilter),
    });
  };

  const handleChangePage = (value) => {
    setMinValue((value - 1) * 9);
    setMaxValue(value * 9);
  };

  return (
    <div
      className={classNames(
        'main-side-content communities-list',
        i18n.language === 'ar' && 'main-side-content--rtl',
      )}
    >
      <Helmet>
        <title>{t('communities.communities')}</title>
        <meta name="description" content="Description of CommunitiesOverview" />
      </Helmet>

      {user?._id && (
        <Row gutter={[0, 30]} className="my-communities">
          <Col xs={24}>
            {myCommunitiesLoading && (
              <Spin className="loading-preview" size="large" />
            )}
            {myCommunities &&
            myCommunities?.data?.length > 0 &&
            !myCommunitiesLoading ? (
              <div className="communities-list-wrapper">
                <h2 className="all-communities-title">
                  {t('communities.myCommunities')}
                </h2>
                <Row gutter={[20, 30]}>
                  {myCommunities?.data
                    .slice(minValue, maxValue)
                    .map((community) => (
                      <Col
                        xl={8}
                        lg={12}
                        md={24}
                        sm={12}
                        xs={24}
                        key={`${community?._id}-list`}
                      >
                        <CommunityCard
                          type="my-communities"
                          community={community}
                        />
                      </Col>
                    ))}
                </Row>
                <Row>
                  <Col span={24}>
                    {myCommunities?.data.length > 9 ? (
                      <Pagination
                        className="pagination-community"
                        defaultCurrent={1}
                        defaultPageSize={9} //default size of page
                        onChange={handleChangePage}
                        total={myCommunities?.data?.length} //total number of card data available
                      />
                    ) : null}
                  </Col>
                </Row>
              </div>
            ) : (
              !myCommunitiesLoading && <CommunityWelcome />
            )}
          </Col>
        </Row>
      )}

      {myCommunitiesLoading && (
        <Spin className="loading-preview" size="large" />
      )}
      {!myCommunitiesLoading && (
        <ActiveCommunities
          initFilter={initFilter}
          onValuesChange={onValuesChange}
          activeCommunities={activeCommunities}
          activeCommunitiesLoading={activeCommunitiesLoading}
          onPageChange={onPageChange}
          updateCommunityRequestJoinsById={(id, newCommunityData) =>
            dispatch(updateCommunityRequestJoinsById(id, newCommunityData))
          }
          updateCommunityInvitationsById={(id, newCommunityData) =>
            dispatch(updateCommunityInvitationsById(id, newCommunityData))
          }
          page={page}
        />
      )}
    </div>
  );
};

CommunitiesOverview.propTypes = {
  myCommunitiesLoading: PropTypes.bool,
  activeCommunitiesLoading: PropTypes.bool,
};

export default compose(withRedux, memo, withUser)(CommunitiesOverview);
