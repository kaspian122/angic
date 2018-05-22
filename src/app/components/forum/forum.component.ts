import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  public host: string;

  constructor() {
    this.host = 'http://localhost';
  }


  ngOnInit() {

  }

}
