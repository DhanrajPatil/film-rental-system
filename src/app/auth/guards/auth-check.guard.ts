import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthApiService} from "../services/auth-api.service";

@Injectable({
  providedIn: 'root'
})
export class AuthCheckGuard implements CanActivate {


  public constructor(private authService: AuthApiService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isLoggedIn) { // Your method to check login status
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to your login page
      return false;
    }
  }

}
