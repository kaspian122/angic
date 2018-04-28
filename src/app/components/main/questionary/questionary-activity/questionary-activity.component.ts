import {Component, Input, OnInit} from '@angular/core';
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
  @Input() questionaryId: string;

  constructor(
    private dataService: QuestionaryService
  ) { }

  ngOnInit() {
    this.dataService.getQuestionaryActivity(this.questionaryId).subscribe(
      activity => {
        this.activity = activity;
      }
    );
  }

}
