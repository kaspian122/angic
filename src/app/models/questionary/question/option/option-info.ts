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
   * Числовое значение
   */
  number: number,

  /**
   * Количество ответов, шт
   */
  responseCount: number,

  /**
   * Процент по ответам
   */
  responsePercent: number,

  /**
   * Сумма по ответам, м2
   */
  responseAmount: number

}
