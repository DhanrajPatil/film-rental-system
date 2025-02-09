declare const google: any;
import {Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {AuthApiService} from "../services/auth-api.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';

  constructor(private router: Router,
              private authApi: AuthApiService) {
  }

  ngOnInit() {
    google.accounts.id.initialize({
      client_id: "1036459211494-jvrq8cdirjkhdtrvf6191at8l9ui19i9.apps.googleusercontent.com",
      callback: this.handleCredentialResponse.bind(this)
    });
    google.accounts.id.renderButton(
      document.getElementById("google-btn"),
      { theme: "filled_blue", size: "large", shape: "rectangle", width: "200px" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    if (response.credential) {
      this.authApi.handleGoogleSignInResponse(response);
      this.router.navigate(['/films']);
    } else {
      console.log("Error: " + response.error);
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

  signInWithGithub(): void {
    this.authApi.signInWithGithub();
  }


}
