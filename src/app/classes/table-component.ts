import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {AfterViewInit, ViewChild} from "@angular/core";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {PaginationInfo} from "../models/pagination-info";
import {SelectionComponent} from "./selection-component";
import {debounceTime, distinctUntilChanged, switchMap} from "rxjs/operators";
import {Subject} from "rxjs/Subject";
import {of} from "rxjs/observable/of";

/**
 * Общий функционал для компонент с таблицами (пагинация, сортировка, фильтрация)
 */
export abstract class TableComponent<T> extends SelectionComponent<T> implements AfterViewInit {

  constructor() {
    super();
  }

  // Источник данных
  protected dataSource = new MatTableDataSource<T>();
  protected dataCollection: ReplaySubject<T[]> = new ReplaySubject<T[]>();

  // Пагинация
  protected totalLength: number = 0;
  protected selectedPageSize: number = 10;
  protected pageSizeOptions = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //Сортировка
  @ViewChild(MatSort) sort: MatSort;

  //Фильтрация
  private searchTerms = new Subject<string>();
  protected actualSearchTerm: string;


  ngAfterViewInit() {
    this.refreshAfterInit();
    this.dataCollection.subscribe(
      dataList => this.dataSource.data = dataList
    );
    this.paginator.page.subscribe(() => {
      this.updateTable();
    });
    this.sort.sortChange.subscribe(() => {
      this.refreshTable();
    });
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => of(term))
    ).subscribe(term => {
      this.actualSearchTerm = term;
      this.refreshTable();
    });
  }

  /**
   * Переопределить, если нужно завязаться на какойто observable(прим. src/app/components/main/questionary-list/questionary-list.component.ts)
   */
  refreshAfterInit() {
    this.refreshTable();
  }

  /**
   * Обновляет таблицу со сбросом пагинации
   */
  refreshTable(): void {
    this.paginator.firstPage();
    this.updateTable();
  }

  /**
   * Обновляет коллекцию - источник данных для таблицы
   */
  abstract updateDataCollection(paginationInfo: PaginationInfo): void

  /**
   * Применяет фильтр
   */
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.searchTerms.next(filterValue);
  }

  /**
   * Обновляет таблицу
   */
  protected updateTable(): void {
    super.updateTable();
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;

    let from = pageIndex * pageSize;
    let to = (pageIndex * pageSize + pageSize) - 1;

    let sortField = this.sort.active;
    let sortType = this.sort.direction;

    let filter = this.actualSearchTerm;

    this.updateDataCollection({rowFrom: from, rowTo: to, sortField: sortField, sortType: sortType, filter: filter});
  }

}
