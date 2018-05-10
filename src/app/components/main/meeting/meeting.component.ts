import { Component, OnInit } from '@angular/core';
import {QuestionaryRights} from '../../../models/questionary/questionary-rights';
import {MeetingRights} from '../../../models/meeting/meeting-rights';
import {QuestionaryService} from '../../../services/questionary/questionary.service';
import {ActivatedRoute} from '@angular/router';
import {MeetingService} from '../../../services/meeting/meeting.service';
import {Observable} from 'rxjs/Observable';
import {MeetingInfo} from '../../../models/meeting/meeting-info';

/**
 * Форма просмотра и проведения собрания
 */
@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {

  meetingRights: MeetingRights = null;
  meetingInfo: MeetingInfo = null;
  meetingId: string;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) { }

  ngOnInit() {
    this.initMeeting();
  }

  initMeeting(): void {
    this.route.paramMap.switchMap(p => Observable.of(p)).subscribe(params => {
        this.meetingId = params.get('id');
        this.meetingService.getMeetingInfo(this.meetingId).subscribe(meetingInfo => {
            this.meetingInfo = meetingInfo;
          }
        );
        this.meetingService.getMeetingRights(this.meetingId).subscribe(meetingRights => {
            this.meetingRights = meetingRights;
          }
        );
      }
    );
  }

  goToProcess(): void {
    this.meetingService.goToProcess(this.meetingInfo); //todo другая dto
  }

  goToCorrect(): void {
    this.meetingService.goToCorrect(this.meetingInfo); //todo другая dto
  }

  loadToZip(): void {
    this.meetingService.getZipFileFromMeeting(this.meetingId).subscribe(data => {
        let contentType = 'application/zip';

        let blob = new Blob([data], {type: contentType});
        let url = window.URL.createObjectURL(blob);
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

        a.href = url;
        a.download = 'Документы.zip';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    );
  }

}
