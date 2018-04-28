import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";
import {User} from "../../models/user/user";
import {MkdNewsInfo} from "../../models/mkd/mkd-news-info";
import {SavePass} from "../../models/save-pass";

@Injectable()
export class UserService {
  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  getUserByLogin(name: string): Observable<User> {
    return this.http.get<User>(this.config.getEndpoint("user/"+name));
  }

  public getUserMkdInfo(mkdId: string): Observable<MkdNewsInfo> {
    return this.http.get<MkdNewsInfo>(this.config.getEndpoint(`user/info/mkd/${mkdId}`), {headers: this.authService.headers()});
  }

  public registration(savePass: SavePass) {
    return this.http.put(this.config.getEndpoint(`user/registration`), savePass, {headers: this.authService.headers()});
  }

  public sendSms(phone: string) {
    const param = new HttpParams().set('phone', phone).toString();
    return this.http.post(this.config.getEndpoint('sendSms?'+param), null, {headers: this.authService.headers()});
  }

  public checkCode(code: string, type: string) {
    const params = new HttpParams().set('key', code).set('type', type);
    return this.http.get(this.config.getEndpoint('auth/check'), {params: params})
  }
}
