import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {AuthService} from "../../services/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorHandler} from "../../services/error-handler";
import {Observable} from "rxjs/Observable";
import "rxjs/add/observable/timer";
import {Subscription} from "rxjs/Subscription";
import "rxjs/add/operator/timeInterval";
import "rxjs/add/operator/take";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  step: number = 1;
  submitLabel: string = "Получить код по СМС";
  loader: boolean = false;
  resendLoader: boolean = false;
  timer: Subscription;
  timeLeft: number = 0;
  form: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.authService.getAuth().then(
      () => {
        this.form = this.fb.group({
          phone: ['', Validators.required]
        });

        const phone = this.route.snapshot.paramMap.get('login') || null;
        if (phone) {
          this.form.get('phone').setValue(phone);
        }
      }
    );

  }

  onSubmit() {
    this.loader = true;

    if (this.step == 1) {
      this.submitOne();
    } else if (this.step == 2) {
      this.submitTwo();
    }
  }

  submitOne() {
    this.userService.sendSms(this.form.get('phone').value).subscribe(
      (data) => {
        console.log(data);
        this.loader = false;
        this.stepTwo(data as number);
      },
      (e) => {
        ErrorHandler.handleFormError(e, this.form);
        this.loader = false;
      }
    )
  }

  submitTwo() {
    const code = this.form.get('key').value;
    this.userService.checkCode(code, 'Phone').subscribe(
      () => {
        this.loader = false;
        this.router.navigate(['/confirm', 'phone', code]);
      },
      (e) => {
        ErrorHandler.handleFormError(e, this.form);
        this.loader = false;
      }
    )
  }

  stepTwo(time: number) {
    this.startTimer(time);
    this.form.addControl('key', new FormControl('', Validators.required));
    this.form.get('phone').disable();
    this.submitLabel = "Войти";
    this.step = 2;
    // this.form.get('key');
  }

  resendCode() {
    this.resendLoader = true;
    this.userService.sendSms(this.form.get('phone').value).subscribe(
      (data) => {
        console.log(data);
        this.startTimer(data as number);
        this.resendLoader = false;
      },
      (e) => {
        ErrorHandler.handleFormError(e, this.form);
        this.loader = false;
      }
    )
  }

  startTimer(time: number) {
    if (this.timer) this.timer.unsubscribe();
    this.timer = Observable.timer(0, 1000).take(time+1)
      .subscribe(
        (x: number) => {
          this.timeLeft = time-x;
        }
      );
  }

  f(name) {
    return this.form.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if (!e) return '';
    if (e.compare) return e.compare;
    if (e.required) return "Необходимо указать";
    if (e.server) return e.server;
  }

}
