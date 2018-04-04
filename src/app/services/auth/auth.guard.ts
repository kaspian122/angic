import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookies: CookieService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (this.cookies.get('sessionid')) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login/'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}
