import {Component, Input, OnInit} from '@angular/core';
import {QuestionaryInfo} from '../../../../models/questionary/questionary-info';
import {MatDialog} from '@angular/material';
import {QuestionaryResultFreeAnswersComponent} from './questionary-result-free-answers/questionary-result-free-answers.component';
import {QuestionInfo} from '../../../../models/questionary/question/question-info';

/**
 * Вкладка результаты анкеты
 */
@Component({
  selector: 'app-questionary-result',
  templateUrl: './questionary-result.component.html',
  styleUrls: ['./questionary-result.component.css']
})
export class QuestionaryResultComponent implements OnInit {

  @Input() questionary: QuestionaryInfo;

  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  openFreeDialog(question: QuestionInfo): void{
    this.dialog.open(QuestionaryResultFreeAnswersComponent, {
      height: '500px',
      width: '500px',
      data: { question }
    });
  }

}
