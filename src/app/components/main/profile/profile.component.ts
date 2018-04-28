import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../services/auth/auth.service";
import { Auth } from "../../../services/auth/auth";
import {UserService} from '../../../services/user/user.service';
import {MkdNewsInfo} from "../../../models/mkd/mkd-news-info";
import {MkdService} from '../../../services/mkd/mkd.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public auth?: Auth = null;
  mkdInfo: MkdNewsInfo = null;

  private ownerApartmentsStr: string;
  private powerOfAttorneyApartmentsStr: string;

  constructor(
    private authService: AuthService,
    private dataService: UserService,
    private mkdService: MkdService,
  ) { }

  ngOnInit() {
    this.authService.getAuth()
      .then(it => {
        this.auth = it;
        this.initInfo();
      });
  }

  initInfo(): void {
    this.mkdService.currentMkd.subscribe(mkd => {
      this.dataService.getUserMkdInfo(mkd.mkdId).subscribe(
        info => {
          this.mkdInfo = info;
          this.ownerApartmentsStr = this.mkdInfo.ownerInfo.apartments.map(it => `кв. ${it.number}(${it.area} кв.м.)`).join(", ");
          this.powerOfAttorneyApartmentsStr = this.mkdInfo.ownerInfo.apartments.map(it => `кв. ${it.number}(${it.area} кв.м.)`).join(", ");
        }
      );
    });
  }

}
