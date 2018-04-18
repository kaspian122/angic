import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {Auth, MkdOwnersInfo} from "../../services/auth/auth";
import { Mkd } from '../../models/mkd';
import {DataService} from "../../services/data/data.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['user.component.css'],
})
export class UserComponent implements OnInit {

  public auth?: Auth = null;
  public mkd = [];
  public currentMkd?: MkdOwnersInfo = null;
  currentMkdId: string;

  constructor(
    private router: Router,
    public authService: AuthService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.currentMkd.subscribe(mkd => {
      this.currentMkd = mkd;
      this.currentMkdId = mkd.mkdId;
    });
    this.authService.getAuth(true)
      .then(it => {

        this.auth = it;
        if(this.auth.mkdOwners){
          this.mkd = this.auth.mkdOwners;
          for(let mkd of this.mkd){
            if(mkd.byDefault){
              this.dataService.currentMkd.next(mkd);
            }
          }
        }
      });

  }

  public logOut(){
    this.authService.logout().then(() => {this.router.navigate(['login'])});
  }

  public setCurrentMkd() {
    console.log(this.currentMkdId);
    this.dataService.setCurrentMkd(this.currentMkdId);
  }

}
