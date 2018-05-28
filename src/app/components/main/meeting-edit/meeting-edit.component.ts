import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MeetingService} from '../../../services/meeting/meeting.service';
import {Observable} from 'rxjs/Observable';
import {SimpleObject} from '../../../models/simple-object';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatDialog} from '@angular/material';
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
import {MeetingQuestionInfo} from '../../../models/meeting/question/meeting-question-info';
import {forkJoin} from 'rxjs/observable/forkJoin';
import * as _moment from 'moment';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {DeleteDialogComponent} from '../../delete-dialog/delete-dialog.component';
const moment = _moment;

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
  holdersCtrl: FormControl = new FormControl();
  @ViewChild('holderInput') holderInput: ElementRef;
  filteredHolderInitiators: Observable<SimpleObject[]>;
  separatorKeysCodes = [ENTER, COMMA];
  @ViewChild('inputFile') inputFile: any;

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
    private route: ActivatedRoute,
    private dialog: MatDialog
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

  /**************************** Инициализация ****************************************/

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

  initForm() {
    if(this.meeting) {
      let questionsFormGroups = this.meeting.questions.map(question => this.fb.group({
        id: [question.id, ''],
        name: [question.name, Validators.required],
        description: [question.description, Validators.required],
        orderNumber: [question.orderNumber, Validators.required],
        quorum: [this.meetingEnums.MeetingQuorum.find(it => it.id == question.quorum.id), Validators.required],
        files: this.fb.array(this.initFiles(question)),
        attachs: this.fb.array([])
      }));
      this.form = this.fb.group({
        kind: [this.meetingEnums.MeetingKind.find(it => it.id == this.meeting.kind.id), Validators.required],
        beginDate: [new Date(this.meeting.beginDate), Validators.required],
        endDate: [new Date(this.meeting.endDate), Validators.required],
        beginTime: [MeetingEditComponent.getTimeStr(this.meeting.beginDate), ''],
        endTime: [MeetingEditComponent.getTimeStr(this.meeting.endDate), ''],
        questions: this.fb.array(questionsFormGroups, Validators.required)
      });
      this.initAttachs();
    } else {
      this.form = this.fb.group({
        kind: ['', Validators.required],
        beginDate: ['', Validators.required],
        endDate: ['', Validators.required],
        beginTime: ['', ''],
        endTime: ['', ''],
        questions: this.fb.array([], Validators.required)
      });
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
  }

  /**************************** Сохранение ****************************************/

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

    if (data.questions.length == 0) {
      this.router.navigate([`/meeting-list`]);
    } else {
      this.form.value.questions.forEach(question => {
          let filesToDelete = question.attachs.filter(f => f.id != null && f.mode == 'del');
          let delRequests = filesToDelete.map(f => this.fileService.deleteFile(f.id, 'MeetingQuestion'));
          forkJoin(delRequests).subscribe(
            null,
            null,
            () => {
              let filesToAttach = question.attachs.filter(f => f.id == null && f.mode == 'add').map(it => it);
              if (filesToAttach.length > 0) {
                let dataQuestion = data.questions.find(it => it.orderNumber == question.orderNumber);
                if (dataQuestion) {
                  this.fileService.attachFiles(dataQuestion.id, filesToAttach, 'MeetingQuestion').subscribe(t => {
                    qCnt += 1;
                    if (qCnt == data.questions.length) {
                      this.router.navigate([`/meeting-list`]);
                    }
                  });
                }
              }
              if (question.orderNumber == this.form.value.questions.length) {
                this.router.navigate([`/meeting-list`]);
              }
            });
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

  /**************************** События ****************************************/

  goToReview(): void {
    this.meetingService.goToReview(this.meeting.id).subscribe(data => {
      this.router.navigate([`/meeting-list`]);
    }, (err: HttpErrorResponse) => {
      ErrorHandler.handleFormError(err, this.form);
      this.savingForm = false;
    });
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      orderNumber: [this.questions.controls.length+1, Validators.required],
      quorum: ['', Validators.required],
      files: this.fb.array([]),
      attachs: this.fb.array([])
    }));

    this.form.markAsDirty({});
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
    this.form.markAsDirty({});
  }

  addFile(f: File, question: AbstractControl) {
    (question.get('attachs') as FormArray).push(this.fb.group({
      id: null, file: f, name: f.name, mode: "add", thumbnail: ''
    }));

    this.form.markAsDirty({});
  }

  deleteFile(question: AbstractControl, file: Attach) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      height: '170px',
      width: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        file.mode = 'del';
        this.form.markAsDirty({});
      }
    });

  }

  /**************************** GET ****************************************/
  get questions() {
    return this.form.get('questions') as FormArray;
  }

  getFilesForView(question: AbstractControl) {
    return question.value.attachs.filter(it => it.mode != 'del');
  }

  /**************************** Остальное ****************************************/

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
    this.inputFile.nativeElement.value = '';
  }

  updateBeginDateTime() {
    this.form.get('beginTime').setErrors(null);
    this.form.get('beginDate').setErrors(null);
  }

  updateEndDateTime() {
    this.form.get('endTime').setErrors(null);
    this.form.get('endDate').setErrors(null);
  }
}
