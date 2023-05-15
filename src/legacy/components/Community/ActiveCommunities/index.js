import React, { memo } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';

import { anatomies, specialities } from 'utils/categoryHelper';

// styles
import './style.scss';

// antd component
import { Row, Col, Button, Form, Select, Pagination, Skeleton } from 'antd';

// components
import CommunityCard from 'legacy/components/Community/CommunityCard';
import ConditionalLink from 'legacy/components/ConditionalLink';

import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

const ActiveCommunities = ({
  initFilter,
  page,
  activeCommunities,
  activeCommunitiesLoading,
  // actions
  onValuesChange,
  onPageChange,
  updateCommunityRequestJoinsById,
  updateCommunityInvitationsById,
  setAuthPopup,
  // default props
  className,
  user,
}) => {
  const { t } = useTranslation();
  const childClassNames = classNames('active-communities', className);

  return (
    <Row gutter={[0, 30]} className={childClassNames}>
      <Col xl={24} xs={24}>
        <div className="communities-list-wrapper">
          <div className="communities-list--header">
            <h2 className="all-communities-title">
              {t('communities.communitiesToJoin')}
            </h2>
            <ConditionalLink
              className="create-community-btn"
              to="/community/create"
              condition={user?._id}
              onClick={() => setAuthPopup({ open: true })}
            >
              <Button className="ant-btn-docre">
                {t('communities.createCommunity')}
              </Button>
            </ConditionalLink>
          </div>
          <div className="main-side-content__filter community-filter">
            <Form
              name="validate_other"
              onValuesChange={onValuesChange}
              initialValues={{
                speciality: initFilter.speciality,
                anatomy: initFilter.anatomy,
                type: initFilter.type,
                sort: initFilter.sort,
              }}
            >
              <Form.Item
                name="speciality"
                label={t('common.domain')}
                className="category-select"
              >
                <Select
                  optionFilterProp="children"
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  <Select.Option value={null}>
                    {t('common.allDomains')}
                  </Select.Option>
                  {specialities.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {t(`common.specialities-${camelCase(item.label)}`)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="anatomy"
                label={t('common.anatomy')}
                className="category-select"
              >
                <Select
                  optionFilterProp="children"
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  <Select.Option value={null}>
                    {t('common.allAnatomies')}
                  </Select.Option>
                  {anatomies.map(item => (
                    <Select.Option key={item.value} value={item.value}>
                      {t(`common.anatomies-${camelCase(item.label)}`)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="type"
                label="Type of community"
                className="category-select"
              >
                <Select
                  placeholder="select"
                  optionFilterProp="children"
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  <Select.Option value="all" title="Open">
                    {t('common.all')}
                  </Select.Option>
                  <Select.Option value="public" title="Open">
                    {t('communities.open')}
                  </Select.Option>
                  <Select.Option value="private" title="Private">
                    {t('communities.private')}
                  </Select.Option>
                  <Select.Option value="semi-private" title="Semi-private">
                    {t('communities.semiPrivate')}
                  </Select.Option>
                  <Select.Option value="industry" title="Industry Partner">
                    {t('communities.community-industryPartner')}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="sort"
                label={t('common.sortBy')}
                className="category-select"
              >
                <Select
                  optionFilterProp="children"
                  placeholder={t('common.sortBy')}
                  getPopupContainer={trigger => trigger.parentElement}
                >
                  <Select.Option value="most_members">
                    {t('communities.mostMembers')}
                  </Select.Option>
                  <Select.Option value="alphabetical">
                    {t('communities.alphabetical')}
                  </Select.Option>
                  <Select.Option value="date">
                    {t('communities.newest')}
                  </Select.Option>
                </Select>
              </Form.Item>
            </Form>
            <div className="totalCount">
              {t('communities.communitiesCount', {
                count: `${activeCommunities.filteredAmount || 0}/${activeCommunities.totalAmount || 0}`
              })}
            </div>
          </div>

          {(activeCommunitiesLoading || !activeCommunities) && (
            <Skeleton active />
          )}

          {activeCommunities &&
            !activeCommunitiesLoading &&
            activeCommunities?.data?.length > 0 && (
              <Row gutter={[20, 30]}>
                {activeCommunities?.data?.map(community => (
                  <Col
                    xl={8}
                    lg={12}
                    md={24}
                    sm={12}
                    xs={24}
                    key={`${community?._id}-list`}
                  >
                    <CommunityCard
                      type="active-communities"
                      community={community}
                      manageCommunityList={(type, data) => {
                        if (data !== undefined) {
                          if (type === 'request_join') {
                            updateCommunityRequestJoinsById(
                              community._id,
                              data,
                            );
                          } else if (type === 'invitation') {
                            updateCommunityInvitationsById(community._id, data);
                          }
                        }
                      }}
                    />
                  </Col>
                ))}
                <Col xs={24} className="community-pagination">
                  <Pagination
                    current={page}
                    defaultCurrent={1}
                    defaultPageSize={9}
                    pageSize={9}
                    showSizeChanger={false}
                    onChange={onPageChange}
                    total={activeCommunities.filteredAmount}
                  />
                </Col>
              </Row>
            )}
        </div>
      </Col>
    </Row>
  );
};

ActiveCommunities.defaultProps = {
  activeCommunitiesLoading: true,
};
ActiveCommunities.propTypes = {
  initFilter: PropTypes.object.isRequired,
  onValuesChange: PropTypes.func.isRequired,
  activeCommunities: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.array.isRequired,
    PropTypes.bool.isRequired,
  ]),
  activeCommunitiesLoading: PropTypes.bool,
  onPageChange: PropTypes.func.isRequired,
  updateCommunityRequestJoinsById: PropTypes.func,
  updateCommunityInvitationsById: PropTypes.func,
  page: PropTypes.number,
};

export default compose(
  memo,
  withUser,
  withAuthPopup,
)(ActiveCommunities);
