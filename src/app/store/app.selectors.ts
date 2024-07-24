import { createSelector } from '@ngrx/store';
import { AppStateProps } from './app.state';

export const selectIsAuthenticated = (state: AppStateProps) => state.app?.isAuthenticated;

export const selectAccountId = (state: AppStateProps) => state.app?.accountId;

export const selectAccessToken = (state: AppStateProps) =>  state.app?.access_token;

export const selectRole = (state: AppStateProps) =>  state.app?.role.roleName;

export const selectError = (state: AppStateProps) => state.app?.error;

export const selectAgentId = (state: AppStateProps) => state.app.agentId

export const selectIsUserAuthenticated = createSelector(
  selectIsAuthenticated,
  isAuthenticated => isAuthenticated === true
);

export const selectAuthState = createSelector(
  selectIsAuthenticated,
  selectAccessToken,
  (isAuthenticated, accessToken) => ({ isAuthenticated, accessToken })
);

export const getCurrentRoute = (state: AppStateProps) => ({index: state.app?.currentRoute, subIndex: state.app?.subIndex});