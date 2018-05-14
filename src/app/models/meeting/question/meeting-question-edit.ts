/**
 * Вопрос в бюллетени ОСС
 */
export interface MeetingQuestionEdit {
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
  quorum: string;
}
