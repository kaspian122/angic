import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MeetingService} from '../../../services/meeting/meeting.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs/Observable';
import {SimpleObject} from '../../../models/simple-object';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MkdService} from '../../../services/mkd/mkd.service';
import {HolderService} from '../../../services/holder/holder.service';
import {MeetingInfo} from '../../../models/meeting/meeting-info';
import {MeetingEdit} from '../../../models/meeting/meeting-edit';
import {MeetingQuestionEdit} from '../../../models/meeting/question/meeting-question-edit';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandler} from '../../../services/error-handler';
import {AbstractControl} from '@angular/forms/src/model';
import {FileService} from '../../../services/file/file.service';
import {Attach} from '../../../models/attach';

/**
 * Создание/редактирование ОСС
 */
@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-edit.component.html',
  styleUrls: ['./meeting-edit.component.css']
})
export class MeetingEditComponent implements OnInit {

  /**
   * Форма
   */
  form: FormGroup;

  /**
   * Список коллекций для выпадающих списков формы
   */
  meetingEnums: any;

  /**
   * ОСС
   */
  meeting: MeetingInfo;

  /**
   * Список выбранных инициаторов
   */
  holderInitiators: SimpleObject[] = [];

  /**
   * Список всех собственников доступных для выбора
   */
  allHolders: SimpleObject[];

  /**
   * Бутор нужный для автокомплита с собственниками
   */
  separatorKeysCodes = [ENTER, COMMA];
  holdersCtrl: FormControl = new FormControl();
  @ViewChild('holderInput') holderInput: ElementRef;
  filteredHolderInitiators: Observable<SimpleObject[]>;

  /**
   * ID дома
   */
  mkdId: string;

  /**
   * Заголовок формы
   */
  title: string;

  /**
   * Заголовок кнопки
   */
  btnTitle: string;

