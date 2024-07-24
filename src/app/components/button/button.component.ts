import { Component, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'magnum-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label = '';
  @Input() icon: IconProp | null = null; 
  @Input() iconPosition!: 'left' | 'right' | 'top'| 'bottom';
  @Input() rounded = false;
  @Input() type: 'primary' | 'secondary' | 'danger' | 'edit' | 'success' = 'primary';
  @Input() outline: boolean = false;
  @Input() contentPosition = '';
  @Input() border = true;

  get classes(): string {
    let buttonClasses = `${this.contentPosition} btn`;
    buttonClasses = this.border ? buttonClasses : buttonClasses + ' no-border';
    if (!this.outline) {
      if (this.type === 'primary') {
        buttonClasses += ' btn-primary';
      } else if (this.type === 'secondary') {
        buttonClasses += ' btn-secondary';
      } else if (this.type === 'danger') {
        buttonClasses += ' btn-danger';
      } else if (this.type === 'edit') {
        buttonClasses += ' btn-warning';
      } else if (this.type === 'success') {
        buttonClasses += ' btn-success';
      }
    } else {
      buttonClasses += ' btn-outline-' + this.type;
    }
    if (this.rounded) {
      buttonClasses += ' btn-rounded';
    }
    return buttonClasses;
  }
}
