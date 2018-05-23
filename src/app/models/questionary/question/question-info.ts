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
   * Опции вопроса
   */
  options: OptionInfo[]

}
