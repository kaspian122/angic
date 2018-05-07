import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {AfterViewInit, ViewChild} from "@angular/core";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {PaginationInfo} from "../models/pagination-info";
import {SelectionComponent} from "./selection-component";

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
  protected totalLength: number = 20;
  protected selectedPageSize: number = 10;
  protected pageSizeOptions = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //Сортировка
  @ViewChild(MatSort) sort: MatSort;
  //Фильтрация
  // protected filterValue: ReplaySubject<string>;

  ngAfterViewInit() {
    this.refreshAfterInit();
    this.paginator.page.subscribe(() => {
      this.updateTable();
    });
    this.sort.sortChange.subscribe(() => {
      this.paginator.firstPage();
      this.updateTable();
    });
    this.dataCollection.subscribe(
      dataList => this.dataSource.data = dataList
    );
  }

  /**
   * Переопределить, если нужно завязаться на какойто observable(прим. src/app/components/main/questionary-list/questionary-list.component.ts)
   */
  refreshAfterInit() {
    this.refreshTable();
  }

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
    // filterValue = filterValue.trim();
    // filterValue = filterValue.toLowerCase();
    // this.updateTable();
  }

  /**
   * Обновляет таблицу
   */
  private updateTable(): void {
    this.selection.clear();
    let pageIndex = this.paginator.pageIndex;
    let pageSize = this.paginator.pageSize;

    let from = pageIndex * pageSize;
    let to = pageIndex * pageSize + pageSize;
    to = to > this.totalLength ? this.totalLength - 1 : to - 1;

    let sortField = this.sort.active;
    let sortType = this.sort.direction;

    this.updateDataCollection({rowFrom: from, rowTo: to, sortField: sortField, sortType: sortType});
  }

}
