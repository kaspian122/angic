/**
 * Статистика на вопрос ОСС
 */
import {MeetingQuestion} from './meeting-question';
import {SimpleObject} from '../simple-object';

export interface MeetingQuestionStatistic {
  /**
   * ID
   */
  id: string;

  /**
   * Вопрос ОСС
   */
  meetingQuestion: MeetingQuestion;

  /**
   * Ответ
   */
  answer: SimpleObject;

  /**
   * Количество ответов, шт
   */
  responseCount: number;

  /**
   * Сумма по ответам, м2
   */
  responseAmount: number;

}
