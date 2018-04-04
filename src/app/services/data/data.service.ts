import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {AppConfig} from "../../app.config";
import {Observable} from "rxjs/Observable";
import {App} from "../../models/app";
import {he} from "ngx-bootstrap";

@Injectable()
export class DataService {

  constructor(
    private http: HttpClient,
    private config: AppConfig
  ) { }

  getMain(sorting: string[], filter: string, query: string, days: number): Observable<any> {

    let p = new HttpParams();

    if (sorting.length) {
      p = p.set('sorting[]', JSON.stringify(sorting));
    }

    if (filter) {
      p = p.set('filter', filter);
    }

    if (query) {
      p = p.set('query', query);
    }

    if (days) {
      p = p.set('days', days.toString());
    }



    return this.http.get(this.config.getEndpoint('home/'), {params: p});
  }

  getMainCharts(sorting: string[], filter: string, query: string, days: number): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type':  'application/json'
    });
    return this.http.post(this.config.getEndpoint('chart-view/'), {days: days}, {headers: headers});
  }

  getBuilds(app: App, page: number, period: string): Observable<any> {

    let params = new HttpParams()
      .set('app_id', app.app_id)
      .set('fullversion', app.build_version+'.'+app.build_build_number.toString())
      .set('env', app.env)
      .set('version', app.build_version)
      .set('period', period);

    if (page > 1) {
      params = params.set('page', page.toString());
    }

    return this.http.get(this.config.getEndpoint('build-stream/'), {
      params: params
    });
  }

  getDeployments(app: App, page: number, period: string): Observable<any> {

    let params = new HttpParams()
      .set('app_id', app.app_id)
      .set('fullversion', app.build_version+'.'+app.build_build_number.toString())
      .set('env', app.env)
      .set('version', app.deploy_version)
      .set('period', period);

    if (page > 1) {
      params = params.set('page', page.toString());
    }

    return this.http.get(this.config.getEndpoint('deploy-stream/'), {
      params: params
    });
  }

  getMonitorData(app: App): Observable<any> {
    let time = ">2017-01-01";
    return this.http.get(this.config.getEndpoint('monitor-stream-info/'), {
      params: new HttpParams()
        .set('app_id', app.app_id)
        .set('env', app.env)
        .set('version', app.deploy_version)
        .set('period', time)
    })
  }

  getMonitorGraphs(app: App, instance: string): Observable<any> {
    let time = ">2017-01-01";
    return this.http.get(this.config.getEndpoint('monitor-stream-line-graph/'), {
      params: new HttpParams()
        .set('app_id', app.app_id)
        .set('env', app.env)
        .set('version', app.deploy_version)
        .set('period', time)
        .set('instance', instance)
    })
  }

  getGraphData(instanceId: string, level: string, period: string) {
    return this.http.get(this.config.getEndpoint('monitor-stream-load-line-graph-data/'), {
      params: new HttpParams()
        .set('level', level)
        .set('period', period)
        .set('instance_id', instanceId)
    })

  }

  getInfoData(instanceId: string, level: string, period: string) {
    return this.http.get(this.config.getEndpoint('monitor-stream-load-info-data/'), {
      params: new HttpParams()
        .set('level', level)
        .set('period', period)
        .set('instance_id', instanceId)
    })

  }

  getLogs(id: string, type: string, page: number): Observable<any> {

    let params = new HttpParams()
      .set('id', id)
      .set('type', type);

    if (page > 1) {
      params = params.set('page', page.toString());
    }

    return this.http.get(this.config.getEndpoint('log-stream/'), {
      params: params
    });
  }

  check() {
    return this.http.get(this.config.getEndpoint('check/'))
  }

}
