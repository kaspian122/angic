import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Mkd} from '../../models/mkd/mkd';
import {MkdCreate} from '../../models/mkd/mkd-create';
import {Auth, MkdOwnersInfo} from '../auth/auth';
import {ReplaySubject} from 'rxjs/ReplaySubject';

@Injectable()
export class MkdService {
  public currentMkd: ReplaySubject<MkdOwnersInfo> = new ReplaySubject<MkdOwnersInfo>();
  public auth?: Auth = null;

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public getMkdList(): Promise<Mkd[]>{
    let response: Observable<Mkd[]> = this.http.request<Mkd[]>("GET", this.config.getEndpoint("mkd/"));
    return response.toPromise<Mkd[]>();
  }

  public getMkdEnums(): Observable<any> {
    return this.http.get(this.config.getEndpoint('mkd/enums'), {headers: this.authService.headers()});
  }

  public createMkd(mkdCreate: MkdCreate): Observable<any> {
    return this.http.post(this.config.getEndpoint('mkd/'), mkdCreate, {headers: this.authService.headers()});
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
