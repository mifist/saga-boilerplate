import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

// antd components
import { Button } from 'antd';

// assets
import CustomIcons from 'legacy/components/CustomIcons';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

// components
import AnswerOption from 'legacy/components/MCQs/AnswerOption';

function MCQsComponents({
  quizQuestionsList,
  // default
  className,
  ...rest
}) {
  const childClassNames = classNames('quiz-box', className);

  const [questionNumber, setQuestionNumber] = useState(1);
  // total tight answers for result
  const [amounRightQuestion, setAmounRightQuestion] = useState(0);

  // check if have any answer
  const [answerIsClicked, setAnswerIsClicked] = useState(false);
  // questions counter
  const [counter, setCounter] = useState(0);
  // main array
  const [quizQuestions, setQuizQuestions] = useState([]);
  // array with answers on all questions from quizQuestionsList
  const [resultArray, setResultArray] = useState([]);
  // current question
  const [currentQuestion, setCurrentQuestion] = useState({});

  // QUIZ
  const [isSubmitted, setIsSubmitted] = useState(false);
  // show next button after submit
  const [showNavigation, setShowNavigation] = useState(false);
  const [showResult, setShowResult] = useState(false);
  // set current answers for current question
  const [currentSelectedAnswer, setCurrentSelectedAnswer] = useState([]);

  useEffect(() => {
    if (quizQuestionsList) {
      // set questions array
      setQuizQuestions(quizQuestionsList);
      // set current cuestion
      setCurrentQuestion(quizQuestionsList[0]);
    }
  }, [quizQuestionsList]);

  const setPrevQuestion = () => {
    if (!(0 > Number(counter) - 1)) {
      const prevCount = Number(counter) - 1;
      const prevQuestion = quizQuestions[prevCount];
      const visited =
        prevQuestion &&
        resultArray.some(elem => elem.question_id === prevQuestion._id && elem);

      if (visited) {
        setCounter(prevCount);
        setQuestionNumber(Number(questionNumber) - 1);
        setCurrentQuestion(prevQuestion);

        setIsSubmitted(true);
        setShowNavigation(true);
      } else if (!visited) {
        setIsSubmitted(false);
        setShowNavigation(false);
      }
    }
  };

  const setNextQuestion = () => {
    if (isSubmitted && quizQuestions.length >= questionNumber) {
      const nextCount = Number(counter) + 1;
      const nextQuestionNumber = Number(questionNumber) + 1;
      const nextQuestion = quizQuestions[nextCount];
      const visited =
        nextQuestion &&
        resultArray.some(elem => elem.question_id === nextQuestion._id && elem);

      setCounter(nextCount);
      setQuestionNumber(nextQuestionNumber);
      setCurrentQuestion(nextQuestion);

      setAnswerIsClicked(false);

      if (visited && quizQuestions.length > nextQuestionNumber) {
        setShowNavigation(true);
        setIsSubmitted(true);
        setShowResult(false);
      } else if (!visited && quizQuestions.length >= nextQuestionNumber) {
        setIsSubmitted(false);
        setShowNavigation(false);
        setShowResult(false);
      } else if (!visited && quizQuestions.length == questionNumber) {
        setIsSubmitted(true);
        setShowNavigation(false);
        setShowResult(true);
        // set total right answers for result
        const amount = getAmountRightQuestions();
        setAmounRightQuestion(amount);
      }
    }
  };

  // action on click by each answers
  const getAnswerSelected = (target, answer) => {
    if (!isSubmitted && target) {
      const answerId = target.id,
        answerChecked = target.checked;

      // save all checked answers
      let answersArray = [...new Set([...currentSelectedAnswer])];
      if (answerChecked) {
        answersArray = [...answersArray, answer];
      } else {
        answersArray = answersArray.filter(
          answer => answer !== answerId && answer,
        );
      }

      setCurrentSelectedAnswer(answersArray);
      setAnswerIsClicked(true);
    }
  };

  // submit/validate current question
  const submitQuestion = () => {
    setIsSubmitted(true);

    setShowNavigation(true);
    // save answers on all questions
    const savedAnswers = [
      {
        question_id: currentQuestion._id,
        answers: [...currentSelectedAnswer],
      },
    ];
    setResultArray([...new Set([...resultArray, ...savedAnswers])]);
  };

  const getRightAnswers = arrayObj => {
    const result = [];
    const map = new Map();
    if (arrayObj) {
      for (const item of arrayObj) {
        if (!map.has(item['_id']) && item['answerType']) {
          map.set(item['_id'], true); // set any value to Map
          result.push({ ...item });
        }
      }
    }
    return result;
  };

  const getAmountRightQuestions = () => {
    let amount = 0;
    if (quizQuestions && resultArray && resultArray.length > 0) {
      quizQuestions.map(question => {
        const rightAnswers = getRightAnswers(question.answers);
        const result = [];
        const map = new Map();

        resultArray.map(resQ => {
          if (question._id === resQ.question_id) {
            rightAnswers.map(el => {
              resQ.answers.map(res => {
                if (el._id == res._id) {
                  map.set(res, true); // set any value to Map
                  result.push({ ...res });
                }
              });
            });
          }
        });

        if (rightAnswers.length === result.length) {
          amount = amount + 1;
        }
      });
    }

    return amount;
  };

  const quizNavigation = (customClass = '') => {
    return (
      <div className={`quiz-box__navigation ${customClass}`}>
        <div className="left-nav" onClick={setPrevQuestion}>
          <ArrowLeftOutlined />
        </div>
        <div className="right-nav" onClick={setNextQuestion}>
          <ArrowRightOutlined />
        </div>
      </div>
    );
  };

  return (
    quizQuestionsList && (
      <div className={childClassNames} {...rest}>
        {showResult && (
          <div className="quiz-box__result">
            <CustomIcons type="trophy" className="result-icon" />
            <h3 className="result-score">
              Your Score: {amounRightQuestion}/{quizQuestions.length}
            </h3>
          </div>
        )}
        {!showResult && currentQuestion && (
          <div className="quiz-box__content">
            <div className="quiz-box__count-box">
              <div className="question-count">
                Question <span>{questionNumber}</span> of{' '}
                <span>{quizQuestions.length}</span>
              </div>

              {quizNavigation('top-bar-navigation')}
            </div>

            <h3 className="question-title">{currentQuestion.question}</h3>

            <ul className="quiz-box__list">
              {currentQuestion?.answers &&
                currentQuestion?.answers.map(answer => {
                  return (
                    <AnswerOption
                      key={answer._id}
                      answer={answer}
                      currentQuestion={currentQuestion}
                      isSubmitted={isSubmitted}
                      resultArray={resultArray}
                      getAnswerSelected={getAnswerSelected}
                    />
                  );
                })}
            </ul>

            <div className="quiz-box__footer">
              {showNavigation && quizNavigation()}
              {!showNavigation && (
                <Button
                  disabled={!answerIsClicked}
                  className="ant-btn submit-quiz"
                  type="primary"
                  onClick={submitQuestion}
                >
                  Submit response
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    )
  );
}

MCQsComponents.propTypes = {
  quizQuestionsList: PropTypes.oneOfType([
    PropTypes.array.isRequired,
    PropTypes.bool.isRequired,
    PropTypes.string.isRequired,
  ]),
};

export default memo(MCQsComponents);
