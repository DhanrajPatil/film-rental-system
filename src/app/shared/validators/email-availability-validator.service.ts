import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidator, ValidationErrors} from "@angular/forms";
import {catchError, map, Observable, of, switchMap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EmailAvailabilityValidatorService implements AsyncValidator{
  private authUrl = environment.authUrl;
  constructor(private http: HttpClient) { }

  validate(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return of(control.value).pipe(
      switchMap(email => this.http.get<any>(this.authUrl + `/email-exists/${email}`)),
      map(res => res ? { emailAlreadyExists: true } : null),
      catchError(() => of(null))
    );
  }
}
