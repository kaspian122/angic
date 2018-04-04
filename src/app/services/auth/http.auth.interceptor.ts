import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/do';
import {CookieService} from "ngx-cookie-service";


@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  constructor(
    private cookie: CookieService,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do(
      () => {},
      event => {
        if ((event instanceof HttpErrorResponse) && (event.status === 403)) {
          this.cookie.delete('sessionid');
          window.location.replace('/login');
        }
      }
    );
  }
}