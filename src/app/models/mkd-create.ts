import {Apartment} from "./apartment";
import {Holder} from "./holder";
import {Mkd} from "./mkd";
import {User} from "./user";

export interface MkdCreate {
  apartment: Apartment;
  holder: Holder;
  mkd: Mkd;
  user: User;
}