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

/**
 * Создание/редактирование ОСС
 */
@Component({
  selector: 'app-meeting-create',
  templateUrl: './meeting-create.component.html',
  styleUrls: ['./meeting-create.component.css']
})
export class MeetingCreateComponent implements OnInit {

  /**
   * Форма
   */
  form: FormGroup;

  /**
   * Список коллекций для выпадающих списков формы
   */
  meetingEnums: any;

  /**
   * todo заменить на список из объекта ОСС
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
        this.mkdService.currentMkd.subscribe(
          mkd =>
            this.holderService.getSimpleHoldersByMkd(mkd.mkdId).subscribe(
              data => {
                this.allHolders = data;
                this.filteredHolderInitiators = this.holdersCtrl.valueChanges.pipe(
                  startWith(''),
                  map(holder =>
                    holder ? this.filter(holder) : this.allHolders
                  )
                );
              }
            )
        );

        this.title = 'Создание общего собрания собственников';
        this.btnTitle = 'Создать';

        this.meetingService.getMeetingEnums().subscribe(
          data => {
            this.meetingEnums = data;
            this.initForm();
          }
        );
      });
  }

  initForm() {
    this.form = this.fb.group({
      kind: ['', Validators.required],
      quorum: ['', Validators.required],
      beginDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
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
