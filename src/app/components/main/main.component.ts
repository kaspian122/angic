import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../services/auth/auth.service";
import {Auth, MkdOwnersInfo} from "../../services/auth/auth";
import {UserService} from "../../services/user/user.service";
import {MkdService} from '../../services/mkd/mkd.service';
import {Router} from '@angular/router';

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
    private mkdService: MkdService,
    public router: Router
  ) { }

  ngOnInit() {
    console.log(this.router.url);
    this.authService.getAuth(true)
      .then(it => {
        this.auth = it;
        this.mkdService.currentMkd.subscribe(
          mkd => {
            this.currentMkd = mkd;
            this.checkPrivileges();
          }
        );
      });
  }

  checkPrivileges() {
    if(this.auth.mkdOwners && this.auth.mkdOwners.length > 0) {
      let m = this.auth.mkdOwners.find(owner => owner.mkdId == this.currentMkd.mkdId);
      this.hasSuperPrivileges = this.authService.checkRole(['CHAIRMAN', 'SYSTEM_ADMIN', 'BOARD_MEMBER'], m.authorities);
      this.hasHolderPrivileges = this.authService.checkRole(['HOLDER'], m.authorities);
    }
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
