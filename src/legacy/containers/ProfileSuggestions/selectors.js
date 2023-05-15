import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the caseOverview state domain
 */

const selectProfileSuggestionsDomain = state =>
  state.profileSuggestions || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by ProfileSuggestions
 */

const makeSelectProfileSuggestions = () =>
  createSelector(
    selectProfileSuggestionsDomain,
    substate => substate,
  );


const makeSelectEvents = () =>
  createSelector(
    selectProfileSuggestionsDomain,
    substate => substate.events,
  );
const makeSelectReplayEvents = () =>
  createSelector(
    selectProfileSuggestionsDomain,
    substate => substate.replayEvents,
  );

const makeSelectLoading = () =>
  createSelector(
    selectProfileSuggestionsDomain,
    substate => substate.loading,
  );

const  makeSelectError = () =>
  createSelector(
    selectProfileSuggestionsDomain,
    substate => substate.error,
  );

const  makeSelectType = () =>
  createSelector(
    selectProfileSuggestionsDomain,
    substate => substate.type,
  );



// export default makeSelectProfileSuggestions;
export {
  selectProfileSuggestionsDomain,
  makeSelectProfileSuggestions,
  makeSelectLoading,
  makeSelectReplayEvents,
  makeSelectError,
  makeSelectEvents,
  makeSelectType,
};
