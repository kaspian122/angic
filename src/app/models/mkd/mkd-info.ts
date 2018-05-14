import {Mkd} from "./mkd";
/**
 * Сводная информация по МКД
 */
export interface MkdInfo extends Mkd {
  /**
   * Информация об управлеческом составе дома (председатель и члены совета)
   */
  managementInfo?: string,
  /**
   * Площадь подключенных квартир
   */
  apartmentsArea: number,
  /**
   * Процент подключенных квартир
   */
  apartmentsPercent: number
}
