import { Component, OnInit } from '@angular/core';
import {HoldersList, MkdHoldersList} from "../../../models/holder/mkd-holders-list";
import {MatTableDataSource} from '@angular/material';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {HolderService} from '../../../services/holder/holder.service';
import {MkdService} from '../../../services/mkd/mkd.service';
import {TableComponent} from "../../../classes/table-component";
import {Observable} from "rxjs/Observable";
import {PaginationInfo} from "../../../models/pagination-info";

@Component({
  selector: 'app-holder-list',
  templateUrl: './holder-list.component.html',
  styleUrls: ['./holder-list.component.css']
})
export class HolderListComponent extends TableComponent<HoldersList> implements OnInit {

    public holdersList?:MkdHoldersList = null;
    public holdersData = [];
    public commonInfo;
    public currentMkd;

    public displayedColumns = ['select', 'apartmentNumber', 'holderName', 'certificateNumber', 'certificateDate', 'area', 'holderShareAmount', 'totalShare', 'voting', 'percentage'];

    constructor(
        private dataService: HolderService,
        private mkdService: MkdService,
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
    });
  }

    openDeleteDialog(): void{
        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            height: '170px',
            width: '350px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result){
                const holderIds = this.getSelectedIds();
                if(holderIds.length > 0) {
                    this.dataService.deleteHolders(holderIds).subscribe(
                        () => {
                            this.refreshTable();
                        }
                    );
                }
            }
        });
    }

    loadToExcel(){
        this.dataService.getExcelFileWithHolders(this.currentMkd.mkdId).subscribe(
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


    updateDataCollection(paginationInfo: PaginationInfo): void {
        this.dataService.getHoldersList(this.currentMkd, paginationInfo).subscribe(
            data => {
                let holdersList = data[0];
                this.totalLength = data[1];

                this.holdersData = [];
                this.holdersList = holdersList;
                let holdersAreaIn = 0;
                for (let holder of holdersList.holders){
                    let votingCount = holder.apartment.area * holder.holder.shareAmount / holder.apartment.totalShare;
                    holdersAreaIn += holder.apartment.area;
                    let holderRow = {
                        apartmentId: holder.apartment.id,
                        holderId: holder.holder.id,
                        userId: holder.user.id,
                        apartmentNumber: holder.apartment.number,
                        holderFirstName: holder.user.firstName,
                        holderLastName: holder.user.lastName,
                        holderSecondName: holder.user.secondName,
                        certificateNumber: holder.holder.certificateNumber,
                        certificateDate: holder.holder.certificateDate,
                        area: holder.apartment.area,
                        holderShareAmount: holder.holder.shareAmount,
                        totalShare: holder.apartment.totalShare,
                        votingCount: votingCount,
                        percentage: parseFloat((votingCount * 100 / this.holdersList.mkd.area).toFixed(2)),
                    };
                    this.holdersData.push(holderRow);
                }
                this.commonInfo = {
                    mkd: holdersList.mkd,
                    holdersAreaIn: holdersAreaIn,
                    holderAreaPercentageIn: parseFloat((holdersAreaIn * 100 / holdersList.mkd.area).toFixed(2))
                };
                this.dataCollection.next(this.holdersData);
            }
        );
    }
}
