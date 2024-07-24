import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showAlert(icon: SweetAlertIcon | undefined, message: string, confirmButtonText = 'OK', showCancelButton = false, cancelButtonText = 'Cancelar', html?: string, reverseButtons = false, customClass?: Object): Promise<any> {
    return Swal.fire({
      icon: icon ? icon : undefined,
      title: '',
      html: html,
      text: message,
      showCancelButton: showCancelButton,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      confirmButtonColor: 'gray',
      reverseButtons: reverseButtons,
      customClass: customClass,
      width: 'auto'
    });
  }

  showSuccess(message: string): Promise<SweetAlertResult> {
    return this.showAlert('success', message);
  }

  showError(message: string): Promise<SweetAlertResult> {
    return this.showAlert('error', message);
  }

  showWarning(message: string): Promise<SweetAlertResult> {
    return this.showAlert('warning', message);
  }

  showInfo(message: string): Promise<SweetAlertResult> {
    return this.showAlert('info', message);
  }

  showConfirmation(message: string, confirmButtonText = 'Sí', cancelButtonText = 'Cancelar'): Promise<SweetAlertResult> {
    return this.showAlert('question', message, confirmButtonText, true, cancelButtonText);
  }
}
