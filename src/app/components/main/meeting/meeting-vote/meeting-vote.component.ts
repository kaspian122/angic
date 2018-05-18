import {Component, Input, OnInit} from '@angular/core';
import {MeetingInfo} from '../../../../models/meeting/meeting-info';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MeetingService} from '../../../../services/meeting/meeting.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingQuestionInfo} from '../../../../models/meeting/question/meeting-question-info';
import {FileService} from '../../../../services/file/file.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {Attach} from '../../../../models/attach';
import {ErrorHandler} from '../../../../services/error-handler';
import {MeetingResponse} from '../../../../models/meeting/question/meeting-response';
import {MeetingRights} from '../../../../models/meeting/meeting-rights';

@Component({
  selector: 'app-meeting-vote',
  templateUrl: './meeting-vote.component.html',
  styleUrls: ['./meeting-vote.component.css']
})
export class MeetingVoteComponent implements OnInit {

  @Input() meeting: MeetingInfo;

  @Input() meetingRights: MeetingRights;

  /**
   * Форма
   */
  form: FormGroup;

  /**
   * Список коллекций для выпадающих списков формы
   */
  meetingEnums: any;

  /**
   * true -> идет сохранение формы в данный момент
   */
  savingForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.meetingService.getMeetingEnums().subscribe(
      enums => {
        this.meetingEnums = enums;
        this.initForm();
     });
  }

  initForm() {
    let questionsFormGroups = this.meeting.questions.map(question => this.fb.group({
      id: [question.id, ''],
      name: [question.name, Validators.required],
      description: [question.description, Validators.required],
      orderNumber: [question.orderNumber, Validators.required],
      files: this.fb.array(this.initFiles(question)),
      attachs: this.fb.array([]),
      answer: [this.getAnswerValue(question), '']
    }));

    this.form = this.fb.group({
      questions: this.fb.array(questionsFormGroups)
    });

    this.initAttachs();
  }

  getAnswerValue(question: MeetingQuestionInfo) {
    if(question.answer) {
      return question.answer.name;
    } else {
      return this.meetingEnums.MeetingQuestionAnswer[this.meetingEnums.MeetingQuestionAnswer.length-1].name;
    }
  }

  initFiles(question: MeetingQuestionInfo) {
    return question.files.map(file => this.fb.group({
      id: [file.id, ''],
      name: [file.name, '']
    }));
  }

  initAttachs() {
    this.questions.controls.forEach(question => {
        question.value.files.forEach(file => {
          (question.get('attachs') as FormArray).push(this.fb.group({
            id: file.id, file: null, name: file.name, mode: 'keep', thumbnail: ''
          }));
        });
      }
    );
    /**
    this.questions.controls.forEach(question => {
        let requests = question.value.files.map(f => this.fileService.getFile(f.id, 'MeetingQuestion'));
        forkJoin(requests).subscribe(
          results => {
            results.forEach((response: HttpResponse<Blob>, i: number) => {
              let file = new File([response.body], question.value.files[i].name, {type: response.headers.get('mime-type')});
              this.addFile(question, file, 'keep', question.value.files[i].id);
            });
          },
          null,
          null
        );
      }
    );
     */
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  addFile(question: AbstractControl, f: File, mode: 'add'|'del'|'keep' = 'add', id: string = null) {
    (question.get('attachs') as FormArray).push(this.fb.group({
      id: id, file: f, name: f.name, mode: 'keep', thumbnail: ''
    }));

    let i = question.value.attachs.length-1;

    let reader = new FileReader();
    reader.onload = (e: any) => {
      question.value.attachs[i].thumbnail = e.target.result;
    };
    reader.readAsDataURL(f);
  }

  downloadFile(file: Attach) {
    this.fileService.getFile(file.id, 'MeetingQuestion').subscribe(
      (response: HttpResponse<Blob>) => {
        let f = new File([response.body], file.name, {type: response.headers.get('mime-type')});
        let url= window.URL.createObjectURL(f);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = url;
        a.download = f.name;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    );
  }

  onSubmit() {
    this.savingForm = true;

    const form = this.form.value;
    let meetingResponses : MeetingResponse[] = [];
    form.questions.forEach(question => {
      meetingResponses.push(
        {
          questionId: question.id,
          answer: this.meetingEnums.MeetingQuestionAnswer.find(it => it.name == question.answer).id
        } as MeetingResponse
      )
    });

    this.meetingService.saveMeetingResponse(this.meeting.id, meetingResponses).subscribe(
      (data) => {
        this.router.navigate([`/meeting-list`]);
      },
      (err: HttpErrorResponse) => {
        ErrorHandler.handleFormError(err, this.form);
        this.savingForm = false;
      }
    );
  }

}
