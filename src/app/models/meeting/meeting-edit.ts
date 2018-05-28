/**
 * ОСС (Общее собрание собственников)
 */
import {MeetingQuestionEdit} from './question/meeting-question-edit';

/**
 * Информация по ОСС для отправки на сервер
 */
export interface MeetingEdit {
  /**
   * ID
   */
  id: string;

  /**
   * МКД
   */
  mkdId: string;

  /**
   * Номер
   */
  number?: number;

  /**
   * Вид
   */
  kind: string;

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
  questions: MeetingQuestionEdit[];

  /**
   * Собственники-инициаторы
   */
  holderInitiatorIds: string[];
}
