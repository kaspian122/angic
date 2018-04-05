import {Auth} from "./auth";


/**
 * @author LikarovskiyAV
 */
export interface LoginFailedError {
  auth: Auth,
  error: {
    type: string,
    message?: string
  }
}
