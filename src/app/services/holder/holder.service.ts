import { Injectable } from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Holder} from '../../models/holder/holder';
import {Apartment} from '../../models/apartment/apartment';

@Injectable()
export class HolderService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public getHoldersByApartment(apartmentId: string): Observable<Holder[]>{
    return this.http.get<Holder[]>(this.config.getEndpoint(`apartment/${apartmentId}/holders`), {headers: this.authService.headers()});
  }

  public getHolderInfo(holderId: string): Observable<Holder>{
    return this.http.get<Holder>(this.config.getEndpoint(`holder/${holderId}`), {headers: this.authService.headers()});
  }

  public createHolder(holder: Holder): Observable<any> {
    return this.http.post(this.config.getEndpoint('holder/'), holder, {headers: this.authService.headers()});
  }

  public updateHolder(holder: Holder): Observable<any> {
    return this.http.put(this.config.getEndpoint('holder/'), holder, {headers: this.authService.headers()});
  }

  public deleteHolders(holderIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("holder"), {body: holderIds, headers: this.authService.headers()});
  }

  public getExcelFileWithHolders(mkdId: string){
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/holders/export"), {headers: this.authService.headers(), responseType: 'arraybuffer'});
  }

}
