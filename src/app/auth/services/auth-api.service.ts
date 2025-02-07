import {Inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {UserDetails} from "../../models/user-details";
import {LOGIN_HEADER_KEY, TOKEN_HEADER_KEY} from "../../shared/constants/constants";
import {GoogleLoginProvider, SocialAuthService} from "@abacritt/angularx-social-login";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private authUrl = environment.authUrl;
  public socialAuthStateObservable$ = this.socialAuthService.authState;

  constructor(private http: HttpClient,
              private socialAuthService: SocialAuthService,
              @Inject(TOKEN_HEADER_KEY) private tokenKey: string,
              @Inject(LOGIN_HEADER_KEY) private loginHeader: string) {

  }

  login(email: string, password: string): Observable<any> {
    const headers = this.createAuthHeader(email, password);
    return this.http.post(`${this.authUrl}/login`, null, { headers, observe: "response" }).pipe(
      tap((response: any) => {
          const header = response.headers.get(this.loginHeader);
          if (header) {
            this.setToken(header);
          }
        }
      )
    );
  }

  emailCheck(email: string): Observable<boolean> {
    return this.http.get<any>(this.authUrl + `/email-exists/${email}`);
  }

  signUp(user: UserDetails): Observable<any> {
    const headers = this.createAuthHeader(user.email, user.password);
    user.email = '';
    user.password = '';
    return this.http.post(`${this.authUrl}/signup`, user, { headers });
  }

  createAuthHeader(email: string, password: string): HttpHeaders{
    const credentials = `${email}:${password}`;
    const encodedCredentials = btoa(credentials);
    const headers = new HttpHeaders({
      [this.loginHeader]: `Basic ${encodedCredentials}`
    });
    return headers;
  }

  logout(): Observable<any> {
    return this.http.post(`${this.authUrl}/logout`, null).pipe(
      tap(() => this.clearToken())
    );
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }
}
