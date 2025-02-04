import { Component, OnInit } from '@angular/core';
import {MatMenuTrigger} from "@angular/material/menu";

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

  constructor() { }

  ngOnInit(): void {
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
