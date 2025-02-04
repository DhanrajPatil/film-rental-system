import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddCustomerComponent} from "./add-customer/add-customer.component";
import {CustomerListComponent} from "./customer-list/customer-list.component";

const routes: Routes = [
  { path: '', component: CustomerListComponent },
  { path: 'add', component: AddCustomerComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
