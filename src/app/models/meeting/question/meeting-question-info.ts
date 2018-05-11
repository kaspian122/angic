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
   * Номер п/п
   */
  orderNumber: number;

  /**
   * Текст вопроса
   */
  name: string;

  /**
   * Описание вопроса
   */
  description: string;

  /**
   * Кворум для принятия решения по вопросу
   */
  quorum: SimpleObject;
}
