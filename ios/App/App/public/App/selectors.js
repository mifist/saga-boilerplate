import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectGlobal = state => state?.global ?? initialState;
const selectRouter = state => state?.router;

export const makeSelectLoading = () => 
  createSelector(
    selectGlobal,
    globalState => globalState.loading
  );

export const makeSelectError = () => 
  createSelector(
    selectGlobal,
    globalState => globalState.error
  );