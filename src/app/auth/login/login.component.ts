import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.username === 'staff' && this.password === 'password') {
      this.router.navigate(['/customers']); // Navigate to customers module
    } else {
      alert('Invalid credentials');
    }
  }
}
