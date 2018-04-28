import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {QuestionaryActivity} from '../../models/questionary/questionary-activity';
import {QuestionaryInfo} from '../../models/questionary/questionary-info';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class QuestionaryService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public getQuestionaryInfo(questionaryId: string): Observable<QuestionaryInfo> {
    return this.http.get<QuestionaryInfo>(this.config.getEndpoint(`questionary/${questionaryId}`), {headers: this.authService.headers()});
  }

  public getQuestionaryActivity(questionaryId: string): Observable<QuestionaryActivity> {
    return this.http.get<QuestionaryActivity>(this.config.getEndpoint(`questionary/${questionaryId}/activity`), {headers: this.authService.headers()});
  }

}
