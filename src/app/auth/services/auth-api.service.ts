import {SupabaseClient, User, createClient} from "@supabase/supabase-js";

declare const google: any;
import {Inject, Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {BehaviorSubject, Observable, of, Subject, tap} from "rxjs";
import {UserDetails} from "../../models/user-details";
import {LOGIN_HEADER_KEY, TOKEN_HEADER_KEY} from "../../shared/constants/constants";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private authUrl = environment.authUrl;
  currentUserDetails$: Subject<UserDetails> = new Subject<UserDetails>();
  isLoggedIn = false;
  logInContext: 'GOOGLE' | 'META' | 'GITHUB' | null =  null;
  private supabaseClient!: SupabaseClient;

  constructor(private http: HttpClient,
              private router: Router,
              @Inject(TOKEN_HEADER_KEY) private tokenKey: string,
              @Inject(LOGIN_HEADER_KEY) private loginHeader: string) {
    this.supabaseClient = createClient(environment.supabase.url, environment.supabase.key);
    this.supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Supabase Auth State Change', event, session);
      if (event === 'SIGNED_IN') {
        this.isLoggedIn = true;
        this.logInContext = 'META';
        if(session && session.user) {
          const user : UserDetails = {
            email: session.user.email,
            firstName: session.user.user_metadata['first_name'],
            lastName: session.user.user_metadata['last_name'],
            role: ['ROLE_USER'],
            token: session.access_token,
            id: session.user.id,
            photoUrl: session.user.user_metadata['avatar_url'],
            password: null
          }
          this.currentUserDetails$.next(user);
          this.router.navigate(['/films']);
        }
      } else {
        this.isLoggedIn = false;
        this.currentUserDetails$.next({} as UserDetails);
      }
    });
  }

  login(email: string, password: string): Observable<any> {
    const headers = this.createAuthHeader(email, password);
    return this.http.post(`${this.authUrl}/login`, null, { headers, observe: "response" }).pipe(
      tap((response: any) => {
          const header = response.headers.get(this.loginHeader);
          if (header) {
            this.setToken(header);
            this.isLoggedIn = true;
            this.logInContext = null;
            this.currentUserDetails$.next(response as UserDetails);
          }
        }
      )
    );
  }

  emailCheck(email: string): Observable<boolean> {
    return this.http.get<any>(this.authUrl + `/email-exists/${email}`);
  }

  signUp(user: UserDetails): Observable<any> {
    if(!user.email  || user.email === '' || !user.password || user.password === ''){
      return new Observable();
    }
    const headers = this.createAuthHeader(user.email, user.password);
    user.email = '';
    user.password = '';
    return this.http.post(`${this.authUrl}/signup`, user, { headers, observe: "response" }).pipe(
      tap((response: any) => {
        const header = response.headers.get(this.loginHeader);
        if (header) {
          this.setToken(header);
          this.isLoggedIn = true;
          this.currentUserDetails$.next(response as UserDetails);
        }
      })
    );
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
    switch (this.logInContext) {
      case 'GOOGLE':
        return this.signOutGoogle();
      default:
        return this.logoutProfile();
    }
  }

  logoutProfile() {
    return this.http.post(`${this.authUrl}/logout`, null).pipe(
      tap(() => {
        this.clearToken();
        this.isLoggedIn = false;
      })
    );
  }

  handleGoogleSignInResponse(googleResponse: any): void {
    const encodedToken = googleResponse.credential.split('.')[1];
    const token = JSON.parse(atob(encodedToken));
    const user = {
      email: token.email,
      firstName: token.given_name,
      lastName: token.family_name,
      role: ['ROLE_USER'],
      token: googleResponse.credential,
      id: token.sub,
      photoUrl: token.picture
    } as UserDetails;
    this.isLoggedIn = true;
    this.logInContext = 'GOOGLE';
    this.currentUserDetails$.next(user as UserDetails);
    this.setToken(JSON.stringify(token));
  }

  async signInWithGithub() {
    await this.supabaseClient.auth.signInWithOAuth({
      provider: 'github'
    });
  }

  async signOut() {
    await this.supabaseClient.auth.signOut();
  }

  async signInWithGoogle() {
    await this.supabaseClient.auth.signInWithOAuth({
      provider: 'google'
    });
  }

  signOutGoogle() {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('googleToken'), () => {
      console.log('Google Sign Out');
    });
    this.clearToken();
    this.isLoggedIn = false;
    return of({});
  }

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
}
