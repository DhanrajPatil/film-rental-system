import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import {SignUpComponent} from "./auth/sign-up/sign-up.component";
import {AuthCheckGuard} from "./auth/guards/auth-check.guard";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule), canActivate: [ AuthCheckGuard ] },
  { path: 'films', loadChildren: () => import('./films/films.module').then(m => m.FilmsModule), canActivate: [ AuthCheckGuard ] },
  { path: 'rentals', loadChildren: () => import('./rentals/rentals.module').then(m => m.RentalsModule), canActivate: [ AuthCheckGuard ] },
  { path: 'actors', loadChildren: () => import('./actors/actors.module').then(m => m.ActorsModule), canActivate: [ AuthCheckGuard ] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes,)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
