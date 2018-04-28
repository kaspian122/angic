/**
 * Права на просмотр вкладок анкеты
 */
export interface QuestionaryRights {
  /**
   * ID анкеты
   */
  id: string,
  /**
   * Название анкеты
   */
  name: string,
  /**
   * Показывать вкладку 'Анкета'
   */
  showVote: boolean,
  /**
   * Можно редактировать вкладку 'Анкета'
   */
  editVote: boolean,
  /**
   * Показывать вкладку 'Результаты'
   */
  showResult: boolean,
  /**
   * Показывать вкладку 'Активность'
   */
  showActivity: boolean

}
