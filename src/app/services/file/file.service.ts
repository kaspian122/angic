import {Injectable} from '@angular/core';
import {AppConfig} from '../../app.config';
import {AuthService} from '../auth/auth.service';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Attach} from '../../models/attach';

@Injectable()
export class FileService {

  constructor(
    private http: HttpClient,
    private config: AppConfig,
    private authService: AuthService
  ) { }

  public attachFiles(id: string, files: Attach[], type: 'Questionary'|'MeetingQuestion'): Observable<any> {
    if (!files.length) {
      return Observable.of({});
    }

    let formData = new FormData();

    files.forEach(file => {
      formData.append('files[]', file.file, file.file['name'])
    });

    return this.http.post(
      this.config.getEndpoint('file/upload'),
      formData,
      {
        params: new HttpParams().set('entityId', id).set('folderType', type),
        headers: this.authService.headers()
      }
    );
  }

  public deleteFile(fileId: string, type: 'Questionary'|'MeetingQuestion'): Observable<any> {
    return this.http.delete(
      this.config.getEndpoint('file/delete'),
      {
        params: new HttpParams().set('fileId', fileId).set('folderType', type),
        headers: this.authService.headers()
      }
    );
  }

  public getFile(id: string, type: string): Observable<HttpResponse<Blob>> {
    return this.http.get(this.config.getEndpoint('file/download'), {
      params: new HttpParams().set('fileId', id).set('folderType', type),
      headers: this.authService.headers(),
      observe: 'response',
      responseType: 'blob'
    })
  }
}
