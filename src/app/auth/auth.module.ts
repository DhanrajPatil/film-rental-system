import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import {MaterialModule} from "../material/material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { SignUpComponent } from './sign-up/sign-up.component';
import {NgxIntlTelInputModule} from "ngx-intl-tel-input";
import {SharedModule} from "../shared/shared.module";
import {PasswordInputComponent} from "./password-input/password-input.component";


@NgModule({
  declarations: [
    LoginComponent,
    SignUpComponent,
    PasswordInputComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxIntlTelInputModule
  ]
})
export class AuthModule { }
