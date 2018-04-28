import {SimpleObject} from '../simple-object';

export interface Apartment {
  id: string;
  area: number;
  mkdId: string;
  number: string;
  floor: number;
  porch: number;
  ownership: SimpleObject;
  totalShare: number;
  utilization: SimpleObject;
}
