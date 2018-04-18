import { Component, OnInit, ViewChild } from '@angular/core';
import { Mkd } from '../../../models/mkd';
import { DataService } from '../../../services/data/data.service';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  public mkd?: Mkd[] = [];

  public displayedColumns = ['id', 'address', 'administrationType', 'apartmentCount', 'area', 'chairmanId', 'floorCount', 'porchCount'];
  public dataSource = new MatTableDataSource<Mkd>(this.mkd);

  constructor(
    private dataService: DataService,

  ) { }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  
  ngOnInit() {

    this.dataService.getMkdList()
      .then(
        it => {
          this.mkd = it;
          this.dataSource = new MatTableDataSource<Mkd>(this.mkd);
          return it;
        },
        err => {
          this.mkd = null;
          throw err;
        }
      );
  }

}
