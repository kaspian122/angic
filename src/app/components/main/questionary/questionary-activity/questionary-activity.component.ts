import { Component, OnInit } from '@angular/core';
import {QuestionaryActivity} from '../../../../models/questionary/questionary-activity';
import {QuestionaryService} from '../../../../services/questionary/questionary.service';

/**
 * Вкладка активности анкеты
 */
@Component({
  selector: 'app-questionary-activity',
  templateUrl: './questionary-activity.component.html',
  styleUrls: ['./questionary-activity.component.css']
})
export class QuestionaryActivityComponent implements OnInit {

  activity: QuestionaryActivity = null;

  constructor(
    private dataService: QuestionaryService
  ) { }

  ngOnInit() {
    this.dataService.getQuestionaryActivity('questionary1').subscribe(
      activity => {
        this.activity = activity;
      }
    );
  }

}
