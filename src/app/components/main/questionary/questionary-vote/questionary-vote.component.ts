import {Component, Input, OnInit} from '@angular/core';
import {QuestionaryService} from "../../../../services/questionary/questionary.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Attach} from "../../../../models/attach";
import {QuestionInfo} from "../../../../models/questionary/question/question-info";
import {QuestionaryInfo} from "../../../../models/questionary/questionary-info";

/**
 * Вкладка прохождения анкеты
 */
@Component({
  selector: 'app-questionary-vote',
  templateUrl: './questionary-vote.component.html',
  styleUrls: ['./questionary-vote.component.css']
})
export class QuestionaryVoteComponent implements OnInit {

  @Input() questionaryId: string;

  form: FormGroup;
  info: QuestionaryInfo;
  loader: boolean = false;

  files: Attach[] = [];

  constructor(
    private questionaryService: QuestionaryService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.questionaryService.getQuestionaryInfo(this.questionaryId).subscribe(
      info => {

        this.info = info;

        info.files.forEach(f => {this.addFile(f.id, f.name)});

        this.form = this.fb.group({
          responses: this.fb.array([])
        });

        info.questions.forEach((q, i) => {
          this.addResponse(i, q);
        });
      }
    )
  }

  get responses() {
    return this.form.get('responses') as FormArray;
  }

  addResponse(i: number, q: QuestionInfo) {

    let config = {
      questionId: [q.id],
      freeAnswer: [''],
    };

    switch (q.type) {
      case ('Multiple'):
        config['questionOptionIds'] = this.fb.array(
          q.options.map(o => this.fb.group({optionId: [o.id], value: [false]}))
        );
        break;
      case ('Single'):
      case ('Score'):
        config['questionOptionIds'] = [null];
        break;

    }

    this.responses.push(this.fb.group(config));
  }

  addFile(id: string = null, name: string = null) {
    this.files.push({
      id: id,
      file: null,
      name: name,
      mode: null,
      thumbnail: ''
    });
  }

  downloadFile(file) {

  }

}
