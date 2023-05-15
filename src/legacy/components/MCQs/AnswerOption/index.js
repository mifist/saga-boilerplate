import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './index.scss';

function AnswerOption({
  answer,
  isSubmitted,
  currentQuestion,
  resultArray,
  // actions
  getAnswerSelected,
  // default
  className,
}) {
  const [checkedAnswer, setCheckedAnswer] = useState(false);

  let mainclass = `answer-items ${checkedAnswer ? 'highlighted-answer' : ''}`;
  const childClassNames = classNames(mainclass, className);

  let answerClasses = '';
  if (resultArray && isSubmitted) {
    resultArray.map(qw => {
      if (qw.question_id === currentQuestion._id) {
        qw.answers.map(res => {
          if (res._id === answer._id) {
            if (answer.answerType) {
              answerClasses = ` right-answer`;
            } else {
              answerClasses = ' wrong-answer';
            }
          } else if (res !== answer._id && answer.answerType) {
            answerClasses = ` right-answer`;
          }
        });
      }
    });
  }

  const checkAnswer = event => {
    if (!isSubmitted) {
      const target = event.currentTarget;
      setCheckedAnswer(!checkedAnswer);
      getAnswerSelected(target, answer);
    }
  };

  return (
    answer && (
      <>
        <li className={childClassNames + ' ' + answerClasses}>
          <input
            type="checkbox"
            name={answer._id}
            checked={checkedAnswer}
            id={answer._id}
            value={answer.answerType}
            onChange={checkAnswer}
          />
          <label htmlFor={answer._id} className="answer">
            {answer.answer}
          </label>
        </li>
      </>
    )
  );
}

AnswerOption.propTypes = {
  answer: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
  currentQuestion: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
  isSubmitted: PropTypes.bool,
  resultArray: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
  getAnswerSelected: PropTypes.func.isRequired,
};

export default memo(AnswerOption);
