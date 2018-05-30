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
import {MeetingEdit} from '../../models/meeting/meeting-edit';
import {Attach} from '../../models/attach';
import {SimpleObject} from "../../models/simple-object";
import {MeetingResponse} from '../../models/meeting/question/meeting-response';

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

  public createMeeting(meeting: MeetingEdit): Observable<any> {
    return this.http.post(this.config.getEndpoint('meeting/'), meeting, {headers: this.authService.headers()});
  }

  public updateMeeting(meeting: MeetingEdit): Observable<any> {
    return this.http.put(this.config.getEndpoint('meeting/'), meeting, {headers: this.authService.headers()});
  }

  public deleteMeetings(meetingIds: string[]): Observable<BatchExecutionResult> {
    return this.http.request<BatchExecutionResult>(
      "DELETE", this.config.getEndpoint("meeting"), {body: meetingIds, headers: this.authService.headers()});
  }

  public saveMeetingResponse(id: string, meetingResponses: MeetingResponse[]): Observable<any> {
    return this.http.post(this.config.getEndpoint(`meeting/${id}/response`), meetingResponses, {headers: this.authService.headers()});
  }

  public saveMeetingResponseForHolder(id: string, holderId: string, meetingResponses: MeetingResponse[]): Observable<any> {
    return this.http.post(this.config.getEndpoint(`meeting/${id}/${holderId}/response`), meetingResponses, {headers: this.authService.headers()});
  }

  public getMeetingInfo(meetingId: string): Observable<MeetingInfo> {
    return this.http.get<MeetingInfo>(this.config.getEndpoint(`meeting/${meetingId}`), {headers: this.authService.headers()});
  }

  public getMeetingHolderInfo(meetingId: string, holderId: string): Observable<MeetingInfo> {
    return this.http.get<MeetingInfo>(this.config.getEndpoint(`meeting/${meetingId}/holder/${holderId}`), {headers: this.authService.headers()});
  }

  public getMeetingActivity(meetingId: string): Observable<MeetingActivity> {
    return this.http.get<MeetingActivity>(this.config.getEndpoint(`meeting/${meetingId}/activity`), {headers: this.authService.headers()});
  }

  public getMeetingRights(meetingId: string): Observable<MeetingRights> {
    return this.http.get<MeetingRights>(this.config.getEndpoint(`meeting/${meetingId}/rights`), {headers: this.authService.headers()});
  }

  public getNotParticipatingHoldersList(mkdId: string, meetingId: string): Observable<SimpleObject[]> {
    return this.http.get<SimpleObject[]>(this.config.getEndpoint(`meeting/${meetingId}/${mkdId}/holders/notparticipating`), {headers: this.authService.headers()});
  }

  public getZipFileFromMeeting(meetingId: string) {
    return this.http.get(this.config.getEndpoint(`meeting/${meetingId}/export/zip`), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

  public goToReview(meetingId): Observable<any> {
    return this.http.put(this.config.getEndpoint(`meeting/${meetingId}/state/review`), null, {headers: this.authService.headers()});
  }

  public goToProcess(meetingId): Observable<any> {
    return this.http.put(this.config.getEndpoint(`meeting/${meetingId}/state/ready`), null, {headers: this.authService.headers()});
  }

  public goToCorrect(meetingId, description): Observable<any> {
    return this.http.put(this.config.getEndpoint(`meeting/${meetingId}/state/correct`), description, {headers: this.authService.headers()});
  }

  public getMeetingEnums(): Observable<any> {
    return this.http.get(this.config.getEndpoint('meeting/enums'), {headers: this.authService.headers()});
  }

}
