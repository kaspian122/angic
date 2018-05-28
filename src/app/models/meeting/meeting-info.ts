/**
 * Общая информация по ОСС
 */
import {SimpleObject} from '../simple-object';
import {MeetingQuestionInfo} from './question/meeting-question-info';

export interface MeetingInfo {
  /**
   * ID
   */
  id: string;

  /**
   * ФИО инициатора-пользователя
   */
  initiator: string;

  /**
   * Название анкеты
   */
  name: string;

  /**
   * Стадия
   */
  state: SimpleObject;

  /**
   * Вид
   */
  kind: SimpleObject;

  /**
   * Дата начала
   */
  beginDate: string;

  /**
   * Дата окончания
   */
  endDate: string;

  /**
   * Номер
   */
  number: number;

  /**
   * Собственники-инициаторы
   */
  holderInitiators: SimpleObject[];

  /**
   * Вопросы
   */
  questions: MeetingQuestionInfo[];

}
