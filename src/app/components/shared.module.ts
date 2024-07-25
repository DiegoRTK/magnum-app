import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { IconsModule } from './icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';
import { TabsComponent } from './tabs/tabs.component';
@NgModule({
  declarations: [
    SpinnerComponent,
    InputComponent,
    ButtonComponent,
    TabsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    IconsModule,
  ],
  exports: [
    CommonModule,
    SpinnerComponent,
    NgbModule,
    InputComponent,
    IconsModule,
    ButtonComponent,
    TabsComponent
  ],
})
export class SharedModule {}
