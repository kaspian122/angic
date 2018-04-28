import {Apartment} from "../apartment/apartment";
import {SimpleQuestionaryInfo} from "../questionary/simple-questionary-info";


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
