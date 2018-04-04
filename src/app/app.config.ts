import {environment} from '../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class AppConfig {
  public readonly apiUrl = environment.apiUrl;

  public getEndpoint(name: string) {
    return this.apiUrl + '/' + name;
  }
}
