import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import {Auth} from "../../../services/auth/auth";

@Component({
  selector: 'app-holder-list',
  templateUrl: './holder-list.component.html',
  styleUrls: ['./holder-list.component.css']
})
export class HolderListComponent implements OnInit {

  public auth?: Auth = null;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.getAuth()
      .then(it => this.auth = it);
  }

}
