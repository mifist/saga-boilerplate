import produce from 'immer';
import {
  FLUSH_STATE,
  LOAD_COMMENTS,
  LOAD_COMMENTS_ERROR,
  LOAD_COMMENTS_SUCCESS,
  REPORT_POST,
  REPORT_POST_ERROR,
  REPORT_POST_SUCCESS,
  SET_REPORT_POPOP_OPENED,
  MODIFY_POST_TYPE,
  MODIFY_POST_TYPE_ERROR,
  MODIFY_POST_TYPE_SUCCESS,
  SET_MODIFY_POST_TYPE_POPOP_OPENED,
  UPDATE_COMMENT_LIST,
} from './constants';

export const initialState = {
  error: false,
  comments: [],
  loading: false,
  firstRender: true,
  reportPopupOpened: false,
  modifyPostTypePopupOpened: false,
};

/* eslint-disable default-case, no-param-reassign */
const commentsOverviewReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FLUSH_STATE:
        return initialState;

      // Load all Comments for Single Case
      case LOAD_COMMENTS:
        draft.loading = true;
        draft.error = false;
        draft.id = action.id;
        draft.firstRender = false;
        break;

      case LOAD_COMMENTS_SUCCESS:
        draft.comments = action.comments;
        draft.loading = false;
        draft.firstRender = false;
        break;

      case LOAD_COMMENTS_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case REPORT_POST:
        draft.loading = true;
        break;
      case REPORT_POST_SUCCESS:
        draft.loading = false;
        draft.reportPopupOpened = false;
        break;
      case REPORT_POST_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;

      case SET_REPORT_POPOP_OPENED:
        draft.reportPopupOpened = action.opened;
        break;

      case MODIFY_POST_TYPE:
        draft.loading = true;
        break;
      case MODIFY_POST_TYPE_SUCCESS:
        draft.loading = false;
        draft.modifyPostTypePopupOpened = false;
        break;
      case MODIFY_POST_TYPE_ERROR:
        draft.error = action.error;
        draft.loading = false;
        break;
      case SET_MODIFY_POST_TYPE_POPOP_OPENED:
        draft.modifyPostTypePopupOpened = action.opened;
        break;

      case UPDATE_COMMENT_LIST:
        if (action.actionType === 'delete' || action.actionType === 'like') {
          if (action.data.type === 'child') {
            const parentIndex = state.comments.findIndex(
              comment => comment._id === action.data.parentId,
            );
            const childIndex = state.comments[parentIndex].answers.findIndex(
              answer => answer._id === action.data._id,
            );
            draft.comments[parentIndex].answers[childIndex] = action.data;
          } else {
            const parentIndex = state.comments.findIndex(
              comment => comment._id === action.data._id,
            );
            draft.comments[parentIndex] = {
              ...action.data,
              answers: state.comments[parentIndex].answers,
            };
          }
        } else if (action.actionType === 'reply') {
          const parentIndex = state.comments.findIndex(
            comment => comment._id === action.data.parentComment._id,
          );

          draft.comments[parentIndex].answers.push(action.data.newAnswer);
        } else if (
          action.actionType === 'edit' &&
          action.data.type === 'child'
        ) {
          const parentIndex = state.comments.findIndex(
            comment => comment._id === action.data.parentId,
          );

          const childIndex = state.comments[parentIndex].answers.findIndex(
            answer => answer._id === action.data._id,
          );

          draft.comments[parentIndex].answers[childIndex] = action.data;
        } else {
          let i = state.comments.findIndex(
            comment => comment._id === action.data._id,
          );

          if (i !== -1) {
            draft.comments[i] = {
              ...action.data,
              answers: state.comments[i].answers,
            };
          } else {
            draft.comments.unshift(action.data);
          }
        }
        break;
    }
  });

export default commentsOverviewReducer;