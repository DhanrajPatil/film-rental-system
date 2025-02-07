import {Inject, Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {TOKEN_HEADER_KEY} from "../constants/constants";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(@Inject(TOKEN_HEADER_KEY) private tokenKey: string) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem(this.tokenKey);

    if (token && !req.url.includes('auth')) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }

}
