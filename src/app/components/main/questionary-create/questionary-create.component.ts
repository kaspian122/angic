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
        this.currentMkd = mkd;
        this.initForm();
      }
    );
  }

  initForm() {
    this.form = this.fb.group({
      mkdId: [this.currentMkd.mkdId],
      name: ['', Validators.required],
      questions: this.fb.array([]),
    });
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  options(i: number) {
    let c = this.questions.at(i).get('options') as FormArray;
    return c;
  }

  addQuestion() {
    this.questions.push(this.fb.group({
      countQuorum: [false, Validators.required],
      required:    [false, Validators.required],
      name:        ['', Validators.required],
      type:        ['Single', Validators.required],
      options:     this.fb.array([])
    }));
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
  }

  addOption(questionNum: number) {
    let options = this.questions.at(questionNum).get('options') as FormArray;
    options.push(this.fb.group({
      option: ['', Validators.required]
    }));
  }

  deleteOption(q: number, o: number) {
    this.options(q).removeAt(o);
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

