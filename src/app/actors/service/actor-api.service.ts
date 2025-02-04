import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Actor} from "../../models/actor";

@Injectable({
  providedIn: 'root'
})
export class ActorApiService {
  private actorUrl: string = environment.actorUrl;

  constructor(private http: HttpClient) { }

  getActors(): Observable<Actor[]> {
    return this.http.get<any>(this.actorUrl);
  }

  addActor(actor: Actor): Observable<Actor> {
    return this.http.post<any>(this.actorUrl, actor);
  }

  getActor(id: number): Observable<Actor> {
    return this.http.get<any>(`${this.actorUrl}/${id}`);
  }


}
