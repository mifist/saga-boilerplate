import React, { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Comment, Collapse, message } from 'antd';

import CustomIcons from 'legacy/components/CustomIcons';
import CommentContent from './CommentContent';
import DeletedCommentMsg from './DeletedCommentMsg';
import CommentAuthor from './CommentAuthor';
import CommentMenu from './CommentMenu';
import HiddenCommentMsg from './HiddenCommentMsg';
import CommentFormNew from '../CommentFormNew';
import ModalWithLikes from 'legacy/components/ModalWithLikes';

import api, { setAuthorizationHeader } from 'engine/api/axiosAPI';

import { withUser } from 'engine/context/User.context';
import { withAuthPopup } from 'engine/context/AuthPopup.context';

import './style.scss';

const CommentItem = ({
  // main props
  commentType,
  comment,
  postData,
  // props
  user,
  setAuthPopup,
  // default
  children,
  className,
  updateCommentList,
  parent,
}) => {
  const childClassNames = classNames('comment-item', className);
  const { t } = useTranslation();
  const currentUser = JSON.parse(localStorage.getItem('beemed_user'));

  const [showForm, setShowForm] = useState({ opened: false, type: null });

  const onClickMenuCallback = ({ key, domEvent }) => {
    //console.debug(key);
    domEvent.preventDefault();

    switch (key) {
      case 'delete':
        api.comments
          .deleteComment({
            _id: comment._id,
            active: false,
          })
          .then(data => {
            message.info('This comment was deleted');

            updateCommentList(
              'delete',
              parent ? { ...data.data, parentId: parent._id } : data.data,
            );
          })
          .catch(e => console.log(e));
        break;
      case 'edit':
        setShowForm({ opened: true, type: 'edit' });
        break;
      case 'highlight':
        api.comments
          .hightlightComment({
            _id: comment._id,
            highlighted: comment.highlighted ? false : true,
          })
          .then(data => {
            updateCommentList(
              'like',
              parent ? { ...data.data, parentId: parent._id } : data.data,
            );
          })
          .catch(e => console.log(e));
        break;
      default:
        break;
    }
  };

  const isActiveLike = comment?.likes?.some(e => e?._id === user?._id);

  const onClickLike = () => {
    if (user?._id) {
      setAuthorizationHeader(currentUser.token);

      api.comments
        .likeComment({
          _id: comment._id,
          likes: isActiveLike
            ? comment?.likes
                ?.filter(i => i?._id !== user._id)
                ?.map(like => ({
                  _id: like._id,
                }))
            : [
                ...comment?.likes.map(like => ({
                  _id: like._id,
                })),
                { _id: user._id },
              ],
        })
        .then(data => {
          updateCommentList(
            'like',
            parent ? { ...data.data, parentId: parent._id } : data.data,
          );
        })
        .catch(e => console.log(e));
    } else {
      setAuthPopup({ open: true });
    }
  };

  // Comment Options
  let commentOptions = {
    className: childClassNames,
    actions: [
      <CommentMenu
        comment={comment}
        post={postData}
        onClick={onClickMenuCallback}
      />,
      <span
        className="comment-reply-to"
        onClick={e =>
          setShowForm(prev => ({
            type:
              prev.opened && prev.type === 'edit'
                ? 'reply'
                : prev.opened
                ? null
                : 'reply',
            opened: prev.type === 'edit' ? true : !prev.opened,
          }))
        }
      >
        <CustomIcons type="comments" />{' '}
        {t(
          `common.${
            showForm.opened
              ? showForm.type === 'edit'
                ? 'reply'
                : 'close'
              : 'reply'
          }`,
        )}
      </span>,
      <>
        <span
          className={`comment-likes${isActiveLike ? ' active' : ''}`}
          onClick={onClickLike}
        >
          {isActiveLike ? (
            <CustomIcons type="downvote" />
          ) : (
            <CustomIcons type="upvote" />
          )}
        </span>
        <ModalWithLikes
          dataSourse={comment}
          community={comment?.community}
          userLikes={comment?.likes?.length}
          className="overview_comments-form-likes"
        />
      </>,
      showForm.opened && showForm.type === 'reply' && (
        <CommentFormNew
          showForm={showForm.opened}
          setShowForm={data => {
            if (user?._id) {
              setShowForm(data);
            } else {
              setAuthPopup({ open: true });
            }
          }}
          nodeType="child"
          postType={commentType}
          actionType="reply"
          postData={postData}
          onSubmitResponse={data => updateCommentList('reply', data)}
          parent={comment.type === 'parent' ? comment : parent}
        />
      ),
    ],
    author: comment.type !== 'parent' && (
      <CommentAuthor view="header" comment={comment} user={user} />
    ),
    content: (
      <CommentContent
        comment={comment}
        showContent={!showForm.opened || showForm.type === 'reply'}
        contentBelow={
          showForm.opened &&
          showForm.type === 'edit' && (
            <CommentFormNew
              showForm={showForm.opened && showForm.type === 'edit'}
              setShowForm={setShowForm}
              nodeType={comment.type}
              postType={commentType}
              actionType="edit"
              postData={postData}
              onSubmitResponse={data =>
                updateCommentList('edit', {
                  ...data,
                  parentId: data.type === 'child' ? parent._id : undefined,
                })
              }
              initialData={comment}
            />
          )
        }
      />
    ),
  };

  return !comment?.active ? (
    <DeletedCommentMsg showMsg={!comment?.active} />
  ) : user?.hiddenComments?.includes(comment._id) ? (
    <HiddenCommentMsg commentId={comment._id} />
  ) : (
    <div className="comment-item-wrapper">
      {comment.type === 'parent' ? (
        <Collapse
          defaultActiveKey={['1']}
          expandIconPosition="left"
          className="comment-accordion"
          key={comment._id}
        >
          <Collapse.Panel
            header={
              <CommentAuthor view="header" comment={comment} user={user} />
            }
            key="1"
          >
            <Comment {...commentOptions}>{children}</Comment>
          </Collapse.Panel>
        </Collapse>
      ) : (
        <Comment {...commentOptions}>{children}</Comment>
      )}
    </div>
  );
};

export default memo(withUser(withAuthPopup(CommentItem)));
