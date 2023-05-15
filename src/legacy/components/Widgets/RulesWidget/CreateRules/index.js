import React, { memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd component
import { Modal, Input, Form, Button } from 'antd';

//components
import RichEditorDescription from 'legacy/components/RichEditorDescription';
import LexicalEditor from 'legacy/components/LexicalEditor';

function CreateRules({
  update,
  visibleModal,
  handleCancel,
  rulesCommunity,
  rulesIndex,
  handelEdit,
  editRulesMode,
  createRulesMode,
  // default props
  className,
  ...rest
}) {
  const childClassNames = classNames('create-rules-wrapper', className);
  const { t } = useTranslation();

  const initForm = {
    title: rulesIndex ? rulesCommunity[rulesIndex].title || '' : '',
    description: rulesIndex ? rulesCommunity[rulesIndex].description || '' : '',
  };
  const [rulesFrom] = Form.useForm();

  const checkRules = () => {
    if (rulesIndex !== null && rulesIndex !== undefined) {
      const descriptioncontent = rulesIndex
        ? rulesCommunity[rulesIndex].description || ''
        : '';

      rulesFrom.setFieldsValue({
        description: descriptioncontent,
        descriptionEditor: descriptioncontent,
      });

      return descriptioncontent;
    }
  };

  useEffect(() => {
    checkRules();
  }, [rulesIndex]);

  useEffect(() => {
    if (visibleModal) {
      let formData = {
        title: rulesIndex === null ? '' : rulesCommunity[rulesIndex].title,
        description:
          rulesIndex === null ? '' : rulesCommunity[rulesIndex].description,
        descriptionEditor:
          rulesIndex === null ? '' : rulesCommunity[rulesIndex].description,
        _id: `${Math.random()}`,
      };
      rulesFrom.setFieldsValue(formData);
    }
  }, [rulesIndex, visibleModal]);

  const handelCreate = values => {
    if (
      values.hasOwnProperty('title') &&
      values.hasOwnProperty('description') &&
      values?.title &&
      values?.description
    ) {
      const newRulesObj = {
        title: values?.title,
        description: values?.description,
      };
      update(newRulesObj);
      rulesFrom.resetFields();
    }
    handleCancel();
  };

  return (
    <div className={childClassNames}>
      <Modal
        title={t(
          `communities.${rulesIndex === null ? 'createRule' : 'editRule'}`,
        )}
        visible={visibleModal}
        onCancel={handleCancel}
        className="rules-modal"
      >
        <Form
          form={rulesFrom}
          initialValues={initForm}
          name="create_community_rules"
          onFinish={values =>
            rulesIndex === null
              ? handelCreate(values)
              : handelEdit(values, rulesIndex)
          }
        >
          <Form.Item
            name="title"
            label=""
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input
              placeholder={t('communities.ruleTitle')}
              className={editRulesMode && !createRulesMode ? 'edit-input' : ''}
            />
          </Form.Item>
          <Form.Item
            hidden
            name="description"
            className="about-editor-widget"
            rules={[{ required: true, message: t('common.requiredField') }]}
          >
            <Input value={checkRules()} />
          </Form.Item>
          <Form.Item
            name="descriptionEditor"
            className="rule-description"
            label=""
          >
            {editRulesMode && !createRulesMode ? (
              <LexicalEditor
                handleChange={text => {
                  rulesFrom.setFieldsValue({
                    description: text,
                    descriptionEditor: text,
                  });
                }}
                content={checkRules()}
                type="full"
                contentIndex={rulesIndex}
              />
            ) : (
              // <RichEditorDescription
              //   handleChange={text => {
              //     rulesFrom.setFieldsValue({
              //       description: text,
              //       descriptionEditor: text,
              //     });
              //   }}
              //   content={checkRules()}
              //   type={'simple'}
              //   contentIndex={rulesIndex}
              // />
              <Input.TextArea
                onChange={event => {
                  const text = event?.target?.value;
                  text &&
                    rulesFrom.setFieldsValue({
                      description: text,
                      descriptionEditor: text,
                    });
                }}
                type="textarea"
                placeholder={t('communities.ruleDescription')}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button key="submit" htmlType="submit">
              {t('common.validate')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

CreateRules.defaultProps = {};
CreateRules.propTypes = {
  update: PropTypes.func,
  visibleModal: PropTypes.bool,
  handleCancel: PropTypes.func,
  rulesCommunity: PropTypes.array,
  rulesIndex: PropTypes.number,
  handelEdit: PropTypes.func,
  initForm: PropTypes.object,
};

export default memo(CreateRules);
