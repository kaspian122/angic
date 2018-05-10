import {Component, Input, OnInit} from '@angular/core';
import {MeetingInfo} from '../../../../models/meeting/meeting-info';

/**
 * Общая информация по ОСС
 */
@Component({
  selector: 'app-meeting-info',
  templateUrl: './meeting-info.component.html',
  styleUrls: ['./meeting-info.component.css']
})
export class MeetingInfoComponent implements OnInit {

  @Input() info: MeetingInfo;

  constructor(
  ) { }

  ngOnInit() {
  }
}
