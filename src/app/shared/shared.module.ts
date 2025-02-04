import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import {MaterialModule} from "../material/material.module";
import {RouterModule} from "@angular/router";
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AutoCompleteSearchComponent } from './auto-complete-search/auto-complete-search.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    NavbarComponent,
    ConfirmDialogComponent,
    AutoCompleteSearchComponent
  ],
  exports: [
    NavbarComponent,
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
