import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the personalSideBar state domain
 */

const selectPersonalSideBarDomain = state =>
  state.personalSideBar || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by PersonalSideBar
 */

const makePersonalSideBar = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate,
  );


const makeSelectMyEvents = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate.myEvents,
  );

const makeSelectMyCommunities = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate.myCommunities,
  );

const makeSelectMyReplayEvents = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate.myReplayEvents,
  );


const makeSelectLoading = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate.loading,
  );

const makeSelectLoadingCommunities = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate.loadingCommunities,
  );

const  makeSelectError = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate.error,
  );

const  makeSelectType = () =>
  createSelector(
    selectPersonalSideBarDomain,
    substate => substate.type,
  );


// export default makeSelectPersonalSideBar;
export {
  makeSelectMyEvents,
  makeSelectMyReplayEvents,
  makePersonalSideBar,
  makeSelectLoading,
  makeSelectError,
  makeSelectType,
  makeSelectMyCommunities,
  makeSelectLoadingCommunities,
};
