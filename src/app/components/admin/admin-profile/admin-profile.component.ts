import { Component, OnInit } from '@angular/core';
import { Mkd } from '../../../models/mkd';
import { Auth } from '../../../services/auth/auth';
import { DataService } from '../../../services/data/data.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  public mkd?: Mkd[] = [];

  constructor(
    private dataService: DataService,

  ) { }

  ngOnInit() {
    this.dataService.getMkdList()
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

}
