/**
 * Вопрос в бюллетени ОСС
 */
import {SimpleObject} from '../../simple-object';

export interface MeetingQuestionInfo {

  /**
   * ID
   */
  id: string;

  /**
   * Текст вопроса
   */
  name: string;

  /**
   * Описание вопроса
   */
  description: string;

  /**
   * Порядковый номер
   */
  orderNumber: string;

  /**
   * Кворум для принятия решения по вопросу
   */
  quorum: SimpleObject;
}
