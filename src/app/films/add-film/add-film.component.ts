import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {Film} from "../../models/film";
import {Language} from "../../models/language";
import {FilmApiService} from "../services/film-api.service";
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {debounceTime, filter, map, Observable, switchMap} from "rxjs";
import {Category} from "../../models/category";
import {Actor} from "../../models/actor";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatSnackBar} from "@angular/material/snack-bar";
import {StringValidators} from "../../shared/validators/string-validators";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../../shared/confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'frs-add-film',
  templateUrl: './add-film.component.html',
  styleUrls: ['./add-film.component.css']
})
export class AddFilmComponent implements OnInit {
  filmForm: UntypedFormGroup;
  filmId: number | null = null;
  controlsConfig: { [key: string]: any; } = {};
  //languageSubject: Subject<Language[]> = new BehaviorSubject<Language[]>([]);
  //languageOptions$ = this.languageSubject.asObservable();
  languageOptions$: Observable<Language[]> = new Observable<Language[]>();
  allLanguageOptions: Language[] = [];
  originalLanguageOptions$: Observable<Language[]> = new Observable<Language[]>();
  ratingOptions: string[] = ['G', 'PG', 'R', 'PG13', 'NC17'];
  yearOptions: number[] = Array.from({length: 130}, (v, k) => k + 1900);
  languageControl!: UntypedFormControl;
  originalLanguageControl!: UntypedFormControl;
  categoriesOptions$: Observable<Category[]> = new Observable<Category[]>();
  actorOptions$: Observable<Actor[]> = new Observable<Actor[]>();
  actorsControl!: UntypedFormControl;
  categoriesControl!: UntypedFormControl;
  allCategoryOptions: Category[] = [];

