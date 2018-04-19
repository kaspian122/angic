import {Holder} from "./holder";
import {Apartment} from "./apartment";
import {User} from "./user";

export interface HoldersList{
    apartment: Apartment,
    holder: Holder,
    user: User
}

export interface MkdHoldersList{
    holders?: HoldersList[],
    managementInfo?: string
}