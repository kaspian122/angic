import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Apartment} from '../../models/apartment/apartment';
import {MkdApartmentsList} from '../../models/apartment/mkd-apartments-list';
import {Observable} from 'rxjs/Observable';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {PaginationInfo} from "../../models/pagination-info";
import {ReplaySubject} from "rxjs/ReplaySubject";
import {PaginationService} from "../pagination/pagination.service";

@Injectable()
export class ApartmentService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService,
    private paginationService: PaginationService
  ) { }

  public getApartmentsList(mkdId: string, paginationInfo: PaginationInfo): Observable<[MkdApartmentsList, number]> {
    let result = new ReplaySubject<[MkdApartmentsList, number]>();
    let headers = this.paginationService.setPagination(this.authService.headers(), paginationInfo);

    this.http.get<MkdApartmentsList>(
      this.config.getEndpoint("mkd/" + mkdId + "/apartments"), {headers: headers, observe: 'response'}
    ).subscribe(resp => {
      let total = this.paginationService.getTotal(resp.headers);
      let data = resp.body;
      result.next([data, total]);
    });
    return result;
  }

  public getApartmentInfo(apartmentId: string): Observable<Apartment>{
    return this.http.get<Apartment>(this.config.getEndpoint(`apartment/${apartmentId}`), {headers: this.authService.headers()});
  }

  public deleteApartments(apartmentIds: string[]){
    return this.http.request("DELETE", this.config.getEndpoint("apartment"), {body: apartmentIds, headers: this.authService.headers()});
  }

  public createApartment(apartment: Apartment): Observable<any> {
    return this.http.post(this.config.getEndpoint('apartment'), apartment, {headers: this.authService.headers()});
  }

  public updateApartment(apartmentDto: Apartment): Observable<any> {
    return this.http.put(this.config.getEndpoint('apartment'), apartmentDto, {headers: this.authService.headers()});
  }

}
