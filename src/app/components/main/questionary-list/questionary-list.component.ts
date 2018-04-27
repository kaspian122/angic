import { Component, OnInit } from '@angular/core';
import {QuestionarySummary} from "../../../models/questionary/questionary-summary";
import {DataService} from "../../../services/data/data.service";
import {MatDialog, MatSnackBar, MatTableDataSource} from "@angular/material";
import {SelectionModel} from "@angular/cdk/collections";
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";
import {BatchExecutionResult} from "../../../models/batch-execution-result";
import {SimpleDialogComponent} from "../../simple-dialog/simple-dialog.component";

/**
 * Список анкет МКД
 */
@Component({
  selector: 'app-questionary-list',
  templateUrl: './questionary-list.component.html',
  styleUrls: ['./questionary-list.component.css']
})
export class QuestionaryListComponent implements OnInit {

  questionaries: QuestionarySummary[];
  dataSource = new MatTableDataSource();
  currentMkdId: string;
  displayedColumns = ['select', 'name', 'state', 'responseCount', 'date'];
  public selection = new SelectionModel(true, []);

  showArchived: boolean = false;

  constructor(
    private dataService: DataService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataService.currentMkd.subscribe(
      mkd => {
        this.setCurrentMkdId(mkd.mkdId);
      }
    );
  }

  setCurrentMkdId(mkdId): void {
    this.currentMkdId = mkdId;
    this.getQuestionariesList();
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

  getQuestionariesList(): void {
    this.selection.clear();
    this.dataService.getQuestionariesList(this.currentMkdId, this.showArchived).subscribe(
      questionariesList => {
        this.questionaries = questionariesList;
        this.dataSource = new MatTableDataSource(this.questionaries);
      }
    );
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  openDeleteDialog(): void {
    let dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '170px',
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        let questionaryIds = this.selection.selected.map(s => s.id);
        if(questionaryIds.length > 0) {
          this.dataService.deleteQuestionaries(questionaryIds).subscribe(
            (data) => {
              this.showBatchResult("Удалено", data);
              this.getQuestionariesList();
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
        let questionaryIds = this.selection.selected.map(s => s.id);
        if(questionaryIds.length > 0) {
          this.dataService.archiveQuestionaries(questionaryIds).subscribe(
            (data) => {
              this.showBatchResult("Переведено в архив", data);
              this.getQuestionariesList();
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
