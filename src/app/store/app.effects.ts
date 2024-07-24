import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './app.actions';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          tap((response) => {
            this.cookieService.set('access_token', response.access_token);
          }),
          map((response) =>
            AuthActions.loginSuccess({
              accountId: response.accountId,
              access_token: response.access_token,
              role: response.role,
              agentId: response.agentId,
            })
          ),
          catchError((error) => of(AuthActions.loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((response) => {
          this.cookieService.delete('access_token');
          this.cookieService.set('access_token', response.access_token);
          this.router.navigate(['/citas'])
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
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
        return { type: '[Auth] Login Failure Toast Shown' };
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.cookieService.delete('access_token');
          this.router.navigateByUrl('/login');
          localStorage.clear();
        })
      ),
    { dispatch: false }
  );
}
