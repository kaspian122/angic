import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {AppConfig} from '../../app.config';
import {Observable} from 'rxjs/Observable';
import {MeetingRights} from '../../models/meeting/meeting-rights';
import {MeetingActivity} from '../../models/meeting/meeting-activity';
import {MeetingInfo} from '../../models/meeting/meeting-info';
import {SimpleMeetingInfo} from "../../models/meeting/simple-meeting-info";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {PaginationInfo} from "../../models/pagination-info";
import {PaginationService} from "../pagination/pagination.service";
import {BatchExecutionResult} from "../../models/batch-execution-result";

@Injectable()
export class MeetingService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService,
    private paginationService: PaginationService
  ) { }

  public getMeetingList(mkdId: string, showCompleted: boolean, paginationInfo: PaginationInfo): Observable<[SimpleMeetingInfo[], number]> {
    let result = new ReplaySubject<[SimpleMeetingInfo[], number]>();

    let headers = this.authService.headers();
    headers = this.paginationService.setHeaderValues(headers, paginationInfo);

    let params = new HttpParams().set('completed', showCompleted ? '1' : '0');
    params = this.paginationService.setRequestParams(params, paginationInfo);

    this.http.get<SimpleMeetingInfo[]>(
      this.config.getEndpoint(`/mkd/${mkdId}/meetings`), {params: params, headers: headers, observe: 'response'}
    ).subscribe(resp => {
      let total = this.paginationService.getTotal(resp.headers);
      let data = resp.body;
      result.next([data, total]);
    });
    return result;
  }

  public deleteMeetings(meetingIds: string[]): Observable<BatchExecutionResult> {
    return this.http.request<BatchExecutionResult>(
      "DELETE", this.config.getEndpoint("meeting"), {body: meetingIds, headers: this.authService.headers()});
  }

  public getMeetingInfo(meetingId: string): Observable<MeetingInfo> {
    return this.http.get<MeetingInfo>(this.config.getEndpoint(`meeting/${meetingId}`), {headers: this.authService.headers()});
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

  public getMeetingEnums(): Observable<any> {
    return this.http.get(this.config.getEndpoint('meeting/enums'), {headers: this.authService.headers()});
  }

}
