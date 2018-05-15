import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {HolderService} from '../../../services/holder/holder.service';
import {SelectionComponent} from "../../../classes/selection-component";
import {Holder} from "../../../models/holder/holder";

@Component({
  selector: 'app-holder-list',
  templateUrl: './holder-list.component.html',
  styleUrls: ['./holder-list.component.css']
})
export class HolderListComponent extends SelectionComponent<Holder> implements OnInit {

    public displayedColumns = [
      'select', 'holderName', 'certificateNumber', 'certificateDate', 'shareAmount', 'areaMeters', 'percent', 'bools'
    ];

    @Input() apartmentId: string;

    constructor(
        private dataService: HolderService,
        private dialog: MatDialog
    ) {
      super();
    }

    ngOnInit() {
      this.updateTable();
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
                            this.updateTable();
                        }
                    );
                }
            }
        });
    }

    updateTable(): void {
        super.updateTable();
        this.dataService.getHoldersByApartment(this.apartmentId).subscribe(
            dataList => this.dataSource.data = dataList
        );
    }

}
