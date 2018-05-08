import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {ApartmentService} from '../../../services/apartment/apartment.service';
import {HolderService} from '../../../services/holder/holder.service';
import {MkdService} from '../../../services/mkd/mkd.service';
import {TableComponent} from "../../../classes/table-component";
import {Apartment} from "../../../models/apartment/apartment";
import {PaginationInfo} from "../../../models/pagination-info";

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css']
})
export class ApartmentListComponent extends TableComponent<Apartment> implements OnInit {
  public commonInfo;
  public currentMkd;

  public displayedColumns = ['select', 'number', 'area', 'floor', 'ownership', 'totalShare', 'utilization'];

  constructor(
    private apartmentService: ApartmentService,
    private dataService: MkdService,
    private holderService: HolderService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
  }

  refreshAfterInit() {
    this.dataService.currentMkd.subscribe(mkd => {
      this.currentMkd = mkd;
      this.refreshTable();
    });
  }

  updateDataCollection(paginationInfo: PaginationInfo): void {
    this.apartmentService.getApartmentsList(this.currentMkd.mkdId, paginationInfo).subscribe(data => {
      let apartmentList = data[0];
      this.totalLength = data[1];
      this.dataCollection.next(apartmentList.apartments);

      let totalAreaIn = 0;
      for(let apartment of apartmentList.apartments) {
        totalAreaIn += apartment.area;
      }
      this.commonInfo = {
        totalAreaIn: totalAreaIn,
        mkd: apartmentList.mkd,
        totalAreaPercentageIn: parseFloat((totalAreaIn * 100 / apartmentList.mkd.area).toFixed(2))
      };
    });
  }

  openDeleteDialog(): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '170px',
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result) {
        const apartmentIds = this.getSelectedIds();
        if(apartmentIds.length > 0) {
          this.apartmentService.deleteApartments(apartmentIds).subscribe(() => {
              this.refreshTable();
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
    let url= window.URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = url;
    a.download = 'Список собственников.xlsx';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

}
