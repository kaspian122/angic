import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MeetingService} from '../../../services/meeting/meeting.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Observable} from 'rxjs/Observable';
import {SimpleObject} from '../../../models/simple-object';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent} from '@angular/material';
import {ActivatedRoute} from '@angular/router';
import {MkdService} from '../../../services/mkd/mkd.service';
import {HolderService} from '../../../services/holder/holder.service';
import {MeetingInfo} from '../../../models/meeting/meeting-info';

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
                    if(meetingId == null) {
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
      this.form = this.fb.group({
        kind: [this.meetingEnums.MeetingKind.find(it => it.id == this.meeting.kind.id), Validators.required],
        quorum: [this.meetingEnums.MeetingQuorum.find(it => it.id == this.meeting.quorum.id), Validators.required],
        beginDate: [new Date(this.meeting.beginDate), Validators.required],
        endDate: [new Date(this.meeting.endDate), Validators.required]
      });
    } else {
      this.form = this.fb.group({
        kind: ['', Validators.required],
        quorum: ['', Validators.required],
        beginDate: ['', Validators.required],
        endDate: ['', Validators.required]
      });
    }
  }

  onSubmit() {

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
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let addedItem = this.filter(event.option.viewValue)[0];
    if(addedItem) {
      this.holderInitiators.push(addedItem);
      this.allHolders.splice(this.allHolders.indexOf(addedItem), 1);
      this.holdersCtrl.setValue(null);
    }

    this.holderInput.nativeElement.value = '';
  }

}
