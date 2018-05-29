import {Component, Input, OnInit} from '@angular/core';
import {QuestionaryService} from "../../../../services/questionary/questionary.service";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Attach} from "../../../../models/attach";
import {QuestionInfo} from "../../../../models/questionary/question/question-info";
import {QuestionaryInfo} from "../../../../models/questionary/questionary-info";
import {QuestionResponse, QuestionResponses} from "../../../../models/questionary/question/question-responses";
import {ErrorHandler} from "../../../../services/error-handler";
import {forkJoin} from "rxjs/observable/forkJoin";
import {MkdService} from "../../../../services/mkd/mkd.service";
import {QuestionaryRights} from "../../../../models/questionary/questionary-rights";
import {OptionInfo} from "../../../../models/questionary/question/option/option-info";
import {MatSnackBar} from "@angular/material";
import {HttpResponse} from "@angular/common/http";
import {FileService} from "../../../../services/file/file.service";

/**
 * Вкладка прохождения анкеты
 */
@Component({
  selector: 'app-questionary-vote',
  templateUrl: './questionary-vote.component.html',
  styleUrls: ['./questionary-vote.component.css']
})
export class QuestionaryVoteComponent implements OnInit {

  @Input() questionary: QuestionaryInfo;
  @Input() questionaryRights: QuestionaryRights;

  form: FormGroup;
  loader: boolean = false;

  files: Attach[] = [];

  constructor(
    private questionaryService: QuestionaryService,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    console.log(this.questionary);
    this.questionary.files.forEach(f => {this.addFile(f.id, f.name)});
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      responses: this.fb.array([])
    });

    this.questionary.questions.forEach((q, i) => {
      this.addResponse(i, q);
    });
    this.checkVoteRights();
  }

  checkVoteRights() {
    if (!this.questionaryRights.editVote) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  get responses() {
    return this.form.get('responses') as FormArray;
  }

  addResponse(i: number, q: QuestionInfo) {

    let config = {
      questionId: [q.id]
    };

    switch (q.type) {
      case ('Multiple'):
        config['questionOptionIds'] = this.fb.array(
          q.options.map(o => this.fb.group({optionId: [o.id], value: [this.checkboxValue(o.id, q.optionsByUser)]}))
        );
        break;
      case ('Single'):
      case ('Score'):
        config['questionOptionIds'] = [q.optionsByUser.length ? q.optionsByUser[0].id : null];
        break;
      case ('FreeForm'):
        config['freeAnswer'] = [q.freeAnswersByUser.length ? q.freeAnswersByUser[0] : ''];
    }

    this.responses.push(this.fb.group(config));
  }

  checkboxValue(optionId: string, optionsByUser: OptionInfo[]) {
    return !!optionsByUser.filter(o => o.id == optionId).length;
  }

  addFile(id: string = null, name: string = null) {
    this.files.push({
      id: id,
      file: null,
      name: name,
      mode: null,
      thumbnail: '',
      loader: false
    });
  }

  downloadFile(f: Attach) {

    f.loader = true;

    this.fileService.getFile(f.id, 'Questionary').subscribe(
      (response: HttpResponse<Blob>) => {
        let file = new File([response.body], f.name, {type: response.headers.get('mime-type')});

        let url= window.URL.createObjectURL(file);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = url;
        a.download = f.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      null,
      () => {
        f.loader = false;
      }
    );
  }

  onSubmit() {
    this.loader = true;
    const responses = this.prepareSaveForm();

    this.questionaryService.respondQuestionary(this.questionary.id, responses).subscribe(
      () => {
        this.snackBar.open('Благодарим Вас за участие в опросе! Ваше мнение будет обязательно учтено!', '', {
          duration: 2000
        });

        this.questionaryService.getQuestionaryRights(this.questionary.id).subscribe(
          (rights) => {
            this.questionaryRights = rights;
            this.checkVoteRights();
          },
          null,
          () => {
            this.loader = false;
          }
        )
      },
      (err) => {
        ErrorHandler.handleFormError(err, this.form);
        this.loader = false;
      }
    )
  }

  prepareSaveForm(): QuestionResponses {
    let form = this.form.value;

    let result = {
      responses: []
    };

    form.responses.forEach((r, i)=> {

      let response: QuestionResponse = {
        questionId: r.questionId,
        required: this.questionary.questions[i].required,
        questionOptionIds: [],
        freeAnswer: null
      };

      const type = this.questionary.questions[i].type;

      switch (type) {
        case 'Single':
        case 'Score':
          response['questionOptionIds'] = r.questionOptionIds ? [r.questionOptionIds] : [];
          break;
        case 'Multiple':
          response['questionOptionIds'] = r.questionOptionIds.filter(o => o.value).map(o => o.optionId);
          break;
        case 'FreeForm':
          response['freeAnswer'] = r.freeAnswer;
      }

      result.responses.push(response);
    });

    return result as QuestionResponses;
  }

  f(name) {
    return this.form.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if(e.required) return "Необходимо указать";
    if(e.server) return e.server;
  }
}
