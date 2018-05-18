import {Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {QuestionaryActivity} from '../../models/questionary/questionary-activity';
import {QuestionaryInfo} from '../../models/questionary/questionary-info';
import {Observable} from 'rxjs/Observable';
import {QuestionaryRights} from "../../models/questionary/questionary-rights";
import {QuestionarySummary} from "../../models/questionary/questionary-summary";
import {BatchExecutionResult} from "../../models/batch-execution-result";
import {QuestionaryCreate} from "../../models/questionary/questionary-create";
import {PaginationService} from "../pagination/pagination.service";
import {PaginationInfo} from "../../models/pagination-info";
import {ReplaySubject} from "rxjs/ReplaySubject";

@Injectable()
export class QuestionaryService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService,
    private paginationService: PaginationService
  ) {
  }

  public getQuestionaryInfo(questionaryId: string): Observable<QuestionaryInfo> {
    return this.http.get<QuestionaryInfo>(this.config.getEndpoint(`questionary/${questionaryId}`), {headers: this.authService.headers()});
  }

  public getQuestionaryActivity(questionaryId: string): Observable<QuestionaryActivity> {
    return this.http.get<QuestionaryActivity>(this.config.getEndpoint(`questionary/${questionaryId}/activity`), {headers: this.authService.headers()});
  }

  public getQuestionaryRights(questionaryId: string): Observable<QuestionaryRights> {
    return this.http.get<QuestionaryRights>(this.config.getEndpoint(`questionary/${questionaryId}/rights`), {headers: this.authService.headers()});
  }


  public getQuestionariesList(mkdId: string, showArchived: boolean, paginationInfo: PaginationInfo): Observable<[QuestionarySummary[], number]> {
    let result = new ReplaySubject<[QuestionarySummary[], number]>();

    let headers = this.authService.headers();
    headers = this.paginationService.setHeaderValues(headers, paginationInfo);

    let params = new HttpParams().set('archived', showArchived ? '1' : '0');
    params = this.paginationService.setRequestParams(params, paginationInfo);

    this.http.get<QuestionarySummary[]>(
      this.config.getEndpoint(`mkd/${mkdId}/questionaries`), {params: params, headers: headers, observe: 'response'}
    ).subscribe(resp => {
      let total = this.paginationService.getTotal(resp.headers);
      let data = resp.body;
      result.next([data, total]);
    });
    return result;
  }

  public deleteQuestionaries(questionaryIds: string[]): Observable<BatchExecutionResult> {
    return this.http.request<BatchExecutionResult>(
      "DELETE", this.config.getEndpoint("questionary"), {body: questionaryIds, headers: this.authService.headers()});
  }

  public archiveQuestionaries(questionaryIds: string[]): Observable<BatchExecutionResult> {
    return this.http.put<BatchExecutionResult>(this.config.getEndpoint("questionary/archive"), questionaryIds, {headers: this.authService.headers()});
  }

  public createQuestionary(questionary: QuestionaryCreate) {
    return this.http.post(this.config.getEndpoint("questionary"), questionary, {headers: this.authService.headers()});
  }
  public editQuestionary(questionary: QuestionaryCreate) {
    return this.http.put(this.config.getEndpoint("questionary"), questionary, {headers: this.authService.headers()});
  }

  public publishQuestionary(id: string) {
    return this.http.put(this.config.getEndpoint(`questionary/${id}/publish`), null, {headers: this.authService.headers()})
  }

}
