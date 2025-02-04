import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FilmListComponent} from "./film-list/film-list.component";
import {AddFilmComponent} from "./add-film/add-film.component";
import {FilmEditDeactivateGuardGuard} from "./guards/film-edit-deactivate-guard.guard";

const routes: Routes = [
  { path: '', component: FilmListComponent },
  {
    path: 'add',
    component: AddFilmComponent,
    canDeactivate: [FilmEditDeactivateGuardGuard]
  },
  {
    path: 'edit/:id',
    component: AddFilmComponent,
    canDeactivate: [FilmEditDeactivateGuardGuard]
  },
  { path: 'view/:id', component: AddFilmComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmsRoutingModule { }
