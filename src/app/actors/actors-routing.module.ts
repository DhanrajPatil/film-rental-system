import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ActorListComponent} from "./actor-list/actor-list.component";
import {AddActorComponent} from "./add-actor/add-actor.component";
import {ActorFilmsComponent} from "./actor-films/actor-films.component";

const routes: Routes = [
  { path: '', component: ActorListComponent },
  { path: 'add', component: AddActorComponent },
  { path: ':id/edit', component: AddActorComponent },
  { path: ':id/view', component: AddActorComponent },
  { path: ':id/films', component: ActorFilmsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActorsRoutingModule { }
