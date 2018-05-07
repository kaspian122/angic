/**
 * Информация по сортировке, пагинации, фильтрации таблицы
 */
export interface PaginationInfo {
  /**
   * Тип сортировки
   */
  sortType?: string,
  /**
   * Названия поля для сортировки
   */
  sortField?: string,
  /**
   * Фильтер
   */
  filter?: string,
  /**
   * С какой строки
   */
  rowFrom?: number,
  /**
   * По какую строку
   */
  rowTo?: number,
}
