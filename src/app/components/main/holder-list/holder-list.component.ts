import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material';
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {HolderService} from '../../../services/holder/holder.service';
import {MkdService} from '../../../services/mkd/mkd.service';

@Component({
  selector: 'app-holder-list',
  templateUrl: './holder-list.component.html',
  styleUrls: ['./holder-list.component.css']
})
export class HolderListComponent implements OnInit {
    public dataSource = new MatTableDataSource();
    public displayedColumns = [
      'select', 'holderName', 'certificateNumber', 'certificateDate', 'shareAmount', 'areaMeters', 'percent'
    ];
    public selection = new SelectionModel(true, []);

    @Input() apartmentId: string;

    constructor(
        private dataService: HolderService,
        private mkdService: MkdService,
        private dialog: MatDialog
    ) { }

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
        this.mkdService.currentMkd.subscribe(
            mkd => {
                this.getHoldersList();
            }
        )
    }

    openDeleteDialog(): void{
        let dialogRef = this.dialog.open(DeleteDialogComponent, {
            height: '170px',
            width: '350px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result){
                let holderIds = this.selection.selected.map(s => s.id);
                if(holderIds.length > 0) {
                    this.dataService.deleteHolders(holderIds).subscribe(
                        () => {
                            this.getHoldersList();
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
