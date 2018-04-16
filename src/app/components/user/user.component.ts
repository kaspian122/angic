import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {Auth} from "../../services/auth/auth";
import { Mkd } from '../../models/mkd';
import {DataService} from "../../services/data/data.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['user.component.css'],
})
export class UserComponent implements OnInit {

  public auth?: Auth = null;
  public mkd?: Mkd[] = [];

  constructor(
    private router: Router,
    public authService: AuthService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.authService.getAuth()
      .then(it => this.auth = it);

    this.dataService.getChairmanMkdList()
      .then(
        it => {
          this.mkd = it;
          return it;
        },
        err => {
          this.mkd = null;
          throw err;
        }
      );
  }

  public logOut(){
    this.authService.logout().then(() => {this.router.navigate(['login'])});
  }
  
}
