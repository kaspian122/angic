import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {MkdHoldersList} from '../../models/holder/mkd-holders-list';
import {Observable} from 'rxjs/Observable';
import {PaginationInfo} from "../../models/pagination-info";
import {PaginationService} from "../pagination/pagination.service";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class HolderService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService,
    private paginationService: PaginationService
  ) { }

  public getHoldersList(mkdId: string, paginationInfo: PaginationInfo): Observable<[MkdHoldersList, number]> {
    let result = new ReplaySubject<[MkdHoldersList, number]>();
    let headers = this.paginationService.setPagination(this.authService.headers(), paginationInfo);

    this.http.get<MkdHoldersList>(
      this.config.getEndpoint("mkd/" + mkdId + "/holders"), {headers: headers, observe: 'response'}
    ).subscribe(resp => {
      let total = this.paginationService.getTotal(resp.headers);
      let data = resp.body;
      result.next([data, total]);
    });
    return result;
  }

  public deleteHolders(holderIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("holder"), {body: holderIds, headers: this.authService.headers()});
  }

  public getExcelFileWithHolders(mkdId: string){
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders/export"), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

}
