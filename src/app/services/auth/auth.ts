export interface UserInfo {
  /**
   * ID пользователя
   */
  userId: string,
  firstName?: string,
  secondName?: string,
  lastName: string,
}

export interface MkdOwnersInfo {
  address: string,
  authorities: string[],
  byDefault: boolean,
  mkdId: string
}

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
   * Инфа по пользователю
   */
  user?: UserInfo,

  /**
   * CSRF токен
   */
  csrfToken?: string,

  /**
   * Список полномочий пользователя
   *
   * TODO use enum?
   */
  authorities?: String[],

  mkdOwners: MkdOwnersInfo[]

}
