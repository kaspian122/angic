/**
 * Информация о ответе анкеты
 */
export interface OptionInfo {

  /**
   * ID
   */
  id: string,

  /**
   * Название
   */
  name: string,

  /**
   * Количество ответов, шт
   */
  responseCount: number,

  /**
   * Процент по ответам
   */
  responsePercent: number

}
