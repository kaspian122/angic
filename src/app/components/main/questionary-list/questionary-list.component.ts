import { Component, OnInit } from '@angular/core';
import {QuestionarySummary} from "../../../models/questionary/questionary-summary";
import {DataService} from "../../../services/data/data.service";
import {MkdOwnersInfo} from "../../../services/auth/auth";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {SelectionModel} from "@angular/cdk/collections";
import {DeleteDialogComponent} from "../../delete-dialog/delete-dialog.component";

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
  displayedColumns = ['select', 'name', 'state', 'responseCount', 'quorum', 'date'];
  public selection = new SelectionModel(true, []);

  constructor(
    private dataService: DataService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.dataService.currentMkd.subscribe(
      mkd => {
        this.setCurrentMkdId(mkd.mkdId);
      }
    )
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
    this.dataService.getQuestionariesList(this.currentMkdId).subscribe(
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
              this.getQuestionariesList();
            }
          );
        }
      }
    });
  }

  openArchiveDialog(): void {

  }

}
