import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {AppConfig} from '../../app.config';
import {Observable} from 'rxjs/Observable';
import {MeetingRights} from '../../models/meeting/meeting-rights';
import {MeetingActivity} from '../../models/meeting/meeting-activity';
import {MeetingInfo} from '../../models/meeting/meeting-info';
import {Holder} from '../../models/holder/holder';

@Injectable()
export class MeetingService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public getMeetingInfo(meetingId: string): Observable<MeetingInfo> {
    return this.http.get<MeetingInfo>(this.config.getEndpoint(`meeting/${meetingId}/info`), {headers: this.authService.headers()});
  }

  public getMeetingActivity(meetingId: string): Observable<MeetingActivity> {
    return this.http.get<MeetingActivity>(this.config.getEndpoint(`meeting/${meetingId}/activity`), {headers: this.authService.headers()});
  }

  public getMeetingRights(meetingId: string): Observable<MeetingRights> {
    return this.http.get<MeetingRights>(this.config.getEndpoint(`meeting/${meetingId}/rights`), {headers: this.authService.headers()});
  }

  public getZipFileFromMeeting(meetingId: string) {
    return this.http.get(this.config.getEndpoint(`meeting/${meetingId}/export/startZip`), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

  public goToProcess(meeting): Observable<any> {
    return this.http.put(this.config.getEndpoint('meeting/state/ready'), meeting, {headers: this.authService.headers()});
  }

  public goToCorrect(meeting): Observable<any> {
    return this.http.put(this.config.getEndpoint('meeting/state/correct'), meeting, {headers: this.authService.headers()});
  }

}
