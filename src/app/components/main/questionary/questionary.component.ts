import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';
import {QuestionaryInfo} from '../../../models/questionary/questionary-info';

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
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getQuestionaryInfo('questionary1').subscribe(
      questionaryInfo => {
        this.questionaryInfo = questionaryInfo;
      }
    );
  }
}
