/**
 *
 * PreviewOption
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

// styles
import './style.scss';

// assets
import { CloseOutlined, EditOutlined } from '@ant-design/icons';

function PreviewOption({
  question,
  // actions
  edit,
  remove,
  // default
  className,
}) {
  const childClassNames = classNames('preview-mcqs__question', className);

  return (
    question && (
      <>
        {
          <div className={childClassNames}>
            <div className="preview-mcqs__question-name">
              {question?.question}
            </div>
            {
              <EditOutlined
                onClick={() => edit(question)}
                className="preview-mcqs__question-edit"
              />
            }
            <CloseOutlined
              onClick={() => remove(question)}
              className="preview-mcqs__question-close"
            />
          </div>
        }
      </>
    )
  );
}

PreviewOption.propTypes = {
  question: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.bool,
    PropTypes.string,
  ]),
  edit: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
};

export default memo(PreviewOption);
