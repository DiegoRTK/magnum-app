import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { startBatlle } from 'src/app/store/app.actions';
import { AppStateProps } from 'src/app/store/app.state';

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
    private store: Store<AppStateProps>,
    private toastService: ToastrService
  ) {}

  ngOnInit(): void {}

  public resetForm(): void {
    this.usersForm.reset();
  }

  public startBattle(): void {
    if (this.usersForm.invalid) {
      this.toastService.info('Todos los campos son obligatorios.');
      this.usersForm.markAllAsTouched();
      this.usersForm.updateValueAndValidity();
      return;
    }
    this.isLoading = true;
    this.store.dispatch(startBatlle(this.usersForm.value));
    this.isLoading = false;
  }
}
