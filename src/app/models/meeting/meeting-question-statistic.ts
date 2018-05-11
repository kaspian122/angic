/**
 * Статистика на вопрос ОСС
 */
export interface MeetingQuestionStatistic {
  /**
   * ID
   */
  id: string;

  /**
   * Вопрос ОСС
   */
  meetingQuestion: string;

  /**
   * Ответ
   */
  answer: string;

  /**
   * Количество ответов, шт
   */
  responseCount: number;

  /**
   * Сумма по ответам, м2
   */
  responseAmount: number;

}
