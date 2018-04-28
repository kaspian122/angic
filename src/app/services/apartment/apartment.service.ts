import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Apartment} from '../../models/apartment/apartment';
import {MkdApartmentsList} from '../../models/apartment/mkd-apartments-list';
import {Observable} from 'rxjs/Observable';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class ApartmentService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public getApartmentsList(mkdId: string):Observable<MkdApartmentsList> {
    return this.http.get(this.config.getEndpoint("mkd/" + mkdId + "/apartments"), {headers: this.authService.headers()});
  }

  public getApartmentInfo(apartmentId: string): Observable<Apartment>{
    return this.http.get<Apartment>(this.config.getEndpoint(`apartment/${apartmentId}`), {headers: this.authService.headers()});
  }

  public deleteApartments(apartmentIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("apartment"), {body: apartmentIds, headers: this.authService.headers()});
  }

  public createApartment(apartment: Apartment): Observable<any> {
    return this.http.post(this.config.getEndpoint('apartment/'), apartment, {headers: this.authService.headers()});
  }

  public updateApartment(apartmentDto: Apartment): Observable<any> {
    return this.http.put(this.config.getEndpoint('apartment/'), apartmentDto, {headers: this.authService.headers()});
  }

}
