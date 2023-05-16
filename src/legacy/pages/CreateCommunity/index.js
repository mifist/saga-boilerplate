import React, { useState, memo } from 'react';
import { compose } from '@reduxjs/toolkit';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import './style.scss';

// HOC
import withRedux from 'HOC/withRedux';
// actions
import { createCommunity as createCommunityAction } from './actions';

// antd component
import { Row } from 'antd';

// Community components
import CreateCommunityForm from 'legacy/components/Community/CreateCommunity/CreateCommunityForm';
import MemberInvitationForm from 'legacy/components/Community/CreateCommunity/MemberInvitationForm';


const CreateCommunity = ({
  // default props
  className,
  // core
  state,
  dispatch
}) => {
  const { loading } = state.CreateCommunity;

  const { t } = useTranslation();
  const [formData, setFormData] = useState(null);
  const [nextStep, setNextStep] = useState(false);

  const handleFormFinish = (data) => {
    setFormData(data);
    setNextStep(true);
  };

  //console.log(loading);

  const handleCreateCommunity = (invitationFormData) => {
    dispatch(createCommunity({ ...formData, ...invitationFormData }));
  };

  return (
    <div className="main-full-content create-community-content">
      <Helmet>
        <title>{t('communities.createCommunity')}</title>
        <meta name="description" content="Description of Create Community" />
      </Helmet>
      <Row gutter={[0, 30]}>
        {!nextStep && !formData ? (
          <CreateCommunityForm onFinish={handleFormFinish} />
        ) : (
          <MemberInvitationForm
            onFinish={handleCreateCommunity}
            loading={loading}
          />
        )}
      </Row>
    </div>
  );
};

export default compose(withRedux, memo)(CreateCommunity);
