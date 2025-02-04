import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilmsRoutingModule } from './films-routing.module';
import { FilmListComponent } from './film-list/film-list.component';
import { AddFilmComponent } from './add-film/add-film.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {MaterialModule} from "../material/material.module";
import {HttpClientModule} from "@angular/common/http";
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from "@angular/material/form-field";
import {SharedModule} from "../shared/shared.module";


@NgModule({
  declarations: [
    FilmListComponent,
    AddFilmComponent
  ],
    imports: [
        CommonModule,
        FilmsRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        MaterialModule,
        HttpClientModule,
        SharedModule
    ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}
  ]
})
export class FilmsModule { }