  /**
   * true -> идет сохранение формы в данный момент
   */
  savingForm: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mkdService: MkdService,
    private holderService: HolderService,
    private meetingService: MeetingService,
    private fileService: FileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.filteredHolderInitiators = this.holdersCtrl.valueChanges.pipe(
      startWith(''),
      map(holder =>
        holder ? this.filter(holder) : this.allHolders
      )
    );
  }

  f(name) {
    return this.form.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if(e.required) {
      return "Необходимо указать";
    }
    if(e.server) {
      return e.server;
    }
  }

  ngOnInit() {
    this.route.paramMap.switchMap(p => Observable.of(p)).subscribe(
      params => {
        let meetingId = params.get('id');

        this.meetingService.getMeetingEnums().subscribe(
          enums => {
            this.meetingEnums = enums;

            this.mkdService.currentMkd.subscribe(
              mkd =>
                this.holderService.getSimpleHoldersByMkd(mkd.mkdId).subscribe(
                  holders => {
                    this.mkdId = mkd.mkdId;
                    if (meetingId == null) {
                      this.title = 'Создание общего собрания собственников';
                      this.btnTitle = 'Создать';
                      this.meeting = null;
                      this.allHolders = holders;
                      this.initForm();
                    } else {
                      this.title = 'Редактирование общего собрания собственников';
                      this.btnTitle = 'Сохранить';
                      this.meetingService.getMeetingInfo(meetingId).subscribe(
                        data => {
                          this.meeting = data;
                          this.holderInitiators = data.holderInitiators;
                          this.allHolders = holders.filter(holder => !this.holderInitiators.map(it => it.id).includes(holder.id));
                          this.initForm();
                        }
                      );
                    }
                  }
                )
            );
          }
        );
      });
  }

  onSubmit() {
    this.savingForm = true;

    const saveForm: MeetingEdit = this.prepareSaveForm();

    if (this.meeting) {
      this.meetingService.updateMeeting(saveForm).subscribe(
        (data: MeetingInfo) => {
          this.afterSave(data);
        },
        (err: HttpErrorResponse) => {
          ErrorHandler.handleFormError(err, this.form);
          this.savingForm = false;
        }
      );
    } else {
      this.meetingService.createMeeting(saveForm).subscribe(
        (data: MeetingInfo) => {
          this.afterSave(data);
        },
        (err: HttpErrorResponse) => {
          ErrorHandler.handleFormError(err, this.form);
          this.savingForm = false;
        }
      );
    }
  }

  afterSave(data: MeetingInfo) {
    let qCnt = 0;
    this.savingForm = false;

    if(data.questions.length == 0) {
      this.router.navigate([`/meeting-list`]);
    } else {
      this.form.value.questions.forEach(question => {
          let filesToAttach = question.newFiles.filter(f => f.value.id == null && f.value.mode == 'add').map(it => it.value);
          if (filesToAttach.length > 0) {
            let dataQuestion = data.questions.find(it => it.orderNumber == question.orderNumber);
            if (dataQuestion) {
              this.fileService.attachFiles(dataQuestion.id, filesToAttach, 'MeetingQuestion').subscribe(t => {
                qCnt += 1;
                if(qCnt == data.questions.length) {
                  this.router.navigate([`/meeting-list`]);
                }
              });
            }
          } else if(question.orderNumber == this.form.value.questions.length) {
            this.router.navigate([`/meeting-list`]);
          }
        }
      );
    }
  }

  prepareSaveForm(): MeetingEdit {
    const form = this.form.value;

    let beginDate = new Date(form.beginDate);
    if(form.beginTime) {
      let beginTime = form.beginTime.split(":");
      beginDate.setHours(beginTime[0], beginTime[1]);
    }

    let endDate = new Date(form.endDate);
    if(form.endTime) {
      let endTime = form.endTime.split(":");
      endDate.setHours(endTime[0], endTime[1]);
    }

    return {
      id: this.meeting && this.meeting.id || null,
      mkdId: this.mkdId,
      name: form.name,
      kind: form.kind.id,
      quorum: form.quorum.id,
      beginDate: beginDate.toISOString(),
      endDate: endDate.toISOString(),
      holderInitiatorIds: this.holderInitiators.map(it => it.id),
      questions: form.questions.map(it => MeetingEditComponent.prepareQuestion(form, it)) as MeetingQuestionEdit[]
    } as MeetingEdit;
  }

  static prepareQuestion(form: any, question: any): MeetingQuestionEdit {
    return {
      id: question.id,
      name: question.name,
      description: question.description,
      quorum: question.quorum.id,
      orderNumber: form.questions.indexOf(question) + 1,
    } as MeetingQuestionEdit;
  }

  goToReview(): void {
    this.meetingService.goToReview(this.meeting.id).subscribe(data => {
      this.router.navigate([`/meeting-list`]);
    }, (err: HttpErrorResponse) => {
      ErrorHandler.handleFormError(err, this.form);
      this.savingForm = false;
    });
  }

  initForm() {
    if(this.meeting) {
      let questionsFormGroups = this.meeting.questions.map(question => this.fb.group({
        id: [question.id, ''],
        name: [question.name, Validators.required],
        description: [question.description, Validators.required],
        orderNumber: [question.orderNumber, Validators.required],
        quorum: [this.meetingEnums.MeetingQuorum.find(it => it.id == question.quorum.id), Validators.required],
        newFiles: this.fb.array([])
      }));
      this.form = this.fb.group({
        kind: [this.meetingEnums.MeetingKind.find(it => it.id == this.meeting.kind.id), Validators.required],
        quorum: [this.meetingEnums.MeetingQuorum.find(it => it.id == this.meeting.quorum.id), Validators.required],
        beginDate: [new Date(this.meeting.beginDate), Validators.required],
        endDate: [new Date(this.meeting.endDate), Validators.required],
        beginTime: [MeetingEditComponent.getTimeStr(this.meeting.beginDate), ''],
        endTime: [MeetingEditComponent.getTimeStr(this.meeting.endDate), ''],
        questions: this.fb.array(questionsFormGroups)
      });
      //this.form.value.questions.forEach(q => new File() this.addFile(q));
    } else {
      this.form = this.fb.group({
        kind: ['', Validators.required],
        quorum: ['', Validators.required],
        beginDate: ['', Validators.required],
        endDate: ['', Validators.required],
        beginTime: ['', ''],
        endTime: ['', ''],
        questions: this.fb.array([])
      });
    }
  }

  static getTimeStr(dateStr: string) {
    return MeetingEditComponent.makeTimeFormat(new Date(dateStr).getHours()) + ":" + MeetingEditComponent.makeTimeFormat(new Date(dateStr).getMinutes());
  }

  static makeTimeFormat(time: number) {
    if(time.toString().length == 1) {
      return "0" + time.toString();
    } else {
      return time.toString();
    }
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      orderNumber: [this.questions.controls.length+1, Validators.required],
      quorum: ['', Validators.required],
      files: this.fb.array([]),
      newFiles: this.fb.array([])
    }));

    this.form.markAsDirty({});
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
    this.form.markAsDirty({});
  }

  filter(name: string) {
    return this.allHolders.filter(holder =>
      holder.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  removeInitiator(holder: any): void {
    const index = this.holderInitiators.indexOf(holder);

    if (index >= 0) {
      this.holderInitiators.splice(index, 1);
      this.allHolders.push(holder);
    }
    this.form.markAsDirty({});
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let addedItem = this.filter(event.option.viewValue)[0];
    if(addedItem) {
      this.holderInitiators.push(addedItem);
      this.allHolders.splice(this.allHolders.indexOf(addedItem), 1);
      this.holdersCtrl.setValue(null);
      this.form.markAsDirty({});
    }

    this.holderInput.nativeElement.value = '';
  }

  fileSelect($event, question) {
    const files: FileList = $event.srcElement.files;
    Array.from(files).forEach(file => this.addFile(file, question));
  }

  addFile(f: File, question: AbstractControl) {
    (question.get('newFiles') as FormArray).push(this.fb.group({
      id: null, file: f, mode: "add", thumbnail: ''
    }));

    let i = (question.value.newFiles as FormArray).length-1;

    let reader = new FileReader();
    reader.onload = (e: any) => {
      (question.get('newFiles') as FormArray).at(i).value.thumbnail = e.target.result;
    };
    reader.readAsDataURL(f);
    this.form.markAsDirty({});
  }

  deleteFile(question: AbstractControl, file: Attach) {
    file.mode = 'del';
    (question.get('newFiles') as FormArray).removeAt(question.value.newFiles.indexOf(file));
    this.form.markAsDirty({});
  }

}
