import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Holder} from '../../../models/holder/holder';
import {ActivatedRoute, Router} from '@angular/router';
import {MkdService} from '../../../services/mkd/mkd.service';
import {HolderService} from '../../../services/holder/holder.service';
import {Observable} from 'rxjs/Observable';
import {User} from '../../../models/user/user';
import {UserService} from '../../../services/user/user.service';
import {MatButton, MatSnackBar} from '@angular/material';
import {ErrorHandler} from '../../../services/error-handler';
import {HttpErrorResponse} from '@angular/common/http';
import {PowerOfAttorney} from '../../../models/holder/power-of-attorney';

/**
 * Собственник
 */
@Component({
  selector: 'app-holder',
  templateUrl: './holder.component.html',
  styleUrls: ['./holder.component.css']
})
export class HolderComponent implements OnInit {

  @ViewChild("sbmt") submit: MatButton;

  /**
   * Форма
   */
  holderForm: FormGroup;

  /**
   * Форма создания
   */
  isCreate: boolean;

  /**
   * Собственник
   */
  holder: Holder = null;

  /**
   * Доверенное лицо
   */
  powerOfAttorney: PowerOfAttorney = null;

  /**
   * Квартира
   */
  apartmentId: string = null;

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

  oldPhone: string;
  oldPoaPhone: string;

  constructor(
    private mkdService: MkdService,
    private holderService: HolderService,
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.paramMap.switchMap(p => Observable.of(p)).subscribe(
      params => {
        let holderId = params.get('id');

        if(holderId == null) {
          this.title = 'Создание собственника';
          this.btnTitle = 'Создать';
          this.apartmentId = params.get('apartmentId');
          this.initForm(null);
          this.isCreate = true;
        } else {
          this.title = 'Редактирование собственника';
          this.btnTitle = 'Сохранить';
          this.holderService.getHolderInfo(holderId).subscribe(
            data => {
              this.apartmentId = data.apartmentId;
              this.initForm(data);
              this.holder = data;
              this.isCreate = false;
            }
          );
        }
      }
    );
  }

  f(name) {
    return this.holderForm.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if(e.required) return "Необходимо указать";
    if(e.pattern) return "Некорректные символы";
    if(e.server) return e.server;
  }

  onSubmit() {
    let formDataApartment = this.holderForm.value;

    this.savingForm = true;

    if(!this.holder) {
      this.holder = <Holder>{};
    }

    this.holder.apartmentId = this.apartmentId;
    if(!this.holder.portalUser || !this.holder.portalUser.id) {
      this.holder.portalUser = formDataApartment.portalUser;
      this.holder.portalUser.login = this.holder.portalUser.phone;
    }

    if(formDataApartment.powerOfAttorney) {
      if(this.powerOfAttorney) {
        this.holder.powerOfAttorney = this.powerOfAttorney;
      } else {
        this.holder.powerOfAttorney = <PowerOfAttorney>{};
      }
      this.holder.powerOfAttorney.number = formDataApartment.powerOfAttorney.number;
      this.holder.powerOfAttorney.beginDate = formDataApartment.powerOfAttorney.beginDate;
      this.holder.powerOfAttorney.endDate = formDataApartment.powerOfAttorney.endDate;
    }

    if(!this.holder.powerOfAttorney.confidant || !this.holder.powerOfAttorney.confidant.id) {
      this.holder.powerOfAttorney.confidant = formDataApartment.powerOfAttorney.confidant;
      this.holder.powerOfAttorney.confidant.login = formDataApartment.powerOfAttorney.confidant.phone;
    }
    if(this.holder.powerOfAttorney.confidant.phone == null || this.holder.powerOfAttorney.confidant.phone == '') {
      this.holder.powerOfAttorney = null;
    }

    this.holder.shareAmount = formDataApartment.shareAmount;
    this.holder.certificateNumber = formDataApartment.certificateNumber;
    this.holder.certificateDate = formDataApartment.certificateDate;
    this.holder.participationMeeting = formDataApartment.participationMeeting;
    this.holder.receiveNewsByEmail = formDataApartment.receiveNewsByEmail;
    this.holder.councilman = formDataApartment.councilman;
    this.holder.chairman = formDataApartment.chairman;
    this.holder.legalPerson = formDataApartment.legalPerson;
    this.holder.comment = formDataApartment.comment;

    if (this.isCreate) {
      this.holderService.createHolder(this.holder).subscribe(
        data => {
          this.savingForm = false;
          this.openSnackBar('Собственник создан', '');
          this.router.navigate([`/apartment/${this.apartmentId}`]);
        },
        (err: HttpErrorResponse) => {
          ErrorHandler.handleFormError(err, this.holderForm);
          this.savingForm = false;
        }
      );
    } else {
      formDataApartment.id = this.holder.id;

      this.holderService.updateHolder(this.holder).subscribe(
        data => {
          this.savingForm = false;
          this.openSnackBar('Данные успешно сохранены', '');
          this.router.navigate([`/apartment/${this.apartmentId}`]);
        },
        (err: HttpErrorResponse) => {
          ErrorHandler.handleFormError(err, this.holderForm);
          this.savingForm = false;
        }
      );
    }
  }

