
import {CustomersModule} from "../customers.module";
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";
import {Customer} from "../../models/customer";
import {PageDto} from "../../models/page-dto";

@Injectable({
  providedIn: 'root',
})
export class CustomerApiService {
  private baseUrl = environment.customerUrl;

  constructor(private http: HttpClient) {}

  // Get the list of customers
  getCustomers(page: number, size: number, sortBy: string = 'firstName,asc'): Observable<PageDto<Customer>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}&sort=${sortBy}`;
    return this.http.get<any>(url);
  }

  // Add a new customer
  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<any>(`${this.baseUrl}`, customer);
  }
}
