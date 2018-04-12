import { Component, OnInit } from '@angular/core';
import {MkdCreate} from "../../../models/mkd-create";
import {DataService} from "../../../services/data/data.service";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-admin-chairman',
  templateUrl: './admin-chairman.component.html',
  styleUrls: ['./admin-chairman.component.css']
})
export class AdminChairmanComponent implements OnInit {

  mkdEnums: any;
  chairmanForm: FormGroup = new FormGroup({});

  constructor(
    private dataService: DataService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.dataService.getMkdEnums().subscribe(
      data => {
        this.mkdEnums = data;
        this.initChairmanForm();
      }
    );
  }

  initChairmanForm() {
    this.chairmanForm = this.fb.group({
      'apartment': this.initApartment(),
      'holder': this.initHolder(),
      'mkd': this.initMkd(),
      'user': this.initUser(),
    })
  }

  initApartment() {
    return this.fb.group({
      area: [''],
      number: [''],
      ownership: [''],
      totalShare: [''],
      utilization: ['']
    });
  }

  initHolder() {
    return this.fb.group({
      // id: [''],
      // apartmentId: [''],
      certificateDate: [''],
      certificateNumber: [''],
      portalUserId: [''],
      shareAmount: [''],
    });
  }

  initMkd() {
    return this.fb.group({
      // id: [''],
      address: [''],
      administrationType: [''],
      apartmentCount: [''],
      area: [''],
      // chairmanId: [''],
      floorCount: [''],
      porchCount: [''],
    });
  }

  initUser() {
    return this.fb.group({
      // id: [''],
      description: [''],
      email: [''],
      firstName: [''],
      lastName: [''],
      login: [''],
      phone: [''],
      secondName: [''],
    });
  }

}
