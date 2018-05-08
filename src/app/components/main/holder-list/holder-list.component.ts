import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {HoldersList, MkdHoldersList} from "../../../models/holder/mkd-holders-list";
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
    public displayedColumns = [
      'select', 'holderName', 'certificateNumber', 'certificateDate', 'shareAmount', 'areaMeters', 'percent'
    ];

    @Input() apartmentId: string;

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

    private getHoldersList(){
        this.dataService.getHoldersByApartment(this.apartmentId).subscribe(
            holdersList => {
                this.dataSource = new MatTableDataSource(holdersList);
            }
        );
    }
}
