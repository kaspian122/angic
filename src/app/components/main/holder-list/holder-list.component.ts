import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../services/data/data.service";
import {MkdHoldersList} from "../../../models/mkd-holders-list";
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";

@Component({
  selector: 'app-holder-list',
  templateUrl: './holder-list.component.html',
  styleUrls: ['./holder-list.component.css']
})
export class HolderListComponent implements OnInit {

    public holdersList?:MkdHoldersList = null;
    public holdersData = [];
    public commonInfo;
    public currentMkd;

    public dataSource = new MatTableDataSource();
    public displayedColumns = ['select', 'apartmentNumber', 'holderName', 'certificateNumber', 'certificateDate', 'area', 'holderShareAmount', 'totalShare', 'voting', 'percentage'];
    public selection = new SelectionModel(true, []);

    constructor(
        private dataService: DataService,
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
                //this.getHoldersList(this.currentMkd);
            }
        )
    }


    openDeleteDialog(): void{
        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            height: '170px',
            width: '350px'
        });

        dialogRef.afterClosed().subscribe(result => {
            let holderIds = [];
            if (result){
                for (let item of this.selection.selected){
                    holderIds.push(item.holderId);
                }
                if(holderIds.length > 0) {
                    this.dataService.deleteHolders(holderIds).subscribe(
                        () => {
                            this.getHoldersList(this.currentMkd);
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
        console.log(new DataView(data));
        let fileName: string = 'Список собственников.csv';
        var url= window.URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }


    private getHoldersList(mkd){
        this.dataService.getHoldersList(mkd.mkdId).subscribe(
            holdersList => {
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

                this.dataSource = new MatTableDataSource(this.holdersData);

            }
        );
    }
}
