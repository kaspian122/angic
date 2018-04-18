import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth/auth.service";
import {Auth} from "../../services/auth/auth";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  public auth?: Auth = null;
  public hasPrivileges = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getAuth(true)
      .then(it => {
        this.auth = it;
        if(this.auth.mkdOwners) {
          for (var mkd of this.auth.mkdOwners) {
            if (mkd.byDefault && (mkd.authorities.indexOf('CHAIRMAN') !== -1 || mkd.authorities.indexOf('SYSTEM_ADMIN') !== -1 || mkd.authorities.indexOf('BOARD_MEMBER') !== -1)) {
              this.hasPrivileges = true;
              break;
            }
          }
        }
      });
  }

  public callAllowedForAdmin () {
    this.http.get("/api/hello")
      .subscribe(() => {})
  }


  public callForbiddenForAdmin () {
    this.http.get("/api/helloSuperAdmin")
      .subscribe(() => {})
  }

}
