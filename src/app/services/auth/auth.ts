/**
 * Created by LikarovskiyAV on 04.04.2018.
 */


export interface Auth {
  /**
   * Статус
   */
  status: 'AUTHENTICATED' | 'NOT_AUTHENTICATED',

  /**
   * Логин пользователя
   */
  login?: string,

  /**
   * ID пользователя
   */
  userId?: string,

  /**
   * CSRF токен
   */
  csrfToken?: string,

  /**
   * Список полномочий пользователя
   *
   * TODO use enum?
   */
  authorities?: String[]
}
