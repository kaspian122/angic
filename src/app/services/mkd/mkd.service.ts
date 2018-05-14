import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Mkd} from '../../models/mkd/mkd';
import {MkdCreate} from '../../models/mkd/mkd-create';
import {Auth, MkdOwnersInfo} from '../auth/auth';
import {ReplaySubject} from 'rxjs/ReplaySubject';
import {PaginationInfo} from "../../models/pagination-info";
import {PaginationService} from "../pagination/pagination.service";
import {MkdInfo} from "../../models/mkd/mkd-info";

@Injectable()
export class MkdService {
  public currentMkd: ReplaySubject<MkdOwnersInfo> = new ReplaySubject<MkdOwnersInfo>();
  public auth?: Auth = null;

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService,
    private paginationService: PaginationService
  ) { }

  public getMkdList(paginationInfo: PaginationInfo): Observable<[Mkd[], number]> {
    let result = new ReplaySubject<[Mkd[], number]>();
    let headers = this.paginationService.setHeaderValues(new HttpHeaders(), paginationInfo);
    let params = this.paginationService.setRequestParams(new HttpParams(), paginationInfo);

    this.http.get<Mkd[]>(
      this.config.getEndpoint("mkd"), {params: params, headers: headers, observe: 'response'}
    ).subscribe(resp => {
      let total = this.paginationService.getTotal(resp.headers);
      let data = resp.body;
      result.next([data, total]);
    });
    return result;
  }

  public getMkdInfo(mkdId: string): Observable<MkdInfo>{
    return this.http.get<MkdInfo>(this.config.getEndpoint(`mkd/${mkdId}/info`), {headers: this.authService.headers()});
  }

  public getMkdEnums(): Observable<any> {
    return this.http.get(this.config.getEndpoint('mkd/enums'), {headers: this.authService.headers()});
  }

  public createMkd(mkdCreate: MkdCreate): Observable<any> {
    return this.http.post(this.config.getEndpoint('mkd'), mkdCreate, {headers: this.authService.headers()});
  }

  public setCurrentMkd(mkdId: string): void{
    const headers = this.authService.headers();

    this.http.post(this.config.getEndpoint("user/settings/mkd/default"), mkdId, {headers: headers}).subscribe(
      ()=> {
        this.authService.getAuth(true).then(
          auth => {
            this.auth = auth;
            let m = this.auth.mkdOwners.find(e=>e.mkdId==mkdId);
            this.currentMkd.next(m);
          }
        );
      }
    );
  }

}
