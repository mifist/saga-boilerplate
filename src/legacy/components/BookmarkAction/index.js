import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

// styles
import './style.scss';

// icons
import CustomIcons from 'legacy/components/CustomIcons';
import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

class RenderButton extends React.Component {
  shouldComponentUpdate(nextProps) {
    return (
      nextProps.active !== this.props.active ||
      nextProps.label !== this.props.label
    );
  }

  render() {
    let { onClickBookMark, type, className, label, active } = this.props;
    const defaultClass =
      type === 'icon' ? 'bookmark-action' : 'bookmark-button';

    const childClassNames = classNames(
      defaultClass,
      className,
      active ? 'bookmarked' : 'bookmark',
    );

    return (
      <a className={childClassNames} onClick={onClickBookMark}>
        <CustomIcons
          type={active ? 'bookmarked' : 'bookmark'}
          className={`bookmark-icon`}
        />
        {type === 'button' && label}
      </a>
    );
  }
}

RenderButton.propTypes = {
  onClickBookMark: PropTypes.any,
  bookmark: PropTypes.any,
  type: PropTypes.any,
  className: PropTypes.any,
  label: PropTypes.any,
  active: PropTypes.any,
};

const BookmarkAction = ({
  user,
  type,
  label,
  action,
  className,
  _id,
  typeBookMark,
  setAuthPopup,
  ...rest
}) => {
  const { bookmarks, bookmarksEvents } = user;
  const { t } = useTranslation();
  const idString = String(_id);

  let books = bookmarks;
  if (typeBookMark === 'event') {
    books = bookmarksEvents;
  }

  const active = books.some(i => {
    return i === idString || i._id === idString;
  });

  const onClickBookMark = () => {
    if (user?._id) {
      if (active) {
        user.onRemoveBookMark(idString, typeBookMark);
      } else {
        user.onPushBookMark(idString, typeBookMark);
      }
    } else {
      setAuthPopup({ open: true });
    }
  };

  return (
    <RenderButton
      onClickBookMark={onClickBookMark}
      type={type}
      label={label ? label : t('common.bookmark')}
      active={active}
      className={className}
    />
  );
};

BookmarkAction.propTypes = {
  type: PropTypes.oneOf(['button', 'icon']).isRequired,
  label: PropTypes.string,
};

export default withUser(withAuthPopup(BookmarkAction));
