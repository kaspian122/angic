import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {QuestionaryRights} from "../../../models/questionary/questionary-rights";
import {Observable} from "rxjs/Observable";
import {QuestionaryService} from '../../../services/questionary/questionary.service';
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

  questionaryRights: QuestionaryRights = null;
  questionaryInfo?: QuestionaryInfo = null;
  questionaryId: string;

  constructor(
    private route: ActivatedRoute,
    private dataService: QuestionaryService
  ) { }

  ngOnInit() {
    this.getQuestionaryInfo();
  }

  getQuestionaryInfo(): void {
    this.route.paramMap.switchMap(p => Observable.of(p)).subscribe(params => {
        this.questionaryId = params.get('id');
        this.updateQuestionary();
        this.updateRights();
      }
    );
  }

  updateRights() {
    this.dataService.getQuestionaryRights(this.questionaryId).subscribe(questionaryRights => {
        this.questionaryRights = questionaryRights;
      }
    );
  }

  updateQuestionary() {
    this.dataService.getQuestionaryInfo(this.questionaryId).subscribe(info => {
        this.questionaryInfo = info;
      }
    );
  }

  onVoted() {
    this.updateRights();
    this.updateQuestionary();
  }

}
