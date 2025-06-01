import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {UserDetails} from "../../models/user-details";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {EmailAvailabilityValidatorService} from "../../shared/validators/email-availability-validator.service";
import {CountryISO, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {StringValidators} from "../../shared/validators/string-validators";
import {AuthApiService} from "../services/auth-api.service";
import {Router} from "@angular/router";
declare const google: any;

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/;

@Component({
  selector: 'frs-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements AfterViewInit, AfterViewChecked {

  userDetails: UserDetails | undefined;
  private googleBtnRendered = false;
  userForm!: FormGroup ;
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

  constructor(private fb: FormBuilder,
              private authApi: AuthApiService,
              private router: Router,
              private emailCheckService: EmailAvailabilityValidatorService) {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(30)]],
      email: ['', {validators: [Validators.required, Validators.email], asyncValidators: [this.emailCheckService.validate.bind(this.emailCheckService)], updateOn: 'blur'}],
      password: this.passwordControl,
      confirmPassword: this.confirmPasswordControl,
      mobileNumber: [{}, Validators.required],
    });
  }


  ngAfterViewInit() {
    this.renderGoogleButton();
  }

  ngAfterViewChecked() {
    // If the button is missing, re-render it
    if (!this.googleBtnRendered && document.getElementById('google-btn')) {
      this.renderGoogleButton();
    }
  }


  renderGoogleButton() {
    const btn = document.getElementById('google-btn');
    if (btn) {
      google.accounts.id.initialize({
        client_id: "1036459211494-jvrq8cdirjkhdtrvf6191at8l9ui19i9.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this)
      });
      google.accounts.id.renderButton(
        btn,
        { theme: 'filled_blue', size: 'large', shape: 'rectangle', width: '200px' }
      );
      this.googleBtnRendered = true;
    }
  }

  handleCredentialResponse(response: any) {
    if (response.credential) {
      this.authApi.handleGoogleLogin(response).subscribe({
        next: (response) => {
          this.router.navigate(['/films']);
        },
        error: (error) => {
          console.error("Error occured while google sign in", error);
        },
        complete: () => {
          console.log('Google login complete');
        }
      });
    }
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
