import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import "rxjs/add/operator/switchMap";
import {Observable} from "rxjs/Observable";
import {SavePass} from "../../models/save-pass";
import {DataService} from "../../services/data/data.service";
import {AuthService} from "../../services/auth/auth.service";
import {capitalize} from "@angular-devkit/core/src/utils/strings";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  password: string;
  passwordConfirm: string;
  key: string;
  type: string;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.route.paramMap.switchMap(p=>Observable.of(p)).subscribe(
      params => {
        this.authService.getAuth().then(
          () => {
            this.key = params.get('key');
            this.type = this.capitalize(params.get('type'));
          }
        );
      }
    );
  }

  capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  onSubmit() {
    let savePass: SavePass = {
      key: this.key,
      type: this.type,
      password: this.password
    };
    this.dataService.registration(savePass).subscribe(
      data => {
        console.log('success', data);
      },
      e => {
        console.log('error', e);
        // this.errorMessage
      }
    )
  }
}
