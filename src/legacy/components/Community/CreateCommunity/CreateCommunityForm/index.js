import React, { useState, memo } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { useTranslation } from 'react-i18next';
import { camelCase } from 'lodash';
// styles
import './style.scss';

// antd component
import {
  Layout,
  Typography,
  Form,
  Input,
  Select,
  Radio,
  Space,
  Button,
} from 'antd';

// components
import RichEditorDescription from 'legacy/components/RichEditorDescription';

// helpers function
import { anatomies, specialities } from 'utils/categoryHelper';
import history from 'utils/history';
import LexicalEditor from 'legacy/components/LexicalEditor';

const CreateCommunityForm = ({ onFinish }) => {
  const { t } = useTranslation();
  const [createCommunityForm] = Form.useForm();
  const [description, setDescription] = useState('');

  const goBackHandler = () => history.push('/community');

  return (
    <Layout.Content className="main-single-content">
      <Typography.Title level={3} className="main-single-content-heading">
        {t('communities.createCommunity')}
      </Typography.Title>

      <Form
        form={createCommunityForm}
        onFinish={values => onFinish({ ...values, description })}
        layout="vertical"
        className="create-community-form"
        initialValues={{
          private: 'public',
        }}
      >
        <Form.Item
          label={t('communities.nameOfYourCommunity')}
          name="title"
          rules={[
            {
              required: true,
              message: t('common.requiredField'),
            },
          ]}
        >
          <Input placeholder={t('communities.communityName')} />
        </Form.Item>
        <Form.Item
          label={t('communities.aboutYourCommunity')}
          className="rich-text-editor"
        >
          {/*<RichEditorDescription*/}
          {/*  handleChange={text => setDescription(text)}*/}
          {/*  content={description}*/}
          {/*  placeholder={t('communities.aboutCommunityPlaceholder')}*/}
          {/*/>*/}
          <LexicalEditor
            handleChange={text => setDescription(text)}
            content={description}
            type="full"
            placeholder={t('communities.aboutCommunityPlaceholder')}
          />
        </Form.Item>
        <Form.Item name="speciality" label={t('communities.communityDomains')}>
          <Select
            placeholder={t('communities.selectDomain')}
            optionFilterProp="children"
            allowClear
            mode="multiple"
            showArrow
            getPopupContainer={trigger => trigger.parentElement}
          >
            {specialities.map(item => (
              <Select.Option key={item.value} value={item.label}>
                {t(`common.specialities-${camelCase(item.label)}`)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="anatomy" label={t('communities.communityAnatomies')}>
          <Select
            placeholder={t('communities.selectAnatomies')}
            optionFilterProp="children"
            allowClear
            mode="multiple"
            showArrow
            getPopupContainer={trigger => trigger.parentElement}
          >
            {anatomies.map(item => (
              <Select.Option key={item.value} value={item.label}>
                {t(`common.anatomies-${camelCase(item.label)}`)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          className="create-community-form__group-items"
          name="private"
          label={t('communities.communityPrivacySettings')}
          rules={[{ required: true, message: '' }]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="public">
                <Typography.Title level={5}>
                  {t('communities.openCommunity')}
                </Typography.Title>
                <Typography.Text>
                  {t('communities.openCommunityDetail')}
                </Typography.Text>
              </Radio>
              <Radio value="semi-private">
                <Typography.Title level={5}>
                  {t('communities.semiPrivateCommunity')}
                </Typography.Title>
                <Typography.Text>
                  {t('communities.semiPrivateCommunityDetail')}
                </Typography.Text>
              </Radio>
              <Radio value="private">
                <Typography.Title level={5}>
                  {t('communities.privateCommunity')}
                </Typography.Title>
                <Typography.Text>
                  {t('communities.privateCommunityDetail')}
                </Typography.Text>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          className="button-container"
          wrapperCol={{ span: 14, offset: 6 }}
        >
          <Button type="default" onClick={goBackHandler}>
            {t('common.back')}
          </Button>
          <Button type="primary" htmlType="submit">
            {t('common.create')}
          </Button>
        </Form.Item>
      </Form>
    </Layout.Content>
  );
};

CreateCommunityForm.defaultProps = {};
CreateCommunityForm.propTypes = {
  onFinish: PropTypes.func.isRequired,
};
export default compose(memo)(CreateCommunityForm);
