import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {Observable} from "rxjs/Observable";
import {UserService} from "../../services/user/user.service";
import {AuthService} from "../../services/auth/auth.service";
import {capitalize} from "@angular-devkit/core/src/utils/strings";
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {ErrorHandler} from "../../services/error-handler";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  loader: boolean = false;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      passwordConfirm: ['', [Validators.required, this.compareWithPassword()]],
      type: [''],
      key: ['']
    });

    this.route.paramMap.switchMap(p=>Observable.of(p)).subscribe(
      params => {
        this.authService.getAuth(true).then(
          (auth) => {
            if (auth.status == 'AUTHENTICATED') {
              this.authService.logout().then(
                () => {
                  this.form.get('login').setValue(params.get('login'));
                  this.form.get('key').setValue(params.get('key'));
                  this.form.get('type').setValue(capitalize(params.get('type')));
                }
              );
            } else {
              this.form.get('login').setValue(params.get('login'));
              this.form.get('key').setValue(params.get('key'));
              this.form.get('type').setValue(capitalize(params.get('type')));
            }
          }
        );
      }
    );
  }

  compareWithPassword(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      let pwd = control.root.get('password');
      if (!pwd) return null;
      return control.value == pwd.value ?  null : {compare: 'Пароль и подтверждение пароля не совпадают'};
    };
  }

  onSubmit() {

    this.loader = true;

    this.dataService.registration(this.form.value).subscribe(
      () => {
        this.authService.getAuth(true).then(
          ()=>{this.router.navigate(['/']);}
        );
      },
      e => {
        ErrorHandler.handleFormError(e, this.form);
        this.loader = false;
      }
    )
  }

  f(name) {
    return this.form.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if (!e) return '';
    if(e.compare) return e.compare;
    if(e.required) return "Необходимо указать";
    if(e.server) return e.server;
  }
}
