import {Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {QuestionaryActivity} from '../../models/questionary/questionary-activity';
import {QuestionaryInfo} from '../../models/questionary/questionary-info';
import {Observable} from 'rxjs/Observable';
import {QuestionaryRights} from "../../models/questionary/questionary-rights";
import {QuestionarySummary} from "../../models/questionary/questionary-summary";
import {BatchExecutionResult} from "../../models/batch-execution-result";

@Injectable()
export class QuestionaryService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
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


  public getQuestionariesList(mkdId: string, showArchived?: boolean): Observable<QuestionarySummary[]> {
    return this.http.get<QuestionarySummary[]>(
      this.config.getEndpoint(`mkd/${mkdId}/questionaries`), {params: {archived: showArchived}, headers: this.authService.headers()});
  }

  public deleteQuestionaries(questionaryIds: string[]): Observable<BatchExecutionResult> {
    return this.http.request<BatchExecutionResult>(
      "DELETE", this.config.getEndpoint("questionary"), {body: questionaryIds, headers: this.authService.headers()});
  }

  public archiveQuestionaries(questionaryIds: string[]): Observable<BatchExecutionResult> {
    return this.http.put<BatchExecutionResult>(this.config.getEndpoint("questionary/archive"), questionaryIds, {headers: this.authService.headers()});
  }

}
