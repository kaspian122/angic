import { Component, OnInit } from '@angular/core';
import {environment} from 'environments/environment';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  public url: string;

  constructor() { }

  ngOnInit() {
    this.url = environment.forumUrl;
  }

}
