import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import { Auth } from "../../../services/auth/auth";
import {DataService} from '../../../services/data/data.service';
import {MkdNewsInfo} from "../../../models/mkd-news-info";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public auth?: Auth = null;
  mkdInfo: MkdNewsInfo = null;

  private apartmentsStr: string;

  constructor(
    private authService: AuthService,
    private dataService: DataService,
  ) { }

  ngOnInit() {
    this.authService.getAuth()
      .then(it => {
        this.auth = it;
        this.initInfo();
      });
  }

  initInfo(): void {
    this.dataService.currentMkd.subscribe(mkd => {
      this.dataService.getUserMkdInfo(mkd.mkdId).subscribe(
        info => {
          this.mkdInfo = info;
          this.apartmentsStr = this.mkdInfo.apartments.map(it => `кв. ${it.number}(${it.area} кв.м.)`).join(", ");
        }
      );
    });
  }

}
