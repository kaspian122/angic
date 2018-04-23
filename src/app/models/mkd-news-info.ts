import {Apartment} from "./apartment";

export interface SimpleQuestionaryInfo {
  id: String,
  stateName: String,
  name: String
}

export interface MkdNewsInfo {
  address: string,
  mkdPercent: number,
  apartments: Apartment[],
  questionary?: SimpleQuestionaryInfo
}
