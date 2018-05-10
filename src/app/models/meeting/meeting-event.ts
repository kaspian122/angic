/**
 * События ОСС
 */
import {Meeting} from './meeting';
import {Holder} from '../holder/holder';
import {User} from '../user/user';
import {SimpleObject} from '../simple-object';

export interface MeetingEvent {
  /**
   * ID
   */
  id: string;

  /**
   * ОСС
   */
  meeting: Meeting;

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
  type: SimpleObject;

}
