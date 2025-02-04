import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActorsRoutingModule } from './actors-routing.module';
import { AddActorComponent } from './add-actor/add-actor.component';
import { ActorListComponent } from './actor-list/actor-list.component';
import { ActorFilmsComponent } from './actor-films/actor-films.component';
import {MaterialModule} from "../material/material.module";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    AddActorComponent,
    ActorListComponent,
    ActorFilmsComponent
  ],
  imports: [
    CommonModule,
    ActorsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MaterialModule
  ]
})
export class ActorsModule { }
