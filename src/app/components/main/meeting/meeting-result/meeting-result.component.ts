import {Component, Input, OnInit} from '@angular/core';
import {MeetingInfo} from '../../../../models/meeting/meeting-info';

@Component({
  selector: 'app-meeting-result',
  templateUrl: './meeting-result.component.html',
  styleUrls: ['./meeting-result.component.css']
})
export class MeetingResultComponent implements OnInit {

  @Input() meeting: MeetingInfo;

  constructor() { }

  ngOnInit() {
  }

}
