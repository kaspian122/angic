import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth/auth.service";
import {Auth, MkdOwnersInfo} from "../../services/auth/auth";
import {UserService} from "../../services/user/user.service";
import {MkdService} from '../../services/mkd/mkd.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  public auth?: Auth = null;
  public hasSuperPrivileges = false;
  public hasHolderPrivileges = false;
  public currentMkd?: MkdOwnersInfo = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dataService: UserService,
    private mkdService: MkdService
  ) { }

  ngOnInit() {

    this.authService.getAuth(true)
      .then(it => {
        this.auth = it;
        if(this.auth.mkdOwners && this.auth.mkdOwners.length > 0) {
          let m = this.auth.mkdOwners[0];
          if (this.auth.mkdOwners.length > 1) {
            let m = this.auth.mkdOwners.find(e => e.byDefault == true);
          }
          this.hasSuperPrivileges = this.authService.checkRole(['CHAIRMAN', 'SYSTEM_ADMIN', 'BOARD_MEMBER'], m.authorities);
          this.hasHolderPrivileges = this.authService.checkRole(['HOLDER'], m.authorities);
        }
      });
    this.mkdService.currentMkd.subscribe(
      mkd => this.currentMkd = mkd
    );
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
