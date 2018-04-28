import { Component, OnInit } from '@angular/core';
import {QuestionaryInfo} from '../../../models/questionary/questionary-info';
import {QuestionaryService} from '../../../services/questionary/questionary.service';

/**
 * Анкета для голосования и просмотра
 */
@Component({
  selector: 'app-questionary',
  templateUrl: './questionary.component.html',
  styleUrls: ['./questionary.component.css']
})
export class QuestionaryComponent implements OnInit {

  questionaryInfo: QuestionaryInfo = null;

  constructor(
    private dataService: QuestionaryService
  ) { }

  ngOnInit() {
    this.dataService.getQuestionaryInfo('questionary1').subscribe(
      questionaryInfo => {
        this.questionaryInfo = questionaryInfo;
      }
    );
  }
}
