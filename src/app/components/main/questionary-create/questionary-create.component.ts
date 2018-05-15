import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MkdService} from "../../../services/mkd/mkd.service";
import {MkdOwnersInfo} from "../../../services/auth/auth";
import {QuestionaryCreate} from "../../../models/questionary/questionary-create";
import {QuestionEdit} from "../../../models/questionary/question/question-edit";
import {QuestionaryService} from "../../../services/questionary/questionary.service";
import {QuestionaryInfo} from "../../../models/questionary/questionary-info";
import {Router} from "@angular/router";
import {Attach} from "../../../models/attach";

@Component({
  selector: 'app-questionary-create',
  templateUrl: './questionary-create.component.html',
  styleUrls: ['./questionary-create.component.css']
})
export class QuestionaryCreateComponent implements OnInit {

  form: FormGroup;
  currentMkd?: MkdOwnersInfo = null;

  private _files: Attach[] = [];

  loader: boolean = false;

  constructor(
    private fb: FormBuilder,
    private mkdService: MkdService,
    private questionaryService: QuestionaryService,
    private router: Router
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
      sendMail: [false, Validators.required]
    });
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  options(i: number) {
    return this.questions.at(i).get('options') as FormArray;
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

  onSubmit() {
    const saveForm: QuestionaryCreate = this.prepareSaveForm();
    this.questionaryService.createQuestionary(saveForm).subscribe(
      (info: QuestionaryInfo) => {
        let filesToAttach = this.files.filter(f=>f.mode=='add');
        this.questionaryService.attachFiles(info.id, filesToAttach, 'Questionary').subscribe(
          // this.router.navigate(['/questionary-list']);
          (data)=> console.log('done!!!', data)
        )
      },
      (e) => {
        console.log(e);
      }
    );
  }

  prepareSaveForm(): QuestionaryCreate {
    const form = this.form.value;
    return {
      name: form.name,
      sendMail: form.sendMail,
      mkdId: form.mkdId,
      questions: form.questions.map((q,i)=>this.prepareQuestion(q, i)) as QuestionEdit[]
    } as QuestionaryCreate;
  }

  prepareQuestion(q: any, i: number): QuestionEdit {
    return {
      name: q.name,
      countQuorum: q.countQuorum,
      required: q.required,
      type: q.type,
      options: this.prepareOptions(q),
      orderNumber: i
    } as QuestionEdit;
  }

  prepareOptions(q: any) {
    if (q.type == 'Score') {
      return [
        {name: '', number: 1},
        {name: '', number: 2},
        {name: '', number: 3},
        {name: '', number: 4},
        {name: '', number: 5}
      ];
    }

    if (q.type == 'Single' || q.type == 'Multiple') {
      return q.options.map(o=>{return {name: o.option, }});
    }
    return [];
  }

  fileSelect($event) {
    const files: FileList = $event.srcElement.files;
    Array.from(files).forEach(file => this.addFile(file));
  }

  addFile(f: File) {
    this._files.push({id: null, file: f, mode: "add", thumbnail: ''});

    let i = this._files.length-1;

    let reader = new FileReader();
    reader.onload = (e: any) => {
      this._files[i].thumbnail = e.target.result;
    };
    reader.readAsDataURL(f);
  }

  get files() {
    return this._files.filter(f=>f.mode == 'keep' || f.mode =='add');
  }

  f(name) {
    return this.form.get(name);
  }

  e(name) {
    let e = this.f(name).errors;
    if(e.required) return "Необходимо указать";
    if(e.server) return e.server;
  }

  deleteFile(file: Attach) {
    file.mode = 'del';
  }
}

