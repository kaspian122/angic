import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import {Mkd} from "../../models/mkd";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";
import {MkdOwnersInfo, Auth} from "../auth/auth";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {MkdCreate} from "../../models/mkd-create";
import {User} from "../../models/user";
import {MkdHoldersList} from "../../models/mkd-holders-list";
import {MkdApartmentsList} from "../../models/mkd-apartments-list";
import {MkdNewsInfo} from "../../models/mkd-news-info";
import {SavePass} from "../../models/save-pass";
import {QuestionaryActivity} from '../../models/questionary/questionary-activity';
import {QuestionaryInfo} from '../../models/questionary/questionary-info';
import {QuestionarySummary} from "../../models/questionary/questionary-summary";

@Injectable()
export class DataService {
  public currentMkd: ReplaySubject<MkdOwnersInfo> = new ReplaySubject<MkdOwnersInfo>();
  public auth?: Auth = null;

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public getMkdList(): Promise<Mkd[]>{
    let response: Observable<Mkd[]> = this.http.request<Mkd[]>("GET", this.config.getEndpoint("mkd/"));
    return response.toPromise<Mkd[]>();
  }

  public getMkdEnums(): Observable<any> {
    return this.http.get(this.config.getEndpoint('mkd/enums'), {headers: this.authService.headers()});
  }


  createMkd(mkdCreate: MkdCreate): Observable<any> {
    return this.http.post(this.config.getEndpoint('mkd/'), mkdCreate, {headers: this.authService.headers()});
  }

  public setCurrentMkd(mkdId: string): void{
    const headers = this.authService.headers();

    this.http.post(this.config.getEndpoint("user/settings/mkd/default"), mkdId, {headers: headers}).subscribe(
      ()=> {
        this.authService.getAuth(true).then(
          auth => {
            this.auth = auth;
            let m = this.auth.mkdOwners.find(e=>e.mkdId==mkdId);
            this.currentMkd.next(m);
          }
        );
      }
    );
  }

  getUserByLogin(name: string): Observable<User> {
    return this.http.get<User>(this.config.getEndpoint("user/"+name));
  }

  public getHoldersList(mkdId: string): Observable<MkdHoldersList>{
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders"), {headers: this.authService.headers()});
  }

  public deleteHolders(holderIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("holder/"), {body: holderIds, headers: this.authService.headers()});
  }

  public getExcelFileWithHolders(mkdId: string){
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders/export"), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

  public getApartmentsList(mkdId: string):Observable<MkdApartmentsList>{
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/apartments"), {headers: this.authService.headers()});
  }

  public deleteApartments(apartmentIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("apartment"), {body: apartmentIds, headers: this.authService.headers()});
  }

  public getUserMkdInfo(mkdId: string): Observable<MkdNewsInfo> {
    return this.http.get<MkdNewsInfo>(this.config.getEndpoint(`user/info/mkd/${mkdId}`), {headers: this.authService.headers()});
  }

  public getQuestionaryInfo(questionaryId: string): Observable<QuestionaryInfo> {
    return this.http.get<QuestionaryInfo>(this.config.getEndpoint(`questionary/${questionaryId}`), {headers: this.authService.headers()});
  }

  public getQuestionaryActivity(questionaryId: string): Observable<QuestionaryActivity> {
    return this.http.get<QuestionaryActivity>(this.config.getEndpoint(`questionary/${questionaryId}/activity`), {headers: this.authService.headers()});
  }

  public registration(savePass: SavePass) {
    return this.http.put(this.config.getEndpoint(`user/registration`), savePass, {headers: this.authService.headers()});
  }

  public getQuestionariesList(mkdId: string): Observable<QuestionarySummary[]> {
    return this.http.get<QuestionarySummary[]>(this.config.getEndpoint(`mkd/${mkdId}/questionaries`), {headers: this.authService.headers()});
  }

  public deleteQuestionaries(questionaryIds: string[]): any {
    return this.http.request("DELETE", this.config.getEndpoint("questionary"), {body: questionaryIds, headers: this.authService.headers()});
  }

}
