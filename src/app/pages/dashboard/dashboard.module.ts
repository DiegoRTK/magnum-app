import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dahboard-routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { SharedModule } from 'src/app/components/shared.module';
import { GameHomeComponent } from './game-home/game-home.component';

@NgModule({
  declarations: [
    DashboardHomeComponent,
    GameHomeComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ],
})
export class DashboardModule { }
