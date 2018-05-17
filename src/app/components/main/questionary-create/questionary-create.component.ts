import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {MkdService} from "../../../services/mkd/mkd.service";
import {MkdOwnersInfo} from "../../../services/auth/auth";
import {QuestionaryCreate} from "../../../models/questionary/questionary-create";
import {QuestionEdit} from "../../../models/questionary/question/question-edit";
import {QuestionaryService} from "../../../services/questionary/questionary.service";
import {QuestionaryInfo} from "../../../models/questionary/questionary-info";
import {ActivatedRoute, Router} from "@angular/router";
import {Attach} from "../../../models/attach";
import {FileService} from '../../../services/file/file.service';
import {QuestionInfo} from "../../../models/questionary/question/question-info";
import {OptionInfo} from "../../../models/questionary/question/option/option-info";
import {forkJoin} from "rxjs/observable/forkJoin";
import {HttpResponse} from "@angular/common/http";
import {Observable} from 'rxjs/Observable';

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
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.route.paramMap.switchMap(p => Observable.of(p)).subscribe(
      params => {
        this.mkdService.currentMkd.subscribe(
          mkd => {
            this.currentMkd = mkd;
            const id = params.get('id');
            if (id) {
              this.initEditForm(id);
            } else {
              this.initForm();
            }
          }
        );
      }
    );
  }

  initForm(info?: QuestionaryInfo) {

    let formConfig = {
      mkdId: [info ? null : this.currentMkd.mkdId],
      name: [info ? info.name : '', Validators.required],
      questions: this.fb.array([]),
      sendMail: [false, Validators.required]
    };

    if (info && info.id) {
      formConfig['id'] = info.id;
    }

    this.form = this.fb.group(formConfig);

    if (info && info.questions && info.questions.length) {
      info.questions.forEach(q => {
        this.addQuestion(q);
      });
    }

  }

  initEditForm(id: string) {
    this.questionaryService.getQuestionaryInfo(id).subscribe(
      info => {
        // let requests = info.files.map(f => this.fileService.getFile(f.id, 'Questionary'));
        // forkJoin(requests).subscribe(
        //   results => {
        //     results.forEach((response: HttpResponse<Blob>, i: number) => {
        //       let file = new File([response.body], info.files[i].name, {type: response.headers.get('mime-type')});
        //       this.addFile(file, 'keep', info.files[i].id);
        //     });
        //   },
        //   null,
        //   () => {
        //   }
        // );

        info.files.forEach(f => {
          this.addFile(null, 'keep', f.id, f.name);
        });

        this.initForm(info);
        this.form.updateValueAndValidity();

      }
    )
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  options(i: number) {
    return this.questions.at(i).get('options') as FormArray;
  }

  addQuestion(q: QuestionInfo) {
    this.questions.push(this.fb.group({
      countQuorum: [q ? q.countQuorum : false, Validators.required],
      required:    [q ? q.required : false, Validators.required],
      name:        [q ? q.name : '', Validators.required],
      type:        [q ? q.type : 'Single', Validators.required],
      options:     this.fb.array([])
    }));

    const i = this.questions.length - 1;

    if (q && q.options && q.options.length) {
      q.options.forEach(o => this.addOption(i, o))
    }
  }

  deleteQuestion(i: number) {
    this.questions.removeAt(i);
  }

  addOption(questionNum: number, option?: OptionInfo) {
    let options = this.questions.at(questionNum).get('options') as FormArray;
    options.push(this.fb.group({
      option: [option ? option.name : '', this.optionRequired]
    }));
  }

  deleteOption(q: number, o: number) {
    this.options(q).removeAt(o);
  }

  onSubmit() {
    const saveForm: QuestionaryCreate = this.prepareSaveForm();

    let request = saveForm.id
      ? this.questionaryService.editQuestionary(saveForm)
      : this.questionaryService.createQuestionary(saveForm);

    request.subscribe(
      (info: QuestionaryInfo) => {

        let filesToDelete = this._files.filter(f=>f.mode=='del');
        let delRequests = filesToDelete.map(f => this.fileService.deleteFile(f.id, 'Questionary'));
        forkJoin(delRequests).subscribe(
          null,
          null,
          () => {
            let filesToAttach = this.files.filter(f=>f.mode=='add');
            this.fileService.attachFiles(info.id, filesToAttach, 'Questionary').subscribe(
              ()=> {
                this.router.navigate(['/questionary-list']);
              }
            )
          }
        );
      },
      (e) => {
        console.log(e);
      }
    );
  }

  prepareSaveForm(): QuestionaryCreate {
    const form = this.form.value;
    let value = {
      name: form.name,
      sendMail: form.sendMail,
      questions: form.questions.map((q,i)=>this.prepareQuestion(q, i)) as QuestionEdit[]
    };

    if (form.id) {
      value['id'] = form.id;
    } else {
      value['mkdId'] = form.mkdId;
    }

    return value as QuestionaryCreate;
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

  addFile(f: File, mode: 'add'|'del'|'keep' = 'add', id: string = null, name: string = null) {
    this._files.push({
      id: id,
      file: f,
      name: name || f.name,
      mode: mode,
      thumbnail: ''
    });

    // let i = this._files.length-1;
    //
    // let reader = new FileReader();
    // reader.onload = (e: any) => {
    //   this._files[i].thumbnail = e.target.result;
    // };
    // reader.readAsDataURL(f);
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

  validateOptions(i: number) {
    let options = this.form.get('questions.'+i+'.options') as FormArray;
    options.controls.forEach(g => {
      let o = g.get('option');
      o.markAsTouched();
      o.updateValueAndValidity();
    });
  }

  optionRequired(control: AbstractControl): ValidationErrors {
    // debugger;
    let type = null;
    try {type = control.parent.parent.parent.get('type').value;} catch (e) {return null;}
    if ((type == 'Single' || type == 'Multiple') && !control.value) {
      return {required: true};
    }
    return null;
  }

}

