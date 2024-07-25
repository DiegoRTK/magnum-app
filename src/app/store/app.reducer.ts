import { Action, createReducer, on } from '@ngrx/store';
import * as GameActions from './app.actions';
import { InitialState } from './app.state';

const initialState: InitialState = {
  roundId: 0,
  gameSessionId: 0,
  error: '',
  player1: {
    id: 0,
    name: '',
  },
  player2: {
    id: 0,
    name: '',
  },
};

const authReducer = createReducer(
  initialState,
  on(
    GameActions.battleSuccess,
    (state, { player1, player2, roundId, gameSessionId }) => ({
      ...state,
      player1,
      player2,
      roundId,
      gameSessionId,
    })
  ),
  on(GameActions.battleFailure, (state, { error }) => ({
    ...state,
    player1: {
      id: 0,
      name: '',
    },
    player2: {
      id: 0,
      name: '',
    },
    roundId: 0,
    gameSessionId: 0,
    error: error,
    player1Name: '',
    player2Name: '',
  })),
  on(GameActions.newRoundSuccess, (state, { roundId }) => ({
    ...state,
    roundId,
  }))
);

export function reducer(state: InitialState | undefined, action: Action) {
  return authReducer(state, action);
}
