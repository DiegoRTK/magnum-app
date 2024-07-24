import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AlertService } from 'src/app/shared/services/alert.service';
import { GameService } from 'src/app/shared/services/game.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss'],
})
export class DashboardHomeComponent implements OnInit {
  public isLoading = false;

  public usersForm: FormGroup = this.fb.group({
    player1Name: ['', Validators.required],
    player2Name: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {}

  public resetForm(): void {
    this.usersForm.reset();
  }

  public startBattle(): void {
    if (this.usersForm.invalid) {
      this.alertService.showWarning('Todos los campos son obligatorios');
      this.usersForm.markAllAsTouched();
      this.usersForm.updateValueAndValidity();
      return;
    }
    this.isLoading = true;
    this.gameService
      .startBattle(this.usersForm.value)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (value) => {
          this.alertService.showSuccess('¡La partida ha comenzado!');
        },
        error: (error) => {
          let errorMessage: string;
          if (error instanceof HttpErrorResponse) {
            errorMessage =
              error?.error?.message ||
              'Ha ocurrido un error al iniciar la partida.';
          } else {
            errorMessage = String(error) || 'Ha ocurrido un error inesperado.';
          }

          this.alertService.showError(errorMessage);
        },
      });
  }
}
