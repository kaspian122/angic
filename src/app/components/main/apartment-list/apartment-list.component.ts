import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {ApartmentService} from '../../../services/apartment/apartment.service';
import {HolderService} from '../../../services/holder/holder.service';
import {MkdService} from '../../../services/mkd/mkd.service';

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css']
})
export class ApartmentListComponent implements OnInit {
  public commonInfo;
  public currentMkd;

  public dataSource = new MatTableDataSource();
  public displayedColumns = ['select', 'number', 'area', 'floor', 'ownership', 'totalShare', 'utilization'];
  public selection = new SelectionModel(true, []);

  constructor(
      private apartmentService: ApartmentService,
      private dataService: MkdService,
      private holderService: HolderService,
      private dialog: MatDialog
  ) { }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  ngOnInit() {
    this.dataService.currentMkd.subscribe(
        mkd => {
          this.currentMkd = mkd;
          this.getApartmentsList(this.currentMkd);
        }
    )
  }


  openDeleteDialog(): void{
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '170px',
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      let apartmentIds = [];
      if (result){
        for (let item of this.selection.selected){
          apartmentIds.push(item.id);
        }
         if(apartmentIds.length > 0) {
          this.apartmentService.deleteApartments(apartmentIds).subscribe(
              () => {
                this.getApartmentsList(this.currentMkd);
              }
          );
        }
      }
    });
  }

  loadToExcel(){
    this.holderService.getExcelFileWithHolders(this.currentMkd.mkdId).subscribe(
        data=> this.downloadFile(data));
  }

  private downloadFile(data){

    let contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    let blob = new Blob([data], { type: contentType });
    var url= window.URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = url;
    a.download = 'Список собственников.xlsx';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }


  private getApartmentsList(mkd){
    this.apartmentService.getApartmentsList(mkd.mkdId).subscribe(
        apartmentsList => {
          let totalAreaIn = 0;
          for (let apartment of apartmentsList.apartments){
            totalAreaIn += apartment.area;
           };
          this.commonInfo = {
            totalAreaIn: totalAreaIn,
            mkd: apartmentsList.mkd,
            totalAreaPercentageIn: parseFloat((totalAreaIn * 100 / apartmentsList.mkd.area).toFixed(2))
          }
          this.dataSource = new MatTableDataSource(apartmentsList.apartments);

        }
    );
  }

}
