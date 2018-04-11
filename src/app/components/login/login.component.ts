import {Component, OnInit} from "@angular/core";
import {AuthService} from "../../services/auth/auth.service";
import {Auth} from "../../services/auth/auth";
import {LoginFailedError} from "../../services/auth/login.failed.error";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.authService.getAuth()
      .then(it => this.auth = it);
  }

  public doLogin() {
    this.errorMessage = null;
    this.authService.login(this.login, this.password)
      .then(
        it => {
          this.auth = it;
          this.router.navigate(['/']);
        },
        (err: LoginFailedError) => {
          this.auth = err.auth;
          this.errorMessage = err.error.message;
        }
      )
  }

  public doLogout() {
    this.authService.logout()
      .then(it => {
        this.auth = it;
        this.router.navigate(['login'])
      })
  }




}
