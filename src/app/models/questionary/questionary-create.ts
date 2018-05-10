import {QuestionEdit} from "./question/question-edit";

export interface QuestionaryCreate {

  /**
   * ID анкеты
   */
  id?: string,

  /**
   * MKD Id
   */
  mkdId: string,

  /**
   * Название
   */
  name: string,

  /**
   * Список вопросов
   */
  questions: QuestionEdit[],

  /**
   * Флаг отсылки емейла
   */
  sendMail: boolean

}