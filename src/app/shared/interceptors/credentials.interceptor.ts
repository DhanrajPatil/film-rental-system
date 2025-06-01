import {HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {catchError, throwError} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class CredentialsInterceptor implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const modifiedReq = req.clone({ withCredentials: true });
    return next.handle(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Redirect to login page on 401 error
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

}
