import { Component, OnInit } from '@angular/core';
import {DataService} from '../../../services/data/data.service';
import {QuestionaryInfo} from '../../../models/questionary/questionary-info';
import {ActivatedRoute} from "@angular/router";

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
  questionaryId: string;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getQuestionaryInfo();
  }

  getQuestionaryInfo(): void {
    this.questionaryId = this.route.snapshot.paramMap.get('id');
    this.dataService.getQuestionaryInfo(this.questionaryId).subscribe(
      questionaryInfo => {
        this.questionaryInfo = questionaryInfo;
      }
    );
  }
}
