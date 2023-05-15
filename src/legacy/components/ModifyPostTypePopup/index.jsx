import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Modal, Radio, Space } from 'antd';

import './styles.scss';

export const ModifyPostTypePopup = memo(
  ({ visible, onClose, onSubmit, loading }) => {
    const [form] = Form.useForm();
    const { t } = useTranslation();

    return (
      <Modal
        title={t('common.changePostType')}
        visible={visible}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              form.resetFields();
              onSubmit(values);
            })
            .catch(info => {
              console.log('Validate Failed:', info);
            });
        }}
        onCancel={onClose}
        okText={t('common.submit')}
        cancelText={t('common.cancel')}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ postType: 'post' }}
        >
          <Form.Item
            name="postType"
            label={t('common.postType')}
            rules={[
              {
                required: true,
                message: t('common.requiredField'),
              },
            ]}
            className="post-type"
          >
            <Radio.Group>
              <Space direction="vertical">
                <Radio value="post">
                  <span className="first-letter-uppercase">
                    {t('common.post')}
                  </span>
                </Radio>
                <Radio value="case">
                  <span className="first-letter-uppercase">
                    {t('common.case')}
                  </span>
                </Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue(['postType']) === 'case' && (
                <Form.Item
                  name="caseTitle"
                  label={t('common.caseTitle')}
                  shouldUpdate
                  rules={[
                    {
                      required: true,
                      message: t('common.requiredField'),
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              )
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);
