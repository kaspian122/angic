/**
 * Информация об ответе на вопрос ОСС
 */
export interface MeetingResponse {

  /**
   * ID вопроса
   */
  questionId: string;

  /**
   * Ответ
   */
  answer: string;
}
