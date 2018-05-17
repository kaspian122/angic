/**
 * Вопрос в бюллетени ОСС
 */
import {SimpleObject} from '../../simple-object';
import {MeetingQuestionFile} from './meeting-question-file';
import {MeetingQuestionStatistic} from './meeting-question-statistic';

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

  /**
   * Список файлов
   */
  files: MeetingQuestionFile[];

  /**
   * Статистика по файлам
   */
  statistic: MeetingQuestionStatistic[]
}
