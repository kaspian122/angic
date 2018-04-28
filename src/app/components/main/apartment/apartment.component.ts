import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Apartment} from '../../../models/apartment/apartment';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorHandler} from '../../../services/error-handler';
import {HttpErrorResponse} from '@angular/common/http';
import {ApartmentService} from '../../../services/apartment/apartment.service';
import {MkdService} from '../../../services/mkd/mkd.service';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs/Observable';

/**
 * Квартира
 */
@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})
export class ApartmentComponent implements OnInit {

  /**
   * Список коллекций для выпадающих списков формы
   */
  mkdEnums: any;

  /**
   * Форма
   */
  apartmentForm: FormGroup;

  /**
   * Квартира
   */
  apartment: Apartment = null;

  /**
   * Выбранный дом
   */
  currentMkd;

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
    private dataService: MkdService,
    private apartmentService: ApartmentService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.paramMap.switchMap(p => Observable.of(p)).subscribe(
      params => {
        let apartmentId = params.get('id');

        this.dataService.currentMkd.subscribe(
          mkd => {
            this.currentMkd = mkd;
          }
        );

        this.dataService.getMkdEnums().subscribe(
          data => {
            this.mkdEnums = data;

            if(apartmentId == null) {
              this.title = 'Создание квартиры';
              this.btnTitle = 'Создать';
              this.initForm();
            } else {
              this.title = 'Редактирование квартиры';
              this.btnTitle = 'Сохранить';
              this.apartmentService.getApartmentInfo(apartmentId).subscribe(
                data => {
                  this.apartment = data;
                  this.initForm();
                }
              );
            }
          }
        );
      }
    );
  }

  f(name) {
    return this.apartmentForm.get(name);
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

  onSubmit() {
    let formDataApartment = this.apartmentForm.value.apartment;
    formDataApartment.mkdId = this.currentMkd.mkdId;

    this.savingForm = true;

    if (this.apartment == null) {
      this.apartmentService.createApartment(formDataApartment).subscribe(
        data => {
          this.savingForm = false;
          this.openSnackBar('Квартира создана', '')
        },
        (err: HttpErrorResponse) => {
          ErrorHandler.handleFormError(err, this.apartmentForm);
          this.savingForm = false;
        }
      );
    } else {
      formDataApartment.id = this.apartment.id;

      this.apartmentService.updateApartment(formDataApartment).subscribe(
        data => {
          this.savingForm = false;
          this.openSnackBar('Данные успешно сохранены', '')
        },
        (err: HttpErrorResponse) => {
          ErrorHandler.handleFormError(err, this.apartmentForm);
          this.savingForm = false;
        }
      );
    }
  }

  initForm() {
    this.apartmentForm = this.fb.group({
      'apartment': this.initApartment()
    })
  }

  initApartment() {
    if(this.apartment == null) {
      return this.fb.group({
        number: ['', Validators.required],
        floor: ['', ''],
        porch: ['', ''],
        area: ['', Validators.required],
        utilization: ['', Validators.required],
        ownership: ['', Validators.required],
        totalShare: ['', Validators.required]
      });
    } else {
      return this.fb.group({
        number: [this.apartment.number, Validators.required],
        floor: [this.apartment.floor, ''],
        porch: [this.apartment.porch, ''],
        area: [this.apartment.area, Validators.required],
        utilization: [this.mkdEnums.ApartmentUtilization.find(it => it.id == this.apartment.utilization.id), Validators.required],
        ownership: [this.mkdEnums.OwnershipType.find(it => it.id == this.apartment.ownership.id), Validators.required],
        totalShare: [this.apartment.totalShare, Validators.required]
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
