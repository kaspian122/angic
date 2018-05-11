/**
 * События ОСС
 */
import {MeetingEdit} from './meeting';
import {Holder} from '../holder/holder';
import {User} from '../user/user';
import {SimpleObject} from '../simple-object';

export interface MeetingEvent {
  /**
   * ID
   */
  id: string;

  /**
   * Респондент
   */
  holder: Holder;

  /**
   * Пользователь портала
   */
  portalUser: User;

  /**
   * Тип события
   */
  type: string;

}
