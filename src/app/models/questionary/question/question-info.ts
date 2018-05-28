import {OptionInfo} from './option/option-info';

/**
 * Информация о вопросе анкеты
 */
export interface QuestionInfo {

  /**
   * ID
   */
  id: string,

  /**
   * Название
   */
  name: string,

  /**
   * Тип
   */
  type: string,

  /**
   * Обязательный
   */
  required: boolean,

  /**
   * Считать кворум
   */
  countQuorum: boolean,

  /**
   * Список свободных ответов
   */
  freeAnswers: string[],

  /**
   * Свободный ответ пользователя
   */
  freeAnswersByUser: string[],

  /**
   * Опции вопроса
   */
  options: OptionInfo[]

  /**
   * Опции вопроса выбранные пользователем
   */
  optionsByUser: OptionInfo[]

}
