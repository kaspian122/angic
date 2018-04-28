import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {MkdHoldersList} from '../../models/holder/mkd-holders-list';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class HolderService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public getHoldersList(mkdId: string): Observable<MkdHoldersList>{
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders"), {headers: this.authService.headers()});
  }

  public deleteHolders(holderIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("holder/"), {body: holderIds, headers: this.authService.headers()});
  }

  public getExcelFileWithHolders(mkdId: string){
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders/export"), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

}
