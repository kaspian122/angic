import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {PaginationInfo} from "../../models/pagination-info";

@Injectable()
export class PaginationService {

  constructor() { }

  readonly FROM = 'row-from';
  readonly TO = 'row-to';
  readonly SORT_TYPE = 'sort-type';
  readonly SORT_FIELD = 'sort-field';
  readonly FILTER = 'filter';
  readonly TOTAL = 'total-size';

  public setPagination(headers: HttpHeaders, paginationInfo: PaginationInfo): HttpHeaders {
    headers = headers
      .set(this.FROM, paginationInfo.rowFrom.toString())
      .set(this.TO, paginationInfo.rowTo.toString());
    if(paginationInfo.sortField && paginationInfo.sortType) {
      headers = headers.set(this.SORT_FIELD, paginationInfo.sortField);
      headers = headers.set(this.SORT_TYPE, paginationInfo.sortType);
    }
    if (paginationInfo.filter) {
      headers = headers.set(this.FILTER, paginationInfo.filter)
    }
    return headers;
  }

  public getTotal(headers: HttpHeaders): number {
    return +headers.get(this.TOTAL);
  }

}
