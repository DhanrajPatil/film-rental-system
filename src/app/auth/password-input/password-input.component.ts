import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AsyncValidator, AsyncValidatorFn, FormControl, Validator, ValidatorFn, Validators} from '@angular/forms';
import {debounceTime} from "rxjs";

@Component({
  selector: 'frs-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.css']
})
export class PasswordInputComponent implements OnInit{
  passwordVisible = false;
  passwordType = 'password';

  @Input() placeholder = 'Please Enter Password';
  @Input() label = 'Password';
  @Input() control: FormControl = new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)]);
  @Input() validationMessageKeyMap: { [key: string]: string } = {};

  constructor() { }

  ngOnInit() {
    this.control.valueChanges.pipe(debounceTime(500)).subscribe(() => {
        this.control.markAsTouched();
      }
    );
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    this.passwordType = this.passwordVisible ? 'text' : 'password';
    if(this.passwordVisible) {
      setTimeout(() => {
        this.passwordVisible = false;
        this.passwordType = 'password';
      }, 5000);
    }
  }


}
