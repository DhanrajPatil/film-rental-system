import { Component, OnInit } from '@angular/core';
import {UserDetails} from "../../models/user-details";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {EmailAvailabilityValidatorService} from "../../shared/validators/email-availability-validator.service";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {StringValidators} from "../../shared/validators/string-validators";
import {AuthApiService} from "../services/auth-api.service";
import {Router} from "@angular/router";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/;

@Component({
  selector: 'frs-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  userDetails: UserDetails | undefined;
  userForm!: UntypedFormGroup ;
  passwordControl = this.fb.control('',
    [Validators.required,
      Validators.minLength(8),
      Validators.pattern(passwordRegex)
    ]
  );
  confirmPasswordControl = this.fb.control('',
    [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(passwordRegex),
      StringValidators.passwordMatchCheck(this.passwordControl)
    ],

  );
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.Canada];

  constructor(private fb: UntypedFormBuilder,
              private authApi: AuthApiService,
              private router: Router,
              private emailCheckService: EmailAvailabilityValidatorService) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email], [this.emailCheckService.validate.bind(this.emailCheckService)]],
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl,
      mobileNumber: [{}, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  signUp() {
    const userFormValues = {...this.userForm.value};
    userFormValues.mobileNumber = userFormValues.mobileNumber.e164Number;
    delete userFormValues.confirmPassword;
    this.userDetails = userFormValues;
    console.log(this.userDetails);
    if(this.userDetails) {
      this.authApi.signUp(this.userDetails).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        }
      });
    }
  }

  clear() {
    this.userForm.reset();
  }
}