  initForm(holder) {
    this.holderForm = this.initHolder(holder);
    if(holder) {
      if (holder.portalUser) {
        this.preloadUser(holder.portalUser);
      }
      if (holder.powerOfAttorney && holder.powerOfAttorney.confidant) {
        this.preloadPoaUser(holder.powerOfAttorney.confidant);
      }
    }
  }

  initHolder(holder) {
    if (holder) {
      return this.fb.group({
        certificateDate: [new Date(holder.certificateDate), Validators.required],
        certificateNumber: [holder.certificateNumber, Validators.required],
        shareAmount: [holder.shareAmount, [Validators.required, Validators.pattern('[0-9]*')]],
        comment: [holder.comment, ''],
        councilman: [holder.councilman, ''],
        chairman: [holder.chairman, ''],
        participationMeeting: [holder.participationMeeting, ''],
        receiveNewsByEmail: [holder.receiveNewsByEmail, ''],
        legalPerson: [holder.legalPerson, ''],
        'portalUser': this.initUser(holder.portalUser),
        'powerOfAttorney': this.initPowerOfAttorney(holder.powerOfAttorney)
      });
    } else {
      return this.fb.group({
        certificateDate: ['', Validators.required],
        certificateNumber: ['', Validators.required],
        shareAmount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
        comment: ['', ''],
        councilman: [false, ''],
        chairman: [false, ''],
        participationMeeting: [true, ''],
        receiveNewsByEmail: [true, ''],
        legalPerson: ['', ''],
        'portalUser': this.initUser(null),
        'powerOfAttorney': this.initPowerOfAttorney(null)
      });
    }
  }

  initUser(portalUser) {
    if (portalUser) {
      return this.fb.group({
        phone: [portalUser.phone, Validators.required],
        lastName: [portalUser.lastName, Validators.required],
        email: [portalUser.email, Validators.required],
        firstName: [portalUser.firstName, Validators.required],
        secondName: [portalUser.secondName, Validators.required]
      });
    } else {
      return this.fb.group({
        phone: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', Validators.required],
        firstName: ['', Validators.required],
        secondName: ['', Validators.required],
      });
    }
  }

  initPowerOfAttorney(powerOfAttorney) {
    if (powerOfAttorney) {
      return this.fb.group({
        number: [powerOfAttorney.number, Validators.required],
        beginDate: [new Date(powerOfAttorney.beginDate), ''],
        endDate: [new Date(powerOfAttorney.endDate), ''],
        'confidant': this.initConfidant(powerOfAttorney.confidant)
      });
    } else {
      return this.fb.group({
        number: ['', ''],
        beginDate: ['', ''],
        endDate: ['', ''],
        'confidant': this.initConfidant(null)
      });
    }
  }

  initConfidant(confidant) {
    if (confidant) {
      return this.fb.group({
        phone: [confidant.phone, Validators.required],
        lastName: [confidant.lastNam, Validators.required],
        email: [confidant.email, ''],
        firstName: [confidant.firstName, Validators.required],
        secondName: [confidant.secondName, Validators.required]
      });
    } else {
      return this.fb.group({
        phone: ['', ''],
        lastName: ['', ''],
        email: ['', ''],
        firstName: ['', ''],
        secondName: ['', '']
      });
    }
  }

  poaPhoneKeyup() {
    const newPhone = this.holderForm.get('powerOfAttorney.confidant.phone').value;
    if (newPhone != this.oldPoaPhone) {
      this.unloadPoaUser();
    }
    this.oldPoaPhone = newPhone;
  }

