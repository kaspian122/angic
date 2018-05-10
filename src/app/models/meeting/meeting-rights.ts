
/**
 * Права на просмотр вкладок ОСС
 */
export interface MeetingRights {
  /**
   * ID ОСС
   */
  id: string,
  /**
   * Название ОСС
   */
  name: string,
  /**
   * Показывать вкладку 'Не участвуют в ОСС'
   */
  showNotParticipationMeeting: boolean,
  /**
   * Можно редактировать вкладку 'Не участвуют в ОСС'
   */
  editNotParticipationMeeting: boolean,
  /**
   * Показывать вкладку 'Собрание'
   */
  showVote: boolean,
  /**
   * Можно редактировать вкладку 'Собрание'
   */
  editVote: boolean,
  /**
   * Показывать вкладку 'Результаты'
   */
  showResult: boolean,
  /**
   * Показывать вкладку 'Активность'
   */
  showActivity: boolean,

  /**
   * Показывать кнопку 'Отпраивть на доработку'
   */
  showCorrectBtn: boolean,

  /**
   * Показывать кнопку 'Запустить процесс'
   */
  showReadyBtn: boolean

  /**
   * Показывать кнопку 'Выгрузить ZIP' с документацией о начале ОСС
   */
  showStartZipBtn: boolean
}
