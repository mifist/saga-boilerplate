import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Input, Modal, Radio, Space } from 'antd';

export const ReportPopup = memo(({ visible, onClose, onSubmit, loading }) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  return (
    <Modal
      title={t('common.report')}
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
      <Form form={form} layout="vertical">
        <Form.Item
          name="reportType"
          label={t('common.whyAreYouReportingThis')}
          rules={[
            {
              required: true,
              message: t('common.requiredField'),
            },
          ]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value={105}>{t('common.report-spam')}</Radio>
              <Radio value={3}>
                {t('common.report-harassmentOrHatefulSpeech')}
              </Radio>
              <Radio value={156}>{t('common.report-inappropriate')}</Radio>
              <Radio value={5}>
                {t(
                  'common.report-intellectualPropertyInfringementOrDefamation',
                )}
              </Radio>
              <Radio value={0}>{t('common.report-other')}</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="reportContent"
          label={t('common.moreAboutReport')}
          rules={[
            {
              required: true,
              message: t('common.requiredField'),
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
});
