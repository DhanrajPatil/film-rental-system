import {Component, Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AddFilmComponent} from "../add-film/add-film.component";

@Injectable({
  providedIn: 'root'
})
export class FilmEditDeactivateGuardGuard implements CanDeactivate<AddFilmComponent> {
  canDeactivate(
    component: AddFilmComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!component.isViewForm && component.filmForm.dirty) {
      return component.openConfirmDialog();
    }
    return true;
  }

}
