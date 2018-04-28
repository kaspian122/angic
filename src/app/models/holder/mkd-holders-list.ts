import {Holder} from "./holder";
import {Apartment} from "../apartment/apartment";
import {User} from "../user/user";
import {Mkd} from "../mkd/mkd";

export interface HoldersList{
    apartment: Apartment,
    holder: Holder,
    user: User
}

export interface MkdHoldersList{
    holders?: HoldersList[],
    managementInfo?: string,
    mkd?: Mkd
}
