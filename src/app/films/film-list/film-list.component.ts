import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {catchError, map, Observable, of} from "rxjs";
import {Film} from "../../models/film";
import {FilmApiService} from "../services/film-api.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSort, Sort, SortDirection} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {PageDto} from "../../models/page-dto";

@Component({
  selector: 'frs-film-list',
  templateUrl: './film-list.component.html',
  styleUrls: ['./film-list.component.css']
})
export class FilmListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'title', 'releaseYear', 'language', 'rentalDuration', 'rentalRate', 'length', 'replacementCost', 'rating', 'edit'];
  currentPageDetails: PageEvent = {pageIndex: 0, pageSize: 15, length: 1000};
  pageSizeOptions: number[] = [5, 10, 15, 45, 100, 300, 1000];
  currentSort: Sort = {active: 'id', direction: 'asc'};
  filmDataSource = new MatTableDataSource<Film>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private filmService: FilmApiService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPageDetails = {
        pageIndex: params['page'] ? +params['page'] : this.currentPageDetails.pageIndex,
        pageSize: params['size'] ? +params['size'] : this.currentPageDetails.pageSize,
        length: this.currentPageDetails.length
      };
      const sort = params['sort'] ? params['sort'].split(',') : null;
      this.currentSort = {
        active: sort && sort.length ? sort[0] : this.currentSort.active,
        direction: sort && sort.length > 1 ? sort[1] as SortDirection : this.currentSort.direction
      };
      this.paginateAndSortFilms(this.currentPageDetails, this.currentSort);
    });
  }

  ngAfterViewInit() {
    this.filmDataSource.paginator = this.paginator;
    this.filmDataSource.sort = this.sort;
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPageDetails.pageIndex;
      this.paginator.pageSize = this.currentPageDetails.pageSize;
    });
  }

  handlePageEvent(event: PageEvent = {pageIndex: 0, pageSize: 15, length: 1000}): void {
    this.currentPageDetails = event;
    this.navigateToPaginatedList();
  }

  paginateAndSortFilms(pageEvent: PageEvent, sort: Sort): void {
    this.filmService.getFilmsByPageAndSize(
        pageEvent.pageIndex,
        pageEvent.pageSize,
        `${sort.active},${sort.direction}`
    ).pipe(
      catchError((error) => {
        console.error('Error loading customers', error);
        const dto: PageDto<Film> = {items: [], totalItems: 0, page: 0, size: 0, totalPages: 0};
        return of(dto);
      })
    ).subscribe((data) => {
      this.filmDataSource = new MatTableDataSource(data.items);
      this.currentPageDetails = {
        pageIndex: data.page,
        pageSize: data.size,
        length: data.totalItems
      };
    });
  }

  editFilm(film: Film): void {
    this.router.navigate(['films/edit', film.id], {queryParamsHandling: "preserve"});
  }

  navigateToPaginatedList(): void {
    this.router.navigate([], {
      queryParams: {
        page: this.currentPageDetails.pageIndex,
        size: this.currentPageDetails.pageSize,
        sort: `${this.currentSort.active},${this.currentSort.direction}`
      }
    });
  }

  sortFilms(event: Sort) {
    this.currentSort = event;
    this.currentPageDetails = {
      ...this.currentPageDetails,
      pageIndex: 0
    }
    this.navigateToPaginatedList();
  }
}
