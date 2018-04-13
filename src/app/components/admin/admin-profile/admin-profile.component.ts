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
  public dataSource = new MatTableDataSource<Mkd>(ELEMENT_DATA);

  constructor(
    private dataService: DataService,

  ) { }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  @ViewChild( MatPaginator ) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

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


const ELEMENT_DATA: Mkd[] = [
  {id: '1', address: 'Hydrogen', administrationType: 'type', apartmentCount: 200, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '2', address: 'Hydrogen', administrationType: 'type', apartmentCount: 240, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '3', address: 'Hydrogen', administrationType: 'type', apartmentCount: 230, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '4', address: 'Hydrogen', administrationType: 'type', apartmentCount: 300, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '5', address: 'Hydrogen', administrationType: 'type', apartmentCount: 210, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '6', address: 'Hydrogen', administrationType: 'type', apartmentCount: 250, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '7', address: 'Hydrogen', administrationType: 'type', apartmentCount: 310, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '8', address: 'Hydrogen', administrationType: 'type', apartmentCount: 100, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '9', address: 'Hydrogen', administrationType: 'type', apartmentCount: 100, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '10', address: 'Hydrogen', administrationType: 'type', apartmentCount: 300, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '11', address: 'Hydrogen', administrationType: 'type', apartmentCount: 200, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
  {id: '12', address: 'Hydrogen', administrationType: 'type', apartmentCount: 200, area: 600, chairmanId: 'man1', floorCount: 9, porchCount: 2},
];
