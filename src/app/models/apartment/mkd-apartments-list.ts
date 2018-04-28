import {Apartment} from "./apartment";
import {Mkd} from "../mkd/mkd";

export interface MkdApartmentsList{
    apartments?: Apartment[],
    managementInfo?: string,
    mkd?: Mkd
}
