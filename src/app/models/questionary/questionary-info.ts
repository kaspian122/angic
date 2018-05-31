import {QuestionInfo} from './question/question-info';

/**
 * Информация по анкете
 */
export interface QuestionaryInfo {

  /**
   * ID анкеты
   */
  id: string,

  /**
   * Название
   */
  name: string,

  /**
   * Стадия
   */
  state: string,

  /**
   * Дата анкеты
   */
  date: string,

  /**
   * Отправлять письма собственникам при публикации анкеты
   */
  sendMail: boolean,

  /**
   * Список вопросов
   */
  questions: QuestionInfo[],

  /**
   * todo потом добавить
   */
  files: any[]

}
