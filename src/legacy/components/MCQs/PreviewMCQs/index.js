/**
 *
 * PreviewMCQs
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

// components
import PreviewOption from 'legacy/components/MCQs/PreviewOption';
import CreateMCQs from 'legacy/components/MCQs/CreateMCQs';

function PreviewMCQs({
  questions,
  // actions
  change,
  // default
  className,
}) {
  const childClassNames = classNames('preview-mcqs', className);

  const [openModal, setOpenModal] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({});

  // remove question from array in the preview
  const removeQuestion = question => {
    if (questions.length > 0 && question) {
      const questionsList = questions.filter(
        qw => qw._id !== question._id && qw,
      );
      change(questionsList);
    }
  };

  // edit question
  const editQuestion = question => {
    if (questions.length > 0 && question) {
      const questionsList = questions.map(qw =>
        qw._id == question._id
          ? {
              ...qw,
              ...question,
            }
          : qw,
      );
      change(questionsList);
    }
  };

  return (
    <>
      {questions.length > 0 && (
        <div className={childClassNames}>
          <div className="preview-mcqs__title" />
          <br />
          <div className="preview-mcqs__list">
            {questions.map(
              question =>
                question && (
                  <PreviewOption
                    key={'Preview-' + question._id}
                    question={question}
                    edit={question => {
                      setOpenModal(true);
                      setCurrentQuestion(question);
                    }}
                    remove={removeQuestion}
                  />
                ),
            )}
          </div>
        </div>
      )}
      {openModal && (
        <CreateMCQs
          key={`edit-modal`}
          mode="edit"
          question={currentQuestion}
          isOpen={openModal}
          changeIsOpen={setOpenModal}
          update={editQuestion}
        />
      )}
    </>
  );
}

PreviewMCQs.propTypes = {
  questions: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
  change: PropTypes.func.isRequired,
};

export default memo(PreviewMCQs);
