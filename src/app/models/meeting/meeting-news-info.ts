/**
 * Информация для новостей по ОСС
 */
import {SimpleObject} from '../simple-object';
import {MeetingQuestionInfo} from './question/meeting-question-info';

export interface MeetingNewsInfo {
  /**
   * ID
   */
  id: string;

  /**
   * ФИО инициатора-пользователя
   */
  initiator: string;

  /**
   * Телефон инициатора-пользователя
   */
  initiatorPhone: string;

  /**
   * Телефон админа
   */
  adminPhone: string;

  /**
   * Название анкеты
   */
  name: string;

  /**
   * Стадия
   */
  state: SimpleObject;

  /**
   * Дата начала
   */
  beginDate: string;

  /**
   * Дата окончания
   */
  endDate: string;

  /**
   * Коммент админа
   */
  adminComment?: string;

  /**
   * Это админ
   */
  isUserAdmin: boolean;

  /**
   * Это инициатор
   */
  isUserInitiator: boolean;

}
