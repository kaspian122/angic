import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../../components/login/login.component'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['user.component.css'],
})
export class UserComponent implements OnInit {

  constructor(private loginComponent: LoginComponent) { }

  ngOnInit() {
  }

  public logOut(){
    this.loginComponent.doLogout();
  }
}
