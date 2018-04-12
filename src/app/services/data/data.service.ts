import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import {Mkd} from "../../models/mkd";
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataService {

  private mkd?: Mkd[] = [];

  constructor(
    private http: HttpClient,
    private config: AppConfig,
  ) { }

  public getMkdList(): Promise<Mkd[]>{
    let response: Observable<Mkd[]> = this.http.request<Mkd[]>("GET", this.config.getEndpoint("mkd"));

    return response
      .toPromise<Mkd[]>()
      .then(
        it => {
          this.mkd = it;
          return it;
        },
        err => {
          this.mkd = null;
          throw err;
        }
      );
  }


}
