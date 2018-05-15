import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {ApartmentService} from '../../../services/apartment/apartment.service';
import {HolderService} from '../../../services/holder/holder.service';
import {MkdService} from '../../../services/mkd/mkd.service';
import {TableComponent} from "../../../classes/table-component";
import {PaginationInfo} from "../../../models/pagination-info";
import {MkdOwnersInfo} from "../../../services/auth/auth";
import {MkdInfo} from "../../../models/mkd/mkd-info";
import {ApartmentRow} from "../../../models/apartment/apartment-row";

@Component({
  selector: 'app-apartment-list',
  templateUrl: './apartment-list.component.html',
  styleUrls: ['./apartment-list.component.css']
})
export class ApartmentListComponent extends TableComponent<ApartmentRow> implements OnInit {
  mkdInfo: MkdInfo;
  currentMkd: MkdOwnersInfo;

  public displayedColumns = ['select', 'number', 'area', 'floor', 'porch', 'ownership', 'totalShare', 'utilization'];

  constructor(
    private apartmentService: ApartmentService,
    private mkdService: MkdService,
    private holderService: HolderService,
    private dialog: MatDialog
  ) {
    super();
  }

  ngOnInit() {
  }

  refreshAfterInit() {
    this.mkdService.currentMkd.subscribe(mkd => {
      this.currentMkd = mkd;
      this.refreshTable();
      this.loadInfo();
    });
  }

  updateDataCollection(paginationInfo: PaginationInfo): void {
    this.apartmentService.getApartmentsList(this.currentMkd.mkdId, paginationInfo).subscribe(data => {
      this.dataCollection.next(data[0]);
      this.totalLength = data[1];
    });
  }

  loadInfo() {
    this.mkdService.getMkdInfo(this.currentMkd.mkdId).subscribe(data => {
      this.mkdInfo = data;
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
        data=> this.downloadFile(data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Список собственников.xlsx'));
  }

  loadRegistryAd() {
    this.mkdService.getRegistryAd(this.currentMkd.mkdId).subscribe(
      data => this.downloadFile(data, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Объявление о регистрации.docx'));
  }

  private downloadFile(data, contentType: String, downloadTitle: String) {
       let blob = new Blob([data], { type: contentType });
    let url= window.URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = url;
    a.download = downloadTitle;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

}
