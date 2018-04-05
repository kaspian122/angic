import {environment} from '../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class AppConfig {
  public readonly apiUrl = environment.apiUrl;

  /**
   * Название заголовка HTTP запроса для передачи CSRF токена в запросе
   * @type {string}
   */
  public readonly X_CSRF_TOKEN_HEADER_NAME = 'X-CSRF-TOKEN';

  /**
   * Название параметра HTTP запроса для передачи CSRF токена в запросе
   *
   * ВАЖНО! параметр используем только в крайнем случае
   *
   * @type {string}
   */
  public readonly X_CSRF_TOKEN_PARAM_NAME = '_csrf';


  public getEndpoint(name: string) {
    return this.apiUrl + '/' + name;
  }
}
