import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-questionary-result-free-answers',
  templateUrl: './questionary-result-free-answers.component.html',
  styleUrls: ['./questionary-result-free-answers.component.css']
})
export class QuestionaryResultFreeAnswersComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() { }

}
