import { Component, OnInit } from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";
import {AuthApiService} from "../../auth/services/auth-api.service";
import {UserDetails} from "../../models/user-details";
import {Router} from "@angular/router";

@Component({
  selector: 'frs-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  sideNavOptions = [
    { label: 'Customers List', link: '/customers', icon: 'group' },
    { label: 'Add Customer', link: '/customers/add', icon: 'person_add' },
    { label: 'Recent Customers Dashboard', link: '/customers/dashboard', icon: 'dashboard' },
    { label: 'Films List', link: '/films', icon: 'movie' },
    { label: 'Add Film', link: '/films/add', icon: 'add' },
    { label: 'Film Inventory', link: '/films/inventory', icon: 'inventory' },
    { label: 'Rentals', link: '/rentals', icon: 'assignment' },
    { label: 'Logout', link: '/login', icon: 'logout' },
  ];
  lastOpenMenu: MatMenuTrigger | null = null;
  user!: UserDetails;

  constructor(private authApi: AuthApiService,
              private router: Router) {}

  canShowSignUp() {
    return !this.authApi.isLoggedIn && window.location.pathname !== '/signup';
  }

  canShowLogin() {
    return !this.authApi.isLoggedIn && window.location.pathname !== '/login';
  }

  canShowProfile() {
    return this.authApi.isLoggedIn;
  }

  ngOnInit(): void {
    this.authApi.currentUserDetails$.subscribe((user) => {
      this.user = user;
    });
  }

  onLogout() {
    this.authApi.logout().subscribe({
      next: () => {
        this.user = {} as UserDetails;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('logut error', error);
      },
      complete: () => {
        console.log('Logout complete');
      }
    });
  }

  openMenu(menuTrigger: MatMenuTrigger, event: MouseEvent) {
    event.stopPropagation();
    this.lastOpenMenu?.closeMenu();
    menuTrigger.openMenu();
    this.lastOpenMenu = menuTrigger;
  }

  closeMenu() {
    this.lastOpenMenu?.closeMenu();
  }

}
