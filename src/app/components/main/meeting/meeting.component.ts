import { Component, OnInit } from '@angular/core';
import {QuestionaryRights} from '../../../models/questionary/questionary-rights';
import {MeetingRights} from '../../../models/meeting/meeting-rights';
import {QuestionaryService} from '../../../services/questionary/questionary.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingService} from '../../../services/meeting/meeting.service';
import {Observable} from 'rxjs/Observable';
import {MeetingInfo} from '../../../models/meeting/meeting-info';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorHandler} from '../../../services/error-handler';
import {QuestionaryResultFreeAnswersComponent} from '../questionary/questionary-result/questionary-result-free-answers/questionary-result-free-answers.component';
import {MatDialog, MatDialogConfig, MatSnackBar} from '@angular/material';
import {MeetingCorrectDialogComponent} from './meeting-correct-dialog/meeting-correct-dialog.component';

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
  meetingInfo?: MeetingInfo = null;
  meetingId: string;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
    this.meetingService.goToProcess(this.meetingId).subscribe(data => {
      this.router.navigate([`/meeting-list`]);
    });
  }

  goToCorrect(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    let dialogRef = this.dialog.open(MeetingCorrectDialogComponent, {
      height: '250px',
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.meetingService.goToCorrect(this.meetingId, result).subscribe(data => {
          this.router.navigate([`/meeting-list`]);
        });
      }
    });
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

  firstNotify(): void {
    this.meetingService.firstNotify(this.meetingId).subscribe(data => {
      this.openSnackBar('Уведомление отправлено', '');
    });
  }

  secondNotify(): void {
    this.meetingService.secondNotify(this.meetingId).subscribe(data => {
      window.location.reload();
    });
  }

  thirdNotify(): void {
    this.meetingService.thirdNotify(this.meetingId).subscribe(data => {
      this.openSnackBar('Уведомление отправлено', '');
    });
  }

  fourNotify(): void {
    this.meetingService.fourNotify(this.meetingId).subscribe(data => {
      window.location.reload();
    });
  }

  archiveMeeting(): void {
    this.meetingService.archiveMeeting(this.meetingId).subscribe(data => {
      window.location.reload();
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
