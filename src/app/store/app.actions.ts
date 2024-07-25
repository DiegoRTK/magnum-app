import { createAction, props } from '@ngrx/store';
import { PlayerInterface } from '../shared/interfaces/player.interface';
import { BattleInterface } from '../shared/interfaces/battle.interface';

export const startBatlle = createAction(
  '[Game] Start',
  props<{ player1Name: string; player2Name: string }>()
);

export const battleSuccess = createAction(
  '[Game] Start Success',
  props<{
    player1: PlayerInterface;
    player2: PlayerInterface;
    roundId: number;
    gameSessionId: number;
  }>()
);

export const battleFailure = createAction(
  '[Game] Start Failure',
  props<{ error: any }>()
);

export const newRoundSuccess = createAction(
  '[Game] New Round',
  props<{roundId: number}>()
);