  userPhoneKeyup() {
    const newPhone = this.holderForm.get('portalUser.phone').value;
    if (newPhone != this.oldPhone) {
      this.unloadUser();
    }
    this.oldPhone = newPhone;
  }

  poaPhoneBlur() {
    const login = this.holderForm.get('powerOfAttorney.confidant.phone').value;

    if (!login) {
      this.unloadPoaUser();
      return;
    }

    const oldLogin = this.powerOfAttorney && this.powerOfAttorney.confidant ? this.powerOfAttorney.confidant.phone : null;

    if (login == oldLogin) {
      return;
    }
    this.unloadPoaUser();

    this.userService.getUserByLogin(login).subscribe(
      (data: User) => {
        if (data) {
          this.preloadPoaUser(data);
        }
        setTimeout(()=>{this.submit.focus()}, 100);
      }
    );
  }

  userPhoneBlur() {
    const login = this.holderForm.get('portalUser.phone').value;

    if (!login) {
      this.unloadUser();
      return;
    }

    const oldLogin = this.holder && this.holder.portalUser ? this.holder.portalUser.phone : null;

    if (login == oldLogin) {
      return;
    }
    this.unloadUser();

    this.userService.getUserByLogin(login).subscribe(
      (data: User) => {
        if (data) {
          this.preloadUser(data);
        }
        setTimeout(()=>{this.submit.focus()}, 100);
      }
    );
  }

  preloadUser(data: User) {
    if(this.holder == null) {
      this.holder = <Holder>{};
    }
    this.holder.portalUser = data;

    this.holderForm.get('portalUser.email').disable();
    this.holderForm.get('portalUser.firstName').disable();
    this.holderForm.get('portalUser.secondName').disable();
    this.holderForm.get('portalUser.lastName').disable();
    this.holderForm.get('portalUser').patchValue({
      phone: data.phone,
      email: data.email,
      firstName: data.firstName,
      secondName: data.secondName,
      lastName: data.lastName
    });
  }

  preloadPoaUser(data: User) {
    if(this.powerOfAttorney == null) {
      this.powerOfAttorney = <PowerOfAttorney>{};
    }
    this.powerOfAttorney.confidant = data;

    this.holderForm.get('powerOfAttorney.confidant.email').disable();
    this.holderForm.get('powerOfAttorney.confidant.firstName').disable();
    this.holderForm.get('powerOfAttorney.confidant.secondName').disable();
    this.holderForm.get('powerOfAttorney.confidant.lastName').disable();
    this.holderForm.get('powerOfAttorney.confidant').patchValue({
      phone: data.phone,
      email: data.email,
      firstName: data.firstName,
      secondName: data.secondName,
      lastName: data.lastName
    });
  }

  unloadUser() {
    if (this.holder && this.holder.portalUser) {
      const login = this.holderForm.get('portalUser.phone').value;
      this.holder.portalUser = void 0;
      this.holderForm.get('portalUser.email').enable();
      this.holderForm.get('portalUser.firstName').enable();
      this.holderForm.get('portalUser.secondName').enable();
      this.holderForm.get('portalUser.lastName').enable();
      this.holderForm.get('portalUser').patchValue({
        phone: login,
        firstName: '',
        secondName: '',
        lastName: '',
        email: ''
      });

      this.holderForm.get('portalUser').markAsUntouched();
      this.holder.portalUser = null;
    }
  }

  unloadPoaUser() {
    if (this.powerOfAttorney && this.powerOfAttorney.confidant) {
      const login = this.holderForm.get('powerOfAttorney.confidant.phone').value;
      this.powerOfAttorney.confidant = void 0;
      this.holderForm.get('powerOfAttorney.confidant.email').enable();
      this.holderForm.get('powerOfAttorney.confidant.firstName').enable();
      this.holderForm.get('powerOfAttorney.confidant.secondName').enable();
      this.holderForm.get('powerOfAttorney.confidant.lastName').enable();
      this.holderForm.get('powerOfAttorney.confidant').patchValue({
        phone: login,
        firstName: '',
        secondName: '',
        lastName: '',
        email: ''
      });

      this.holderForm.get('powerOfAttorney.confidant').markAsUntouched();
      this.powerOfAttorney.confidant = null;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
