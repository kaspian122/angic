import {User} from '../user/user';
import {PowerOfAttorney} from './power-of-attorney';
import {HolderVoteCount} from './holder-vote-count';

export interface Holder {
  id: string;
  apartmentId: string;
  portalUser: User;
  shareAmount: number;
  certificateNumber: string;
  certificateDate: string;
  participationMeeting: boolean;
  receiveNewsByEmail: boolean;
  councilman: boolean;
  chairman: boolean;
  legalPerson: string;
  comment: string;
  realHolderName: string;
  powerOfAttorney: PowerOfAttorney;
  voteCount: HolderVoteCount;
}
