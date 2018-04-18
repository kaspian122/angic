import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../services/data/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MkdCreate} from "../../../models/mkd-create";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-chairman',
  templateUrl: './admin-chairman.component.html',
  styleUrls: ['./admin-chairman.component.css']
})
export class AdminChairmanComponent implements OnInit {

  mkdEnums: any;
  chairmanForm: FormGroup;

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

  onSubmit() {
    this.mkdCreate = this.chairmanForm.value;
    this.mkdCreate.user.login = this.mkdCreate.user.phone;

    this.dataService.createMkd(this.mkdCreate).subscribe(
      data => {
        console.log('Success:', data);
      },
      err => {
        console.log('Error:', err);
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
      // id: [''],
      address: ['', Validators.required],
      administrationType: ['', Validators.required],
      apartmentCount: ['', Validators.required],
      area: ['', Validators.required],
      // chairmanId: [''],
      floorCount: ['', Validators.required],
      porchCount: ['', Validators.required],
    });
  }

  initUser() {
    return this.fb.group({
      // id: [''],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      secondName: [''],
      // firstName: ['', Validators.required],
      // lastName: ['', Validators.required],
      // secondName: ['', Validators.required],
    });
  }

}
