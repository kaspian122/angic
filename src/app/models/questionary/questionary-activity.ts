/**
 * Активность анкеты
 */
export interface QuestionaryActivity {

  /**
   * ID анкеты
   */
  id: string,

  /**
   * Название
   */
  name: string,

  /**
   * Смотрели анкету, но не участвовали (кол-во)
   */
  view: number,

  /**
   * Участвовали в анкете (кол-во)
   */
  takePart: number,

  /**
   * Не смотрели анкету (кол-во)
   */
  none: number
}
