/**
 * Вопрос в бюллетени ОСС
 */
export interface MeetingQuestionEdit {
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
   * Кворум для принятия решения по вопросу
   */
  quorum: string;

  /**
   * Порядковый номер
   */
  orderNumber: string;
}
