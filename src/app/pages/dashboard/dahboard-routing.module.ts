import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { GameHomeComponent } from './game-home/game-home.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardHomeComponent },
      {
        path: 'juego',
        component: GameHomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
