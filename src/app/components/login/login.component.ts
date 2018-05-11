import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";
import {Auth} from "../../services/auth/auth";
import {LoginFailedError} from "../../services/auth/login.failed.error";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public login: string = "";
  public password: string = "";
  public auth?: Auth = null;
  public errorMessage?: string = null;

  public returnUrl = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.authService.getAuth()
      .then(it => {
        this.auth = it;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
      });
  }

  public doLogin() {
    this.errorMessage = null;
    this.authService.login(this.login, this.password)
      .then(
        it => {
          this.auth = it;
          if (this.returnUrl) {
            this.router.navigate([this.returnUrl]);
          } else {
            if(this.authService.hasRole('ROLE_ADMIN')){
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/']);
            }
          }

        },
        (err: LoginFailedError) => {
          this.auth = err.auth;
          // this.errorMessage = err.error.message;
          this.errorMessage = "Неверный логин или пароль";
        }
      )
  }

  public register() {
    if (this.login) {
      this.router.navigate(['/register', this.login]);
    } else {
      this.router.navigate(['/register']);
    }
  }

  public doLogout() {
    this.authService.logout().then(it => this.auth = it);
  }
}