  selectedCategories: Category[] = [];
  selectedActors: Actor[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  isViewForm: boolean = false;
  isEditForm: boolean = false;

  dialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

  editingFilm: Film | null = null;

  @ViewChild('actorInput') actorInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement> | undefined;

  constructor( private fb: UntypedFormBuilder,
               private filmService: FilmApiService,
               private route: ActivatedRoute,
               private snackBar: MatSnackBar,
               private router: Router,
               private dialog: MatDialog) {
    const id = this.route.snapshot.paramMap.get('id');
    const path = this.route.snapshot.url[0].path;
    const isView = path === 'view';
    this.isEditForm = path === 'edit';
    this.isViewForm = isView;
    this.categoriesControl = new UntypedFormControl({value: [], disabled: isView});
    this.actorsControl = new UntypedFormControl({value: [], disabled: isView});
    this.languageControl = new UntypedFormControl({value: '', disabled: isView}, Validators.required);
    this.originalLanguageControl = new UntypedFormControl({value: '', disabled: isView}, Validators.required);
    const controlsConfig: { [key: string]: any; } = {
      title: [{value: '', disabled: isView}, [
        Validators.required, StringValidators.emptyStringCheck,
        Validators.minLength(2), Validators.maxLength(100)]],
      description: [{value: '', disabled: isView}],
      releaseYear: [{value: 2022, disabled: isView}, Validators.required],
      language: this.languageControl,
      originalLanguage: this.originalLanguageControl,
      rentalDuration: [{value: 0, disabled: isView}, Validators.required],
      rentalRate: [{value: 0.0, disabled: isView}, [Validators.required, Validators.min(0.1)]],
      length: [{value: 0, disabled: isView}, [Validators.required, Validators.min(1)]],
      replacementCost: [{value: 0.0, disabled: isView}, [Validators.required, Validators.min(0.1)]],
      rating: [{value: 'PG13', disabled: isView},],
      specialFeatures: [{value: '', disabled: isView}],
      actors: this.actorsControl,
      categories: this.categoriesControl
    };
    this.filmForm = this.fb.group(controlsConfig);
    this.controlsConfig = controlsConfig;
    if (id) {
      this.filmId = +id;
      this.fetchFilm(+id, null);
    }
  }

  fetchFilm(id: number | null, redirectUrl: string | null): void {
    if(id) {
      this.filmService.getFilmById(+id).subscribe({
        next: (film) => {
          const lang: Language = {languageId: film.languageId, name: film.language};
          const origLang: Language = {languageId: film.originalLanguageId, name: film.originalLanguage};
          const currentFilm: any = film;
          currentFilm.originalLanguage = origLang;
          currentFilm.language = lang;
          this.patchFilmValuesToForm({...currentFilm} as Film);
          if(redirectUrl) {
            this.router.navigate([redirectUrl]);
          } else {
            this.editingFilm = currentFilm;
          }
        }
      });
    }
  }

  saveFilm(): void {
    if (this.filmForm.valid) {
      const film: any = this.filmForm.value;
      const lang: Language = film.language;
      const origLang: Language = film.originalLanguage;
      film.originalLanguage = origLang.name;
      film.originalLanguageId = origLang.languageId;
      film.language = lang.name;
      film.languageId = lang.languageId;
      film.actors = this.selectedActors;
      film.categories = this.selectedCategories;
      film.id = this.filmId;
      film.title = film.title.trim();
      if(this.filmId) {
        this.filmService.patchFilm(this.filmId, film).subscribe({
          next: (film) => {
            this.navigateToView();
            this.snackBar.open('Film updated.', 'Close');
          },
          error: (error) => {
            this.snackBar.open('Film updation failed.', 'Close');
          }
        });
      } else {
        this.filmService.addFilm(film).subscribe({
          next: (film) => {
            this.filmId = film.id;
            this.navigateToView();
            this.snackBar.open('Film created.', 'Close');
          },
          error: (error) => {
            this.snackBar.open('Film creation failed.', 'Close');
          }
        });
      }
    }
  }

  clearForm() {
    this.selectedActors = [];
    this.selectedCategories = [];
    this.filmForm.reset({
      title: '',
      description: '',
      releaseYear: 2022,
      length: 0,
      rentalDuration: 0,
      rentalRate: 0.0,
      replacementCost: 0.0,
      rating: 'PG13',
      specialFeatures: ''
    });
  }

  patchFilmValuesToForm(film: Film) {
    this.filmForm.patchValue(film);
    this.selectedActors = [...film.actors];
    this.selectedCategories = [...film.categories];
  }

  resetToOldValues() {
    this.patchFilmValuesToForm(this.editingFilm as Film);
  }

  navigateToView() {
    this.fetchFilm(this.filmId, '/films/view/' + this.filmId);
  }

  ngOnInit(): void {
    this.filmService.getAllLanguages().subscribe({
      next: (languages) => {
        this.allLanguageOptions = languages;
      }
    });

    this.filmService.getAllCategories().subscribe({
      next: (categories) => {
        this.allCategoryOptions = categories;
      }
    });

    this.languageOptions$ = this.languageControl.valueChanges.pipe(
      debounceTime(100),
      map(this.languageMapper.bind(this))
    );

    this.originalLanguageOptions$ = this.originalLanguageControl.valueChanges.pipe(
      debounceTime(100),
      map(this.languageMapper.bind(this))
    );

    this.actorOptions$ = this.actorsControl.valueChanges.pipe(
      debounceTime(300),
      filter((value) => value && value.length > 2 && typeof value === 'string'),
      map((value) => value.toLowerCase()),
      switchMap((value) => this.filmService.getActorsByName(value)),
      map((actors) =>
        actors.length ? actors :
          [{id: 1, firstName: 'Not found, Please', lastName: 'Add actor using the actors/add Page'}]
      )
    );

    this.categoriesOptions$ = this.categoriesControl.valueChanges.pipe(
      debounceTime(100),
      map((value) => {
        if(!value) return this.allCategoryOptions;
        if(typeof value === 'string') {
          return this.allCategoryOptions.filter(
            (category) => category.name.toLowerCase().includes(value.toLowerCase())
          );
        }
        return [];
      })
    );
  }

  languageMapper(value: any) {
    if(!value || typeof value !== 'string') return this.allLanguageOptions;
    return this.allLanguageOptions.filter(
      (language) => language.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  displayFn(obj: any): string {
    return obj && obj.name ? obj.name : '';
  }

  displayActorFn(actor: Actor): string {
    return actor ? `${actor.firstName} ${actor.lastName}` : '';
  }

  controlFocused(control: AbstractControl | null) {
    if(control && control.value === '') {
      control.setValue('');
    }
  }

  categoryFocused(event: any) {
    if(event.target.value === '') {
      this.categoriesControl.setValue('');
    }
  }

  removeActor(actor: Actor) {
    this.selectedActors = this.selectedActors.filter((a) => a.id !== actor.id);
  }

  removeCategory(category: Category) {
    this.selectedCategories = this.selectedCategories.filter((c) => c.id !== category.id);
  }

  actorSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedActors.push(event.option.value);
    if(this.actorInput) {
      this.actorInput.nativeElement.value = '';
    }
    this.actorsControl.setValue(null);
  }

  categorySelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedCategories.push(event.option.value);
    if(this.categoryInput) {
      this.categoryInput.nativeElement.value = '';
    }
    this.categoriesControl.setValue(null);
  }

  editForm() {
    this.router.navigate(['films/edit', this.filmId]);
  }

  createNew() {
    this.router.navigate(['films/add']);
  }

  openConfirmDialog(): Observable<boolean> {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: 'Are you sure, Do you want to discard changes?'
    });
    return this.dialogRef.afterClosed();
  }
}
