import {Apartment} from "./apartment";

/**
 * Расширенная модель для строки таблицы
 */
export interface ApartmentRow extends Apartment {

  /**
   * Заполнена информация о собственниках
   */
  complete: boolean;

}
