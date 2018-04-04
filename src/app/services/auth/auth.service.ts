import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AppConfig} from "../../app.config";
import 'rxjs/add/operator/map';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class AuthService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private cookie: CookieService
  ) { }

  logout() {
    this.cookie.delete('sessionid');
  }

  authenticate(username: string, password: string) {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    // return this.http.post(this.config.getEndpoint('login/'), {username: username, password: password});
    return this.http.post(this.config.getEndpoint('login/'), body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    });
  }
}
