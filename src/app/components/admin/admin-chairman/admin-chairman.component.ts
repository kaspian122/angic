import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../../../services/data/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MkdCreate} from "../../../models/mkd-create";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {User} from "../../../models/user";
import {MatButton} from "@angular/material";
import {ErrorHandler} from "../../../services/error-handler";

@Component({
  selector: 'app-admin-chairman',
  templateUrl: './admin-chairman.component.html',
  styleUrls: ['./admin-chairman.component.css']
})
export class AdminChairmanComponent implements OnInit {

  @ViewChild("sbmt") submit: MatButton;

  mkdEnums: any;
  chairmanForm: FormGroup;

  user: User;
  oldPhone: string;

  loader: boolean = false;

  mkdCreate: MkdCreate;

  constructor(
    private dataService: DataService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.dataService.getMkdEnums().subscribe(
      data => {
        this.mkdEnums = data;
        this.initChairmanForm();
      }
    );
  }

  f(name) {
    return this.chairmanForm.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if(e.required) return "Необходимо указать";
    if(e.email) return "Невалидный email адрес";
    if(e.server) return e.server;
  }

  onSubmit() {
    this.mkdCreate = this.chairmanForm.value;

    if (this.user) {
      this.mkdCreate.user = this.user;
    } else {
      this.mkdCreate.user.login = this.mkdCreate.user.phone;
    }

    this.loader = true;
    this.dataService.createMkd(this.mkdCreate).subscribe(
      data => {
        this.loader = false;
        this.router.navigate(['/admin']);
      },
      (err: HttpErrorResponse) => {
        ErrorHandler.handleFormError(err, this.chairmanForm);
        this.loader = false;
      }
    );
  }

  initChairmanForm() {
    this.chairmanForm = this.fb.group({
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
    const login = this.chairmanForm.get('user.phone').value;

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

    this.chairmanForm.get('user.email').disable();
    this.chairmanForm.get('user.firstName').disable();
    this.chairmanForm.get('user.secondName').disable();
    this.chairmanForm.get('user.lastName').disable();
    this.chairmanForm.get('user').patchValue({
      phone: data.phone,
      email: data.email,
      firstName: data.firstName,
      secondName: data.secondName,
      lastName: data.lastName
    });
  }

  phoneKeyup() {
    const newPhone = this.chairmanForm.get('user.phone').value;
    if (newPhone != this.oldPhone) this.unloadUser();
    this.oldPhone = newPhone;
  }

  unloadUser() {
    if (this.user) {
      const login = this.chairmanForm.get('user.phone').value;
      this.user = void 0;
      this.chairmanForm.get('user.email').enable();
      this.chairmanForm.get('user.firstName').enable();
      this.chairmanForm.get('user.secondName').enable();
      this.chairmanForm.get('user.lastName').enable();
      this.chairmanForm.get('user').patchValue({
        phone: login,
        firstName: '',
        secondName: '',
        lastName: '',
        email: ''
      });

      this.chairmanForm.get('user').markAsUntouched();


    }
  }

}
