import { Action, createReducer, on } from '@ngrx/store';
import * as AuthActions from './app.actions';
import { InitialState } from './app.state';

const initialState: InitialState = {
  isAuthenticated: false,
  accountId: null,
  access_token: null,
  error: null,
  role: {
    roleId: 0,
    roleName: '',
    description: '',
    createdAt: new Date()
  },
  agentId: 0
};

const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { accountId, access_token, role, agentId}) => ({
    ...state,
    isAuthenticated: true,
    accountId: accountId,
    agentId: agentId,
    access_token: access_token,
    error: null,
    role: role
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isAuthenticated: false,
    accountId: null,
    access_token: null,
    error: error
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    isAuthenticated: false,
    accountId: null,
    access_token: null,
    error: null
  })),
  on(AuthActions.setCurrentRoute, (state, { route, subIndex }) => ({
    ...state,
    currentRoute: route,
    subIndex: subIndex
  }))
);

export function reducer(state: InitialState | undefined, action: Action) {
  return authReducer(state, action);
}
