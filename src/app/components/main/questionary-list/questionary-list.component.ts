import { Component, OnInit } from '@angular/core';
import {QuestionarySummary} from "../../../models/questionary/questionary-summary";
import {MatDialog, MatSnackBar} from "@angular/material";
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {BatchExecutionResult} from "../../../models/batch-execution-result";
import {SimpleDialogComponent} from "../../simple-dialog/simple-dialog.component";
import {QuestionaryService} from "../../../services/questionary/questionary.service";
import {MkdService} from "../../../services/mkd/mkd.service";
import {TableComponent} from "../../../classes/table-component";
import {PaginationInfo} from "../../../models/pagination-info";
import {AuthService} from "../../../services/auth/auth.service";

/**
 * Список анкет МКД
 */
@Component({
  selector: 'app-questionary-list',
  templateUrl: './questionary-list.component.html',
  styleUrls: ['./questionary-list.component.css']
})
export class QuestionaryListComponent extends TableComponent<QuestionarySummary> implements OnInit {

  currentMkdId: string;
  displayedColumns = ['select', 'name', 'state', 'responseCount', 'date'];

  showArchived: boolean = false;
  createAllowed: boolean = false;

  constructor(
    private dataService: QuestionaryService,
    private mkdService: MkdService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    super(); }

  ngOnInit() {
  }

  refreshAfterInit() {
    this.mkdService.currentMkd.subscribe(mkd => {
      this.createAllowed = this.authService.checkRole(['CHAIRMAN', 'BOARD_MEMBER'], mkd.authorities);
      this.currentMkdId = mkd.mkdId;
      this.refreshTable();
    });
  }

  updateDataCollection(paginationInfo: PaginationInfo): void {
    this.dataService.getQuestionariesList(this.currentMkdId, this.showArchived, paginationInfo)
      .subscribe(data => {
          this.dataCollection.next(data[0]);
          this.totalLength = data[1];
        }
      );
  }

  openDeleteDialog(): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '170px',
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let questionaryIds = this.getSelectedIds();
        if(questionaryIds.length > 0) {
          this.dataService.deleteQuestionaries(questionaryIds).subscribe(
            (data) => {
              this.showBatchResult("Удалено", data);
              this.refreshTable();
            }
          );
        }
      }
    });
  }

  openArchiveDialog(): void {
    let dialogRef = this.dialog.open(SimpleDialogComponent, {
      height: '170px',
      width: '350px',
      data: { title: 'Перевести в архив все' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let questionaryIds = this.getSelectedIds();
        if(questionaryIds.length > 0) {
          this.dataService.archiveQuestionaries(questionaryIds).subscribe(
            (data) => {
              this.showBatchResult("Переведено в архив", data);
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


}
