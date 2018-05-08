import { Component, OnInit } from '@angular/core';
import { Mkd } from '../../../models/mkd/mkd';
import { MkdService } from '../../../services/mkd/mkd.service';
import { TableComponent } from "../../../classes/table-component";
import {PaginationInfo} from "../../../models/pagination-info";

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent extends TableComponent<Mkd> implements OnInit {

  public displayedColumns = ['address', 'administrationType', 'apartmentCount', 'area', 'chairmanId', 'floorCount', 'porchCount', 'loadDate'];

  constructor(
    private dataService: MkdService,
  ) {
    super();
  }

  ngOnInit() {
  }

  updateDataCollection(paginationInfo: PaginationInfo): void {
    this.dataService.getMkdList(paginationInfo).subscribe(
      data => {
        this.dataCollection.next(data[0]);
        this.totalLength = data[1];
      },
      err => {
        this.dataCollection.next(null);
        this.totalLength = 0;
        throw err;
      }
    );
  }

}
