import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, shareReplay} from "rxjs";
import {Film} from "../../models/film";
import {PageDto} from "../../models/page-dto";
import {Language} from "../../models/language";
import {Actor} from "../../models/actor";
import {Category} from "../../models/category";

@Injectable({
  providedIn: 'root'
})
export class FilmApiService {
  filmUrl = environment.filmUrl;
  languageUrl: string = environment.languageUrl;
  actorUrl = environment.actorUrl;
  categoryUrl = environment.categoryUrl;
  private cache = new Map<number, Observable<Film>>();


  constructor(private http: HttpClient) { }

  getFilmsByPageAndSize(pageNo: number, pageSize: number, sort: string): Observable<PageDto<Film>> {
    const url =  `${this.filmUrl}?page=${pageNo}&size=${pageSize}&sort=${sort}`;
    return this.http.get<any>(url);
  }

  addFilm(film: Film): Observable<Film> {
    this.cache.delete(film.id);
    return this.http.post<any>(this.filmUrl, film);
  }

  patchFilm(filmId: number, film: Film): Observable<Film> {
    return this.http.patch<any>(this.filmUrl + "/" + filmId, film);
  }

  updateFilm(filmId: number, film: Film): Observable<Film> {
    return this.http.put<any>(this.filmUrl + "/" + filmId, film);
  }

  getAllLanguages(): Observable<Language[]> {
    return this.http.get<any>(`${this.languageUrl}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.categoryUrl}`);
  }

  getFilmById(id: number): Observable<Film> {
    if(!this.cache.has(id)) {
      const reqObservable = this.http.get<any>(`${this.filmUrl}/${id}`).pipe(
        shareReplay(1)
      );
      this.cache.set(id, reqObservable);
    }
    return this.cache.get(id)!;
  }

  getActorsByName(name: string): Observable<Actor[]> {
    return this.http.get<any>(`${this.actorUrl}/search/${name}`);
  }

}
