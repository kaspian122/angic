import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['user.component.css'],
})
export class UserComponent implements OnInit {

  constructor(
    private router: Router,
    public authService: AuthService,
  ) { }

  ngOnInit() {
  }

  public logOut(){
    this.authService.logout().then(() => {this.router.navigate(['login'])});
  }
}
