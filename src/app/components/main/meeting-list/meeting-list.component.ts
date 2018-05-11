import { Component, OnInit } from '@angular/core';
import {TableComponent} from "../../../classes/table-component";
import {SimpleMeetingInfo} from "../../../models/meeting/simple-meeting-info";
import {PaginationInfo} from "../../../models/pagination-info";
import {MkdService} from "../../../services/mkd/mkd.service";
import {MeetingService} from "../../../services/meeting/meeting.service";
import {MatDialog, MatSnackBar} from "@angular/material";
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {BatchExecutionResult} from "../../../models/batch-execution-result";
import {Router} from '@angular/router';

/**
 * Список ОСС
 */
@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css']
})
export class MeetingListComponent extends TableComponent<SimpleMeetingInfo> implements OnInit {

  displayedColumns = ['select', 'state', 'number', 'kind', 'initiator', 'beginDate', 'endDate', 'loadDate'];
  currentMkdId: string;

  showCompleted: boolean = false;

  constructor(
    private mkdService: MkdService,
    private meetingService: MeetingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
  }

  refreshAfterInit() {
    this.mkdService.currentMkd.subscribe(mkdInfo => {
        this.currentMkdId = mkdInfo.mkdId;
        this.refreshTable();
      }
    )
  }

  updateDataCollection(paginationInfo: PaginationInfo): void {
    this.meetingService.getMeetingList(this.currentMkdId, this.showCompleted, paginationInfo)
      .subscribe(data => {
        this.dataCollection.next(data[0]);
        this.totalLength = data[1];
      });
  }

  openDeleteDialog(): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '170px',
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let selectedIds = this.getSelectedIds();
        if(selectedIds.length > 0) {
          this.meetingService.deleteMeetings(selectedIds).subscribe(
            (data) => {
              this.showBatchResult("Удалено", data);
              this.refreshTable();
            }
          );
        }
      }
    });
  }

  showBatchResult(actionName: string, data: BatchExecutionResult): void {
    let message = `${actionName} ${data.executed} из ${data.total}. `;
    if (data.executed != data.total) {
      message = message.concat(data.message);
    }
    this.snackBar.open(message, null, {
      duration: 3000
    });
  }

  openMeeting(row: SimpleMeetingInfo): void {
    if(row.state == 'Проект') {
      this.router.navigate([`/meeting-edit/${row.id}`]);
    } else {
      this.router.navigate([`/meeting/${row.id}`]);
    }
  }

}
