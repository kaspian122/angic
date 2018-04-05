import {Injectable} from "@angular/core";
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/do";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";


let FORBIDDEN = 403;
let UNAUTHORIZED = 401;


@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {


  constructor(
    private cookie: CookieService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do(
      () => {
      },
      event => {
        if ((event instanceof HttpErrorResponse) && !(this.router.routerState.snapshot.url || "").startsWith("/login")) {
          if (event.status === UNAUTHORIZED) {
            window.location.replace('/login');
          } else if (event.status === FORBIDDEN) {
            window.location.replace('/forbidden');
          }
        }
      }
    );
  }
}
