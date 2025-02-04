import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {filter, map, Observable} from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import {FilmApiService} from "../../films/services/film-api.service";

interface Option {
  id: number | string | undefined;
  label: string;
  detail: string;
}

@Component({
  selector: 'frs-auto-complete-search',
  templateUrl: './auto-complete-search.component.html',
  styleUrls: ['./auto-complete-search.component.css']
})
export class AutoCompleteSearchComponent implements OnInit {
  searchControl = new FormControl();
  filteredOptions: Observable<Option[]> = new Observable<Option[]>();
  selectedOptions: Option[] = [];

  constructor(private filmService: FilmApiService, private http: HttpClient
              ) {}

  ngOnInit() {
    this.filteredOptions = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      filter((value) => value && value.length > 2 && typeof value === 'string'),
      map((value) => value.toLowerCase()),
      switchMap((value) => this.filmService.getActorsByName(value)),
      map((actors) =>
        actors.length ?
          actors.map(actor => ({id: actor.id, label: `${actor.firstName}`, detail: actor.lastName})) :
          [{id: 1, label: 'Not found!', detail: 'Please, Add actor using the actors/add Page'}]
      )
    );
  }

  fetchOptions(query: string): Observable<Option[]> {
    if (!query) return new Observable<Option[]>();
    return this.http.get<Option[]>(`/api/search?q=${query}`);
  }

  selectOption(event: MatAutocompleteSelectedEvent) {
    const selected = event.option.value;
    if (!this.selectedOptions.find(opt => opt.id === selected.id)) {
      this.selectedOptions.push(selected);
    }
    this.searchControl.setValue('');
  }

  removeChip(option: Option) {
    this.selectedOptions = this.selectedOptions.filter(opt => opt.id !== option.id);
  }
}
