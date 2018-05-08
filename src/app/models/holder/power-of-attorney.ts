import {User} from '../user/user';

/**
 * Доверенное лицо
 */
export interface PowerOfAttorney {
  /**
   * ID собственника
   */
  holderId: string;
  /**
   * Доверенное лицо
   */
  confidant: User;
  /**
   * Номер доверенности
   */
  number: string;
  /**
   * Дата начала
   */
  beginDate: string;
  /**
   * Дата окончания
   */
  endDate: string;
}
