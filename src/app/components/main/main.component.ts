import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})
export class MainComponent implements OnInit {

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {

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
