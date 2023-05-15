/**
 *
 * CreateMCQs
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// antd components
import { Modal, Button, Select, Tag, Switch, Form, Input, Space } from 'antd';
const { TextArea } = Input;

// assets
import CustomIcons from 'legacy/components/CustomIcons';
import {
  MenuOutlined,
  MinusCircleOutlined,
  CloseOutlined,
  UnorderedListOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import { devNull } from 'os';

// helper
const fileOptions = [
  { value: 'image1.png' },
  { value: 'mysecondpicture.png' },
  { value: '3.jpg' },
  { value: 'myfavoritecat.jpg' },
  { value: 'myfavoritedog.png' },
];

function CreateMCQs({
  mode,
  question,
  isOpen,
  changeIsOpen,
  // actions
  update,
  // default
  className,
  ...rest
}) {
  const childClassNames = classNames('create-mcqs', className);

  const { t } = useTranslation();

  const initForm = {
    attach_media: [],
    question: '',
    answers: [''],
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [attachMedia, setAttachMedia] = useState([]);
  const [checkAnswer, setCheckAnswer] = useState(false);

  const [questionFrom] = Form.useForm();

  useEffect(() => {
    if (question && mode === 'edit') {
      const fromData = {
        question: question.question,
        attach_media: question.media,
        answers: question.answers,
      };
      setIsModalVisible(isOpen);
      questionFrom.setFieldsValue(fromData);
      setAttachMedia(question.attach_media);
    }
  }, [question, mode, isOpen]);

  const resetMCQs = () => {
    setAttachMedia([]);
    setIsModalVisible(false);
    mode === 'edit' && changeIsOpen(false);
    questionFrom.resetFields();
  };

  const closeModal = () => {
    setIsModalVisible(false);
    mode === 'edit' && changeIsOpen(false);
  };

  // validate current question and save
  const handleValidate = values => {
    const tempValues = values;
    if (tempValues.hasOwnProperty('question') && tempValues?.question) {
      let newQuestion = {};

      // change question _id for edit mode
      if (question && mode === 'edit') {
        newQuestion = question;
        newQuestion.question = tempValues?.question;
      } else {
        newQuestion = {
          _id: `question-${Math.floor(Math.random() * 11)}`,
          question: tempValues?.question,
        };
      }

      if (tempValues?.attach_media) {
        newQuestion.media = [...tempValues?.attach_media];
      }
      if (tempValues?.answers && tempValues?.answers.length > 0) {
        newQuestion.answers = tempValues?.answers.map((answer, index) => {
          return {
            _id: `answer-${Date.now()}${index}`,
            answer: answer.answer,
            answerType: Boolean(answer.answerType),
          };
        });
      }

      const questionTemp = newQuestion;
      // save current question
      update(questionTemp);
      // reset Modal/Form
      resetMCQs();

      setCheckAnswer(false);
    }
  };

  // render select item for media
  const tagRender = props => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = event => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={value}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  };

  const checkValidAnswer = (_, values) => {
    let hasValidAnswer = false;
    for (let i = 0; i < values.length; i++) {
      if (values[i]?.answerType) {
        hasValidAnswer = true;
      }
    }
    setCheckAnswer(!hasValidAnswer);

    if (hasValidAnswer) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  };

  return (
    <div className={childClassNames}>
      {mode !== 'edit' && (
        <div
          // icon={<CustomIcons type="mcqs" />}
          className="btn-mcqs"
          type="primary"
          onClick={() => setIsModalVisible(true)}
        >
          {/*<CustomIcons type="mcqs" />*/}
          <UnorderedListOutlined style={{ fontSize: 24 }} />
          <div>{t('common.createQuestion')}</div>
        </div>
      )}
      <Modal
        className="mcqs-modal"
        title={t('common.mcqQuestion')}
        visible={isModalVisible}
        onCancel={closeModal}
        onOk={() => questionFrom.submit()}
        closeIcon={
          <span className="mcqs-modal__close" onClick={closeModal}>
            <CloseOutlined /> {t('common.close')}
          </span>
        }
        footer={[
          <Button
            form={mode !== 'edit' ? 'create_mcqs' : 'edit_mcqs'}
            key="submit"
            htmlType="submit"
          >
            {t('common.validate')}
          </Button>,
        ]}
      >
        <Form
          form={questionFrom}
          layout="vertical"
          name={mode !== 'edit' ? 'create_mcqs' : 'edit_mcqs'}
          onFinish={handleValidate}
          initialValues={initForm}
          className="modal-body"
        >
          <div className="mcqs-modal__content">
            <div className="mcqs-modal__text">
              <Form.Item
                name="question"
                label=""
                rules={[
                  {
                    required: true,
                    message: t('common.requiredField'),
                  },
                ]}
              >
                <Input
                  className="mcqs-modal__title"
                  placeholder={t('common.questionPlaceholder')}
                />
              </Form.Item>
              {/*<Form.Item name="attach_media" label="">*/}
              {/*  <Select*/}
              {/*    className="mcqs-modal__attach"*/}
              {/*    mode="multiple"*/}
              {/*    showArrow*/}
              {/*    placeholder="Attach images to your question (optional)"*/}
              {/*    tagRender={tagRender}*/}
              {/*    options={fileOptions}*/}
              {/*    value={attachMedia}*/}
              {/*    onChange={value => {*/}
              {/*      console.log('attach_media: ', value);*/}
              {/*      setAttachMedia(value);*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</Form.Item>*/}
            </div>
          </div>

          <div className="qustions-item">
            <Form.List
              name="answers"
              rules={[{ required: true }, { validator: checkValidAnswer }]}
            >
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} className="answer-row" align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'answer']}
                        rules={[
                          {
                            required: true,
                            message: t('common.requiredField'),
                          },
                        ]}
                        className="answer-input"
                      >
                        <Input placeholder={t('common.answerPlaceholder')} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'answerType']}
                        className="answer-switch"
                        valuePropName="checked"
                      >
                        <Switch
                          checkedChildren={<CheckOutlined />}
                          unCheckedChildren={<CloseOutlined />}
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button className="qustions-item-btn" onClick={() => add()}>
                      {t('common.addAnotherAnswer')}
                    </Button>
                  </Form.Item>
                  {checkAnswer && (
                    <Form.Item>
                      <p className="warning-message">
                        {t('common.correctAnswerError')}
                      </p>
                    </Form.Item>
                  )}
                </>
              )}
            </Form.List>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

CreateMCQs.defaultProps = {
  mode: 'create',
  question: {},
};

CreateMCQs.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  isOpen: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  question: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
  update: PropTypes.func.isRequired,
};

export default memo(CreateMCQs);
