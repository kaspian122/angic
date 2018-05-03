import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MkdService} from "../../../services/mkd/mkd.service";
import {MkdOwnersInfo} from "../../../services/auth/auth";

@Component({
  selector: 'app-questionary-create',
  templateUrl: './questionary-create.component.html',
  styleUrls: ['./questionary-create.component.css']
})
export class QuestionaryCreateComponent implements OnInit {

  form: FormGroup;
  currentMkd?: MkdOwnersInfo = null;

  loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mkdService: MkdService
  ) { }

  ngOnInit() {
    console.log('init');
    this.mkdService.currentMkd.subscribe(
      mkd => {
        console.log('got current mkd');
        this.currentMkd = mkd;
        this.initForm();
      }
    );
  }

  initForm() {
    console.log('init form');
    this.form = this.fb.group({
      mkdId: [this.currentMkd.mkdId],
      name: ['', Validators.required],
      questions: this.fb.array([]),
    });
    console.log('init form end');
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      countQuorum: [false, Validators.required],
      required:    [false, Validators.required],
      name:        ['', Validators.required],
      type:        ['FreeForm', Validators.required],
      options:     this.fb.array([])
    }));
  }


  addOption(questionNum: number) {
    let options = this.questions[questionNum].get('options') as FormArray;
    options.push(this.fb.group({
      option: ['']
    }));
  }

  f(name) {
    return this.form.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if(e.required) return "Необходимо указать";
    if(e.server) return e.server;
  }

}

