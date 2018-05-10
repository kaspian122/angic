/**
 * Активность собрания
 */
export interface MeetingActivity {
  /**
   * ID
   */
  id: string,

  /**
   * Название
   */
  name: string,

  /**
   * Смотрели собрание, но не участвовали (кол-во)
   */
  view: number,

  /**
   * Участвовали в собрании (кол-во)
   */
  takePart: number,

  /**
   * Не смотрели собрание (кол-во)
   */
  none: number
}
