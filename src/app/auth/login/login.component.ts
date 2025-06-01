declare const google: any;
import {AfterViewChecked, AfterViewInit, Component} from '@angular/core';
import { Router } from '@angular/router';
import {AuthApiService} from "../services/auth-api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit, AfterViewChecked{
  private googleBtnRendered = false;
  email: string = '';
  password: string = '';

  constructor(private router: Router,
              private authApi: AuthApiService) {}

  ngAfterViewInit() {
    this.renderGoogleButton();
  }

  ngAfterViewChecked() {
    // If the button is missing, re-render it
    if (!this.googleBtnRendered && document.getElementById('google-btn')) {
      this.renderGoogleButton();
    }
  }


  renderGoogleButton() {
    const btn = document.getElementById('google-btn');
    if (btn) {
      google.accounts.id.initialize({
        client_id: "1036459211494-jvrq8cdirjkhdtrvf6191at8l9ui19i9.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this)
      });
      google.accounts.id.renderButton(
        btn,
        { theme: 'filled_blue', size: 'large', shape: 'rectangle', width: '200px' }
      );
      this.googleBtnRendered = true;
    }
  }

  handleCredentialResponse(response: any) {
    if (response.credential) {
      this.authApi.handleGoogleLogin(response).subscribe({
        next: (response) => {
          this.router.navigate(['/films']);
        },
        error: (error) => {
          console.error("Error occured while google sign in", error);
        },
        complete: () => {
          console.log('Google login complete');
        }
      });
    }
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
}
