import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {Customer} from "../../models/customer";
import {CustomerApiService} from "../services/customer-api.service";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListComponent implements OnInit {
  customers$: Observable<Customer[]> = new Observable<Customer[]>();
  totalNumberOfCustomers: number = 1000;
  pageSizeOptions: number[] = [5, 10, 15, 45, 100, 300, 1000];
  pageIndex = 0;
  pageSize = 45;
  isChecked = true;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'city', 'storeId'];

  constructor(private customerApi: CustomerApiService) {}

  ngOnInit(): void {
    this.handlePageEvent({
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.totalNumberOfCustomers
    });
  }

  handlePageEvent(event: PageEvent = {pageIndex: 0, pageSize: 15, length: 1000}): void {
    this.customers$ = this.customerApi.getCustomers(event.pageIndex, event.pageSize)
      .pipe(
        map((data) => {
          this.totalNumberOfCustomers = data.totalItems
          return data.items;
        }),
        catchError((error) => {
          console.error('Error loading customers', error);
          return of([]);
        })
      );
  }

  isSticky(): boolean {
    return this.isChecked;
  }
}
