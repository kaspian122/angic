import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import {Mkd} from "../../models/mkd";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";
import {MkdCreate} from "../../models/mkd-create";

@Injectable()
export class DataService {

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


  createMkd(mkdCreate: MkdCreate): Observable<any> {
    return this.http.post(this.config.getEndpoint('mkd/'), mkdCreate, {headers: this.authService.headers()});
  }

  public setCurrentMkd(mkdId: string): Observable<any> {
    const headers = this.authService.headers();

    return this.http.post(this.config.getEndpoint("user/settings/mkd/default"), mkdId.toString(), {headers: headers});
  }
}
