import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import {Mkd} from "../../models/mkd";
import {Observable} from "rxjs/Observable";
import {AuthService} from "../auth/auth.service";
import {MkdOwnersInfo, Auth} from "../auth/auth";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {MkdCreate} from "../../models/mkd-create";
import {MkdHoldersList} from "../../models/mkd-holders-list";
import {MkdApartmentsList} from "../../models/mkd-apartments-list";

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

  public getHoldersList(mkdId: string): Observable<MkdHoldersList>{
    return this.http.get(this.config.getEndpoint("/mkd/" + mkdId + "/holders"), {headers: this.authService.headers()});
  }

  public deleteHolders(holderIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("/holder/"), {body: holderIds, headers: this.authService.headers()});
  }

  public getExcelFileWithHolders(mkdId: string){
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders/export"), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

  public getApartmentsList(mkdId: string):Observable<MkdApartmentsList>{
    return this.http.get(this.config.getEndpoint("/mkd/" + mkdId + "/apartments"), {headers: this.authService.headers()});
  }

  public deleteApartments(apartmentIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("/apartment"), {body: apartmentIds, headers: this.authService.headers()});
  }
}
