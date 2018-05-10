/**
 * ОСС (Общее собрание собственников)
 */
import {Mkd} from '../mkd/mkd';
import {User} from '../user/user';
import {SimpleObject} from '../simple-object';
import {Holder} from '../holder/holder';
import {MeetingQuestion} from './meeting-question';
import {MeetingEvent} from './meeting-event';

export interface Meeting {
  /**
   * ID
   */
  id: string;

  /**
   * МКД
   */
  mkd: Mkd;

  /**
   * Инициатор
   */
  initiator: User;

  /**
   * Номер
   */
  number?: number;

  /**
   * Стадия
   */
  state: SimpleObject;

  /**
   * Вид
   */
  kind: SimpleObject;

  /**
   * Кворум
   */
  quorum: SimpleObject;

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
   * Вопросы
   */
  questions: MeetingQuestion[];

  /**
   * События
   */
  events: MeetingEvent[];

  /**
   * Собственники-инициаторы
   */
  holderInitiators: Holder[];

}
