import { Component, Input, OnInit, inject } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { distinctUntilChanged } from 'rxjs';

const equals = (one: NgbDateStruct, two: NgbDateStruct) =>
  one &&
  two &&
  two.year === one.year &&
  two.month === one.month &&
  two.day === one.day;

const before = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day < two.day
      : one.month < two.month
    : one.year < two.year;

const after = (one: NgbDateStruct, two: NgbDateStruct) =>
  !one || !two
    ? false
    : one.year === two.year
    ? one.month === two.month
      ? one.day === two.day
        ? false
        : one.day > two.day
      : one.month > two.month
    : one.year > two.year;

@Component({
  selector: 'magnum-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() control: AbstractControl = new FormControl();
  @Input() label: string | undefined;
  @Input() placeholder: string | undefined = '';
  @Input() type = 'text';
  @Input() isPassword = false;
  @Input() isCountryPicker = false;
  @Input() showLabel = true;
  @Input() isDatePicker = false;
  @Input() isDatePickerRange = false;
  @Input() iconRight = '';
  @Input() isTimePicker = false;
  @Input() spinners = false;
  @Input() fromDate: NgbDate | null = this.calendar.getToday();
  @Input() toDate: NgbDate | null = null;
  @Input() centerText = false;
  @Input() isMultipleDays = false;
  @Input() isTextArea = false;
  @Input() isCheckbox = false;
  @Input() isSwitch = false;
  @Input() isRadioButton = false;
  @Input() radioButtonValue: boolean | string = '';
  @Input() minDate!: NgbDateStruct;
  @Input() maxDate!: NgbDateStruct;
  @Input() readonly = false;
  public showPassword: boolean = false;
  public isRequired = false;
  public hoveredDate: NgbDate | null = null;
  public isFromDateActive = true;
  public showWeekdays = true;
  public newValueControl = new FormControl();
  public selectedOption = new FormControl();
  public selectedDatesList: NgbDate[] = [];

  constructor(
    public formatter: NgbDateParserFormatter,
    public calendar: NgbCalendar
  ) {}
  ngOnInit(): void {
    if (
      this.transformControl.errors &&
      this.transformControl.errors['required']
    ) {
      this.isRequired = true;
    }
    setTimeout(() => {
      if (this.transformControl.value && this.isDatePickerRange) {
        const [startDate, toDate]: string[] =
          this.transformControl.value.split(' - ');
        this.fromDate = this.parseDate(startDate);
        this.toDate = this.parseDate(toDate);
        this.updateFormControlValue();
      }
      if (this.type === 'phoneNumber') {
        if (this.transformControl.value) {
          this.transformNumber();
        }
        this.newValueControl.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe((value) => {
            this.updatePhoneNumber();
          });
        this.selectedOption.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe((value) => {
            this.updatePhoneNumber();
          });
      }
    }, 100);
  }

  ngAfterContentInit(): void {}

  get transformControl(): FormControl {
    return this.control as FormControl;
  }

  getErrorKeys(): string[] {
    const errors = this.transformControl.errors;
    if (errors) {
      return Object.keys(errors);
    }
    return [];
  }

  public togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  public inputType(): string {
    if (this.type === 'password' && !this.showPassword) {
      return 'password';
    } else if (this.type === 'password' && this.showPassword) {
      return 'text';
    } else if (this.isCountryPicker) {
      return 'tel';
    } else {
      return this.type;
    }
  }

  public onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate) {
      if (date.before(this.fromDate)) {
        this.toDate = this.fromDate;
        this.fromDate = date;
      } else {
        this.toDate = date;
      }
      this.updateFormControlValue();
    } else {
      this.fromDate = date;
      this.toDate = null;
    }
  }

  public onMultipleDateSelection(event: any, date: any) {
    event.target.parentElement.blur();
    if (!this.fromDate && !this.toDate) {
      if (event.ctrlKey == true) this.fromDate = date;
      else this.addDate(date);

      this.transformControl.setValue(this.selectedDatesList);
    } else if (this.fromDate && !this.toDate && after(date, this.fromDate)) {
      this.toDate = date;
      this.fromDate = null;
      this.toDate = null;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  addDate(date: any) {
    let index = this.selectedDatesList.findIndex(
      (f) => f.day == date.day && f.month == date.month && f.year == date.year
    );
    if (index >= 0) this.selectedDatesList.splice(index, 1);
    else this.selectedDatesList.push(date);
  }

  public validateInput(
    currentValue: NgbDate | null,
    input: string
  ): NgbDate | null {
    const parsed = this.formatter.parse(input);
    const newDate = parsed ? NgbDate.from(parsed) : null;
    if (newDate) {
      this.fromDate = newDate;
      this.updateFormControlValue();
    }
    return currentValue;
  }

  private updateFormControlValue() {
    if (this.fromDate && this.toDate) {
      const formattedFromDate = this.formatter.format(this.fromDate);
      const formattedToDate = this.formatter.format(this.toDate);
      const dateRange = `${formattedFromDate} - ${formattedToDate}`;
      this.transformControl.setValue(dateRange);
    }
  }
  public isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  public isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  public isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  public getErrorMessage(string: string): string | null {
    if (string === 'required') {
      return `${this.label} es obligatorio`;
    }
    if (string === 'email') {
      return 'Debes registrar un correo electrónico válido.';
    }
    if (string === 'pattern') {
      return this.parseErrorPatternPasswordMessage();
    }
    if (string === 'mismatch') {
      return 'Las contraseñas no coinciden.';
    }
    return null;
  }

  isDateSelected(date: NgbDateStruct): boolean {
    return this.selectedDatesList.some(
      (selectedDate) =>
        selectedDate.year === date.year &&
        selectedDate.month === date.month &&
        selectedDate.day === date.day
    );
  }

  private parseDate(date: string): NgbDate {
    const [year, month, day] = date.split('-');
    return new NgbDate(Number(year), Number(month), Number(day));
  }

  private parseErrorPatternPasswordMessage(): string {
    const actualValue = (this.transformControl.errors as ValidationErrors)[
      'pattern'
    ].actualValue;
    if (!/(?=.*[A-Z])/.test(actualValue)) {
      return 'Debe contener al menos una letra mayúscula.';
    }
    if (!/[0-9]/.test(actualValue)) {
      return 'Debe contener al menos un número.';
    }
    if (!/[^A-Za-z0-9]/.test(actualValue)) {
      return 'Debe contener al menos un carácter especial.';
    }
    if (actualValue.length < 8) {
      return 'Debe tener al menos 8 caracteres.';
    }
    return '';
  }

  private transformNumber(): void {
    setTimeout(() => {
      const [code, number] = this.transformControl.value.split(' ');
      this.selectedOption.patchValue(code);
      this.newValueControl.patchValue(number);
    }, 1);
  }

  private updatePhoneNumber(): void {
    const codeNumber = this.selectedOption.value;
    const phoneNumber = this.newValueControl.value;
    this.transformControl.setValue(`${codeNumber} ${phoneNumber}`);
  }
}
