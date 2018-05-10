export interface QuestionEdit {

  /**
   * ID
   */
  id?: string,

  /**
   * Название
   */
  name: string,

  /**
   * Тип
   */
  type: "FreeForm"|"Single"|"Multiple"|"Score",

  /**
   * Обязательный
   */
  required: boolean,

  /**
   * Считать кворум
   */
  countQuorum: boolean,

  /**
   * Опции вопроса
   */
  options: string[]

}