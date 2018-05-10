/**
 * Общая информация по ОСС
 */
export interface MeetingInfo {
  /**
   * ID
   */
  id: string;

  /**
   * ФИО инициатора-пользователя
   */
  initiator: string;

  /**
   * Название анкеты
   */
  name: string;

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
   * Номер
   */
  number: number;

  /**
   * Собственники-инициаторы
   */
  holderInitiators: string[];

}
