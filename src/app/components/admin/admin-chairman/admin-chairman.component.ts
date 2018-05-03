import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../../services/user/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MkdCreate} from "../../../models/mkd/mkd-create";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../../../models/user/user";
import {MatButton} from "@angular/material";
import {ErrorHandler} from "../../../services/error-handler";
import {MkdService} from '../../../services/mkd/mkd.service';

@Component({
  selector: 'app-admin-chairman',
  templateUrl: './admin-chairman.component.html',
  styleUrls: ['./admin-chairman.component.css']
})
export class AdminChairmanComponent implements OnInit {

  @ViewChild("sbmt") submit: MatButton;

  mkdEnums: any;
  form: FormGroup;

  user: User;
  oldPhone: string;

  loader: boolean = false;

  mkdCreate: MkdCreate;

  constructor(
    private dataService: UserService,
    private mkdService: MkdService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.mkdService.getMkdEnums().subscribe(
      data => {
        this.mkdEnums = data;
        this.initChairmanForm();
      }
    );
  }

  f(name) {
    return this.form.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if(e.required) return "Необходимо указать";
    if(e.email) return "Невалидный email адрес";
    if(e.server) return e.server;
  }

  onSubmit() {
    this.mkdCreate = this.form.value;

    if (this.user) {
      this.mkdCreate.user = this.user;
    } else {
      this.mkdCreate.user.login = this.mkdCreate.user.phone;
    }

    this.loader = true;
    this.mkdService.createMkd(this.mkdCreate).subscribe(
      data => {
        this.loader = false;
        this.router.navigate(['/admin']);
      },
      (err: HttpErrorResponse) => {
        ErrorHandler.handleFormError(err, this.form);
        this.loader = false;
      }
    );
  }

  initChairmanForm() {
    this.form = this.fb.group({
      'mkd': this.initMkd(),
      'user': this.initUser(),
    })
  }

  initMkd() {
    return this.fb.group({
      address: ['', Validators.required],
      administrationType: ['', Validators.required],
      apartmentCount: ['', Validators.required],
      area: ['', Validators.required],
      floorCount: ['', Validators.required],
      porchCount: ['', Validators.required],
    });
  }

  initUser() {
    return this.fb.group({
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      secondName: ['', Validators.required],
    });
  }

  phoneBlur() {
    const login = this.form.get('user.phone').value;

    if (!login) {
      this.unloadUser();
      return;
    }

    const oldLogin = this.user ? this.user.phone : null;

    if (login == oldLogin) return;
    this.unloadUser();

    this.dataService.getUserByLogin(login).subscribe(
      (data: User) => {
        if (data) this.preloadUser(data);
        setTimeout(()=>{this.submit.focus()}, 100);
      }
    );

  }

  preloadUser(data: User) {
    this.user = data;

    this.form.get('user.email').disable();
    this.form.get('user.firstName').disable();
    this.form.get('user.secondName').disable();
    this.form.get('user.lastName').disable();
    this.form.get('user').patchValue({
      phone: data.phone,
      email: data.email,
      firstName: data.firstName,
      secondName: data.secondName,
      lastName: data.lastName
    });
  }

  phoneKeyup() {
    const newPhone = this.form.get('user.phone').value;
    if (newPhone != this.oldPhone) this.unloadUser();
    this.oldPhone = newPhone;
  }

  unloadUser() {
    if (this.user) {
      const login = this.form.get('user.phone').value;
      this.user = void 0;
      this.form.get('user.email').enable();
      this.form.get('user.firstName').enable();
      this.form.get('user.secondName').enable();
      this.form.get('user.lastName').enable();
      this.form.get('user').patchValue({
        phone: login,
        firstName: '',
        secondName: '',
        lastName: '',
        email: ''
      });

      this.form.get('user').markAsUntouched();


    }
  }

}
