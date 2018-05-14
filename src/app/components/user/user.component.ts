import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";
import {Auth, MkdOwnersInfo} from "../../services/auth/auth";
import {MkdService} from '../../services/mkd/mkd.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['user.component.css'],
})
export class UserComponent implements OnInit {

  public mkd = [];
  currentMkdId: string;

  constructor(
    private router: Router,
    public authService: AuthService,
    private dataService: MkdService,
  ) { }

  ngOnInit() {
    this.dataService.currentMkd.subscribe(mkd => {
      this.currentMkdId = mkd.mkdId;
    });
    this.authService.getAuth()
      .then(it => {
        if(it.mkdOwners){
          this.mkd = it.mkdOwners;
          for(let mkd of this.mkd){
            if(mkd.byDefault || this.mkd.length == 1 ){
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
    this.dataService.setCurrentMkd(this.currentMkdId);
  }

}
