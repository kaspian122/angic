import {SimpleObject} from "../simple-object";
export interface Mkd {
  id: string;
  address: string;
  administrationType: string;
  apartmentCount: number;
  area: number;
  admin: SimpleObject;
  chairman?: SimpleObject;
  floorCount: number;
  porchCount: number;
  loadDate: string;
}
