/**
 * Сводная информация по ОСС для таблицы
 */
export interface SimpleMeetingInfo {
  /**
   * ID
   */
  id: string;

  /**
   * Название ОСС
   */
  name: string;

  /**
   * Номер
   */
  number?: number;

  /**
   * Стадия
   */
  state: string;

  /**
   * Вид
   */
  kind: string;

  /**
   * Кворум
   */
  quorum: string;

  /**
   * Дата начала
   */
  beginDate: string;

  /**
   * Дата окончания
   */
  endDate: string;

  /**
   * Инициатор
   */
  initiator: string,

  /**
   * Коммент админа
   */
  adminComment?: string;

  /**
   * Дата создания
   */
  loadDate: string;

}
