import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient,
    private config: AppConfig
  ) { }

}
