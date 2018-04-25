import {Apartment} from "./apartment";

export interface SimpleQuestionaryInfo {
  id: String,
  stateName: String,
  name: String
}

export interface UserMkdApartmentsInfo {
  address: string,
  mkdPercent: number,
  apartments: Apartment[]
}

export interface MkdNewsInfo {
  ownerInfo?: UserMkdApartmentsInfo,
  powerOfAttorneyInfo?: UserMkdApartmentsInfo,
  questionary?: SimpleQuestionaryInfo
}
