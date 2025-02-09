import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {MaterialModule} from "../material/material.module";
import {RouterModule} from "@angular/router";
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AutoCompleteSearchComponent } from './auto-complete-search/auto-complete-search.component';
import {ReactiveFormsModule} from "@angular/forms";
import {AuthModule} from "../auth/auth.module";

@NgModule({
    declarations: [
        NavbarComponent,
        ConfirmDialogComponent,
        AutoCompleteSearchComponent
    ],
    exports: [
        NavbarComponent,
        ConfirmDialogComponent,
        AutoCompleteSearchComponent
    ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
