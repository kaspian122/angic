import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import "rxjs/add/operator/map";
import "rxjs/add/operator/toPromise";
import "rxjs/add/observable/of";
import {Observable} from "rxjs/Observable";
import {Auth} from "./auth";
import {LoginFailedError} from "./login.failed.error";

@Injectable()
export class AuthService {

  private auth?: Auth = null;

  constructor(private http: HttpClient,
              private config: AppConfig) {
  }

  /**
   * Получение текущего объекта аутентификации/авторизации
   * @param refresh перечитать информацию с сервера
   * @return {Observable<Auth>}
   */
  public getAuth(refresh: Boolean = false): Promise<Auth> {
    if (this.auth && !refresh) {
      return Promise.resolve<Auth>(this.auth);
    }
    let response: Observable<Auth> = this.http.request<Auth>("GET", this.config.getEndpoint("authStatus"));
    return response
      .toPromise<Auth>()
      .then(
        it => {
          this.auth = it;
          return it;
        },
        err => {
          this.auth = null;
          throw err;
        }
      );
  }

  /**
   * Логин с указанным именем пользователя и паролем
   * @param login имя пользователя
   * @param password пароль
   * @param refreshAuthOnForbidden если при попытке залогинется получили 403 (устарел CSRF_TOKEN), обновить auth
   * @return {Observable<Auth>}
   */
  public login(login: string, password: string, refreshAuthOnForbidden: Boolean = true): Promise<Auth> {
    if (!this.auth || !this.auth.csrfToken) {
      throw new Error("You have to get csrfToken before login")
    }

    const body = new HttpParams()
      .set('login', login)
      .set('password', password);


    let response: Promise<Auth> = this.http.post<Auth>(this.config.getEndpoint("login"), body.toString(), {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set(this.config.X_CSRF_TOKEN_HEADER_NAME, this.auth.csrfToken)
    }).toPromise<Auth>();

    return response
      .then(it => {
          this.auth = it;
          return it;
        },
        err => {
          if (err.status === 400 && err.error) {
            let loginFailedError = <LoginFailedError>err.error;
            this.auth = loginFailedError.auth;
            throw loginFailedError;
          } else if (err.status == 403 && refreshAuthOnForbidden) {
            return this.getAuth(true)
              .then((newAuth) => {
                if (newAuth.status === "AUTHENTICATED") {
                  // В другой вкладке залогинились
                  return newAuth;
                }
                return this.login(login, password, false);
              })
          }
          throw  err;
        }
      )
  }

  /**
   * @return {Observable<Auth>}
   */
  logout(): Promise<Auth> {
    if (!this.auth || !this.auth.csrfToken) {
      throw new Error("You have to get csrfToken before logout")
    }
    return this.http.request<Auth>(
      "POST",
      this.config.getEndpoint("logout"),
      {headers: this.headers()}
    )
      .toPromise<Auth>()
      .then(it => this.auth = it);
  }

  hasRole(role: string): boolean {
    return this.auth.authorities.indexOf(role) !== -1;
  }

  headers() {
    return new HttpHeaders().set(this.config.X_CSRF_TOKEN_HEADER_NAME, this.auth.csrfToken);
  }

  checkRole(roles: string[], authorities: string[]):boolean {
    for(let role of roles){
      if(authorities.indexOf(role) !== -1) {
        return true;
      }
    }
    return false;
  }
}
