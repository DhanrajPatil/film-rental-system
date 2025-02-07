import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthApiService} from "../services/auth-api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router,
              private authApi: AuthApiService) {
    this.authApi.socialAuthStateObservable$.subscribe({
      next: (state) => {
        if(state) {
          this.router.navigate(['/films']);
        }
      }
    });
  }

  onLogin() {
    this.authApi.login(this.email, this.password)
      .subscribe({
        next: (response) => {
          this.router.navigate(['/films']);
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          console.log('complete');
        }
      });
  }

  signInWithGoogle(): void {
    this.authApi.signInWithGoogle();
  }
}
