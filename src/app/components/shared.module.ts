import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { IconsModule } from './icons.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputComponent } from './input/input.component';
import { ButtonComponent } from './button/button.component';
// import { SmallSpinnerComponent } from './small-spinner/small-spinner.component';
// import { NavbarComponent } from './navbar/navbar.component';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
// import { DatatableSharedComponent } from './datatable/datatable.component';
// import { SidebarComponent } from './sidebar/sidebar.component';
// import { NavbarBreadcrumbComponent } from './navbar-breadcrumb/navbar-breadcrumb.component';
// import { SelectComponent } from './select/select.component';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { TabsComponent } from './tabs/tabs.component';
// import { AvatarComponent } from './avatar/avatar.component';
// import { OffcanvasComponent } from './offcanvas/offcanvas.component';
// import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    SpinnerComponent,
    InputComponent,
    ButtonComponent,
    // SmallSpinnerComponent,
    // NavbarComponent,
    // DatatableSharedComponent,
    // SidebarComponent,
    // NavbarBreadcrumbComponent,
    // SelectComponent,
    // TabsComponent,
    // AvatarComponent,
    // OffcanvasComponent,
    // ModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    IconsModule,
    // NgSelectModule,
  ],
  exports: [
    CommonModule,
    SpinnerComponent,
    NgbModule,
    InputComponent,
    IconsModule,
    ButtonComponent,
    // DatatableSharedComponent,
    // SmallSpinnerComponent,
    // NavbarComponent,
    // NgxDatatableModule,
    // SidebarComponent,
    // NavbarBreadcrumbComponent,
    // SelectComponent,
    // NgbCollapseModule,
    // TabsComponent,
    // AvatarComponent,
    // OffcanvasComponent,
    // ModalComponent
  ],
})
export class SharedModule {}
