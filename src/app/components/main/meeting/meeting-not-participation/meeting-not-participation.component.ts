import {Component, Input, OnInit} from '@angular/core';
import {SimpleObject} from "../../../../models/simple-object";
import {MeetingService} from "../../../../services/meeting/meeting.service";
import {MkdService} from "../../../../services/mkd/mkd.service";

/**
 * Список собственников, не учавствующих в ОСС
 */
@Component({
  selector: 'app-meeting-not-participation',
  templateUrl: './meeting-not-participation.component.html',
  styleUrls: ['./meeting-not-participation.component.css']
})
export class MeetingNotParticipationComponent implements OnInit {

  @Input() meetingId: string;
  users: SimpleObject[];

  constructor(
    private meetingService: MeetingService,
    private mkdService: MkdService
  ) { }

  ngOnInit() {
    this.mkdService.currentMkd.subscribe(mkd => {
        this.meetingService.getNotParticipatingHoldersList(mkd.mkdId).subscribe(
          data => this.users = data
        );
      }
    );
  }

}
