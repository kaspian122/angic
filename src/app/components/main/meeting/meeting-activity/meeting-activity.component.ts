import {Component, Input, OnInit} from '@angular/core';
import {MeetingService} from '../../../../services/meeting/meeting.service';
import {MeetingActivity} from '../../../../models/meeting/meeting-activity';

@Component({
  selector: 'app-meeting-activity',
  templateUrl: './meeting-activity.component.html',
  styleUrls: ['./meeting-activity.component.css']
})
export class MeetingActivityComponent implements OnInit {

  activity?: MeetingActivity = null;
  @Input() meetingId: string;

  constructor(
    private meetingService: MeetingService
  ) { }

  ngOnInit() {
    this.meetingService.getMeetingActivity(this.meetingId).subscribe(
      activity => {
        this.activity = activity;
      }
    );
  }

}
