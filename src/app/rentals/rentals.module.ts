import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RentalsRoutingModule } from './rentals-routing.module';
import { RentalListComponent } from './rental-list/rental-list.component';
import { AddRentalComponent } from './add-rental/add-rental.component';


@NgModule({
  declarations: [
    RentalListComponent,
    AddRentalComponent
  ],
  imports: [
    CommonModule,
    RentalsRoutingModule
  ]
})
export class RentalsModule { }
