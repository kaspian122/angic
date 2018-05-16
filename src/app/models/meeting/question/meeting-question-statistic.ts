/**
 * Статистика по ответу
 */
export interface MeetingQuestionStatistic {

  /**
   * Ответ
   */
  answer: string;

  /**
   * Кол-во ответов, шт
   */
  responseCount: number;

  /**
   *  Сумма по ответам, м2
   */
  responseAmount: number;

  /**
   * Процент по ответам
   */
  responsePercent: number;
}
