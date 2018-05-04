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

  options(i: number) {
    let c = this.questions.at(i).get('options') as FormArray;
    console.log(c);
    return c;
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      countQuorum: [false, Validators.required],
      required:    [false, Validators.required],
      name:        ['', Validators.required],
      type:        ['Single', Validators.required],
      options:     this.fb.array([
        this.fb.group({option: '1111'}),
        this.fb.group({option: '2222'}),
        this.fb.group({option: '3333'}),
        this.fb.group({option: ''}),
        this.fb.group({option: ''})
      ])
    }));
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
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

