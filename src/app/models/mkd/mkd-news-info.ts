import {Apartment} from "../apartment/apartment";
import {SimpleQuestionaryInfo} from "../questionary/simple-questionary-info";
import {MeetingNewsInfo} from '../meeting/meeting-news-info';


export interface UserMkdApartmentsInfo {
  address: string,
  mkdPercent: number,
  apartments: Apartment[]
}

export interface MkdNewsInfo {
  ownerInfo?: UserMkdApartmentsInfo,
  powerOfAttorneyInfo?: UserMkdApartmentsInfo,
  questionary?: SimpleQuestionaryInfo,
  meetings?: MeetingNewsInfo[]
}
