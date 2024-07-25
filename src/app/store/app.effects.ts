import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GameActions from './app.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { GameService } from '../shared/services/game.service';

@Injectable()
export class GameEffects {
  constructor(
    private actions$: Actions,
    private gameService: GameService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  startBattle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.startBatlle),
      mergeMap((action) =>
        this.gameService.startBattle(action).pipe(
          map((response) =>
            GameActions.battleSuccess({
              player1: response.player1,
              player2: response.player2,
              roundId: response.roundId,
              gameSessionId: response.gameSessionId,
            })
          ),
          catchError((error) => of(GameActions.battleFailure({ error })))
        )
      )
    )
  );

  battleSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameActions.battleSuccess),
        tap(() => {
          this.toastr.success('!La partida ha comenzado!');
          this.router.navigate(['/dashboard/juego']);
        })
      ),
    { dispatch: false }
  );

  newRoundSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(GameActions.newRoundSuccess),
        tap(() => {
          this.toastr.success('!Se ha creado la ronda correctamente!');
        }),
        map((response) =>
          GameActions.newRoundSuccess({
            roundId: response.roundId,
          })
        )
      ),
    { dispatch: false }
  );

  battleError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GameActions.battleFailure),
      map(({ error }) => {
        if (
          error instanceof HttpErrorResponse &&
          error.error &&
          error.error.message
        ) {
          this.toastr.error(error.error.message, 'Error');
        } else {
          this.toastr.error('Ha ocurrido un error inesperado.', 'Error');
        }
        return { type: '[Game] Battle Failure Toast Shown' };
      })
    )
  );
}
