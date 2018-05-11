import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Holder} from '../../models/holder/holder';
import {Apartment} from '../../models/apartment/apartment';
import {PaginationInfo} from "../../models/pagination-info";
import {PaginationService} from "../pagination/pagination.service";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {SimpleObject} from '../../models/simple-object';

@Injectable()
export class HolderService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService,
    private paginationService: PaginationService
  ) { }

  public getSimpleHoldersByMkd(mkdId: string): Observable<SimpleObject[]>{
    return this.http.get<SimpleObject[]>(this.config.getEndpoint(`mkd/${mkdId}/simpleHolders`), {headers: this.authService.headers()});
  }

  public getHoldersByApartment(apartmentId: string): Observable<Holder[]>{
    return this.http.get<Holder[]>(this.config.getEndpoint(`apartment/${apartmentId}/holders`), {headers: this.authService.headers()});
  }

  public getHolderInfo(holderId: string): Observable<Holder>{
    return this.http.get<Holder>(this.config.getEndpoint(`holder/${holderId}`), {headers: this.authService.headers()});
  }

  public createHolder(holder: Holder): Observable<any> {
    return this.http.post(this.config.getEndpoint('holder/'), holder, {headers: this.authService.headers()});
  }

  public updateHolder(holder: Holder): Observable<any> {
    return this.http.put(this.config.getEndpoint('holder/'), holder, {headers: this.authService.headers()});
  }

  public deleteHolders(holderIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("holder"), {body: holderIds, headers: this.authService.headers()});
  }

  public getExcelFileWithHolders(mkdId: string){
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders/export"), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

}
