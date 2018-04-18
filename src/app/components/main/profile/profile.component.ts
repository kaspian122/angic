import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import { Auth } from "../../../services/auth/auth";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public auth?: Auth = null;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getAuth()
      .then(it => this.auth = it);
  }

}
