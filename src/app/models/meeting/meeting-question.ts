/**
 * Вопрос в бюллетени ОСС
 */
import {Meeting} from './meeting';
import {SimpleObject} from '../simple-object';
import {MeetingQuestionStatistic} from './meeting-question-statistic';

export interface MeetingQuestion {
  /**
   * ID
   */
  id: string;

  /**
   * ОСС
   */
  meeting: Meeting;

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

  /**
   * Статистика
   */
  questionResponses: MeetingQuestionStatistic[];

  /**
   * Файлы
   */
  //questionFiles: MeetingQuestionFile[]; todo потом
}
