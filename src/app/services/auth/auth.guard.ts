import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // TODO handle onreject?
    return this.authService.getAuth()
      .then(it => {
          if (it.status === "AUTHENTICATED") {
            return route.data && route.data.expectedRole
              ? this.authService.hasRole(route.data.expectedRole)
              : true;
          } else {
            this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
            return false;
          }
        }
      );
  }
}
